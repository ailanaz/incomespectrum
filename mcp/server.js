import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_PATH = join(__dirname, "data", "directory.json");

// Load directory data once at startup
const { entries } = JSON.parse(readFileSync(DATA_PATH, "utf8"));

// Helper: case-insensitive includes check
const includes = (str, term) =>
  str?.toLowerCase().includes(term.toLowerCase());

// -------------------------------------------------------
// Server setup
// -------------------------------------------------------
const server = new McpServer({
  name: "incomespectrum-directory",
  version: "1.0.0",
});

// -------------------------------------------------------
// TOOL 1: search_directory
// Full-text search across name, description, tags, type
// -------------------------------------------------------
server.tool(
  "search_directory",
  "Search the Income Spectrum directory by keyword. Searches name, description, tags, and type fields.",
  { keyword: z.string().describe("The keyword to search for") },
  async ({ keyword }) => {
    const results = entries.filter(
      (e) =>
        includes(e.name, keyword) ||
        includes(e.description, keyword) ||
        includes(e.type, keyword) ||
        e.tags.some((t) => includes(t, keyword))
    );
    return {
      content: [
        {
          type: "text",
          text:
            results.length === 0
              ? `No results found for "${keyword}".`
              : `Found ${results.length} result(s) for "${keyword}":\n\n` +
                results
                  .map(
                    (e) =>
                      `- **${e.name}** (${e.type})\n  Section: ${e.section} | Page: ${e.page}\n  Reach: ${e.reach}\n  URL: ${e.url}\n  Tags: ${e.tags.join(", ")}`
                  )
                  .join("\n\n"),
        },
      ],
    };
  }
);

// -------------------------------------------------------
// TOOL 2: get_by_section
// Returns all entries in a named section
// -------------------------------------------------------
server.tool(
  "get_by_section",
  "Get all directory entries in a specific section (e.g. 'Service Roles', 'Auto Trades', 'Legal, Compliance & Protection').",
  { section: z.string().describe("The section name to look up") },
  async ({ section }) => {
    const results = entries.filter((e) => includes(e.section, section));
    return {
      content: [
        {
          type: "text",
          text:
            results.length === 0
              ? `No entries found in section "${section}".`
              : `${results.length} entries in "${section}":\n\n` +
                results
                  .map((e) => `- **${e.name}** | ${e.type} | ${e.url}`)
                  .join("\n"),
        },
      ],
    };
  }
);

// -------------------------------------------------------
// TOOL 3: get_by_page
// Returns all entries from a specific site page
// -------------------------------------------------------
server.tool(
  "get_by_page",
  "Get all directory entries from a specific site page. Pages: income-options, education-training, supportive-services, state-federal-resources, federal-contracting-resources, state-contracting-resources, local-government-contracting-resources, focus.",
  { page: z.string().describe("The page name (e.g. 'income-options')") },
  async ({ page }) => {
    const results = entries.filter((e) => includes(e.page, page));
    return {
      content: [
        {
          type: "text",
          text:
            results.length === 0
              ? `No entries found for page "${page}".`
              : `${results.length} entries on "${page}":\n\n` +
                results
                  .map(
                    (e) =>
                      `- **${e.name}** | ${e.section} | ${e.link_type === "affiliate" ? "AFFILIATE" : "direct"}`
                  )
                  .join("\n"),
        },
      ],
    };
  }
);

// -------------------------------------------------------
// TOOL 4: get_by_state
// Returns all entries relevant to a specific state
// -------------------------------------------------------
server.tool(
  "get_by_state",
  "Get all directory entries relevant to a specific US state, including state resource pages, contracting portals, and cottage food laws.",
  { state: z.string().describe("State name or abbreviation (e.g. 'Texas' or 'TX')") },
  async ({ state }) => {
    const results = entries.filter(
      (e) =>
        includes(e.reach, state) ||
        e.tags.some((t) => includes(t, state)) ||
        includes(e.name, state) ||
        includes(e.description, state)
    );
    return {
      content: [
        {
          type: "text",
          text:
            results.length === 0
              ? `No entries found for state "${state}".`
              : `${results.length} entries for "${state}":\n\n` +
                results
                  .map(
                    (e) =>
                      `- **${e.name}** | ${e.type}\n  URL: ${e.url}`
                  )
                  .join("\n\n"),
        },
      ],
    };
  }
);

// -------------------------------------------------------
// TOOL 5: get_affiliate_links
// Returns all affiliate entries grouped by network/vendor
// -------------------------------------------------------
server.tool(
  "get_affiliate_links",
  "Get all affiliate links in the directory, grouped by network and vendor. Useful for monetization audits and affiliate program management.",
  {},
  async () => {
    const affiliates = entries.filter((e) => e.link_type === "affiliate");
    const byVendor = affiliates.reduce((acc, e) => {
      const key = e.affiliate_vendor || "unknown";
      acc[key] = acc[key] || [];
      acc[key].push(e);
      return acc;
    }, {});

    const output = Object.entries(byVendor)
      .map(
        ([vendor, items]) =>
          `**Vendor: ${vendor}**\n` +
          items
            .map((e) => `  - ${e.name} (${e.page} / ${e.section})\n    ${e.url}`)
            .join("\n")
      )
      .join("\n\n");

    return {
      content: [
        {
          type: "text",
          text: `${affiliates.length} affiliate link(s) found:\n\n${output}`,
        },
      ],
    };
  }
);

// -------------------------------------------------------
// TOOL 6: find_gaps
// Returns sections sorted by entry count (fewest first)
// Also flags sections with no affiliate options
// -------------------------------------------------------
server.tool(
  "find_gaps",
  "Analyze the directory for gaps - returns sections ranked by entry count (fewest first), identifies thin sections, and flags sections with no affiliate options.",
  {},
  async () => {
    // Count by section
    const sectionCounts = entries.reduce((acc, e) => {
      acc[e.section] = (acc[e.section] || 0) + 1;
      return acc;
    }, {});

    // Affiliate coverage by section
    const sectionAffiliates = entries
      .filter((e) => e.link_type === "affiliate")
      .reduce((acc, e) => {
        acc[e.section] = (acc[e.section] || 0) + 1;
        return acc;
      }, {});

    // Sort sections by count ascending, skip state/contracting index sections
    const skipSections = new Set([
      "State Information",
      "Cottage Food and Home Food Rules",
      "Commissary and Shared Kitchen Directories",
    ]);

    const ranked = Object.entries(sectionCounts)
      .filter(([section]) => !skipSections.has(section))
      .sort((a, b) => a[1] - b[1]);

    const output = ranked
      .map(([section, count]) => {
        const affiliateCount = sectionAffiliates[section] || 0;
        const flag = affiliateCount === 0 ? " [no affiliate options]" : ` [${affiliateCount} affiliate(s)]`;
        return `${count} entries - ${section}${flag}`;
      })
      .join("\n");

    // Also surface single-tag entries (potential gap topics)
    const tagCounts = entries.reduce((acc, e) => {
      e.tags.forEach((t) => {
        acc[t] = (acc[t] || 0) + 1;
      });
      return acc;
    }, {});
    const rareTags = Object.entries(tagCounts)
      .filter(([, count]) => count === 1)
      .map(([tag]) => tag)
      .slice(0, 20);

    return {
      content: [
        {
          type: "text",
          text:
            `**Section entry counts (fewest first):**\n${output}\n\n` +
            `**Tags with only 1 entry (potential content gaps):**\n${rareTags.join(", ")}`,
        },
      ],
    };
  }
);

// -------------------------------------------------------
// TOOL 7: get_section_list
// Returns all unique sections and pages - useful orientation tool
// -------------------------------------------------------
server.tool(
  "get_section_list",
  "Get a full list of all sections and pages in the directory. Use this to orient yourself before querying specific sections.",
  {},
  async () => {
    const pages = [...new Set(entries.map((e) => e.page))].sort();
    const sections = [...new Set(entries.map((e) => e.section))].sort();

    return {
      content: [
        {
          type: "text",
          text:
            `**Pages (${pages.length}):**\n${pages.map((p) => `- ${p}`).join("\n")}\n\n` +
            `**Sections (${sections.length}):**\n${sections.map((s) => `- ${s}`).join("\n")}`,
        },
      ],
    };
  }
);

// -------------------------------------------------------
// TOOL 8: get_entry_by_id
// Look up a single entry by its ID slug
// -------------------------------------------------------
server.tool(
  "get_entry_by_id",
  "Look up a single directory entry by its ID slug (e.g. 'fiverr', 'bench', 'salehoo').",
  { id: z.string().describe("The entry ID slug") },
  async ({ id }) => {
    const entry = entries.find((e) => e.id === id);
    if (!entry) {
      return {
        content: [{ type: "text", text: `No entry found with id "${id}".` }],
      };
    }
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(entry, null, 2),
        },
      ],
    };
  }
);

// -------------------------------------------------------
// Start server
// -------------------------------------------------------
const transport = new StdioServerTransport();
await server.connect(transport);

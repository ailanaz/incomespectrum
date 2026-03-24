(function () {
  const STORAGE_KEY_LOCAL = "income-spectrum-app-state-v2-local";
  const STORAGE_KEY_SESSION = "income-spectrum-app-state-v2-session";
  const ACCOUNT_KEY_LOCAL = "income-spectrum-founder-account-v1";
  const sections = ["income", "training", "services", "official"];
  const sectionLabels = {
    income: "Income Options",
    training: "Education & Training",
    services: "Supportive Services",
    official: "Official Information",
    saved: "Founder File",
    article: "Article / Resource",
    quiz: "Quiz Result"
  };
  const setupGoals = [
    { value: "explore options", label: "Explore Options" },
    { value: "gain knowledge", label: "Gain Knowledge" },
    { value: "get support", label: "Get Support" },
    { value: "find official information", label: "Find Official Information" }
  ];
  const founderIdentityOptions = [
    "Founder",
    "Entrepreneur",
    "Small Business Owner",
    "Self-Employed",
    "Solopreneur",
    "Business Owner"
  ];
  const founderIdentityDescriptions = {
    Founder: "A broad identity for someone building, shaping, or formalizing something of their own.",
    Entrepreneur: "Usually someone creating, testing, or growing a business idea, offer, or operating model.",
    "Small Business Owner": "Usually someone running or building an established business with ongoing operations, customers, and responsibilities.",
    "Self-Employed": "Usually someone earning through their own direct work, services, or independent operation.",
    Solopreneur: "Usually someone building and running a business mostly on their own without a larger team structure yet.",
    "Business Owner": "Usually someone operating a business that may already have systems, customers, and room to grow or change."
  };
  const founderIdentitySuggestions = {
    "Own Idea": "Entrepreneur",
    "Usable Skill": "Self-Employed",
    "Need Knowledge": "Founder",
    "Need Support": "Solopreneur",
    "Need Official Clarity": "Small Business Owner",
    "Still Early": "Founder"
  };
  const FOUNDER_FORMS_KEY = "income-spectrum-founder-forms-v1";
  const FORMS_MAX_BYTES = 1048576; // 1MB per file
  const businessDocTypes = [
    { id: "businessPlan", label: "Business Plan", helper: "Your self-guided plan, outline, or a link to your document.", category: "Foundation" },
    { id: "ein", label: "EIN (Employer Identification Number)", helper: "Your IRS-issued EIN. Note the number, filing date, or link to your confirmation letter.", category: "Foundation" },
    { id: "stateRegistration", label: "State Business Registration", helper: "LLC, corporation, DBA, or sole proprietor filing. Note details or add a link.", category: "Foundation" },
    { id: "operatingAgreement", label: "Operating Agreement or DBA", helper: "Operating agreement, DBA registration, or partnership agreement if applicable.", category: "Foundation" },
    { id: "otherForms", label: "Other Forms", helper: "Upload completed forms, filings, or copies. PDF, Word, or image files up to 1MB each.", category: "Foundation", isUpload: true },
    { id: "bookkeeping", label: "Bookkeeping Records", helper: "Where your books are kept. Link to your spreadsheet, software, or accountant contact.", category: "Financial" },
    { id: "accountingSoftware", label: "Accounting Software", helper: "The tool you use - QuickBooks, Wave, FreshBooks, etc. Add a link or notes.", category: "Financial" },
    { id: "contracts", label: "Contracts and Agreements", helper: "Service agreements, client contracts, or templates. Link to where they are stored.", category: "Operations" },
    { id: "licensesPermits", label: "Licenses and Permits", helper: "Business licenses, local permits, or professional certifications needed to operate.", category: "Operations" },
    { id: "insurance", label: "Business Insurance", helper: "Liability coverage or other policies. Note provider or link to your policy documents.", category: "Operations" }
  ];
  const docStatusOptions = [
    { value: "", label: "Set status" },
    { value: "not-started", label: "Not started" },
    { value: "in-progress", label: "In progress" },
    { value: "on-file", label: "On file" },
    { value: "complete", label: "Complete" },
    { value: "not-applicable", label: "Not applicable" }
  ];
  const workPreferences = [
    { value: "online", label: "Online" },
    { value: "local", label: "Local" },
    { value: "both", label: "Both" }
  ];
  const allStates = [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware",
    "District of Columbia", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
    "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota",
    "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico",
    "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island",
    "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington",
    "West Virginia", "Wisconsin", "Wyoming"
  ];
  const liveContentSources = [
    { path: "income-options.html", section: "income" },
    { path: "education-training.html", section: "training" },
    { path: "supportive-services.html", section: "services" },
    { path: "state-federal-resources.html", section: "official" },
    { path: "federal-contracting-resources.html", section: "official" },
    { path: "state-contracting-resources.html", section: "official" },
    { path: "local-government-contracting-resources.html", section: "official" },
    { path: "asl-interpreter-opportunities-by-state.html", section: "income" },
    { path: "asl-education-and-training-by-state.html", section: "training" },
    { path: "asl-communication-access-services-by-state.html", section: "services" },
    { path: "asl-official-information-by-state.html", section: "official" },
    { path: "blog/index.html", section: "article", parser: "blog" },
    { path: "blog/what-people-will-pay-for/index.html", section: "article", parser: "article" },
    { path: "blog/government-contracting-resources/index.html", section: "article", parser: "article" },
    { path: "blog/best-ai-tools-for-people-trying-to-make-money-on-their-own/index.html", section: "article", parser: "article" },
    { path: "blog/what-people-will-pay-for-quiz/index.html", section: "article", parser: "article" }
  ];
  const statePageCache = new Map();
  const articleContentCache = new Map();

  const data = {
    income: [
      {
        id: "income-mobile-notary",
        title: "Mobile Notary Service",
        description: "Provide document notarization for real estate closings, legal paperwork, and business documents.",
        overview: "A flexible service role for people who can work locally, handle scheduling, and build trust-based client relationships.",
        whyChoose: "People may choose this when they want a low-overhead service they can start locally and grow through repeat referral work.",
        fit: "Useful for someone who wants local appointments, structured tasks, and a service that can expand into loan signing work.",
        tags: ["local", "service-based", "skill-based", "low-cost to start", "ownership-based", "service roles"],
        startupCost: "Low",
        speed: "Moderate",
        skill: "Moderate",
        location: "Local",
        repeatIncome: "Medium",
        customerInteraction: "High",
        complexity: "Moderate",
        trainingIds: ["training-notary-basics", "training-business-foundations"],
        serviceIds: ["service-bookkeeping", "service-website-setup"],
        officialIds: ["official-state-registration", "official-ein-irs"]
      },
      {
        id: "income-virtual-assistant",
        title: "Virtual Assistant Services",
        description: "Offer remote admin support, inbox management, scheduling, client communications, and process help.",
        overview: "A online income option that can start with one client and expand into an agency or specialized support model.",
        whyChoose: "People often choose this when they already organize, communicate, and keep projects moving for others.",
        fit: "Useful for someone who prefers online service work, flexible client relationships, and a lower startup cost.",
        tags: ["online", "service-based", "skill-based", "low-cost to start", "recurring income", "service roles"],
        startupCost: "Low",
        speed: "Fast",
        skill: "Moderate",
        location: "Online",
        repeatIncome: "High",
        customerInteraction: "High",
        complexity: "Low",
        trainingIds: ["training-va-systems", "training-business-foundations"],
        serviceIds: ["service-branding", "service-bookkeeping", "service-website-setup"],
        officialIds: ["official-state-registration", "official-ein-irs"]
      },
      {
        id: "income-asl-interpreting",
        title: "ASL Interpreting",
        description: "Work as an independent interpreter or build an interpreting business around language access needs.",
        overview: "An opportunity tied to communication access, certification, and service-based client work for public and private settings.",
        whyChoose: "This may fit someone who wants to build an independent service rooted in communication access and specialized skill.",
        fit: "Useful for someone willing to pursue certification, state-specific requirements, and relationship-based service work.",
        tags: ["service-based", "skill-based", "local", "online", "ownership-based", "service roles"],
        startupCost: "Medium",
        speed: "Moderate",
        skill: "High",
        location: "Both",
        repeatIncome: "High",
        customerInteraction: "High",
        complexity: "High",
        trainingIds: ["training-asl-pathways", "training-certification-prep"],
        serviceIds: ["service-communication-access", "service-legal"],
        officialIds: ["official-asl-state", "official-state-registration"]
      },
      {
        id: "income-print-on-demand",
        title: "Print-on-Demand Shop",
        description: "Sell custom products through a storefront without holding inventory.",
        overview: "A product-based online model that focuses on design, positioning, and demand testing rather than carrying stock.",
        whyChoose: "People may choose this when they want an online store model with lower inventory risk and room to test ideas quickly.",
        fit: "Useful for someone who wants online product ownership with moderate marketing effort and ongoing experimentation.",
        tags: ["online", "product-based", "low-cost to start", "ownership-based", "product sales"],
        startupCost: "Low",
        speed: "Fast",
        skill: "Moderate",
        location: "Online",
        repeatIncome: "Medium",
        customerInteraction: "Low",
        complexity: "Moderate",
        trainingIds: ["training-digital-storefront", "training-brand-basics"],
        serviceIds: ["service-branding", "service-website-setup", "service-marketing"],
        officialIds: ["official-state-registration", "official-state-tax"]
      },
      {
        id: "income-commercial-cleaning",
        title: "Commercial Cleaning Business",
        description: "Provide recurring cleaning services for offices, small facilities, or commercial spaces.",
        overview: "A hands-on service business with recurring revenue potential and clear operational systems.",
        whyChoose: "This can fit someone who wants local recurring work with a service people regularly need.",
        fit: "Useful for someone comfortable with operations, scheduling, labor planning, and direct local client work.",
        tags: ["local", "service-based", "hands-on", "recurring income", "ownership-based", "service roles"],
        startupCost: "Medium",
        speed: "Moderate",
        skill: "Low",
        location: "Local",
        repeatIncome: "High",
        customerInteraction: "Medium",
        complexity: "Moderate",
        trainingIds: ["training-operations-basics", "training-business-foundations"],
        serviceIds: ["service-bookkeeping", "service-marketing", "service-legal"],
        officialIds: ["official-state-registration", "official-licensing"]
      },
      {
        id: "income-government-contracting",
        title: "Government Contracting Services",
        description: "Pursue federal, state, or local contracting opportunities for services and structured deliverables.",
        overview: "A business direction for operators who want to connect existing service capabilities to public-sector purchasing systems.",
        whyChoose: "This may fit a business owner who already offers services and wants an additional client lane beyond private work.",
        fit: "Useful for someone willing to handle registrations, certifications, capability statements, and procurement processes.",
        tags: ["service-based", "ownership-based", "skill-based", "online", "local", "ownership & acquisition"],
        startupCost: "Medium",
        speed: "Slow",
        skill: "High",
        location: "Both",
        repeatIncome: "High",
        customerInteraction: "Medium",
        complexity: "High",
        trainingIds: ["training-government-contracting", "training-business-foundations"],
        serviceIds: ["service-advisory", "service-bookkeeping", "service-legal"],
        officialIds: ["official-federal-contracting", "official-state-contracting"]
      }
    ],
    training: [
      {
        id: "training-notary-basics",
        title: "Notary Commission Basics",
        provider: "Official state notary information",
        format: "Self-paced",
        cost: "Varies by state",
        description: "State-based information on commission steps, requirements, and entry points for notary work.",
        covers: "Application basics, notary requirements, and early setup steps.",
        fit: "Useful for someone exploring mobile notary work or a local document service.",
        tags: ["beginner", "online", "certification", "short-form"],
        relatedIncomeIds: ["income-mobile-notary"]
      },
      {
        id: "training-va-systems",
        title: "Virtual Assistant Systems and Client Workflow",
        provider: "Independent online training",
        format: "Online",
        cost: "Paid",
        description: "Covers client onboarding, admin workflows, tools, and packaging remote support work.",
        covers: "Client systems, process design, tools, and service packaging.",
        fit: "Useful for someone building a remote admin support offer.",
        tags: ["paid", "beginner", "online", "short-form"],
        relatedIncomeIds: ["income-virtual-assistant"]
      },
      {
        id: "training-business-foundations",
        title: "Business Foundations for Service Operators",
        provider: "Small business training resources",
        format: "Online",
        cost: "Free and paid options",
        description: "A general business education layer covering pricing, operations, setup, and early client systems.",
        covers: "Pricing, positioning, operations, and foundational business tasks.",
        fit: "Useful for anyone moving from skill to service business.",
        tags: ["free", "paid", "beginner", "online", "full program"],
        relatedIncomeIds: ["income-mobile-notary", "income-virtual-assistant", "income-commercial-cleaning", "income-government-contracting"]
      },
      {
        id: "training-asl-pathways",
        title: "ASL Education and Interpreter Options",
        provider: "RID and interpreter education resources",
        format: "Program and continuing education",
        cost: "Varies",
        description: "State-based interpreter education and continuing education paths.",
        covers: "ASL learning, interpreter options, and formal program options.",
        fit: "Useful for someone exploring interpreter work and the training side of that option.",
        tags: ["beginner", "advanced", "online", "in-person", "full program"],
        relatedIncomeIds: ["income-asl-interpreting"]
      },
      {
        id: "training-certification-prep",
        title: "Certification Preparation",
        provider: "Professional certification resources",
        format: "Online and in-person",
        cost: "Varies",
        description: "Prep resources for certification-related options that support specific service roles.",
        covers: "Exam prep, skill-building, and readiness for formal certification steps.",
        fit: "Useful for people moving from interest into qualification-dependent work.",
        tags: ["advanced", "certification", "online", "in-person"],
        relatedIncomeIds: ["income-asl-interpreting"]
      },
      {
        id: "training-digital-storefront",
        title: "Digital Storefront Setup",
        provider: "Ecommerce training resources",
        format: "Online",
        cost: "Free and paid options",
        description: "Training on launching product listings, storefronts, and order flow for ecommerce.",
        covers: "Store setup, product publishing, and foundational ecommerce workflow.",
        fit: "Useful for product-based operators using print-on-demand or online retail models.",
        tags: ["beginner", "online", "short-form"],
        relatedIncomeIds: ["income-print-on-demand"]
      },
      {
        id: "training-brand-basics",
        title: "Brand Basics",
        provider: "Business education resources",
        format: "Online",
        cost: "Free and paid options",
        description: "Foundational work on positioning, messaging, and communicating value clearly.",
        covers: "Basic brand clarity, positioning, and offer communication.",
        fit: "Useful for new service and product operators who need a clear public-facing offer.",
        tags: ["beginner", "online", "short-form"],
        relatedIncomeIds: ["income-print-on-demand"]
      },
      {
        id: "training-operations-basics",
        title: "Operations Basics for Service Businesses",
        provider: "Small business operations resources",
        format: "Online",
        cost: "Free and paid options",
        description: "Basic systems for scheduling, staffing, workflows, and quality control.",
        covers: "Operations planning, service delivery systems, and recurring service management.",
        fit: "Useful for hands-on service operators who need process and repeatability.",
        tags: ["beginner", "online", "full program"],
        relatedIncomeIds: ["income-commercial-cleaning"]
      },
      {
        id: "training-government-contracting",
        title: "Government Contracting Basics",
        provider: "SBA and official contracting guidance",
        format: "Online",
        cost: "Free",
        description: "Entry-level training on SAM registration, set-asides, capability statements, and contracting systems.",
        covers: "Registrations, federal systems, and starting points.",
        fit: "Useful for businesses assessing whether public-sector work is worth pursuing.",
        tags: ["free", "beginner", "online", "short-form"],
        relatedIncomeIds: ["income-government-contracting"]
      }
    ],
    services: [
      {
        id: "service-legal",
        title: "Legal Support",
        description: "Support with structure, contracts, compliance, and formal business setup questions.",
        category: "legal",
        helpsWith: "Structure, agreements, compliance, and protecting business operations.",
        examples: "Forming an entity, reviewing a service agreement, or understanding a compliance requirement.",
        providerLinks: [
          { label: "Official state business resources", href: "state-federal-resources.html" },
          { label: "Federal EIN and IRS resources", href: "https://www.irs.gov/businesses/small-businesses-self-employed" }
        ],
        relatedIncomeIds: ["income-mobile-notary", "income-government-contracting", "income-asl-interpreting"],
        tags: ["legal"]
      },
      {
        id: "service-bookkeeping",
        title: "Bookkeeping and Accounting",
        description: "Track income, expenses, records, and financial routines that keep the business usable.",
        category: "bookkeeping",
        helpsWith: "Financial records, expense tracking, reporting rhythm, and operational clarity.",
        examples: "Cleaning up monthly books, setting up transaction tracking, or preparing for tax season.",
        providerLinks: [
          { label: "IRS Small Business Resources", href: "https://www.irs.gov/businesses/small-businesses-self-employed" }
        ],
        relatedIncomeIds: ["income-mobile-notary", "income-virtual-assistant", "income-commercial-cleaning", "income-government-contracting"],
        tags: ["bookkeeping", "accounting"]
      },
      {
        id: "service-website-setup",
        title: "Website Setup",
        description: "Build a simple online presence so people can understand, trust, and contact the business.",
        category: "websites",
        helpsWith: "Basic web presence, offer clarity, contact flow, and online visibility.",
        examples: "A landing page, service page, inquiry flow, or storefront setup.",
        providerLinks: [
          { label: "Official ADA Title III overview", href: "https://www.ada.gov/topics/title-iii/" }
        ],
        relatedIncomeIds: ["income-mobile-notary", "income-virtual-assistant", "income-print-on-demand"],
        tags: ["websites", "operations"]
      },
      {
        id: "service-branding",
        title: "Branding and Messaging",
        description: "Clarify how the business presents itself, what it offers, and how it signals fit.",
        category: "branding",
        helpsWith: "Offer clarity, positioning, brand voice, and explaining value simply.",
        examples: "Naming, messaging, service descriptions, or clarifying what the business is actually for.",
        providerLinks: [],
        relatedIncomeIds: ["income-virtual-assistant", "income-print-on-demand"],
        tags: ["branding", "marketing"]
      },
      {
        id: "service-marketing",
        title: "Marketing Support",
        description: "Get help with visibility, demand generation, and outreach around the offer.",
        category: "marketing",
        helpsWith: "Lead generation, visibility, content planning, and customer acquisition efforts.",
        examples: "Social content, email flows, local outreach, or ads planning.",
        providerLinks: [],
        relatedIncomeIds: ["income-print-on-demand", "income-commercial-cleaning"],
        tags: ["marketing"]
      },
      {
        id: "service-advisory",
        title: "Business Advisory",
        description: "Strategic help with direction, decision-making, and structuring the next move.",
        category: "advisory",
        helpsWith: "Choosing direction, prioritizing decisions, and reducing confusion around next steps.",
        examples: "Assessing an opportunity, clarifying service structure, or mapping next actions.",
        providerLinks: [],
        relatedIncomeIds: ["income-government-contracting", "income-commercial-cleaning"],
        tags: ["advisory"]
      },
      {
        id: "service-communication-access",
        title: "ASL & Communication Access Services",
        description: "Resources for businesses that need interpreters, communication access support, CART, or captioning.",
        category: "communication access",
        helpsWith: "Interpreter access, communication support, and accessibility-related service use.",
        examples: "Meetings, trainings, customer service interactions, events, and business operations.",
        providerLinks: [
          { label: "RID Search the Registry", href: "https://myaccount.rid.org/Public/Search/Member.aspx" },
          { label: "ADA Effective Communication", href: "https://www.ada.gov/resources/effective-communication/" }
        ],
        relatedIncomeIds: ["income-asl-interpreting"],
        tags: ["communication access", "interpreting services"]
      }
    ],
    official: [
      {
        id: "official-state-registration",
        title: "State Business Registration",
        description: "Find official registration, filing, and agency links for the selected state.",
        type: "State Information",
        categories: ["business registration", "business agencies"],
        stateLinks: {
          Texas: [
            { label: "Texas Secretary of State", href: "https://www.sos.state.tx.us/" },
            { label: "Texas Business Filings", href: "https://www.sos.state.tx.us/corp/index.shtml" }
          ],
          California: [
            { label: "California Secretary of State", href: "https://bizfileonline.sos.ca.gov/" },
            { label: "California Office of the Small Business Advocate", href: "https://calosba.ca.gov/" }
          ],
          Florida: [
            { label: "Sunbiz", href: "https://dos.fl.gov/sunbiz/" },
            { label: "Florida Division of Corporations", href: "https://dos.myflorida.com/sunbiz/" }
          ],
          "New York": [
            { label: "New York Department of State", href: "https://dos.ny.gov/" },
            { label: "New York Business Express", href: "https://businessexpress.ny.gov/" }
          ],
          Illinois: [
            { label: "Illinois Secretary of State", href: "https://www.ilsos.gov/" },
            { label: "Illinois Business Portal", href: "https://www2.illinois.gov/business/registration-licenses-permits/Pages/default.aspx" }
          ]
        },
        federalLinks: [],
        tags: ["state"]
      },
      {
        id: "official-state-tax",
        title: "State Tax Information",
        description: "Find official state tax agencies and business tax references for the selected state.",
        type: "State Information",
        categories: ["state tax"],
        stateLinks: {
          Texas: [
            { label: "Texas Comptroller", href: "https://comptroller.texas.gov/" }
          ],
          California: [
            { label: "California Department of Tax and Fee Administration", href: "https://www.cdtfa.ca.gov/" },
            { label: "Franchise Tax Board", href: "https://www.ftb.ca.gov/" }
          ],
          Florida: [
            { label: "Florida Department of Revenue", href: "https://floridarevenue.com/" }
          ],
          "New York": [
            { label: "New York Department of Taxation and Finance", href: "https://www.tax.ny.gov/" }
          ],
          Illinois: [
            { label: "Illinois Department of Revenue", href: "https://tax.illinois.gov/" }
          ]
        },
        federalLinks: [],
        tags: ["state"]
      },
      {
        id: "official-licensing",
        title: "State Licensing and Agencies",
        description: "Find licensing and agency information that may affect how a business operates in the selected state.",
        type: "State Information",
        categories: ["licensing", "business agencies"],
        stateLinks: {
          Texas: [
            { label: "Texas.gov Licenses and Permits", href: "https://www.texas.gov/business/licenses-permits/" }
          ],
          California: [
            { label: "CalGold Permit Assistance", href: "https://www.calgold.ca.gov/" }
          ],
          Florida: [
            { label: "Florida DBPR", href: "https://www2.myfloridalicense.com/" }
          ],
          "New York": [
            { label: "New York State License Center", href: "https://www.businessexpress.ny.gov/app/answers/cms/a_id/3411" }
          ],
          Illinois: [
            { label: "Illinois Registration, Licenses, and Permits", href: "https://www2.illinois.gov/business/registration-licenses-permits/Pages/default.aspx" }
          ]
        },
        federalLinks: [],
        tags: ["state"]
      },
      {
        id: "official-ein-irs",
        title: "EIN and IRS",
        description: "Federal EIN application, tax guidance, and core IRS business information.",
        type: "Federal Information",
        categories: ["EIN", "IRS", "federal business guidance"],
        stateLinks: {},
        federalLinks: [
          { label: "Apply for an Employer Identification Number", href: "https://www.irs.gov/businesses/small-businesses-self-employed/employer-id-numbers" },
          { label: "IRS Small Business and Self-Employed", href: "https://www.irs.gov/businesses/small-businesses-self-employed" }
        ],
        tags: ["federal"]
      },
      {
        id: "official-federal-contracting",
        title: "Federal Contracting",
        description: "Official federal contracting registrations, set-up steps, and opportunity resources.",
        type: "Federal Information",
        categories: ["federal contracting"],
        stateLinks: {},
        federalLinks: [
          { label: "SAM.gov", href: "https://sam.gov/" },
          { label: "SBA Federal Contracting", href: "https://www.sba.gov/federal-contracting" },
          { label: "Federal Contracting Resources page", href: "federal-contracting-resources.html" }
        ],
        tags: ["federal"]
      },
      {
        id: "official-state-contracting",
        title: "State Contracting",
        description: "Official state procurement and contracting resources for the selected state.",
        type: "State Information",
        categories: ["state contracting"],
        stateLinks: {
          Texas: [
            { label: "Texas SmartBuy", href: "https://www.txsmartbuy.gov/" }
          ],
          California: [
            { label: "Cal eProcure", href: "https://caleprocure.ca.gov/" }
          ],
          Florida: [
            { label: "MyFloridaMarketPlace", href: "https://vendor.myfloridamarketplace.com/" }
          ],
          "New York": [
            { label: "New York State Contract Reporter", href: "https://www.nyscr.ny.gov/" }
          ],
          Illinois: [
            { label: "Illinois BidBuy", href: "https://www.bidbuy.illinois.gov/" }
          ]
        },
        federalLinks: [],
        tags: ["state"]
      },
      {
        id: "official-asl-state",
        title: "ASL Official Information by State",
        description: "State-specific interpreter licensure, regulation, and official interpreter-related information.",
        type: "State Information",
        categories: ["licensing", "state regulation"],
        stateLinks: {
          Texas: [
            { label: "Texas interpreter licensure information", href: "asl-official-information-by-state.html" }
          ],
          California: [
            { label: "California interpreter-related state information", href: "asl-official-information-by-state.html" }
          ],
          Florida: [
            { label: "Florida interpreter-related state information", href: "asl-official-information-by-state.html" }
          ],
          "New York": [
            { label: "New York interpreter-related state information", href: "asl-official-information-by-state.html" }
          ],
          Illinois: [
            { label: "Illinois interpreter-related state information", href: "asl-official-information-by-state.html" }
          ]
        },
        federalLinks: [],
        tags: ["state"]
      }
    ],
    articles: [
      {
        id: "article-what-people-pay-for",
        title: "What People Pay For",
        description: "Use the six motivators, the cost of living, and cultural motivation to see where opportunity starts.",
        href: "blog/what-people-will-pay-for/"
      },
      {
        id: "article-government-contracting",
        title: "Government Contracting Resources",
        description: "An article on federal contracting basics, registrations, and why some small businesses should not write it off too early.",
        href: "blog/government-contracting-resources/"
      },
      {
        id: "article-best-ai-tools",
        title: "Best AI Tools for People Trying to Make Money on Their Own",
        description: "A breakdown of AI tools that can support people building income on their own, depending on what they are trying to do.",
        href: "blog/best-ai-tools-for-people-trying-to-make-money-on-their-own/"
      }
    ]
  };

  const quiz = {
    title: "What People Pay For",
    intro: "This quiz is designed to help you understand what people are paying for and turn that understanding into a living Founder File.",
    frameworkNote: "You will be building understanding of The Six, the six motivators that drive spending; The Cost of Living, the costs people keep paying in time, energy, attention, comfort, and risk; Niche as Culture, where culture is shaped by shared cost and shared outcomes sought; and how The Cost of Living drives opportunity.",
    questions: [
      {
        id: "block",
        prompt: "When you try to understand what people pay for, what has been making that hardest to see?",
        options: [
          { value: "Overload", label: "Too much information, too many ideas, and too much noise" },
          { value: "NoStartingPoint", label: "I do not know where to start observing" },
          { value: "TooManyDirections", label: "I notice too many possible directions and no clear way to sort them" },
          { value: "NeedProof", label: "I do not know what counts as a real signal versus a guess" },
          { value: "RulesConcern", label: "I keep worrying about rules, registration, licensing, or doing it wrong" }
        ]
      },
      {
        id: "problem",
        prompt: "If you pause and observe, which of these seems closest to what people keep spending around, returning to, or trying to secure, change, avoid, gain, improve, or enjoy?",
        options: [
          { value: "Relief and Health", label: "Relief, solution, repair, replacement, or improvement keeps showing up" },
          { value: "Safety and Protection", label: "Protection, prevention, preservation, or reducing exposure keeps showing up" },
          { value: "Survival and Stability", label: "Access, stability, order, simplicity, or savings keeps showing up" },
          { value: "Status, Meaning, and Legacy", label: "Growth, proof, understanding, advancement, or stronger decisions keeps showing up" },
          { value: "Belonging and Love", label: "Connection, support, inclusion, trust, or feeling understood keeps showing up" },
          { value: "Pleasure and Comfort", label: "Comfort, ease, enjoyment, or a better experience keeps showing up" }
        ]
      },
      {
        id: "payment",
        prompt: "Which part of the Cost of Living seems to be spent most heavily here?",
        options: [
          { value: "Time", label: "Time" },
          { value: "Energy", label: "Energy" },
          { value: "Attention", label: "Attention" },
          { value: "Comfort", label: "Comfort" },
          { value: "Risk", label: "Risk" }
        ]
      },
      {
        id: "culture",
        prompt: "When you look at the shared cost being carried and the shared result being sought, which pattern feels closest to the culture you are observing?",
        options: [
          { value: "Instability to order", label: "A shared cost around instability, disorder, or lack of access, with order, access, savings, or stronger footing being sought" },
          { value: "Exposure to protection", label: "A shared cost around exposure, uncertainty, or possible loss, with protection, prevention, preservation, or more certainty being sought" },
          { value: "Friction to solution", label: "A shared cost around pain, friction, strain, confusion, or breakdown, with solution, repair, replacement, improvement, or relief being sought" },
          { value: "Discomfort to ease", label: "A shared cost around discomfort or inconvenience, with comfort, ease, simplicity, enjoyment, or a better experience being sought" },
          { value: "Disconnection to connection", label: "A shared cost around disconnection, exclusion, or not feeling understood, with connection, support, trust, inclusion, or understanding being sought" },
          { value: "Uncertainty to proof", label: "A shared cost around uncertainty, stalled growth, weak decisions, or lack of proof, with understanding, proof, direction, advancement, or stronger decisions being sought" }
        ]
      },
      {
        id: "action",
        prompt: "Looking at that pattern, what does the spending seem to be helping people secure, change, avoid, gain, improve, understand, or enjoy most?",
        options: [
          { value: "Attain Or Gain", label: "Get access, attain something, gain something, or bring something into reach" },
          { value: "Protect Or Prevent", label: "Protect something, preserve something, prevent loss, or reduce exposure" },
          { value: "Improve Or Replace", label: "Improve something, repair something, replace something, or strengthen a result" },
          { value: "Simplify Or Order", label: "Make something simpler, more orderly, easier, steadier, or less costly to manage" },
          { value: "Prove Or Understand", label: "Get proof, understanding, clarity, confidence, or better decisions" },
          { value: "Connect Or Enjoy", label: "Feel connected, supported, included, understood, or enjoy something more" }
        ]
      },
      {
        id: "value",
        prompt: "From what you are observing, where does the clearest opportunity seem to be forming?",
        options: [
          { value: "Lower the cost", label: "Lowering the cost people are already carrying" },
          { value: "Increase the value", label: "Increasing the value or result people receive" },
          { value: "A mix of both", label: "A mix of lowering cost and increasing value" }
        ]
      },
      {
        id: "startingMaterial",
        prompt: "Based on what you are understanding about what people are paying for, what seems most usable as a starting point if you wanted to respond to that pattern?",
        options: [
          { value: "Own Idea", label: "An idea of my own that may fit what I am observing" },
          { value: "Usable Skill", label: "A usable skill, service, or experience I can work from" },
          { value: "Need Knowledge", label: "A direction is forming, but I still need knowledge or training" },
          { value: "Need Support", label: "A direction is forming, but I will likely need support services" },
          { value: "Need Official Clarity", label: "A direction is forming, but I need clarity on rules, registration, or compliance" },
          { value: "Still Early", label: "I am still early and need a starting point more than a fixed idea" }
        ]
      },
      {
        id: "fieldInterest",
        prompt: "Which of these areas feels most like where you want to work or already have some experience?",
        options: [
          { value: "Trades and hands-on services", label: "Trades and hands-on services - auto, home repair, maintenance, or skilled physical work" },
          { value: "Health, beauty, and personal care", label: "Health, beauty, and personal care - massage, skincare, hair, wellness, or physical care" },
          { value: "Coaching, counseling, and support", label: "Coaching, counseling, and support - life coaching, business coaching, therapy, or mentorship" },
          { value: "Creative and digital work", label: "Creative and digital work - content, design, marketing, teaching, or technology" },
          { value: "Products and resale", label: "Products and resale - physical goods, ecommerce, handmade items, or resale" },
          { value: "Business and professional services", label: "Business and professional services - consulting, bookkeeping, admin, or professional support" },
          { value: "No clear direction yet", label: "I have not landed on a direction yet" }
        ]
      },
      {
        id: "workStyle",
        prompt: "How do you most want to deliver your work?",
        options: [
          { value: "In person with clients", label: "Directly with clients in person or at their location" },
          { value: "From my own space", label: "From my own space - a shop, studio, salon, or office" },
          { value: "Mobile or on-site", label: "Mobile or on-site at different client locations" },
          { value: "Online or remotely", label: "Online or remotely, from wherever I work" },
          { value: "Through products", label: "Through products I make, source, or resell" }
        ]
      },
      {
        id: "founderType",
        prompt: "What type of founder are you?",
        options: [
          { value: "Entrepreneur", label: "Entrepreneur: you are building, growing, or shaping a business from an idea, opportunity, or broader vision" },
          { value: "Solopreneur", label: "Solopreneur: you are building or running something mostly on your own, even if you use tools or outside help" },
          { value: "Small Business Owner", label: "Small Business Owner: you own or are building a business meant to operate as an established business" },
          { value: "Self-Employed Professional", label: "Self-Employed Professional: you work for yourself by offering your own skill, service, trade, or expertise" },
          { value: "Owner-Operator", label: "Owner-Operator: you own and directly run the work, service, route, or operation yourself" },
          { value: "Founder", label: "Founder: you are still sorting this out, or more than one of these may fit you right now" }
        ]
      }
    ]
  };

  const defaultState = {
    isSignedIn: false,
    setupComplete: false,
    selectedState: "Texas",
    browseOfficialState: "Texas",
    goal: "explore options",
    workPreference: "both",
    activeView: "home",
    activeExploreSection: "income",
    sortMode: "default",
    savedIds: [],
    savedMeta: {},
    compareIds: [],
    notes: {},
    planDraft: {},
    businessDocs: {},
    recentlyViewed: [],
    recentSearches: [],
    progress: {
      "just exploring": [],
      interested: [],
      comparing: [],
      launch: []
    },
    quizAnswers: {},
    quizResult: null,
    overlayState: {
      id: null,
      kind: null,
      itemId: null,
      itemType: null,
      stateName: null
    },
    activeGateScreen: "opening",
    signupReturn: {
      hasReturn: false,
      view: null,
      overlayState: {
        id: null,
        kind: null,
        itemId: null,
        itemType: null,
        stateName: null
      }
    }
  };

  let appState = loadState();
  let quizIndex = 0;
  let savedFilter = "all";
  let exploreFilter = "all";

  document.addEventListener("DOMContentLoaded", init);

  async function init() {
    populateStateSelects();
    renderSetupChoices();
    bindEvents();
    renderAll();
    syncGateState();
    if (appState.setupComplete) {
      if (!appState.isSignedIn && appState.activeView === "saved") {
        appState.activeView = "home";
        saveState();
      }
      showView(appState.activeView || "home");
      await restoreOverlayState();
    }
    await hydrateCatalogFromSite();
    renderAll();
    syncGateState();
    if (appState.setupComplete) {
      if (!appState.isSignedIn && appState.activeView === "saved") {
        appState.activeView = "home";
        saveState();
      }
      showView(appState.activeView || "home");
      await restoreOverlayState();
    }
  }

  function bindEvents() {
    document.body.addEventListener("click", handleClick);
    document.body.addEventListener("input", handleInput);
    document.body.addEventListener("change", handleChange);
    const globalSearchInput = document.getElementById("globalSearchInput");
    if (globalSearchInput) globalSearchInput.addEventListener("input", renderSearchResults);
    document.getElementById("filterSelect").addEventListener("change", (event) => {
      exploreFilter = event.target.value;
      renderExplore(exploreFilter);
    });
    document.getElementById("profileState").addEventListener("change", (event) => {
      appState.selectedState = event.target.value;
      appState.browseOfficialState = event.target.value;
      syncFounderAccountProfile();
      saveState();
      renderAll();
    });
    const signupState = document.getElementById("signupState");
    if (signupState) {
      signupState.addEventListener("change", (event) => {
        appState.selectedState = event.target.value;
        appState.browseOfficialState = event.target.value;
        renderSetupChoices();
        updateSignupButtonState();
      });
    }
    updateSignupButtonState();
  }

  function handleInput(event) {
    const planField = event.target.closest("[data-plan-field]");
    if (planField && appState.isSignedIn) {
      appState.planDraft[planField.dataset.planField] = planField.value;
      saveState();
    }
    const docField = event.target.closest("[data-doc-id][data-doc-field]");
    if (docField && appState.isSignedIn) {
      const docId = docField.dataset.docId;
      const field = docField.dataset.docField;
      if (!appState.businessDocs) appState.businessDocs = {};
      if (!appState.businessDocs[docId]) appState.businessDocs[docId] = {};
      appState.businessDocs[docId][field] = docField.value;
      saveState();
    }
    if (["signupName", "signupEmail", "signupPassword"].includes(event.target.id)) {
      updateSignupButtonState();
    }
  }

  function handleChange(event) {
    const docField = event.target.closest("[data-doc-id][data-doc-field]");
    if (docField && appState.isSignedIn) {
      const docId = docField.dataset.docId;
      const field = docField.dataset.docField;
      if (!appState.businessDocs) appState.businessDocs = {};
      if (!appState.businessDocs[docId]) appState.businessDocs[docId] = {};
      appState.businessDocs[docId][field] = docField.value;
      saveState();
      if (field === "status") {
        const item = docField.closest(".doc-item");
        if (item) {
          item.className = "doc-item" + (docField.value ? " doc-item--" + docField.value : "");
        }
      }
    }
    if (event.target.dataset.action === "attach-founder-form" && appState.isSignedIn) {
      const files = Array.from(event.target.files || []);
      const errEl = document.getElementById("docUploadError");
      if (errEl) { errEl.hidden = true; errEl.textContent = ""; }
      files.forEach(function (file) {
        if (file.size > FORMS_MAX_BYTES) {
          showDocUploadError(file.name + " is too large. Files must be 1MB or under.");
          return;
        }
        addFounderForm(file);
      });
      event.target.value = "";
    }
  }

  function handleClick(event) {
    const actionNode = event.target.closest("[data-action]");
    if (actionNode) {
      const action = actionNode.dataset.action;
      if (action === "start-explore-guest") {
        appState.isSignedIn = false;
        appState.setupComplete = true;
        saveState();
        openApp("explore");
      } else if (action === "start-setup-signup") {
        captureSignupReturn();
        clearAuthMessages();
        resetSignupForm();
        showGate("signup");
      } else if (action === "start-setup-signin") {
        captureSignupReturn();
        clearAuthMessages();
        resetSigninForm();
        showGate("signin");
      } else if (action === "sign-in-demo") {
        appState.isSignedIn = true;
        appState.setupComplete = true;
        saveState();
        openApp("home");
      } else if (action === "continue-guest") {
        appState.isSignedIn = false;
        appState.setupComplete = true;
        saveState();
        openApp("home");
      } else if (action === "complete-signup") {
        completeSignup();
      } else if (action === "complete-signin") {
        completeSignin();
      } else if (action === "toggle-password") {
        const target = document.getElementById(actionNode.dataset.target);
        if (target) {
          const isPassword = target.type === "password";
          target.type = isPassword ? "text" : "password";
          actionNode.textContent = isPassword ? "Hide Password" : "Show Password";
        }
      } else if (action === "back-to-opening") {
        returnFromSignup();
      } else if (action === "skip-setup") {
        appState.setupComplete = true;
        openApp("home");
      } else if (action === "show-view") {
        closeAllOverlays();
        if (actionNode.dataset.view === "profile" && !appState.isSignedIn) {
          showGate("signup");
        } else if (actionNode.dataset.view === "saved" && !appState.isSignedIn) {
          renderPlannerSignupPrompt();
          openOverlay("progressOverlay", { kind: "planner-signup" });
        } else {
          showView(actionNode.dataset.view);
        }
      } else if (action === "go-explore") {
        closeAllOverlays();
        showView("explore");
      } else if (action === "open-explore-section") {
        appState.activeExploreSection = actionNode.dataset.section;
        exploreFilter = actionNode.dataset.section === "official" ? "state" : "all";
        if (actionNode.dataset.section === "official" && !appState.browseOfficialState) {
          appState.browseOfficialState = appState.selectedState;
        }
        closeAllOverlays();
        showView("explore");
      } else if (action === "open-progress") {
        if (appState.isSignedIn) {
          renderProgress();
          openOverlay("progressOverlay", { kind: "progress" });
        } else {
          renderPlannerSignupPrompt();
          openOverlay("progressOverlay", { kind: "planner-signup" });
        }
      } else if (action === "post-signup-quiz") {
        closeOverlay("progressOverlay");
        quizIndex = 0;
        renderQuiz();
        openOverlay("quizOverlay", { kind: "quiz" });
      } else if (action === "post-signup-explore") {
        closeOverlay("progressOverlay");
        showView("explore");
      } else if (action === "open-founder-file") {
        if (appState.isSignedIn) {
          closeAllOverlays();
          showView("saved");
        } else {
          renderPlannerSignupPrompt();
          openOverlay("progressOverlay", { kind: "planner-signup" });
        }
      } else if (action === "open-notes") {
        if (appState.isSignedIn) {
          renderNotes();
          openOverlay("notesOverlay", { kind: "notes", itemId: null });
        } else {
          renderSaveSignupPrompt();
          openOverlay("progressOverlay", { kind: "save-signup" });
        }
      } else if (action === "open-founder-note") {
        if (appState.isSignedIn) {
          renderNotes(actionNode.dataset.id);
          openOverlay("notesOverlay", { kind: "notes", itemId: actionNode.dataset.id });
        } else {
          renderSaveSignupPrompt();
          openOverlay("progressOverlay", { kind: "save-signup" });
        }
      } else if (action === "new-founder-note") {
        if (appState.isSignedIn) {
          const newNoteId = createFounderNote();
          renderNotes(newNoteId);
          openOverlay("notesOverlay", { kind: "notes", itemId: newNoteId });
        } else {
          renderSaveSignupPrompt();
          openOverlay("progressOverlay", { kind: "save-signup" });
        }
      } else if (action === "save-founder-note") {
        if (appState.isSignedIn) {
          saveFounderNote(actionNode.dataset.id);
        } else {
          closeOverlay("notesOverlay");
          renderSaveSignupPrompt();
          openOverlay("progressOverlay", { kind: "save-signup" });
        }
      } else if (action === "remove-founder-form") {
        removeFounderForm(actionNode.dataset.formId);
      } else if (action === "delete-founder-note") {
        deleteFounderNote(actionNode.dataset.id);
      } else if (action === "scroll-founder-file-section") {
        const target = document.getElementById(actionNode.dataset.target);
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      } else if (action === "open-quiz") {
        quizIndex = 0;
        renderQuiz();
        openOverlay("quizOverlay", { kind: "quiz" });
      } else if (action === "open-articles") {
        renderArticleDirectory();
      } else if (action === "open-terms") {
        renderTermsDirectory();
      } else if (action === "close-overlay") {
        closeOverlay(actionNode.dataset.target);
      } else if (action === "open-item") {
        openDetail(actionNode.dataset.id, actionNode.dataset.type);
      } else if (action === "save-item") {
        if (appState.isSignedIn) {
          toggleSaved(actionNode.dataset.id);
        } else {
          renderSaveSignupPrompt();
          openOverlay("progressOverlay", { kind: "save-signup" });
        }
      } else if (action === "remove-saved") {
        removeSaved(actionNode.dataset.id);
      } else if (action === "set-stage") {
        setStage(actionNode.dataset.id, actionNode.dataset.stage);
      } else if (action === "save-note") {
        if (appState.isSignedIn) {
          saveNote(actionNode.dataset.id);
        } else {
          closeOverlay("notesOverlay");
          renderSaveSignupPrompt();
          openOverlay("progressOverlay", { kind: "save-signup" });
        }
      } else if (action === "toggle-note-star") {
        toggleNoteStar(actionNode.dataset.id);
      } else if (action === "delete-note") {
        deleteNote(actionNode.dataset.id);
      } else if (action === "toggle-sort") {
        appState.sortMode = appState.sortMode === "title" ? "default" : "title";
        renderExplore();
      } else if (action === "open-filter") {
        // Filter chips are always visible; this is a compact no-op in the current version.
      } else if (action === "saved-sort") {
        renderSaved();
      } else if (action === "filter-saved") {
        savedFilter = actionNode.dataset.filter;
        renderSaved();
      } else if (action === "recent-search") {
        const globalSearchInput = document.getElementById("globalSearchInput");
        if (globalSearchInput) {
          globalSearchInput.value = actionNode.dataset.query;
          renderSearchResults();
        }
      } else if (action === "reset-app" || action === "reset-founder-test") {
        appState = structuredClone(defaultState);
        localStorage.removeItem(STORAGE_KEY_LOCAL);
        localStorage.removeItem(ACCOUNT_KEY_LOCAL);
        sessionStorage.removeItem(STORAGE_KEY_SESSION);
        clearAuthMessages();
        saveState();
        syncGateState();
        renderAll();
      } else if (action === "sign-out") {
        appState = structuredClone(defaultState);
        localStorage.removeItem(STORAGE_KEY_LOCAL);
        sessionStorage.removeItem(STORAGE_KEY_SESSION);
        clearAuthMessages();
        saveState();
        syncGateState();
        renderAll();
      } else if (action === "quiz-option") {
        setQuizAnswer(actionNode.dataset.value);
      } else if (action === "quiz-next") {
        nextQuizStep();
      } else if (action === "quiz-back") {
        previousQuizStep();
      } else if (action === "save-quiz-result") {
        if (appState.isSignedIn) {
          saveQuizResult();
        } else {
          closeOverlay("quizOverlay");
          renderPlannerSignupPrompt();
          openOverlay("progressOverlay", { kind: "planner-signup" });
        }
      } else if (action === "open-state-detail") {
        appState.browseOfficialState = actionNode.dataset.state || appState.selectedState;
        saveState();
        openStateDetail(actionNode.dataset.state || appState.selectedState);
      } else if (action === "browse-official-state") {
        appState.browseOfficialState = actionNode.dataset.state || appState.selectedState;
        saveState();
        renderExplore();
      } else if (action === "open-all-states") {
        openAllStatesBrowser();
      } else if (action === "open-path-summary") {
        openPathSummary();
      }
      return;
    }

    const sectionTab = event.target.closest(".section-tab");
    if (sectionTab) {
      const previousSection = appState.activeExploreSection;
      appState.activeExploreSection = sectionTab.dataset.section;
      exploreFilter = sectionTab.dataset.section === "official" ? "state" : "all";
      if (sectionTab.dataset.section === "income") {
        appState.activeExploreSection = "income";
      }
      if (sectionTab.dataset.section === "official" && !appState.browseOfficialState) {
        appState.browseOfficialState = appState.selectedState;
      }
      if (previousSection === "official" && appState.activeExploreSection !== "official") {
        document.getElementById("exploreContent").innerHTML = "";
        document.getElementById("filterSelect").innerHTML = "";
      }
      saveState();
      renderAll();
      return;
    }

    const bottomTab = event.target.closest(".bottom-tab");
    if (bottomTab) {
      if (bottomTab.dataset.view === "saved" && !appState.isSignedIn) {
        renderPlannerSignupPrompt();
        openOverlay("progressOverlay", { kind: "planner-signup" });
      } else {
        showView(bottomTab.dataset.view);
      }
      return;
    }

    const choicePill = event.target.closest(".choice-pill");
    if (choicePill) {
      const group = choicePill.closest(".choice-group, .pill-row");
      group.querySelectorAll(".choice-pill").forEach((pill) => pill.classList.remove("active"));
      choicePill.classList.add("active");
      if (group.id === "profileGoal") {
        appState.goal = choicePill.dataset.value;
        syncFounderAccountProfile();
        saveState();
      } else if (group.id === "signupGoal") {
        appState.goal = choicePill.dataset.value;
        renderSetupChoices();
        updateSignupButtonState();
      } else if (group.id === "profileWorkPref") {
        appState.workPreference = choicePill.dataset.value;
        saveState();
      }
    }

    const founderIdentitySelect = event.target.closest("[data-founder-identity-select]");
    if (founderIdentitySelect && appState.isSignedIn) {
      appState.planDraft.founderIdentity = founderIdentitySelect.value;
      saveState();
      renderSaved();
      renderProgress();
    }

  }

  function populateStateSelects() {
    const signupSelect = document.getElementById("signupState");
    const profileSelect = document.getElementById("profileState");
    const options = allStates.map((state) => `<option value="${state}">${state}</option>`).join("");
    if (signupSelect) {
      signupSelect.innerHTML = options;
      signupSelect.value = appState.selectedState;
    }
    if (profileSelect) {
      profileSelect.innerHTML = options;
      profileSelect.value = appState.selectedState;
    }
  }

  function renderSetupChoices() {
    renderProfilePrefs();
  }

  function renderProfilePrefs() {
    const signupState = document.getElementById("signupState");
    const signupGoal = document.getElementById("signupGoal");
    const profileState = document.getElementById("profileState");
    const profileGoal = document.getElementById("profileGoal");
    const accountStatusCopy = document.getElementById("accountStatusCopy");
    const profileSignupCard = document.getElementById("profileSignupCard");
    const profileToolsTitle = document.getElementById("profileToolsTitle");
    const topSignOutButton = document.getElementById("topSignOutButton");
    if (signupState) signupState.value = appState.selectedState;
    if (signupGoal) signupGoal.innerHTML = setupGoals.map((goal) => `
      <button class="choice-pill ${goal.value === appState.goal ? "active" : ""}" type="button" data-value="${goal.value}">${goal.label}</button>
    `).join("");
    if (profileState) profileState.value = appState.selectedState;
    if (profileGoal) profileGoal.innerHTML = setupGoals.map((goal) => `
      <button class="choice-pill ${goal.value === appState.goal ? "active" : ""}" type="button" data-value="${goal.value}">${goal.label}</button>
    `).join("");
    if (accountStatusCopy) accountStatusCopy.textContent = appState.isSignedIn
      ? "You are signed in as a Founder. Your state, file, notes, and saved items stay with your account on this device."
      : "You are browsing in Guest Mode. Founder File access and saved progress require a Founder sign-in.";
    if (profileSignupCard) profileSignupCard.classList.toggle("hidden", appState.isSignedIn);
    if (profileToolsTitle) profileToolsTitle.textContent = appState.isSignedIn ? "App tools" : "Guest tools";
    if (topSignOutButton) topSignOutButton.classList.toggle("hidden", !appState.isSignedIn);
    document.getElementById("topPlannerButton").textContent = "Founder File Overview";
    document.getElementById("topPlannerButton").setAttribute("aria-label", "Open Founder File Overview");
  }

  async function hydrateCatalogFromSite() {
    const pageResults = await Promise.allSettled(liveContentSources.map((source) => loadSourcePage(source)));
    pageResults.forEach((result, index) => {
      if (result.status !== "fulfilled") return;
      mergeImportedItems(liveContentSources[index].section, result.value);
    });
    hydrateStatePagesInBackground();
  }

  async function loadSourcePage(source) {
    const response = await fetch(source.path);
    if (!response.ok) return [];
    const html = await response.text();
    const doc = new DOMParser().parseFromString(html, "text/html");
    if (source.parser === "blog") {
      return parseBlogCards(doc, source);
    }
    if (source.parser === "article") {
      return parseArticlePage(doc, source);
    }
    return parseListingCards(doc, source);
  }

  function parseListingCards(doc, source) {
    const pageTitle = textContentOf(doc.querySelector(".page-header__title, h1")) || source.path;
    return [...doc.querySelectorAll(".listing-card")].map((card, index) => {
      const title = textContentOf(card.querySelector(".listing-card__name"));
      if (!title) return null;
      const description = textContentOf(card.querySelector(".listing-card__desc")) || `${title} resource from ${pageTitle}.`;
      const block = card.closest(".cat-block, .subcat");
      const groupTitle = textContentOf(block?.querySelector(".cat-block__title, .subcat__title")) || pageTitle;
      const href = card.querySelector(".listing-card__cta")?.getAttribute("href") || "";
      const typeText = textContentOf(card.querySelector(".listing-card__type")) || groupTitle;
      const coverage = textContentOf(card.querySelector(".listing-card__coverage"));
      const tags = extractTags(card, groupTitle, coverage);
      const id = `${source.section}-${slugify(title)}-${slugify(source.path)}-${index}`;

      if (source.section === "income") {
        return {
          id,
          title,
          description,
          overview: description,
          whyChoose: `This sits inside ${groupTitle.toLowerCase()} on ${pageTitle.toLowerCase()}.`,
          fit: coverage ? `Useful when you are looking at ${coverage.toLowerCase()} coverage or fit.` : `Useful when ${groupTitle.toLowerCase()} is the direction you want to explore.`,
          tags,
          trainingIds: [],
          serviceIds: [],
          officialIds: [],
          externalHref: href,
          sourcePage: source.path,
          groupTitle,
          typeLabel: typeText
        };
      }

      if (source.section === "training") {
        return {
          id,
          title,
          provider: typeText,
          format: groupTitle,
          cost: "Varies",
          description,
          covers: description,
          fit: `Useful for people exploring ${groupTitle.toLowerCase()}.`,
          tags,
          relatedIncomeIds: [],
          externalHref: href,
          sourcePage: source.path,
          groupTitle
        };
      }

      if (source.section === "services") {
        return {
          id,
          title,
          description,
          category: groupTitle,
          helpsWith: description,
          examples: `This service sits inside ${groupTitle.toLowerCase()} in the live directory.`,
          providerLinks: href ? [{ label: "Open resource", href }] : [],
          relatedIncomeIds: [],
          tags,
          externalHref: href,
          sourcePage: source.path,
          groupTitle
        };
      }

      return {
        id,
        title,
        description,
        type: groupTitle,
        categories: [groupTitle],
        stateLinks: coverage ? { [coverage]: href ? [{ label: title, href }] : [] } : {},
        federalLinks: !coverage && href ? [{ label: title, href }] : [],
        tags,
        externalHref: href,
        sourcePage: source.path,
        coverage,
        groupTitle
      };
    }).filter(Boolean);
  }

  function parseBlogCards(doc) {
    return [...doc.querySelectorAll(".blog-card")].map((card, index) => {
      const title = textContentOf(card.querySelector(".blog-card__title"));
      if (!title) return null;
      const href = card.querySelector(".blog-card__title a, .blog-card__cta")?.getAttribute("href") || "";
      return {
        id: `article-${slugify(title)}-${index}`,
        title,
        description: textContentOf(card.querySelector(".blog-card__excerpt")) || title,
        href: href.startsWith("http") ? href : `blog/${href.replace(/^\.?\//, "")}`
      };
    }).filter(Boolean);
  }

  function parseArticlePage(doc, source) {
    const title = textContentOf(doc.querySelector("meta[property='og:title']")) || textContentOf(doc.querySelector("title")) || textContentOf(doc.querySelector("h1"));
    if (!title) return [];
    const normalizedTitle = title.replace(/\s*\|\s*Income Spectrum\s*$/i, "").trim();
    const description =
      doc.querySelector("meta[name='description']")?.getAttribute("content")?.trim() ||
      textContentOf(doc.querySelector(".article-hero__lead, .article-body p")) ||
      normalizedTitle;
    let href = source.path;
    if (href.endsWith("/index.html")) href = href.replace(/index\.html$/, "");
    return [{
      id: `article-${slugify(normalizedTitle)}`,
      title: normalizedTitle,
      description,
      href,
      sourcePage: source.path
    }];
  }

  function mergeImportedItems(section, importedItems) {
    const existingByTitle = new Map(data[section].map((item) => [normalizeKey(item.title), item]));
    importedItems.forEach((item) => {
      const match = existingByTitle.get(normalizeKey(item.title));
      if (match) {
        Object.assign(match, {
          ...item,
          tags: unique([...(match.tags || []), ...(item.tags || [])]),
          categories: unique([...(match.categories || []), ...(item.categories || [])]),
          providerLinks: uniqueLinks([...(match.providerLinks || []), ...(item.providerLinks || [])]),
          federalLinks: uniqueLinks([...(match.federalLinks || []), ...(item.federalLinks || [])]),
          stateLinks: mergeStateLinks(match.stateLinks || {}, item.stateLinks || {})
        });
        return;
      }
      data[section].push(item);
    });
  }

  function getStartDestinationFromGoal() {
    const sectionByGoal = {
      "explore options": "income",
      "gain knowledge": "training",
      "get support": "services",
      "find official information": "official"
    };
    const section = sectionByGoal[appState.goal];
    if (!section) return "home";
    appState.activeExploreSection = section;
    return "explore";
  }

  function completeSignup() {
    const name = (document.getElementById("signupName")?.value || "").trim();
    const email = (document.getElementById("signupEmail")?.value || "").trim().toLowerCase();
    const password = (document.getElementById("signupPassword")?.value || "").trim();
    const selectedState = document.getElementById("signupState")?.value || appState.selectedState;
    const initialGoal = getActiveChoiceValue(document.getElementById("signupGoal")) || appState.goal;
    if (!name || !email || !password || !selectedState || !initialGoal) {
      setAuthMessage("signupMessage", "Enter your name, email, password, state, and initial goal to create your Founder account.");
      return;
    }
    appState.selectedState = selectedState;
    appState.browseOfficialState = selectedState;
    appState.goal = initialGoal;
    saveFounderAccount({
      name,
      email,
      password,
      selectedState,
      goal: initialGoal
    });
    appState.isSignedIn = true;
    appState.setupComplete = true;
    clearSignupReturn();
    saveState();
    openApp("home");
    renderPostSignupPrompt();
    openOverlay("progressOverlay", { kind: "post-signup" });
  }

  function completeSignin() {
    const email = (document.getElementById("signinEmail")?.value || "").trim().toLowerCase();
    const password = (document.getElementById("signinPassword")?.value || "").trim();
    const founderAccount = loadFounderAccount();
    if (!email || !password) {
      setAuthMessage("signinMessage", "Enter your email and password to sign in.");
      return;
    }
    if (!founderAccount) {
      setAuthMessage("signinMessage", "No Founder account is saved on this device yet. Create one first.");
      return;
    }
    if (founderAccount.email !== email || founderAccount.password !== password) {
      setAuthMessage("signinMessage", "That email or password does not match the saved Founder account on this device.");
      return;
    }
    applyFounderAccountToState(founderAccount);
    appState.isSignedIn = true;
    appState.setupComplete = true;
    clearSignupReturn();
    saveState();
    openApp("home");
  }

  function captureSignupReturn() {
    if (!appState.setupComplete) {
      clearSignupReturn();
      saveState();
      return;
    }
    appState.signupReturn = {
      hasReturn: true,
      view: appState.activeView || "home",
      overlayState: appState.overlayState?.id
        ? { ...structuredClone(defaultState.overlayState), ...appState.overlayState }
        : { ...structuredClone(defaultState.overlayState) }
    };
    saveState();
  }

  function clearSignupReturn() {
    appState.signupReturn = structuredClone(defaultState.signupReturn);
  }

  function clearAuthMessages() {
    setAuthMessage("signupMessage", "");
    setAuthMessage("signinMessage", "");
  }

  function resetSignupForm() {
    const signupName = document.getElementById("signupName");
    const signupEmail = document.getElementById("signupEmail");
    const signupPassword = document.getElementById("signupPassword");
    if (signupName) signupName.value = "";
    if (signupEmail) signupEmail.value = "";
    if (signupPassword) signupPassword.value = "";
    populateStateSelects();
    renderSetupChoices();
    updateSignupButtonState();
  }

  function resetSigninForm() {
    const signinEmail = document.getElementById("signinEmail");
    const signinPassword = document.getElementById("signinPassword");
    if (signinEmail) signinEmail.value = "";
    if (signinPassword) signinPassword.value = "";
  }

  function updateSignupButtonState() {
    const button = document.getElementById("completeSignupButton");
    if (!button) return;
    const name = (document.getElementById("signupName")?.value || "").trim();
    const email = (document.getElementById("signupEmail")?.value || "").trim();
    const password = (document.getElementById("signupPassword")?.value || "").trim();
    const selectedState = document.getElementById("signupState")?.value || "";
    const initialGoal = getActiveChoiceValue(document.getElementById("signupGoal"));
    button.disabled = !(name && email && password && selectedState && initialGoal);
  }

  function setAuthMessage(id, message) {
    const node = document.getElementById(id);
    if (!node) return;
    node.textContent = message;
  }

  function saveFounderAccount(account) {
    localStorage.setItem(ACCOUNT_KEY_LOCAL, JSON.stringify(account));
  }

  function loadFounderAccount() {
    try {
      const raw = localStorage.getItem(ACCOUNT_KEY_LOCAL);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      return null;
    }
  }

  function applyFounderAccountToState(founderAccount) {
    if (!founderAccount) return;
    if (founderAccount.selectedState) {
      appState.selectedState = founderAccount.selectedState;
      appState.browseOfficialState = founderAccount.selectedState;
    }
    if (founderAccount.goal) {
      appState.goal = founderAccount.goal;
    }
  }

  function syncFounderAccountProfile() {
    if (!appState.isSignedIn) return;
    const founderAccount = loadFounderAccount();
    if (!founderAccount) return;
    saveFounderAccount({
      ...founderAccount,
      selectedState: appState.selectedState,
      goal: appState.goal
    });
  }

  function returnFromSignup() {
    const signupReturn = appState.signupReturn || structuredClone(defaultState.signupReturn);
    if (!signupReturn.hasReturn) {
      clearSignupReturn();
      saveState();
      showGate("opening");
      return;
    }
    clearSignupReturn();
    saveState();
    syncGateState();
    showView(signupReturn.view || "home");
    if (signupReturn.overlayState?.id) {
      appState.overlayState = {
        ...structuredClone(defaultState.overlayState),
        ...signupReturn.overlayState
      };
      saveState();
      void restoreOverlayState();
    }
  }

  function getActiveChoiceValue(node) {
    if (!node) return "";
    return node.querySelector(".choice-pill.active")?.dataset.value || "";
  }

  function syncGateState() {
    if (!appState.setupComplete) {
      showGate(appState.activeGateScreen || "opening");
      document.getElementById("mainApp").classList.add("hidden");
      return;
    }
    document.querySelectorAll(".gate-screen").forEach((screen) => screen.classList.remove("active"));
    document.getElementById("mainApp").classList.remove("hidden");
  }

  function showGate(screen) {
    closeAllOverlays();
    appState.activeGateScreen = screen;
    document.getElementById("mainApp").classList.add("hidden");
    document.querySelectorAll(".gate-screen").forEach((node) => node.classList.remove("active"));
    document.querySelector(`[data-screen="${screen}"]`).classList.add("active");
    saveState();
  }

  function openApp(view) {
    appState.setupComplete = true;
    appState.activeGateScreen = "opening";
    saveState();
    syncGateState();
    showView(view);
  }

  function showView(view) {
    appState.activeView = view;
    document.querySelectorAll(".view").forEach((node) => node.classList.remove("active"));
    const viewNode = document.querySelector(`.view[data-view="${view}"]`);
    if (!viewNode) return;
    viewNode.classList.add("active");
    document.querySelectorAll(".bottom-tab").forEach((tab) => tab.classList.toggle("active", tab.dataset.view === view));
    document.getElementById("viewTitle").textContent = sectionLabels[view] || capitalize(view);
    saveState();
    renderAll();
  }

  function renderAll() {
    renderProfilePrefs();
    renderHome();
    renderExplore(exploreFilter);
    renderSaved();
    renderProgress();
    renderNotes();
    renderSearchResults();
    renderSavedQuizResult();
  }

  function renderHome() {
    const currentPath = buildPathSnapshot();
    document.getElementById("continueTitle").textContent = "Explore the Income Spectrum app.";
    document.getElementById("continueCopy").textContent = "The Income Spectrum App is an interactive companion for exploring income opportunities, knowledge resources, support services, official information, and articles while building your personal Founder File in one place.";
    const heroStateButton = document.getElementById("heroStateButton");
    if (appState.isSignedIn) {
      document.getElementById("heroStateValue").textContent = appState.selectedState;
      if (heroStateButton) {
        heroStateButton.dataset.action = "open-state-detail";
        delete heroStateButton.dataset.state;
      }
    } else {
      document.getElementById("heroStateValue").textContent = "All States Official Info";
      if (heroStateButton) {
        heroStateButton.dataset.action = "open-all-states";
        delete heroStateButton.dataset.state;
      }
    }
    document.getElementById("heroPathValue").textContent = currentPath.label;
    document.getElementById("heroPlanValue").textContent = buildPlanSnapshot().label;
    document.getElementById("topPlannerButton").textContent = "Founder File Overview";
    document.getElementById("topPlannerButton").setAttribute("aria-label", "Open Founder File Overview");

    const founderSpaceLink = document.getElementById("founderSpaceLink");
    document.getElementById("founderSpaceStatus").innerHTML = buildFounderSpaceStatusMarkup();
    const founderSpaceHighlights = buildFounderSpaceHighlights();
    document.getElementById("nextStepsList").innerHTML = founderSpaceHighlights
      .map((item) => `<li><strong class="founder-space-label">${item.label}:</strong> ${item.value}</li>`)
      .join("");
    founderSpaceLink.textContent = appState.isSignedIn ? "Open Founder File" : "Sign Up to Access Founder Space";
    founderSpaceLink.dataset.action = appState.isSignedIn ? "show-view" : "start-setup-signup";
    if (appState.isSignedIn) {
      founderSpaceLink.dataset.view = "saved";
    } else {
      delete founderSpaceLink.dataset.view;
    }

    const recentMarkup = appState.recentlyViewed.slice(0, 1).map((id) => renderMiniCard(findItem(id), "Revisit")).join("");
    document.getElementById("recentlyViewed").innerHTML = recentMarkup || `<div class="empty-state">Recently viewed items will show up here.</div>`;
  }

  function buildFounderSpaceStatusMarkup() {
    if (!appState.isSignedIn) {
      return `
        <p class="helper-copy founder-space-copy">Founder Space becomes your saved place for ideas, notes, official information, and progress once you create your Founder account.</p>
      `;
    }
    const planDraft = appState.quizResult
      ? { ...buildPlanDraft(appState.quizResult), ...appState.planDraft }
      : appState.planDraft;
    const founderIdentity = planDraft.founderIdentity || "Founder";
    const ideaFirstSentence = (planDraft.incomeIdea || "").split(".")[0].trim();
    const quizStatus = appState.quizResult ? "Quiz complete" : "Quiz not started";
    const businessSummary = ideaFirstSentence ? ideaFirstSentence + "." : quizStatus;
    return `
      <div class="mini-card">
        <p><strong class="founder-space-label">Identity:</strong> <strong>${founderIdentity}</strong></p>
        <p>${businessSummary}</p>
      </div>
    `;
  }

  function buildFounderSpaceHighlights() {
    if (!appState.isSignedIn) {
      return buildNextSteps();
    }
    const planDraft = appState.quizResult
      ? { ...buildPlanDraft(appState.quizResult), ...appState.planDraft }
      : appState.planDraft;
    const notes = getFounderNotesEntries();
    const itemNotes = buildSortedNoteEntries(1);
    const nextStep = (planDraft.nextMoves || "")
      .split("\n")
      .map((step) => step.trim())
      .filter(Boolean)[0];
    const goal = (planDraft.goals || planDraft.proof || "").trim();
    const officialSavedCount = appState.savedIds.filter((id) => detectItemType(id) === "official").length;
    const highlights = [];
    if (goal) {
      highlights.push({ label: "Goal", value: goal });
    }
    if (nextStep) {
      highlights.push({ label: "Next", value: nextStep });
    }
    if (notes[0]?.subject) {
      highlights.push({ label: "Note", value: notes[0].subject });
    } else if (itemNotes[0]?.item?.title) {
      highlights.push({ label: "Saved Note", value: itemNotes[0].item.title });
    }
    if (officialSavedCount) {
      highlights.push({ label: "Official Items Saved", value: String(officialSavedCount) });
    }
    return highlights.slice(0, 4);
  }

  function renderExplore(filter = exploreFilter || "all") {
    document.querySelectorAll(".section-tab").forEach((tab) => {
      tab.classList.toggle("active", tab.dataset.section === appState.activeExploreSection);
    });

    renderFilterSelector(appState.activeExploreSection, filter);
    document.getElementById("filterPanel").dataset.section = appState.activeExploreSection;
    const content = document.getElementById("exploreContent");
    if (appState.activeExploreSection === "official") {
      content.innerHTML = renderOfficialList();
      return;
    }

    let items = [...data[appState.activeExploreSection]];
    items = items.filter((item) => matchesFilter(item, filter));
    if (!items.length && appState.activeExploreSection !== "official" && filter !== "all") {
      exploreFilter = "all";
      renderFilterSelector(appState.activeExploreSection, "all");
      items = [...data[appState.activeExploreSection]];
    }
    if (appState.sortMode === "title") {
      items.sort((a, b) => a.title.localeCompare(b.title));
    }
    content.innerHTML = `
      <div class="list-grid">
        ${items.map((item) => renderListItem(item, appState.activeExploreSection)).join("")}
      </div>
    `;
  }

  function renderFilterSelector(section, activeFilter) {
    const filtersBySection = {
      income: ["all", "service roles", "auto trades", "beauty & wellness", "counseling & coaching", "product sales", "ownership & acquisition", "business programs"],
      training: [
        { value: "all", label: "All" },
        { value: "entrepreneurship & ownership", label: "Entrepreneurship & Ownership" },
        { value: "ai, digital & creative skills", label: "AI, Digital & Creative Skills" },
        { value: "certification, trade skills, licensing & exam prep", label: "Certification, Trade Skills, Licensing & Exam Prep" },
        { value: "asl education and training", label: "ASL Education" }
      ],
      services: [
        { value: "all", label: "All" },
        { value: "legal, compliance & protection services", label: "Legal, Compliance & Protection Services" },
        { value: "communication access services", label: "Communication Access Services" },
        { value: "finance, funding & transaction services", label: "Finance, Funding & Transaction Services" },
        { value: "operations, marketing & advisory", label: "Operations, Marketing & Advisory" }
      ],
      official: ["state", "federal"]
    };
    const filters = filtersBySection[section];
    document.getElementById("filterSelect").innerHTML = filters.map((filter) => {
      const option = typeof filter === "string"
        ? { value: filter, label: titleCase(filter) }
        : filter;
      return `
      <option value="${option.value}" ${option.value === activeFilter ? "selected" : ""}>${option.label}</option>
    `;
    }).join("");
  }

  function renderOfficialList() {
    const selectedState = appState.browseOfficialState || appState.selectedState;
    const activeFilter = exploreFilter || "state";
    const stateItems = data.official.filter((item) => item.tags.includes("state") || item.coverage === selectedState);
    const federalItems = data.official.filter((item) => item.tags.includes("federal"));
    const accountActions = appState.isSignedIn ? `
      <div class="inline-actions">
        <button class="app-btn app-btn--ghost" data-action="show-view" data-view="profile">Change State</button>
      </div>
    ` : "";
    const stateContext = appState.isSignedIn
      ? `<div class="detail-section"><p>Your saved state is <strong>${appState.selectedState}</strong>. Browsing another state here does not change your saved default state.</p></div>`
      : `<div class="detail-section"><p>Browse official business information by state without changing anything in your account.</p></div>`;
    if (activeFilter === "federal") {
      return `
        <div class="card">
          <div class="card-header">
            <div>
              <p class="section-kicker">Official Information</p>
              <h2>Federal Information</h2>
            </div>
            ${accountActions}
          </div>
          <div class="detail-section">
            <p>Federal EIN, IRS, federal guidance, federal contracting, and related national resources for doing business in the U.S.</p>
          </div>
          <div class="saved-block">
            <h4>All Federal Resources</h4>
            <div class="plain-list">
              ${federalItems.map((item) => renderOfficialMini(item, selectedState)).join("")}
            </div>
          </div>
        </div>
      `;
    }
    return `
        <div class="card">
          <div class="card-header">
            <div>
              <p class="section-kicker">Official Information</p>
              <h2>Browse by State</h2>
            </div>
            ${accountActions}
          </div>
        ${stateContext}
        <div class="state-browser-grid">
          ${allStates.map((state) => `
            <button class="state-browser-card ${state === selectedState ? "state-browser-card--current" : ""}" type="button" data-action="open-state-detail" data-state="${state}">
              <span class="state-browser-card__eyebrow">${appState.isSignedIn && state === appState.selectedState ? "Saved State" : "State"}</span>
              <strong>${state}</strong>
              <span class="state-browser-card__meta">Open state information</span>
            </button>
          `).join("")}
        </div>
        <div class="card-grid card-grid--two">
          <div class="saved-block">
            <h4>${selectedState}</h4>
            <p>Showing state-level official information.</p>
            <div class="inline-actions">
              <button class="app-btn app-btn--secondary" data-action="open-state-detail" data-state="${selectedState}">Open State Detail</button>
            </div>
          </div>
          <div class="saved-block">
            <h4>State Information</h4>
            <p>Business registration, tax, licensing, agencies, and state contracting resources.</p>
            <div class="plain-list">
              ${stateItems.map((item) => renderOfficialMini(item, selectedState)).join("")}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function renderOfficialMini(item, selectedState) {
    const links = resolveOfficialLinks(item, selectedState);
    const topLink = links[0];
    return `
      <div class="mini-card">
        <strong>${item.title}</strong>
        <p>${item.description}</p>
        <div class="inline-actions">
          <button class="app-btn ${openButtonClass("official")}" data-action="open-item" data-id="${item.id}" data-type="official">Open</button>
          <button class="app-btn app-btn--ghost" data-action="save-item" data-id="${item.id}">${isSaved(item.id) ? "Saved" : "Save"}</button>
          ${topLink ? `<a class="app-btn app-btn--ghost" href="${topLink.href}" target="_blank" rel="noopener noreferrer">Open Link</a>` : ""}
        </div>
      </div>
    `;
  }

  function renderSaved() {
    let planHubHeader = document.getElementById("planHubHeader");
    const savedSectionsNode = document.getElementById("savedSections");
    const savedView = document.getElementById("view-saved");
    if (!savedSectionsNode || !savedView) return;
    if (!planHubHeader) {
      planHubHeader = document.createElement("div");
      planHubHeader.id = "planHubHeader";
      savedView.insertBefore(planHubHeader, savedSectionsNode);
    }
    if (!appState.isSignedIn) {
      planHubHeader.innerHTML = `
        <section class="card guest-upgrade">
          <div class="card-header">
            <div>
              <p class="section-kicker">File</p>
              <h2>Sign up to access your Founder File</h2>
            </div>
          </div>
          <p>Create a Founder account to keep your Founder File, notes, saved items, and progress together in one place.</p>
          <div class="stack-actions">
            <button class="app-btn app-btn--primary" data-action="start-setup-signup">Sign Up to Access Features</button>
          </div>
        </section>
      `;
      savedSectionsNode.className = "";
      savedSectionsNode.innerHTML = "";
      return;
    }

    const planDraft = appState.quizResult
      ? { ...buildPlanDraft(appState.quizResult), ...appState.planDraft }
      : appState.planDraft;
    const planSummary = buildPlanSnapshot();
    const noteEntries = buildFounderNoteLinksMarkup();
    const currentFocus = buildPathSnapshot();
    const goalLabel = setupGoals.find((goal) => goal.value === appState.goal)?.label || "Explore Options";
    const founderIdentity = planDraft.founderIdentity || "Founder";
    const founderIdentityDescription = founderIdentityDescriptions[founderIdentity] || founderIdentityDescriptions.Founder;
    const founderIdentityItems = [
      `<label class="field founder-identity-field"><span>Founder Identity</span><select data-founder-identity-select>${founderIdentityOptions.map((option) => `<option value="${option}" ${option === founderIdentity ? "selected" : ""}>${option}</option>`).join("")}</select></label>`,
      `<div class="mini-card"><strong>What this identity means</strong><p>${founderIdentityDescription}</p></div>`,
      `<div class="mini-card"><strong>Selected State</strong><p>${appState.selectedState}</p></div>`,
      `<div class="mini-card"><strong>Starting Goal</strong><p>${goalLabel}</p></div>`
    ].join("");
    const quizResultSummary = appState.quizResult
      ? {
          understanding: appState.quizResult.understandingSummary,
          culture: appState.quizResult.cultureSummary,
          opportunity: appState.quizResult.opportunitySummary
        }
      : {
          understanding: "Your quiz results will summarize what people pay for here once you complete the quiz.",
          culture: "Your quiz results will summarize how niche is culture here once you complete the quiz.",
          opportunity: "Your quiz results will summarize how the Cost of Living drives opportunity here once you complete the quiz."
        };
    const currentFocusMarkup = `
      <div class="mini-card">
        <strong>What People Pay For</strong>
        <p>${quizResultSummary.understanding}</p>
      </div>
      <div class="mini-card">
        <strong>Niche as Culture</strong>
        <p>${quizResultSummary.culture}</p>
      </div>
      <div class="mini-card">
        <strong>The Cost of Living Drives Opportunity</strong>
        <p>${quizResultSummary.opportunity}</p>
      </div>
    `;
    const ideasMarkup = `
      ${renderFounderFileField("Ideas", "incomeIdea", planDraft.incomeIdea || "", "Capture the income opportunity, business idea, or possible direction you want to keep exploring.")}
      ${buildSavedGroupMarkup("income", "Saved Income Opportunities")}
    `;
    const knowledgeMarkup = `
      ${renderFounderFileField("Knowledge", "knowledge", planDraft.knowledge || "", "Record what you already know and what you may need to learn next.")}
      ${buildSavedGroupMarkup("training", "Saved Knowledge Resources")}
    `;
    const supportMarkup = `
      ${renderFounderFileField("Support", "support", planDraft.support || "", "Note supportive services you may need now, later, or want to compare.")}
      ${buildSavedGroupMarkup("services", "Saved Supportive Services")}
    `;
    const officialMarkup = `
      ${renderFounderFileField("Official Needs", "official", planDraft.official || "", "Track state and federal requirements, pages, and official items relevant to your Founder goals.")}
      ${buildSavedGroupMarkup("official", "Saved Official Information")}
    `;
    const goalsMarkup = `
      ${renderFounderFileField("Goals", "goals", planDraft.goals || planDraft.proof || "", "Describe the goals that matter most to you, in your own words.")}
    `;
    const nextMovesMarkup = `
      ${renderFounderFileField("Next Steps", "nextMoves", planDraft.nextMoves || "", "List the next actions you want to take inside or outside the app.")}
    `;

    planHubHeader.innerHTML = `
      <section class="card">
        <div class="card-header">
          <div>
            <p class="section-kicker">Founder File</p>
          </div>
        </div>
        <div class="quick-links-row">
          <p class="helper-copy quick-links-row__label">Quick Links:</p>
          <button class="utility-link-pill" data-action="open-notes">Notes</button>
          <button class="utility-link-pill" data-action="scroll-founder-file-section" data-target="founderFileDocsSection">Documents</button>
          <button class="utility-link-pill" data-action="scroll-founder-file-section" data-target="founderFileNextStepsSection">Next Steps</button>
        </div>
      </section>
    `;

    savedSectionsNode.className = "plan-page-grid";
    savedSectionsNode.innerHTML = `
      <div class="plan-page-column plan-page-column--left">
        <section class="saved-block plan-page-block plan-page-block--identity">
          <div class="plain-list">${founderIdentityItems}</div>
        </section>
        <section class="saved-block plan-page-block">
          <p class="section-kicker">Goals</p>
          <div class="plain-list">${goalsMarkup}</div>
        </section>
      <section class="saved-block plan-page-block" id="founderFileNextStepsSection">
        <p class="section-kicker">Next Steps</p>
        <div class="plain-list">${nextMovesMarkup}</div>
      </section>
        <section class="saved-block plan-page-block" id="founderFileNotesSection">
          <p class="section-kicker">Notes</p>
          <div class="plain-list">
            ${noteEntries}
          </div>
        </section>
      </div>
      <div class="plan-page-column plan-page-column--right">
        <section class="saved-block plan-page-block">
          <p class="section-kicker">Ideas</p>
          <div class="plain-list">${ideasMarkup}</div>
        </section>
        <section class="saved-block plan-page-block">
          <p class="section-kicker">Knowledge</p>
          <div class="plain-list">${knowledgeMarkup}</div>
        </section>
        <section class="saved-block plan-page-block">
          <p class="section-kicker">Support</p>
          <div class="plain-list">${supportMarkup}</div>
        </section>
        <section class="saved-block plan-page-block">
          <p class="section-kicker">Official Needs</p>
          <div class="plain-list">${officialMarkup}</div>
        </section>
      </div>
      <section class="saved-block plan-page-block plan-page-block--fullwidth" id="founderFileDocsSection">
        <p class="section-kicker">Business Documents</p>
        <p class="helper-copy" style="margin-top:0">Track your key documents from formation to operations. Set a status, add notes, and link to where each one lives.</p>
        <div class="doc-modules">${renderBusinessDocsModule()}</div>
      </section>
      <section class="saved-block plan-page-block plan-page-block--fullwidth">
        <p class="section-kicker">Quiz Results Summary</p>
        <div class="plain-list">${currentFocusMarkup}</div>
      </section>
      <section class="saved-block plan-page-block plan-page-block--fullwidth">
        <p class="section-kicker">Explore Another Set of Ideas</p>
        <p>If you are feeling different, seeing a different opportunity pattern, or want to test another set of ideas, you can revisit the quiz.</p>
        <div class="inline-actions">
          <button class="utility-link" data-action="open-quiz">Revisit the Quiz</button>
        </div>
      </section>
    `;
  }

  function renderFounderFileField(label, field, value, helper) {
    return `
      <label class="field plan-draft-field">
        <textarea data-plan-field="${field}" placeholder="${helper}">${value}</textarea>
      </label>
    `;
  }

  function getFounderForms() {
    try { return JSON.parse(localStorage.getItem(FOUNDER_FORMS_KEY) || "[]"); } catch (e) { return []; }
  }

  function saveFounderForms(files) {
    try { localStorage.setItem(FOUNDER_FORMS_KEY, JSON.stringify(files)); } catch (e) {
      showDocUploadError("Storage limit reached. Remove existing files or use a link instead.");
    }
  }

  function showDocUploadError(msg) {
    const errEl = document.getElementById("docUploadError");
    if (errEl) { errEl.textContent = msg; errEl.hidden = false; }
  }

  function addFounderForm(file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const existing = getFounderForms();
      existing.push({ id: "form-" + Date.now(), name: file.name, type: file.type, size: file.size, data: e.target.result, addedAt: new Date().toISOString() });
      saveFounderForms(existing);
      renderSaved();
    };
    reader.readAsDataURL(file);
  }

  function removeFounderForm(formId) {
    saveFounderForms(getFounderForms().filter(function (f) { return f.id !== formId; }));
    renderSaved();
  }

  function buildOtherFormsMarkup() {
    const files = getFounderForms();
    const fileListMarkup = files.length
      ? files.map(function (f) {
          const kb = Math.round(f.size / 1024);
          return `<div class="doc-file-row">
            <a class="doc-file-name" href="${f.data}" download="${f.name}" title="Download ${f.name}">${f.name}</a>
            <span class="doc-file-size">${kb}KB</span>
            <button class="doc-file-remove text-link" data-action="remove-founder-form" data-form-id="${f.id}" aria-label="Remove ${f.name}">Remove</button>
          </div>`;
        }).join("")
      : `<p class="doc-file-empty">No files attached yet.</p>`;
    return `
      <div class="doc-item doc-item--upload">
        <div class="doc-item__header">
          <span class="doc-item__label">Other Forms</span>
        </div>
        <p class="doc-item__helper">Upload completed forms, filings, or copies. PDF, Word, or image files up to 1MB each. Files are stored in your browser only.</p>
        <label class="doc-upload-label">
          <input type="file" class="doc-file-input" data-action="attach-founder-form" accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" multiple>
          <span class="doc-upload-btn">Attach files</span>
        </label>
        <div id="docUploadError" class="doc-upload-error" hidden></div>
        <div class="doc-file-list">${fileListMarkup}</div>
      </div>
    `;
  }

  function renderBusinessDocsModule() {
    const docs = appState.businessDocs || {};
    const categories = ["Foundation", "Financial", "Operations"];
    return categories.map(function (category) {
      const items = businessDocTypes.filter(function (d) { return d.category === category; });
      const itemsMarkup = items.map(function (doc) {
        if (doc.isUpload) return buildOtherFormsMarkup();
        const docData = docs[doc.id] || {};
        const status = docData.status || "";
        const note = docData.note || "";
        const statusOptions = docStatusOptions.map(function (opt) {
          return `<option value="${opt.value}"${opt.value === status ? " selected" : ""}>${opt.label}</option>`;
        }).join("");
        const statusClass = status ? " doc-item--" + status : "";
        return `
          <div class="doc-item${statusClass}">
            <div class="doc-item__header">
              <span class="doc-item__label">${doc.label}</span>
              <select class="doc-item__status" data-doc-id="${doc.id}" data-doc-field="status">${statusOptions}</select>
            </div>
            <label class="field doc-item__note-field">
              <textarea data-doc-id="${doc.id}" data-doc-field="note" placeholder="${doc.helper}">${note}</textarea>
            </label>
          </div>
        `;
      }).join("");
      return `
        <div class="doc-category">
          <p class="doc-category__label">${category}</p>
          <div class="doc-category__items">${itemsMarkup}</div>
        </div>
      `;
    }).join("");
  }

  function buildSavedGroupMarkup(type, heading) {
    const items = appState.savedIds
      .map((id) => findItem(id))
      .filter(Boolean)
      .filter((item) => detectItemType(item.id) === type);
    if (!items.length) {
      return `<div class="empty-state">No saved items here yet.</div>`;
    }
    return `
      <section class="plan-saved-group">
        <h5>${heading}</h5>
        <div class="plain-list">
          ${items.map((item) => renderSavedItem(item, type)).join("")}
        </div>
      </section>
    `;
  }

  function normalizeNoteEntry(entry) {
    if (!entry) return { text: "", starred: false };
    if (typeof entry === "string") return { text: entry, starred: false };
    return {
      text: entry.text || "",
      starred: Boolean(entry.starred)
    };
  }

  function getNoteText(id) {
    return normalizeNoteEntry(appState.notes[id]).text;
  }

  function isNoteStarred(id) {
    return normalizeNoteEntry(appState.notes[id]).starred;
  }

  function buildSortedNoteEntries(limit = null) {
    const entries = Object.entries(appState.notes)
      .map(([id, note]) => ({ id, note: normalizeNoteEntry(note), item: findItem(id) }))
      .filter((entry) => entry.item && entry.note.text);
    entries.sort((a, b) => Number(b.note.starred) - Number(a.note.starred));
    return limit ? entries.slice(0, limit) : entries;
  }

  function buildNoteCardsMarkup() {
    const noteEntries = buildSortedNoteEntries();
    if (!noteEntries.length) {
      return `<div class="empty-state">Notes you add to items in the app will show up here.</div>`;
    }
    return noteEntries.map(({ id, note, item }) => {
      const type = detectItemType(id);
      return `
        <div class="mini-card">
          <strong>${item.title}</strong>
          <p>${note.text}</p>
          <div class="inline-actions">
            <button class="utility-link" data-action="toggle-note-star" data-id="${id}">${note.starred ? "Starred" : "Star"}</button>
            <button class="utility-link" data-action="open-item" data-id="${id}" data-type="${type}">Open</button>
            <button class="utility-link utility-link--danger" data-action="delete-note" data-id="${id}">Delete</button>
          </div>
        </div>
      `;
    }).join("");
  }

  function getFounderNotesEntries() {
    let entries = Array.isArray(appState.planDraft.founderNotesEntries)
      ? appState.planDraft.founderNotesEntries.map((entry) => ({
          id: entry.id,
          subject: entry.subject || "",
          body: entry.body || "",
          updatedAt: entry.updatedAt || new Date().toISOString()
        }))
      : [];
    if (!entries.length && typeof appState.planDraft.founderNotes === "string" && appState.planDraft.founderNotes.trim()) {
      entries = [{
        id: `founder-note-${Date.now()}`,
        subject: "Founder Note",
        body: appState.planDraft.founderNotes.trim(),
        updatedAt: new Date().toISOString()
      }];
      appState.planDraft.founderNotesEntries = entries;
      delete appState.planDraft.founderNotes;
      saveState();
    }
    return entries.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }

  function saveFounderNotesEntries(entries) {
    appState.planDraft.founderNotesEntries = entries;
    delete appState.planDraft.founderNotes;
    saveState();
  }

  function createFounderNote() {
    const entries = getFounderNotesEntries();
    const newEntry = {
      id: `founder-note-${Date.now()}`,
      subject: "",
      body: "",
      updatedAt: new Date().toISOString()
    };
    saveFounderNotesEntries([newEntry, ...entries]);
    renderSaved();
    return newEntry.id;
  }

  function updateFounderNoteField(noteId, field, value) {
    const entries = getFounderNotesEntries();
    const entry = entries.find((item) => item.id === noteId);
    if (!entry) return;
    entry[field] = value;
    entry.updatedAt = new Date().toISOString();
    saveFounderNotesEntries(entries);
    renderSaved();
    renderProgress();
  }

  function saveFounderNote(noteId) {
    const subjectInput = document.querySelector(`[data-founder-note-field="subject"][data-note-id="${noteId}"]`);
    const bodyInput = document.querySelector(`[data-founder-note-field="body"][data-note-id="${noteId}"]`);
    if (!subjectInput || !bodyInput) return;
    updateFounderNoteField(noteId, "subject", subjectInput.value);
    updateFounderNoteField(noteId, "body", bodyInput.value);
    renderNotes(noteId);
    openOverlay("notesOverlay", { kind: "notes", itemId: noteId });
  }

  function deleteFounderNote(noteId) {
    const entries = getFounderNotesEntries().filter((entry) => entry.id !== noteId);
    saveFounderNotesEntries(entries);
    renderSaved();
    renderProgress();
    renderNotes(entries[0]?.id || null);
    openOverlay("notesOverlay", { kind: "notes", itemId: entries[0]?.id || null });
  }

  function formatFounderNoteDate(value) {
    if (!value) return "";
    try {
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      }).format(new Date(value));
    } catch {
      return value;
    }
  }

  function buildFounderNoteLinksMarkup() {
    const entries = getFounderNotesEntries();
    if (!entries.length) {
      return `<div class="empty-state">Founder notes will show up here.</div>`;
    }
    return entries.map((entry) => `
      <div class="mini-card founder-note-link-card">
        <button class="text-link founder-note-link" data-action="open-founder-note" data-id="${entry.id}">${escapeHtml(entry.subject || "Untitled Note")}</button>
        <p class="founder-note-link__meta">${escapeHtml(formatFounderNoteDate(entry.updatedAt))}</p>
      </div>
    `).join("");
  }

  function buildSavedCollectionsMarkup() {
    const grouped = {};
    appState.savedIds.forEach((id) => {
      const item = findItem(id);
      if (!item) return;
      const type = detectItemType(id);
      grouped[type] = grouped[type] || [];
      grouped[type].push(item);
    });

    const groups = Object.entries(grouped).map(([type, items]) => `
      <section class="plan-saved-group">
        <h5>${sectionLabels[type] || titleCase(type)}</h5>
        <div class="plain-list">
          ${items.map((item) => renderSavedItem(item, type)).join("")}
        </div>
      </section>
    `).join("");

    return groups || `<div class="empty-state">Save any option, resource, official page, or article you want to keep inside your file.</div>`;
  }

  function renderSavedItem(item, type) {
    const id = item.id;
    const savedNote = getNoteText(id);
    return `
      <div class="mini-card">
        <strong>${item.title}</strong>
        <p>${item.description || item.explanation || ""}</p>
        ${savedNote ? `<p><strong>Saved note:</strong> ${savedNote}</p>` : ""}
        <div class="inline-actions inline-actions--saved">
          <button class="app-btn ${openButtonClass(type)}" data-action="open-item" data-id="${id}" data-type="${type}">Open</button>
          <button class="utility-link utility-link--danger" data-action="remove-saved" data-id="${id}">Remove</button>
        </div>
      </div>
    `;
  }

  function renderNotes(selectedFounderNoteId = null) {
    const founderNotes = getFounderNotesEntries();
    const activeFounderNote = founderNotes.find((entry) => entry.id === selectedFounderNoteId) || founderNotes[0] || null;
    const noteEntries = buildSortedNoteEntries();
    document.getElementById("notesList").innerHTML = `
      <section class="saved-block">
        <h4>Founder Notes</h4>
        <p>Use this space for free-form notes you want to keep in your Founder File.</p>
        <div class="inline-actions">
          <button class="utility-link" data-action="new-founder-note">New Note</button>
        </div>
        ${activeFounderNote ? `
          <label class="field plan-draft-field">
            <span>Subject</span>
            <input data-founder-note-field="subject" data-note-id="${activeFounderNote.id}" type="text" placeholder="Subject" value="${escapeHtml(activeFounderNote.subject)}">
          </label>
          <label class="field plan-draft-field">
            <span>Date</span>
            <input type="text" value="${escapeHtml(formatFounderNoteDate(activeFounderNote.updatedAt))}" disabled>
          </label>
          <label class="field plan-draft-field">
            <span>Note</span>
            <textarea data-founder-note-field="body" data-note-id="${activeFounderNote.id}" placeholder="Add notes, reminders, observations, or anything else you want to keep here.">${escapeHtml(activeFounderNote.body)}</textarea>
          </label>
          <div class="inline-actions founder-note-actions">
            <button class="app-btn app-btn--primary" data-action="save-founder-note" data-id="${activeFounderNote.id}">Save Note</button>
            <button class="app-btn app-btn--danger" data-action="delete-founder-note" data-id="${activeFounderNote.id}">Delete Note</button>
          </div>
        ` : `<div class="empty-state">Start a Founder note to keep free-form thoughts, reminders, and ideas in one place.</div>`}
      </section>
      <section class="saved-block">
        <h4>Founder Note List</h4>
        ${founderNotes.length
          ? `<div class="plain-list">${founderNotes.map((entry) => `
              <div class="mini-card founder-note-link-card">
                <button class="text-link founder-note-link" data-action="open-founder-note" data-id="${entry.id}">${escapeHtml(entry.subject || "Untitled Note")}</button>
                <p class="founder-note-link__meta">${escapeHtml(formatFounderNoteDate(entry.updatedAt))}</p>
              </div>
            `).join("")}</div>`
          : `<div class="empty-state">Your Founder notes will show up here once you create them.</div>`
        }
      </section>
      <section class="saved-block">
        <h4>Notes by Item</h4>
        ${noteEntries.length
          ? noteEntries.map(({ id, note, item }) => {
          return `
            <div class="note-card">
              <h4>${item.title}</h4>
              <p>${note.text}</p>
              <div class="inline-actions">
                <button class="utility-link" data-action="toggle-note-star" data-id="${id}">${note.starred ? "Starred" : "Star"}</button>
                <button class="app-btn ${openButtonClass(detectItemType(id))}" data-action="open-item" data-id="${id}" data-type="${detectItemType(id)}">Open</button>
                <button class="app-btn app-btn--ghost" data-action="delete-note" data-id="${id}">Delete Note</button>
              </div>
            </div>
          `;
        }).join("")
          : `<div class="empty-state">Notes you add to income options, training, services, and official resources will show up here.</div>`
        }
      </section>
    `;
  }

  function renderProgress() {
    const planDraft = appState.quizResult
      ? { ...buildPlanDraft(appState.quizResult), ...appState.planDraft }
      : appState.planDraft;
    const founderIdentity = planDraft.founderIdentity || "Founder";
    const noteEntries = buildSortedNoteEntries(3);
    const nextMoves = (planDraft.nextMoves || "")
      .split("\n")
      .map((step) => step.trim())
      .filter(Boolean)
      .slice(0, 4);
    const overviewNextSteps = nextMoves.length ? nextMoves : [];
    const goalSummary = planDraft.goals || planDraft.proof || "Clarify what progress, traction, or proof would matter most right now.";
    document.getElementById("progressStages").innerHTML = `
      <section class="progress-stage">
        <h4>Identity</h4>
        <div class="mini-card">
          <strong>${founderIdentity}</strong>
          <p>Your current founder type will show here.</p>
        </div>
      </section>
      <section class="progress-stage">
        <h4>Next Steps</h4>
        ${overviewNextSteps.length
          ? `<ul class="overview-list">${overviewNextSteps.map((step) => `<li>${step}</li>`).join("")}</ul>`
          : `<div class="mini-card"><p>Next steps will show here.</p></div>`
        }
      </section>
      <section class="progress-stage">
        <h4>Notes Highlights</h4>
        ${noteEntries.length
          ? noteEntries.map(({ item, note }) => `
              <div class="mini-card">
                <strong>${item.title}</strong>
                <p>${note.text}</p>
              </div>
            `).join("")
          : `<div class="mini-card"><p>Your most important notes will show here.</p></div>`
        }
      </section>
      <section class="progress-stage">
        <h4>Goals</h4>
        <div class="mini-card">
          <strong>Current goals</strong>
          <p>${goalSummary}</p>
        </div>
      </section>
    `;
  }

  function renderPlanField(label, field, value) {
    return `
      <label class="field plan-draft-field">
        <span>${label}</span>
        <textarea data-plan-field="${field}" placeholder="${label}">${value}</textarea>
      </label>
    `;
  }

  function renderPlannerSignupPrompt() {
    document.getElementById("progressStages").innerHTML = `
      <section class="progress-stage progress-stage--overview">
        <h4>Sign Up to Access Founder File Overview</h4>
        <p>Create a Founder account to build your Founder File and save your notes, relevant information, and Founder progress.</p>
        <div class="inline-actions">
          <button class="app-btn app-btn--secondary" data-action="start-setup-signup">Founder Sign Up</button>
          <button class="app-btn app-btn--ghost" data-action="go-explore">Keep Exploring</button>
        </div>
      </section>
    `;
  }

  function renderSaveSignupPrompt() {
    document.getElementById("progressStages").innerHTML = `
      <section class="progress-stage progress-stage--overview">
        <h4>Sign Up to Use Save Features</h4>
        <p>Create an account to save options, resources, notes, and plan items so you can return to them later.</p>
        <div class="inline-actions">
          <button class="app-btn app-btn--secondary" data-action="start-setup-signup">Sign Up to Save</button>
          <button class="app-btn app-btn--ghost" data-action="go-explore">Keep Exploring</button>
        </div>
      </section>
    `;
  }

  function renderPostSignupPrompt() {
    document.getElementById("progressStages").innerHTML = `
      <section class="progress-stage progress-stage--overview">
        <h4>Founder access unlocked</h4>
        <p>You can go straight to the quiz to build understanding of what people pay for, or start by exploring opportunities, resources, and official information.</p>
        <div class="inline-actions">
          <button class="app-btn app-btn--secondary" data-action="post-signup-quiz">Go to Quiz</button>
          <button class="app-btn app-btn--ghost" data-action="post-signup-explore">Explore First</button>
        </div>
      </section>
    `;
  }

  function renderSavedQuizResult() {
    const node = document.getElementById("savedQuizResult");
    if (!appState.quizResult) {
      node.innerHTML = `<div class="empty-state">Take the quiz to generate a first-draft Founder File based on what people pay for and where opportunity may be forming.</div>`;
      return;
    }
    node.innerHTML = renderQuizResult(appState.quizResult, false);
  }

  function renderArticleDirectory() {
    const detailType = document.getElementById("detailType");
    const detailTitle = document.getElementById("detailTitle");
    const detailBody = document.getElementById("detailBody");
    detailType.textContent = "Articles";
    detailTitle.textContent = "All Articles";
    detailBody.innerHTML = `
      <div class="detail-section article-directory-shell">
        <p class="article-directory-copy">Browse every article available inside the app and open any one without leaving the app experience.</p>
        <div class="plain-list article-directory-list">
          ${data.articles.map((item) => `
            <div class="mini-card">
              <strong>${item.title}</strong>
              <p>${item.description || ""}</p>
              <div class="inline-actions">
                <button class="utility-link" data-action="open-item" data-id="${item.id}" data-type="article">Open Article</button>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    `;
    openOverlay("detailOverlay", { kind: "article-directory" });
  }

  function renderTermsDirectory() {
    const detailType = document.getElementById("detailType");
    const detailTitle = document.getElementById("detailTitle");
    const detailBody = document.getElementById("detailBody");
    detailType.textContent = "Terms";
    detailTitle.textContent = "Terms & Definitions";
    detailBody.innerHTML = `
      <div class="detail-section article-directory-shell">
        <p class="article-directory-copy">Use this glossary to understand the core concepts behind the app and the founder identity terms used throughout the Founder File.</p>
        <div class="plain-list article-directory-list">
          <div class="mini-card">
            <strong>What People Pay For</strong>
            <p>The full range of what people pay for across need, want, desire, protection, access, improvement, proof, enjoyment, and more.</p>
          </div>
          <div class="mini-card">
            <strong>The Six</strong>
            <p>The six motivators that drive spending: Survival and Stability, Safety and Protection, Relief and Health, Pleasure and Comfort, Belonging and Love, and Status, Meaning, and Legacy.</p>
          </div>
          <div class="mini-card">
            <strong>The Cost of Living</strong>
            <p>The costs people pay to get results, get what they want, solve problems, or just live. These costs show up in time, energy, attention, comfort, and risk.</p>
          </div>
          <div class="mini-card">
            <strong>Niche as Culture</strong>
            <p>Culture is the cost and relief sought. It is established by what people pay and the result they seek.</p>
          </div>
          <div class="mini-card">
            <strong>Founder</strong>
            <p>Founder is the catch-all term used in the app for a person building, shaping, formalizing, buying, owning, or running something of their own.</p>
            <p><strong>Workforce:</strong> varies by business model and stage.</p>
          </div>
          <div class="mini-card">
            <strong>Entrepreneur</strong>
            <p>An entrepreneur is a person building a business with the intent to innovate, scale, and create something that can eventually operate beyond the founder’s direct labor.</p>
            <p><strong>Workforce:</strong> may start solo, but may grow into a team.</p>
          </div>
          <div class="mini-card">
            <strong>Solopreneur</strong>
            <p>A solopreneur is a person who independently owns and operates a business without partners or employees. They are both the founder and the workforce.</p>
            <p><strong>Workforce:</strong> solo.</p>
          </div>
          <div class="mini-card">
            <strong>Small Business Owner</strong>
            <p>A small business owner is a person who operates a business to serve a local, specific, or defined market, often through a storefront, direct service, or specialized offer. Unlike entrepreneurs focused on scaling quickly, small business owners often build around a more established model and make it their own.</p>
            <p><strong>Workforce:</strong> a small team, a few employees, or the owner alone.</p>
          </div>
          <div class="mini-card">
            <strong>Freelancer</strong>
            <p>A freelancer is a self-employed person who provides services to clients on a project, contract, or hourly basis.</p>
            <p><strong>Workforce:</strong> solo.</p>
          </div>
          <div class="mini-card">
            <strong>Independent Contractor</strong>
            <p>An independent contractor is a self-employed person hired to perform work under contract rather than as an employee.</p>
            <p><strong>Workforce:</strong> solo.</p>
          </div>
          <div class="mini-card">
            <strong>Owner-Operator</strong>
            <p>An owner-operator is a person who owns the business and also actively performs the day-to-day work or core service of that business. While all owner-operators are small business owners, not all small business owners are owner-operators.</p>
            <p><strong>Workforce:</strong> the owner as the primary operator, sometimes with a very small team.</p>
          </div>
          <div class="mini-card">
            <strong>Service Business Owner</strong>
            <p>A service business owner is a person whose business earns money by providing services rather than selling products.</p>
            <p><strong>Workforce:</strong> solo or team.</p>
          </div>
          <div class="mini-card">
            <strong>Product-Based Business Owner</strong>
            <p>A product-based business owner is a person whose business earns money by selling physical or digital products.</p>
            <p><strong>Workforce:</strong> solo or team.</p>
          </div>
          <div class="mini-card">
            <strong>Online Business Owner</strong>
            <p>An online business owner is a person who runs a business primarily through the internet.</p>
            <p><strong>Workforce:</strong> solo or team.</p>
          </div>
          <div class="mini-card">
            <strong>Home-Based Business Owner</strong>
            <p>A home-based business owner is a person who operates a business from home rather than from a separate commercial location.</p>
            <p><strong>Workforce:</strong> solo or a very small team.</p>
          </div>
          <div class="mini-card">
            <strong>Business Buyer</strong>
            <p>A business buyer is a person who acquires an existing business instead of creating one from scratch.</p>
            <p><strong>Workforce:</strong> depends on the business acquired.</p>
          </div>
          <div class="mini-card">
            <strong>Franchise Owner</strong>
            <p>A franchise owner is a person who operates a business using an established brand, system, and operating model licensed from a larger company.</p>
            <p><strong>Workforce:</strong> varies by franchise model.</p>
          </div>
          <div class="mini-card">
            <strong>Full-Time Business Owner</strong>
            <p>A full-time business owner is a person whose primary work and primary earned income come from their business.</p>
            <p><strong>Workforce:</strong> solo or team.</p>
          </div>
          <div class="mini-card">
            <strong>Part-Time Business Owner</strong>
            <p>A part-time business owner is a person who owns and runs a business while also balancing another major job, role, or responsibility.</p>
            <p><strong>Workforce:</strong> solo or a very small team.</p>
          </div>
        </div>
      </div>
    `;
    openOverlay("detailOverlay", { kind: "terms-directory" });
  }

  async function openDetail(id, type) {
    const item = findItem(id);
    if (!item) return;
    if (type === "official" && item.statePage && item.stateName) {
      await openStateDetail(item.stateName);
      return;
    }
    registerViewed(id);
    const detailType = document.getElementById("detailType");
    const detailTitle = document.getElementById("detailTitle");
    const detailBody = document.getElementById("detailBody");
    detailType.textContent = sectionLabels[type] || titleCase(type);
    detailTitle.textContent = item.title;
    openOverlay("detailOverlay", { kind: "item", itemId: id, itemType: type });
    if (type === "article") {
      detailBody.innerHTML = `<div class="empty-state">Loading article...</div>`;
      const articleContent = await loadArticleContent(item);
      detailBody.innerHTML = renderDetailBody(item, type, articleContent);
      return;
    }
    detailBody.innerHTML = renderDetailBody(item, type);
  }

  function renderDetailBody(item, type, articleContent = null) {
    if (type === "income") {
      return `
        <div class="detail-section">
          <p>${item.overview || item.description}</p>
          <div class="item-tags">${(item.tags || []).map(renderTag).join("")}</div>
        </div>
        <div class="detail-section">
          <h3>Why someone may choose it</h3>
          <p>${item.whyChoose || `This appears in ${item.groupTitle || "the live directory"} and may fit someone exploring this direction.`}</p>
        </div>
        <div class="detail-section">
          <h3>What kind of person or situation it may fit</h3>
          <p>${item.fit || `Useful when ${item.groupTitle ? item.groupTitle.toLowerCase() : "this option"} fits what you are trying to build.`}</p>
        </div>
        <div class="detail-section">
          <h3>Related training</h3>
          ${renderRelatedLinks(item.trainingIds, "training", item, "income")}
        </div>
        <div class="detail-section">
          <h3>Related support services</h3>
          ${renderRelatedLinks(item.serviceIds, "services", item, "income")}
        </div>
        <div class="detail-section">
          <h3>Related official information</h3>
          ${renderRelatedLinks(item.officialIds, "official", item, "income")}
        </div>
        ${item.externalHref ? `<div class="detail-section"><a class="app-btn app-btn--secondary" href="${item.externalHref}" target="_blank" rel="noopener noreferrer">Open Source Listing</a></div>` : ""}
        ${renderNoteEditor(item.id)}
        ${renderDetailActions(item.id, type)}
      `;
    }

    if (type === "training") {
      return `
        <div class="detail-section">
          <p><strong>Provider:</strong> ${item.provider || item.groupTitle || "Training resource"}</p>
          <p><strong>Format:</strong> ${item.format || item.groupTitle || "Resource"}</p>
          <p><strong>Cost:</strong> ${item.cost || "Varies"}</p>
          <p>${item.covers || item.description}</p>
        </div>
        <div class="detail-section">
          <h3>Who it may fit</h3>
          <p>${item.fit || `Useful when you are building skills around ${item.groupTitle ? item.groupTitle.toLowerCase() : "this option"}.`}</p>
        </div>
        <div class="detail-section">
          <h3>Related income options</h3>
          ${renderRelatedLinks(item.relatedIncomeIds, "income", item, "training")}
        </div>
        ${item.externalHref ? `<div class="detail-section"><a class="app-btn app-btn--secondary" href="${item.externalHref}" target="_blank" rel="noopener noreferrer">Open Source Listing</a></div>` : ""}
        ${renderDetailActions(item.id, type)}
        ${renderNoteEditor(item.id)}
      `;
    }

    if (type === "services") {
      return `
        <div class="detail-section">
          <p>${item.helpsWith || item.description}</p>
        </div>
        <div class="detail-section">
          <h3>Examples of when someone may need it</h3>
          <p>${item.examples || `This can matter when ${item.groupTitle ? item.groupTitle.toLowerCase() : "support work"} becomes a bottleneck.`}</p>
        </div>
        <div class="detail-section">
          <h3>Related providers or resources</h3>
          <ul class="detail-links">${(item.providerLinks || []).map((link) => `<li><a href="${link.href}" target="_blank" rel="noopener noreferrer">${link.label}</a></li>`).join("") || (item.externalHref ? `<li><a href="${item.externalHref}" target="_blank" rel="noopener noreferrer">Open source listing</a></li>` : "<li>No linked provider resources in this directory item yet.</li>")}</ul>
        </div>
        <div class="detail-section">
          <h3>Related income options</h3>
          ${renderRelatedLinks(item.relatedIncomeIds, "income", item, "services")}
        </div>
        ${renderDetailActions(item.id, type)}
        ${renderNoteEditor(item.id)}
      `;
    }

    if (type === "official") {
      const links = resolveOfficialLinks(item, appState.selectedState);
      return `
        <div class="detail-section">
          <p>${item.description}</p>
          <p><strong>Selected state:</strong> ${appState.selectedState}</p>
        </div>
        <div class="detail-section">
          <h3>Links</h3>
          <ul class="detail-links">${links.map((link) => `<li><a href="${link.href}" target="_blank" rel="noopener noreferrer">${link.label}</a></li>`).join("") || "<li>No direct links for this state in the current seed data.</li>"}</ul>
        </div>
        ${renderDetailActions(item.id, type)}
        ${renderNoteEditor(item.id)}
      `;
    }

    if (type === "article") {
      return `
        <div class="detail-section article-detail-shell">
          ${articleContent?.meta ? `<p class="article-detail-meta">${articleContent.meta}</p>` : ""}
          <div class="article-detail-intro">
            <p class="article-detail-description">${item.description || "This article is available inside the Income Spectrum resource base."}</p>
            ${articleContent?.lead ? `<p class="article-detail-lead">${articleContent.lead}</p>` : ""}
          </div>
          ${articleContent?.bodyHtml ? `<div class="article-live-content">${articleContent.bodyHtml}</div>` : ""}
        </div>
        <div class="detail-section article-detail-footer">
          <h3>Keep this connected</h3>
          <p>You can save this article in the app, add notes to it, and use it alongside related income options, training, services, and official information.</p>
        </div>
        ${item.href ? `<div class="detail-section"><a class="utility-link" href="${item.href}" target="_blank" rel="noopener noreferrer">Open Website Article</a></div>` : ""}
        ${renderNoteEditor(item.id)}
        ${renderDetailActions(item.id, type)}
      `;
    }

    return `
      <div class="detail-section">
        <p>${item.description || item.explanation || ""}</p>
      </div>
    `;
  }

  function renderRelatedLinks(ids, type, sourceItem = null, sourceType = "") {
    let items = ids.map((id) => findItem(id)).filter(Boolean);
    if (!items.length && sourceItem) {
      items = inferRelatedItems(sourceItem, type, sourceType);
    }
    return items.length
      ? `<ul class="detail-links">${items.map((item) => `<li><button class="text-link" data-action="open-item" data-id="${item.id}" data-type="${type}">${item.title}</button></li>`).join("")}</ul>`
      : `<div class="empty-state">No close related items surfaced for this one yet.</div>`;
  }

  function renderDetailActions(id, type) {
    return "";
  }

  function renderNoteEditor(id) {
    return `
      <div class="detail-section note-editor">
        <h3>Add Note</h3>
        <textarea id="note-${id}" placeholder="Add a note about this item...">${getNoteText(id)}</textarea>
        <div class="inline-actions">
          <button class="utility-link utility-link--detail-save ${isSaved(id) ? "utility-link--active" : ""}" data-action="save-note" data-id="${id}">${isSaved(id) ? "Saved" : "Save"}</button>
        </div>
      </div>
    `;
  }

  function renderSearchResults() {
    const recentSearchesNode = document.getElementById("recentSearches");
    const searchResultsNode = document.getElementById("searchResults");
    if (!recentSearchesNode || !searchResultsNode) return;
    const query = (document.getElementById("globalSearchInput")?.value || "").trim().toLowerCase();
    recentSearchesNode.innerHTML = appState.recentSearches.map((term) => `
      <button class="recent-search" data-action="recent-search" data-query="${term}">${term}</button>
    `).join("");
    if (!query) {
      searchResultsNode.innerHTML = `<div class="empty-state">Search across income options, training, services, official information, and articles.</div>`;
      return;
    }

    registerSearch(query);

    const pools = {
      income: data.income,
      training: data.training,
      services: data.services,
      official: data.official,
      article: data.articles
    };

    const groups = Object.entries(pools).map(([type, items]) => {
      const results = items.filter((item) => searchMatch(item, query));
      if (!results.length) return "";
      return `
        <section class="result-group">
          <h3>${sectionLabels[type] || titleCase(type)}</h3>
          ${results.map((item) => `
            <div class="mini-card">
              <strong>${item.title}</strong>
              <p>${item.description}</p>
              <div class="inline-actions">
                <button class="app-btn ${openButtonClass(type)}" data-action="open-item" data-id="${item.id}" data-type="${type}">Open</button>
              </div>
            </div>
          `).join("")}
        </section>
      `;
    }).join("");

    searchResultsNode.innerHTML = groups || `<div class="empty-state">No results found. Try a different term.</div>`;
  }

  function renderQuiz() {
    const progressText = document.getElementById("quizProgressText");
    const progressBar = document.getElementById("quizProgressBar");
    const body = document.getElementById("quizBody");
    document.getElementById("quizTitle").textContent = quiz.title;

    if (appState.quizResult && quizIndex >= quiz.questions.length) {
      progressText.textContent = "Result";
      progressBar.style.width = "100%";
      body.innerHTML = renderQuizResult(appState.quizResult, true);
      return;
    }

    const question = quiz.questions[quizIndex];
    const selected = appState.quizAnswers[question.id];
    progressText.textContent = `Question ${quizIndex + 1} of ${quiz.questions.length}`;
    progressBar.style.width = `${((quizIndex + 1) / quiz.questions.length) * 100}%`;
    body.innerHTML = `
      <div class="quiz-question">
        ${quizIndex === 0 ? `<p>${quiz.intro}</p><p>${quiz.frameworkNote}</p>` : ""}
        <h3>${question.prompt}</h3>
        <div class="quiz-options">
          ${question.options.map((option) => `
            <button class="quiz-option ${selected === option.value ? "selected" : ""}" data-action="quiz-option" data-value="${option.value}">
              ${option.label}
            </button>
          `).join("")}
        </div>
        <div class="quiz-nav">
          <button class="app-btn app-btn--ghost" data-action="quiz-back" ${quizIndex === 0 ? "disabled" : ""}>Back</button>
          <button class="app-btn app-btn--primary" data-action="quiz-next">${quizIndex === quiz.questions.length - 1 ? "See Result" : "Next"}</button>
        </div>
      </div>
    `;
  }

  function setQuizAnswer(value) {
    const question = quiz.questions[quizIndex];
    appState.quizAnswers[question.id] = value;
    saveState();
    renderQuiz();
  }

  function nextQuizStep() {
    const question = quiz.questions[quizIndex];
    if (!appState.quizAnswers[question.id]) return;
    if (quizIndex < quiz.questions.length - 1) {
      quizIndex += 1;
      renderQuiz();
      return;
    }
    appState.quizResult = buildQuizResult();
    applyQuizResultToPlan(appState.quizResult);
    quizIndex = quiz.questions.length;
    saveState();
    renderQuiz();
    renderSavedQuizResult();
    renderProgress();
    renderHome();
  }

  function previousQuizStep() {
    if (quizIndex > 0) {
      quizIndex -= 1;
      renderQuiz();
    }
  }

  function resetIncompleteQuiz() {
    const hasCompletedResult = Boolean(appState.quizResult);
    const isQuizComplete = quizIndex >= quiz.questions.length;
    if (hasCompletedResult || isQuizComplete) return;
    appState.quizAnswers = {};
    quizIndex = 0;
    saveState();
  }

  function renderQuizResult(result, includeSaveButton) {
    return `
      <div class="result-group">
        <h3>${result.planTitle}</h3>
        <p>${result.explanation}</p>
        <div class="detail-section">
          <h4>Founder Identity</h4>
          <p><strong>${result.founderIdentity}</strong></p>
          <p>${result.founderIdentityDescription}</p>
        </div>
        <div class="detail-section">
          <h4>State</h4>
          <p>${appState.selectedState}</p>
        </div>
        <div class="detail-section">
          <h4>Focus</h4>
          <p><strong>${result.pathLabel}</strong></p>
          <p>${result.pathSummary}</p>
        </div>
        <div class="detail-section">
          <h4>File</h4>
          <p>${result.planSummary}</p>
        </div>
        <div class="detail-section">
          <h4>What is driving the behavior</h4>
          <p>${result.motivator}</p>
        </div>
        <div class="detail-section">
          <h4>What people are paying with</h4>
          <p>${result.payment}</p>
        </div>
        <div class="detail-section">
          <h4>What the culture pattern is</h4>
          <p>${result.culture}</p>
        </div>
        <div class="detail-section">
          <h4>Where opportunity starts</h4>
          <p>${result.direction}</p>
        </div>
        ${result.fieldSuggestion && result.fieldSuggestion.label !== "Still exploring" ? `
        <div class="detail-section">
          <h4>Possible Field of Interest</h4>
          <p><strong>${result.fieldSuggestion.label}</strong></p>
          <p>${result.fieldSuggestion.summary}</p>
          <p>Delivery preference: ${result.workStyle || "not specified"}</p>
          <a href="${result.fieldSuggestion.link}" class="text-link" target="_blank" rel="noopener noreferrer">Browse related resources &rarr;</a>
        </div>` : ""}
        <div class="detail-section">
          <h4>Income Idea</h4>
          <p><strong>${result.incomeIdeaTitle}</strong></p>
          <p>${result.incomeIdeaSummary}</p>
        </div>
        <div class="detail-section">
          <h4>Knowledge</h4>
          <p>${result.knowledgeSummary}</p>
        </div>
        <div class="detail-section">
          <h4>Supportive Services</h4>
          <p>${result.supportSummary}</p>
        </div>
        <div class="detail-section">
          <h4>Official Needs</h4>
          <p>${result.officialSummary}</p>
        </div>
        <div class="detail-section">
          <h4>How to use this plan</h4>
          <ul class="detail-links">
            ${result.planSteps.map((step) => `<li>${step}</li>`).join("")}
          </ul>
        </div>
        <div class="detail-section">
          <h4>File Inputs: Income Opportunities</h4>
          ${renderRelatedLinks(result.suggestedIncomeIds, "income")}
        </div>
        <div class="detail-section">
          <h4>File Inputs: Knowledge Resources</h4>
          ${renderRelatedLinks(result.suggestedTrainingIds, "training")}
        </div>
        <div class="detail-section">
          <h4>File Inputs: Supportive Services</h4>
          ${renderRelatedLinks(result.suggestedServiceIds, "services")}
        </div>
        <div class="detail-section">
          <h4>File Inputs: Official Information</h4>
          ${renderRelatedLinks(result.suggestedOfficialIds, "official")}
        </div>
        ${includeSaveButton ? `<div class="inline-actions"><button class="app-btn app-btn--primary" data-action="save-quiz-result">${appState.isSignedIn ? "Build File" : "Sign Up to Build File"}</button></div>` : ""}
      </div>
    `;
  }

  function saveQuizResult() {
    if (!appState.isSignedIn) {
      renderPlannerSignupPrompt();
      openOverlay("progressOverlay", { kind: "planner-signup" });
      return;
    }
    appState.quizResult = buildQuizResult();
    applyQuizResultToPlan(appState.quizResult);
    appState.planDraft = {
      ...buildPlanDraft(appState.quizResult),
      ...appState.planDraft
    };
    appState.savedIds = unique(appState.savedIds);
    saveState();
    closeOverlay("quizOverlay");
    renderProgress();
    renderSavedQuizResult();
    renderSaved();
    showView("saved");
  }

  function buildPlanDraft(result) {
    return {
      founderIdentity: result.founderIdentity || "Founder",
      startingPoint: result.startingPointSummary,
      understanding: result.understandingSummary,
      culture: result.cultureSummary,
      opportunity: result.opportunitySummary,
      incomeIdea: result.incomeIdeaSummary,
      knowledge: result.knowledgeSummary,
      support: result.supportSummary,
      official: result.officialSummary,
      nextMoves: result.planSteps.join("\n"),
      goals: result.proofSummary,
      proof: result.proofSummary
    };
  }

  function openAllStatesBrowser() {
    const detailType = document.getElementById("detailType");
    const detailTitle = document.getElementById("detailTitle");
    const detailBody = document.getElementById("detailBody");

    detailType.textContent = "All States";
    detailTitle.textContent = "Browse Official Information by State";
    detailBody.innerHTML = `
      <div class="detail-section">
        <p>${appState.isSignedIn
          ? `Your saved state is <strong>${appState.selectedState}</strong>. Opening another state here will not change your default state in the app.`
          : "Browse official business information by state without changing anything in your account."}</p>
      </div>
      <div class="state-browser-grid">
        ${allStates.map((state) => `
          <button class="state-browser-card ${state === appState.selectedState ? "state-browser-card--current" : ""}" type="button" data-action="open-state-detail" data-state="${state}">
            <span class="state-browser-card__eyebrow">${appState.isSignedIn && state === appState.selectedState ? "Saved State" : "State"}</span>
            <strong>${state}</strong>
            <span class="state-browser-card__meta">Open official information</span>
          </button>
        `).join("")}
      </div>
    `;

    openOverlay("detailOverlay", { kind: "all-states" });
  }

  async function openStateDetail(stateName = appState.selectedState) {
    const detailType = document.getElementById("detailType");
    const detailTitle = document.getElementById("detailTitle");
    const detailBody = document.getElementById("detailBody");
    openOverlay("detailOverlay", { kind: "state-detail", stateName });
    detailType.textContent = "State Detail";
    detailTitle.textContent = `${stateName} Official Business Information`;
    detailBody.innerHTML = `<div class="empty-state">Loading ${stateName} official information...</div>`;
    const statePageSaveItem = ensureOfficialStatePageItem(stateName);
    const stateItems = data.official.filter((item) => item.stateLinks && item.stateLinks[stateName]?.length);
    const statePageItems = await loadStateSpecificOfficialItems(stateName);
    const combinedStateItems = [
      ...stateItems,
      ...statePageItems.filter((item) => !stateItems.some((existing) => normalizeKey(existing.title) === normalizeKey(item.title)))
    ];
    detailBody.innerHTML = `
      <div class="detail-section">
        <p>Official business registration, tax, licensing, agency, and state contracting links for ${stateName}.</p>
      </div>
      <div class="detail-section">
        <div class="inline-actions">
          <button class="app-btn app-btn--ghost" data-action="open-all-states">Back to All States</button>
          <button class="utility-link utility-link--save-file ${isSaved(statePageSaveItem.id) ? "utility-link--active" : ""}" data-action="save-item" data-id="${statePageSaveItem.id}">${isSaved(statePageSaveItem.id) ? "Saved to File" : "Save to File"}</button>
        </div>
      </div>
      <div class="card-grid card-grid--two">
        ${combinedStateItems.map((item) => `
          <section class="saved-block">
            <h3>${item.title}</h3>
            <p>${item.description}</p>
            <ul class="detail-links">
              ${resolveOfficialLinks(item, stateName).map((link) => `<li><a href="${link.href}" target="_blank" rel="noopener noreferrer">${link.label}</a></li>`).join("")}
            </ul>
            <button class="utility-link utility-link--save-file ${isSaved(item.id) ? "utility-link--active" : ""}" data-action="save-item" data-id="${item.id}">${isSaved(item.id) ? "Saved to File" : "Save to File"}</button>
          </section>
        `).join("")}
      </div>
      ${!combinedStateItems.length ? `<div class="empty-state">No direct official items are available for ${stateName} yet.</div>` : ""}
    `;
  }

  function ensureOfficialStatePageItem(stateName) {
    const id = `official-state-page-${slugify(stateName)}`;
    let item = data.official.find((entry) => entry.id === id);
    if (item) return item;
    item = {
      id,
      title: `${stateName} Official Business Information`,
      description: `Official business registration, tax, licensing, agency, and state contracting information for ${stateName}.`,
      type: "State Information",
      categories: ["State Information"],
      statePage: true,
      stateName,
      tags: ["state information", normalizeTag(stateName)]
    };
    data.official.push(item);
    return item;
  }

  function buildQuizResult() {
    const block = appState.quizAnswers.block || "NoStartingPoint";
    const motivator = appState.quizAnswers.problem || "Survival and Stability";
    const payment = appState.quizAnswers.payment || "Time";
    const culture = appState.quizAnswers.culture || "Instability to order";
    const action = appState.quizAnswers.action || "Get It Done";
    const value = appState.quizAnswers.value || "Lower the cost";
    const startingMaterial = appState.quizAnswers.startingMaterial || "Still Early";
    const fieldInterest = appState.quizAnswers.fieldInterest || "No clear direction yet";
    const workStyle = appState.quizAnswers.workStyle || "In person with clients";
    const founderIdentity = appState.quizAnswers.founderType || founderIdentitySuggestions[startingMaterial] || "Founder";

    const fieldSuggestionMap = {
      "Trades and hands-on services": {
        label: "Auto trades and home services",
        summary: "Your interest in trades and hands-on work points toward the auto trades, home services, and skilled repair space. These are fields where technical skill translates directly into a service business.",
        link: "https://incomespectrum.com/income-options.html?q=auto"
      },
      "Health, beauty, and personal care": {
        label: "Beauty and wellness",
        summary: "Your interest in health, beauty, and personal care points toward licensed service businesses in massage therapy, esthetics, cosmetology, barber services, and wellness.",
        link: "https://incomespectrum.com/income-options.html?q=beauty"
      },
      "Coaching, counseling, and support": {
        label: "Coaching and counseling",
        summary: "Your interest in coaching, counseling, and support points toward private practice, independent coaching, and wellness services built on your knowledge and experience with people.",
        link: "https://incomespectrum.com/income-options.html?q=coaching"
      },
      "Creative and digital work": {
        label: "Digital and creative services",
        summary: "Your interest in creative and digital work points toward service-based or product-based income built around content, design, education, and technology.",
        link: "https://incomespectrum.com/income-options.html?q=digital"
      },
      "Products and resale": {
        label: "Products and ecommerce",
        summary: "Your interest in products and resale points toward ecommerce, physical goods, print-on-demand, handmade items, and resale models.",
        link: "https://incomespectrum.com/income-options.html?q=product"
      },
      "Business and professional services": {
        label: "Business and professional services",
        summary: "Your interest in business and professional services points toward consulting, bookkeeping, administrative support, and other knowledge-based service businesses.",
        link: "https://incomespectrum.com/income-options.html?q=consulting"
      },
      "No clear direction yet": {
        label: "Still exploring",
        summary: "You have not landed on a direction yet. The Income Spectrum directory is built for exactly this stage - browse by interest or start with what feels familiar.",
        link: "https://incomespectrum.com/income-options.html"
      }
    };
    const fieldSuggestion = fieldSuggestionMap[fieldInterest] || fieldSuggestionMap["No clear direction yet"];

    const resultMap = {
      "Survival and Stability": {
        title: "Stability and support are driving demand.",
        income: ["income-virtual-assistant", "income-commercial-cleaning"],
        training: ["training-business-foundations", "training-operations-basics"],
        services: ["service-bookkeeping", "service-legal"],
        official: ["official-state-registration", "official-ein-irs"]
      },
      "Safety and Protection": {
        title: "People are paying to reduce exposure and uncertainty.",
        income: ["income-mobile-notary", "income-government-contracting"],
        training: ["training-business-foundations", "training-notary-basics"],
        services: ["service-legal", "service-bookkeeping"],
        official: ["official-state-registration", "official-licensing"]
      },
      "Relief and Health": {
        title: "Demand is being driven by strain, friction, and the need for relief.",
        income: ["income-asl-interpreting", "income-commercial-cleaning"],
        training: ["training-asl-pathways", "training-certification-prep"],
        services: ["service-communication-access", "service-advisory"],
        official: ["official-asl-state", "official-licensing"]
      },
      "Pleasure and Comfort": {
        title: "People are paying for ease, enjoyment, and a better day-to-day experience.",
        income: ["income-print-on-demand", "income-virtual-assistant"],
        training: ["training-digital-storefront", "training-brand-basics"],
        services: ["service-branding", "service-marketing"],
        official: ["official-state-registration", "official-state-tax"]
      },
      "Belonging and Love": {
        title: "People are paying to feel connected, supported, and understood.",
        income: ["income-asl-interpreting", "income-virtual-assistant"],
        training: ["training-asl-pathways", "training-business-foundations"],
        services: ["service-communication-access", "service-branding"],
        official: ["official-asl-state", "official-state-registration"]
      },
      "Status, Meaning, and Legacy": {
        title: "People are paying for advancement, recognition, and long-term positioning.",
        income: ["income-government-contracting", "income-print-on-demand"],
        training: ["training-government-contracting", "training-brand-basics"],
        services: ["service-advisory", "service-legal"],
        official: ["official-federal-contracting", "official-state-contracting"]
      }
    };

    const result = resultMap[motivator];
    const pathMap = {
      "Attain Or Gain": {
        pathLabel: "Access and gain focus",
        primarySection: "income",
        incomeIdeaTitle: "A direction that helps people attain, gain, or access something is the clearest starting point.",
        incomeIdeaSummary: "This pattern suggests people are paying to get something they do not yet have, reach something more easily, or gain a better position. That can point toward services, products, or structured offers that open access or move them forward."
      },
      "Protect Or Prevent": {
        pathLabel: "Protection focus",
        primarySection: "services",
        incomeIdeaTitle: "A protection or prevention direction is the clearest starting point.",
        incomeIdeaSummary: "This pattern suggests people are paying to lower exposure, avoid loss, protect what they have, or prevent a worse outcome. That can point toward legal, compliance, advisory, support, or process-based offers."
      },
      "Improve Or Replace": {
        pathLabel: "Improvement focus",
        primarySection: "income",
        incomeIdeaTitle: "An improvement or replacement direction is the clearest starting point.",
        incomeIdeaSummary: "This pattern suggests people are paying to make something work better, change what is not working, or replace a weaker result with a stronger one. That can point toward service, product, or ownership directions."
      },
      "Simplify Or Order": {
        pathLabel: "Simplicity focus",
        primarySection: "services",
        incomeIdeaTitle: "A simplicity or order-based direction is the clearest starting point.",
        incomeIdeaSummary: "This pattern suggests people are paying to make something easier, more orderly, less confusing, or less costly to manage. That can point toward organization, systems, support, compliance, or service-based offers."
      },
      "Prove Or Understand": {
        pathLabel: "Clarity focus",
        primarySection: "training",
        incomeIdeaTitle: "A proof, understanding, or decision-support direction is the clearest starting point.",
        incomeIdeaSummary: "This pattern suggests people are paying to understand better, make decisions with more confidence, or get proof that something will work. That can point toward education, advisory, certification, support, or information-based offers."
      },
      "Connect Or Enjoy": {
        pathLabel: "Connection and enjoyment focus",
        primarySection: "income",
        incomeIdeaTitle: "A connection, support, or enjoyment-oriented direction is the clearest starting point.",
        incomeIdeaSummary: "This pattern suggests people are paying to feel connected, supported, understood, or to enjoy life more fully and easily. That can point toward communication access, support services, products, or experience-based offers."
      }
    };
    const startingMaterialMap = {
      "Own Idea": "You already have an idea to work with. The plan should not replace it. It should test whether the idea really fits the pressure, cost, and sought result pattern you are seeing.",
      "Usable Skill": "You already have something usable to work from, so the plan should start by shaping and testing that skill against real demand.",
      "Need Knowledge": "Knowledge is the first gap, so this plan should place more weight on training, clarity, and skill-building before expansion.",
      "Need Support": "Support structure is part of the plan, not an afterthought. This plan should include outside help where it reduces friction or strengthens delivery.",
      "Need Official Clarity": "Rules, registration, licensing, or formal requirements are part of the plan. Official information should be treated as an early step, not a later detail.",
      "Still Early": "You do not need a fixed idea yet. The plan should help you identify a starting point, test it, and keep adjusting as the signal gets clearer."
    };
    const blockMap = {
      Overload: "You have been sorting through too much information. The plan should reduce noise and keep attention on the pressure, the cost, and what people are actually seeking.",
      NoStartingPoint: "You have been missing a starting point. The plan should start from what you are seeing, not from trying to force a perfect idea too early.",
      TooManyDirections: "You have been pulled in too many directions. The plan should narrow the field by tying ideas back to a real pressure pattern.",
      NeedProof: "You have been unsure what counts as proof. The plan should look for signals of demand, not just interesting possibilities.",
      RulesConcern: "Rules and compliance have been part of the blockage. The plan should surface official needs early so uncertainty does not sit in the background."
    };
    const actionMap = {
      "Attain Or Gain": "attain, gain, or bring something into reach",
      "Protect Or Prevent": "protect something, preserve it, or prevent loss",
      "Improve Or Replace": "improve, repair, replace, or strengthen something",
      "Simplify Or Order": "make something simpler, steadier, easier, or more manageable",
      "Prove Or Understand": "get proof, understanding, clarity, confidence, or better decisions",
      "Connect Or Enjoy": "feel connected, supported, included, understood, or enjoy something more"
    };
    const directionText = value === "A mix of both"
      ? "The best opening may come from lowering cost in one area while increasing value in another."
      : value === "Lower the cost"
        ? "Look for ways to reduce what this group is spending in time, energy, attention, comfort, or risk."
        : "Look for ways to make the result more valuable inside the culture you are looking at.";
    const path = pathMap[action];
    const planTitle = "Founder File";
    const startingPointSummary = `${blockMap[block]} ${startingMaterialMap[startingMaterial]}`;
    const understandingSummary = `The pattern you are observing points most strongly to ${motivator.toLowerCase()}. People are paying with ${payment.toLowerCase()}, which means the cost of living is showing up there most heavily. When the same cost keeps showing up and the same sought result keeps showing up with it, opportunity starts to become visible.`;
    const cultureSummary = `In this framework, culture is not a niche label. It is the shared cost being carried and the shared outcome being sought around that cost. Here, the culture pattern looks like ${culture.toLowerCase()}, and the spending seems to be helping people ${actionMap[action]}.`;
    const opportunitySummary = `${directionText} This is how the cost of living drives opportunity: when people keep paying in ${payment.toLowerCase()}, opportunity forms around lowering that cost or increasing the value of what they are trying to attain, preserve, improve, understand, enjoy, or make easier.`;
    const knowledgeSummary = startingMaterial === "Usable Skill"
      ? "You may not need a large new training stack to begin. Start by tightening what you already know, then add knowledge where it strengthens the offer."
      : startingMaterial === "Need Official Clarity"
        ? "Knowledge should focus on understanding the rules, registrations, and steps that affect whether this idea can operate cleanly."
        : "This should include targeted knowledge, not random learning. Use the suggested training items to close the exact gaps between your current position and a workable offer.";
    const supportSummary = startingMaterial === "Need Support"
      ? "Support services are likely part of the operating model from the start. Choose only the ones that reduce friction, protect the business, or help you deliver consistently."
      : "Support services are optional at first, but they can strengthen delivery, reduce risk, and help the plan run more smoothly as it grows.";
    const officialSummary = action === "Simplify Or Order" || startingMaterial === "Need Official Clarity" || block === "RulesConcern"
      ? `Official information should be handled early in this plan. Use ${appState.selectedState} and federal resources to clarify registration, tax, licensing, contracting, or other requirements that shape the work.`
      : `Official information still matters because it anchors the business in real rules. Use ${appState.selectedState} and federal resources to confirm the registrations, tax steps, and requirements that apply.`;
    const planSteps = [
      "Start with what people are paying for and the result they are seeking.",
      `Use ${path.pathLabel.toLowerCase()} as a useful reference, not a fixed label.`,
      startingMaterialMap[startingMaterial],
      "Browse app ideas that fit what you are observing, then generate your own ideas too, even if they seem common.",
      "Keep what fits, revise what does not, and update the file as your understanding changes."
    ];
    const proofSummary = "Proof can be simple at first: the pattern keeps showing up, the idea clearly reduces a cost or increases a valued result, and the plan feels workable enough to test with real people or real next steps.";
    return {
      id: "quiz-result",
      title: result.title,
      planTitle,
      explanation: `This result is not trying to force a business idea on you. It is helping you understand what you are seeing. The strongest pattern here is ${motivator.toLowerCase()}, the cost of living shows up most in ${payment.toLowerCase()}, and the culture is forming around ${culture.toLowerCase()}.`,
      motivator,
      payment,
      culture,
      action,
      value,
      block,
      startingMaterial,
      primarySection: path.primarySection,
      pathLabel: path.pathLabel,
      pathSummary: `Build around The Six, The Cost of Living, and the shared cost and sought outcome inside this culture. Here, that means ${motivator.toLowerCase()}, ${payment.toLowerCase()}, and a flexible understanding you can keep refining.`,
      planSummary: "This file is not a formal business-plan document. It is a living Founder File meant to help you nurture an idea you already have or develop one you discovered in the app.",
      founderIdentity,
      founderIdentityDescription: founderIdentityDescriptions[founderIdentity] || founderIdentityDescriptions.Founder,
      startingPointSummary,
      understandingSummary,
      cultureSummary,
      opportunitySummary,
      incomeIdeaTitle: path.incomeIdeaTitle,
      incomeIdeaSummary: path.incomeIdeaSummary,
      knowledgeSummary,
      supportSummary,
      officialSummary,
      planSteps,
      proofSummary,
      direction: directionText,
      fieldSuggestion,
      workStyle,
      suggestedIncomeIds: result.income,
      suggestedTrainingIds: result.training,
      suggestedServiceIds: result.services,
      suggestedOfficialIds: result.official
    };
  }

  function buildPathSnapshot() {
    if (!appState.quizResult) {
      return {
        label: "Find your focus",
        summary: "Understand what people pay for and how the Cost of Living drives Opportunity.",
        primarySection: "income"
      };
    }
    return {
      label: appState.quizResult.pathLabel,
      summary: appState.quizResult.pathSummary,
      primarySection: appState.quizResult.primarySection
    };
  }

  function buildPlanSnapshot() {
    if (!appState.isSignedIn) {
      return {
        label: "Access Your Founder File",
        summary: "Sign up to access your Founder File."
      };
    }
    if (!appState.quizResult) {
      return {
        label: "Access Your Founder File",
        summary: "Open your Founder File to review identity, notes, saved items, and progress."
      };
    }
    return {
      label: "Access Your Founder File",
      summary: appState.quizResult.planSummary
    };
  }

  function applyQuizResultToPlan(result) {
    const nextProgress = {
      "just exploring": [],
      interested: [],
      comparing: [],
      launch: []
    };
    const pathIds = {
      income: result.suggestedIncomeIds,
      training: result.suggestedTrainingIds,
      services: result.suggestedServiceIds,
      official: result.suggestedOfficialIds
    };
    const leadIds = pathIds[result.primarySection] || [];
    nextProgress["just exploring"] = unique(leadIds.slice(0, 2));
    nextProgress.interested = unique([
      ...(pathIds.training || []).slice(0, 1),
      ...(pathIds.services || []).slice(0, 1)
    ]);
    nextProgress.comparing = unique((pathIds.income || []).slice(0, 2));
    nextProgress.launch = unique((pathIds.official || []).slice(0, 2));
    appState.progress = nextProgress;
    appState.savedIds = unique([
      ...appState.savedIds,
      ...result.suggestedIncomeIds,
      ...result.suggestedTrainingIds,
      ...result.suggestedServiceIds,
      ...result.suggestedOfficialIds
    ]);
  }

  function openPathSummary() {
    const detailType = document.getElementById("detailType");
    const detailTitle = document.getElementById("detailTitle");
    const detailBody = document.getElementById("detailBody");
    const path = buildPathSnapshot();

    detailType.textContent = "Quiz";
    detailTitle.textContent = "Take the Quiz";
    detailBody.innerHTML = `
      <div class="detail-section">
        <p>${path.summary}</p>
      </div>
      <div class="detail-section">
        <div class="inline-actions">
          <button class="app-btn app-btn--secondary" data-action="open-quiz">Open Quiz</button>
          <button class="app-btn app-btn--ghost" data-action="go-explore">Open Explore</button>
        </div>
      </div>
    `;
    openOverlay("detailOverlay", { kind: "path-summary" });
  }

  function renderListItem(item, type) {
    const secondary = type === "training"
      ? `<p><strong>${item.provider || item.groupTitle || "Training resource"}</strong> · ${item.format || "Resource"}</p>`
      : type === "services"
        ? `<p><strong>${titleCase(item.category || item.groupTitle || "supportive services")}</strong></p>`
        : type === "income"
          ? `<p><strong>${item.typeLabel || item.groupTitle || "Income option"}</strong></p>`
          : "";
    return `
      <article class="list-item">
        <h3>${item.title}</h3>
        ${secondary}
        <p>${item.description}</p>
        <div class="item-tags">${(item.tags || []).map(renderTag).join("")}</div>
        <div class="inline-actions">
          <button class="app-btn ${openButtonClass(type)}" data-action="open-item" data-id="${item.id}" data-type="${type}">Open</button>
        </div>
      </article>
    `;
  }

  function renderMiniCard(item, actionLabel = "Open") {
    if (!item) return "";
    return `
      <div class="mini-card">
        <strong>${item.title}</strong>
        <p>${item.description || item.explanation || ""}</p>
        <div class="inline-actions">
          <button class="app-btn ${openButtonClass(detectItemType(item.id))}" data-action="open-item" data-id="${item.id}" data-type="${detectItemType(item.id)}">${actionLabel}</button>
        </div>
      </div>
    `;
  }

  function openButtonClass(type) {
    if (type === "income") return "app-btn--income";
    if (type === "training") return "app-btn--knowledge";
    if (type === "services") return "app-btn--support";
    if (type === "official") return "app-btn--official";
    return "app-btn--secondary";
  }

  function buildNextSteps() {
    return [
      {
        label: "Quiz",
        value: "Understand what people pay for and how the Cost of Living drives Opportunity."
      },
      {
        label: "File",
        value: "Save the information you want to keep in your Founder File."
      },
      {
        label: "Notes",
        value: "Record what matters to you as ideas and priorities become clearer."
      },
      {
        label: "Explore",
        value: "Review opportunities, resources, and Official Information that are relevant to your business."
      }
    ];
  }

  function matchesFilter(item, filter) {
    if (!filter || filter === "all") return true;
    if (filter === "both") return item.location === "Both" || (item.tags || []).includes("both");
    const normalizedFilter = normalizeTag(filter);
    return (item.tags || []).some((tag) => normalizeTag(tag) === normalizedFilter)
      || normalizeTag(item.category) === normalizedFilter
      || (item.categories || []).some((category) => normalizeTag(category) === normalizedFilter)
      || normalizeTag(item.groupTitle) === normalizedFilter;
  }

  function currentFilter() {
    return exploreFilter || "all";
  }

  function toggleSaved(id) {
    if (isSaved(id)) {
      removeSaved(id);
      return;
    }
    appState.savedIds.unshift(id);
    appState.savedIds = unique(appState.savedIds);
    appState.savedMeta[id] = new Date().toISOString();
    saveState();
    renderAll();
  }

  function removeSaved(id) {
    appState.savedIds = appState.savedIds.filter((savedId) => savedId !== id);
    delete appState.savedMeta[id];
    appState.compareIds = appState.compareIds.filter((compareId) => compareId !== id);
    Object.keys(appState.progress).forEach((stage) => {
      appState.progress[stage] = appState.progress[stage].filter((stageId) => stageId !== id);
    });
    saveState();
    renderAll();
  }

  function saveNote(id) {
    const input = document.getElementById(`note-${id}`);
    if (!input) return;
    const value = input.value.trim();
    const existing = normalizeNoteEntry(appState.notes[id]);
    if (!value) {
      delete appState.notes[id];
    } else {
      appState.notes[id] = {
        text: value,
        starred: existing.starred
      };
    }
    if (!isSaved(id)) {
      appState.savedIds.unshift(id);
    }
    saveState();
    renderNotes();
    renderSaved();
  }

  function deleteNote(id) {
    delete appState.notes[id];
    saveState();
    renderNotes();
  }

  function toggleNoteStar(id) {
    const existing = normalizeNoteEntry(appState.notes[id]);
    if (!existing.text) return;
    appState.notes[id] = {
      text: existing.text,
      starred: !existing.starred
    };
    saveState();
    renderNotes();
    renderSaved();
    renderProgress();
  }

  function setStage(id, stage) {
    Object.keys(appState.progress).forEach((key) => {
      appState.progress[key] = appState.progress[key].filter((itemId) => itemId !== id);
    });
    appState.progress[stage].push(id);
    if (!isSaved(id)) {
      appState.savedIds.unshift(id);
    }
    saveState();
    renderProgress();
    renderSaved();
  }

  function currentStageFor(id) {
    return Object.keys(appState.progress).find((stage) => appState.progress[stage].includes(id)) || "just exploring";
  }

  function registerViewed(id) {
    appState.recentlyViewed = [id, ...appState.recentlyViewed.filter((entry) => entry !== id)].slice(0, 8);
    saveState();
    renderHome();
  }

  function registerSearch(query) {
    appState.recentSearches = [query, ...appState.recentSearches.filter((term) => term !== query)].slice(0, 6);
    saveState();
  }

  function searchMatch(item, query) {
    const blob = [
      item.title,
      item.description,
      item.overview,
      item.provider,
      item.category,
      ...(item.tags || []),
      ...(item.categories || [])
    ].filter(Boolean).join(" ").toLowerCase();
    return blob.includes(query);
  }

  function findItem(id) {
    for (const key of ["income", "training", "services", "official"]) {
      const match = data[key].find((item) => item.id === id);
      if (match) return match;
    }
    const article = data.articles.find((item) => item.id === id);
    if (article) return article;
    return null;
  }

  function detectItemType(id) {
    if (id.startsWith("income-")) return "income";
    if (id.startsWith("training-")) return "training";
    if (id.startsWith("service-")) return "services";
    if (id.startsWith("official-")) return "official";
    if (id.startsWith("article-")) return "article";
    return "income";
  }

  function isSaved(id) {
    return appState.savedIds.includes(id);
  }

  function saveState() {
    const payload = JSON.stringify(appState);
    if (appState.isSignedIn) {
      localStorage.setItem(STORAGE_KEY_LOCAL, payload);
      sessionStorage.removeItem(STORAGE_KEY_SESSION);
      return;
    }
    sessionStorage.setItem(STORAGE_KEY_SESSION, payload);
  }

  function loadState() {
    try {
      const localRaw = localStorage.getItem(STORAGE_KEY_LOCAL);
      if (localRaw) {
        const parsed = JSON.parse(localRaw);
        if (parsed.isSignedIn) return { ...structuredClone(defaultState), ...parsed };
      }
      const sessionRaw = sessionStorage.getItem(STORAGE_KEY_SESSION);
      if (sessionRaw) {
        const parsed = JSON.parse(sessionRaw);
        if (!parsed.isSignedIn) return { ...structuredClone(defaultState), ...parsed };
      }
      return structuredClone(defaultState);
    } catch (error) {
      return structuredClone(defaultState);
    }
  }

  async function restoreOverlayState() {
    const overlayState = appState.overlayState || {};
    if (!overlayState.id) return;
    if (!appState.isSignedIn && appState.activeView === "saved") {
      appState.activeView = "home";
      appState.overlayState = { ...structuredClone(defaultState.overlayState) };
      saveState();
      return;
    }
    if (overlayState.kind === "planner-signup") {
      renderPlannerSignupPrompt();
      openOverlay("progressOverlay", { kind: "planner-signup" });
      return;
    }
    if (overlayState.kind === "save-signup") {
      renderSaveSignupPrompt();
      openOverlay("progressOverlay", { kind: "save-signup" });
      return;
    }
    if (overlayState.kind === "progress") {
      if (appState.isSignedIn) {
        renderProgress();
        openOverlay("progressOverlay", { kind: "progress" });
      }
      return;
    }
    if (overlayState.kind === "post-signup") {
      if (appState.isSignedIn) {
        renderPostSignupPrompt();
        openOverlay("progressOverlay", { kind: "post-signup" });
      }
      return;
    }
    if (overlayState.kind === "notes") {
      if (appState.isSignedIn) {
        renderNotes(overlayState.itemId || null);
        openOverlay("notesOverlay", { kind: "notes", itemId: overlayState.itemId || null });
      }
      return;
    }
    if (overlayState.kind === "quiz") {
      renderQuiz();
      openOverlay("quizOverlay", { kind: "quiz" });
      return;
    }
    if (overlayState.kind === "article-directory") {
      renderArticleDirectory();
      return;
    }
    if (overlayState.kind === "path-summary") {
      openPathSummary();
      return;
    }
    if (overlayState.kind === "all-states") {
      openAllStatesBrowser();
      return;
    }
    if (overlayState.kind === "state-detail" && overlayState.stateName) {
      await openStateDetail(overlayState.stateName);
      return;
    }
    if (overlayState.kind === "item" && overlayState.itemId && overlayState.itemType) {
      await openDetail(overlayState.itemId, overlayState.itemType);
    }
  }

  function openOverlay(id, state = null) {
    if (state) {
      appState.overlayState = { ...structuredClone(defaultState.overlayState), id, ...state };
    } else {
      appState.overlayState = { ...(appState.overlayState || structuredClone(defaultState.overlayState)), id };
    }
    saveState();
    document.getElementById(id).classList.remove("hidden");
  }

  function closeOverlay(id) {
    if (id === "quizOverlay") {
      resetIncompleteQuiz();
    }
    document.getElementById(id).classList.add("hidden");
    if (appState.overlayState?.id === id) {
      appState.overlayState = { ...structuredClone(defaultState.overlayState) };
      saveState();
    }
  }

  function closeAllOverlays() {
    if (appState.overlayState?.id === "quizOverlay") {
      resetIncompleteQuiz();
    }
    document.querySelectorAll(".overlay").forEach((node) => node.classList.add("hidden"));
    appState.overlayState = { ...structuredClone(defaultState.overlayState) };
    saveState();
  }

  function renderTag(tag) {
    return `<span class="tag">${titleCase(tag)}</span>`;
  }

  function titleCase(value) {
    return value.replace(/\b\w/g, (char) => char.toUpperCase());
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function capitalize(value) {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  function unique(values) {
    return [...new Set(values)];
  }

  function stageDescription(stage) {
    if (stage === "just exploring") return "The starting point for the plan you are building.";
    if (stage === "interested") return "Items that support or strengthen the plan.";
    if (stage === "comparing") return "Options you are weighing before you commit.";
    return "Items that move the plan toward launch.";
  }

  async function loadStateSpecificOfficialItems(stateName) {
    if (statePageCache.has(stateName)) return statePageCache.get(stateName);
    const path = `states/${slugify(stateName)}.html`;
    try {
      const response = await fetch(path);
      if (!response.ok) {
        statePageCache.set(stateName, []);
        return [];
      }
      const html = await response.text();
      const doc = new DOMParser().parseFromString(html, "text/html");
      const items = parseListingCards(doc, { path, section: "official" }).map((item) => ({
        ...item,
        coverage: stateName
      }));
      statePageCache.set(stateName, items);
      mergeImportedItems("official", items);
      return items;
    } catch {
      statePageCache.set(stateName, []);
      return [];
    }
  }

  async function loadArticleContent(item) {
    const key = item.sourcePage || item.href || item.id;
    if (articleContentCache.has(key)) return articleContentCache.get(key);
    const path = item.sourcePage || item.href;
    if (!path) {
      const empty = { meta: "", lead: "", bodyHtml: "" };
      articleContentCache.set(key, empty);
      return empty;
    }
    try {
      const response = await fetch(path);
      if (!response.ok) {
        const empty = { meta: "", lead: "", bodyHtml: "" };
        articleContentCache.set(key, empty);
        return empty;
      }
      const html = await response.text();
      const doc = new DOMParser().parseFromString(html, "text/html");
      const meta = textContentOf(doc.querySelector(".article-header__meta"));
      const lead = textContentOf(doc.querySelector(".article-header__lead, .article-hero__lead"));
      const bodyNode = doc.querySelector(".article-body");
      const bodyHtml = bodyNode ? normalizeArticleHtml(bodyNode, path) : "";
      const content = { meta, lead, bodyHtml };
      articleContentCache.set(key, content);
      return content;
    } catch {
      const empty = { meta: "", lead: "", bodyHtml: "" };
      articleContentCache.set(key, empty);
      return empty;
    }
  }

  function normalizeArticleHtml(bodyNode, sourcePath) {
    const clone = bodyNode.cloneNode(true);
    const baseUrl = new URL(sourcePath, window.location.href);
    clone.querySelectorAll("script, style").forEach((node) => node.remove());
    clone.querySelectorAll("a[href], img[src]").forEach((node) => {
      const attr = node.tagName === "IMG" ? "src" : "href";
      const value = node.getAttribute(attr);
      if (!value || value.startsWith("#") || value.startsWith("mailto:") || value.startsWith("tel:")) return;
      try {
        node.setAttribute(attr, new URL(value, baseUrl).href);
      } catch {
        // Leave the original value if URL resolution fails.
      }
    });
    return clone.innerHTML;
  }

  async function hydrateStatePagesInBackground() {
    const stateJobs = allStates.map((state) => loadStateSpecificOfficialItems(state));
    await Promise.allSettled(stateJobs);
    renderAll();
  }

  function resolveOfficialLinks(item, selectedState) {
    if (item.stateLinks && item.stateLinks[selectedState]?.length) return item.stateLinks[selectedState];
    if (item.coverage === selectedState && item.externalHref) return [{ label: item.title, href: item.externalHref }];
    if (item.federalLinks?.length) return item.federalLinks;
    if (item.externalHref) return [{ label: item.title, href: item.externalHref }];
    return [];
  }

  function extractTags(card, groupTitle, coverage) {
    const dataTags = (card.dataset.tags || "").split(/\s+/).filter(Boolean);
    const visualTags = [...card.querySelectorAll(".tag")].map((tag) => normalizeTag(tag.textContent));
    const derived = [normalizeTag(groupTitle), normalizeTag(coverage)].filter(Boolean);
    return unique([...dataTags, ...visualTags, ...derived]);
  }

  function normalizeTag(value) {
    return (value || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  }

  function textContentOf(node) {
    return node?.textContent?.replace(/\s+/g, " ").trim() || "";
  }

  function slugify(value) {
    return (value || "")
      .toLowerCase()
      .replace(/&/g, " and ")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function normalizeKey(value) {
    return slugify(value);
  }

  function uniqueLinks(links) {
    const seen = new Set();
    return links.filter((link) => {
      const key = `${link.label}|${link.href}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  function mergeStateLinks(base, incoming) {
    const merged = { ...base };
    Object.entries(incoming).forEach(([state, links]) => {
      merged[state] = uniqueLinks([...(merged[state] || []), ...links]);
    });
    return merged;
  }

  function inferRelatedItems(sourceItem, targetType, sourceType) {
    const pool = data[targetType] || [];
    const sourceTags = new Set((sourceItem.tags || []).map(normalizeTag).filter(Boolean));
    const sourceText = normalizeTag(`${sourceItem.title} ${sourceItem.description || ""} ${sourceItem.groupTitle || ""}`);
    return pool
      .filter((item) => item.id !== sourceItem.id)
      .map((item) => {
        const itemTags = (item.tags || []).map(normalizeTag);
        const overlap = itemTags.filter((tag) => sourceTags.has(tag)).length;
        const textScore = sourceText && normalizeTag(`${item.title} ${item.description || ""} ${item.groupTitle || ""}`).split(" ").some((word) => word && sourceText.includes(word)) ? 1 : 0;
        return { item, score: overlap + textScore };
      })
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, sourceType === "income" ? 4 : 3)
      .map((entry) => entry.item);
  }
})();

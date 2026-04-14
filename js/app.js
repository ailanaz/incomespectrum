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
    "Solopreneur",
    "Freelancer",
    "Owner-Operator",
    "Still sorting"
  ];
  const founderIdentityDescriptions = {
    Founder: "A person who starts, owns, builds, buys, or runs a business or venture.",
    Entrepreneur: "Building something with room to grow beyond your direct labor.",
    Solopreneur: "Running a business you own and operate yourself.",
    "Small Business Owner": "Owning and running a business that serves a defined market or community.",
    Freelancer: "Working independently by offering a skill or service to clients.",
    "Owner-Operator": "Owning the business and also doing the day-to-day work.",
    "Still sorting": "You are still narrowing in on what fits you best."
  };
  const QUIZ_VERSION = "20260414-focus-v4";
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
    { path: "focus.html", section: "focus" },
    { path: "education-training.html", section: "training" },
    { path: "supportive-services.html", section: "services" },
    { path: "state-federal-resources.html", section: "official" },
    { path: "federal-contracting-resources.html", section: "official" },
    { path: "state-contracting-resources.html", section: "official" },
    { path: "local-government-contracting-resources.html", section: "official" },
    { path: "asl-interpreter-opportunities-by-state.html", section: "income" },
    { path: "asl-education-and-training-by-state.html", section: "training" },
    { path: "asl-communication-access-services-by-state.html", section: "services" },
    { path: "asl-official-information-by-state.html", section: "official" }
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
        id: "income-hydroseeding",
        title: "Hydroseeding Service",
        description: "Spray a seed, mulch, and fertilizer slurry to establish grass, control erosion, and prepare sites for residential, commercial, and municipal clients.",
        overview: "A U.S.-originated outdoor service (invented in the 1940s) that uses specialized spray equipment to seed large areas faster and more effectively than conventional seeding. Demand comes from homebuilders, landscapers, municipalities, DOTs, and homeowners.",
        whyChoose: "This may fit someone who wants a local service business with equipment-based differentiation, multi-sector client demand, and recurring seasonal work.",
        fit: "Useful for someone comfortable with equipment operation, outdoor physical work, and client acquisition across residential and commercial markets.",
        tags: ["local", "service-based", "hands-on", "equipment-based", "ownership-based", "service roles"],
        startupCost: "High",
        speed: "Moderate",
        skill: "Moderate",
        location: "Local",
        repeatIncome: "Medium",
        customerInteraction: "Medium",
        complexity: "Moderate",
        trainingIds: ["training-hydroseeding", "training-operations-basics", "training-business-foundations"],
        serviceIds: ["service-bookkeeping", "service-marketing", "service-legal"],
        officialIds: ["official-state-registration", "official-licensing"]
      },
      {
        id: "income-escape-room",
        title: "Escape Room Business",
        description: "Operate a fixed-location experience venue where groups solve puzzles to escape themed rooms, booked by the session.",
        overview: "Originated in Hungary in 2011 and franchised globally within years. US operators run 4 to 6 themed rooms with multiple daily sessions. Corporate team-building bookings fill weekday inventory. High repeat usage and strong group referral rates.",
        whyChoose: "This may fit someone who wants a venue-based experience business with corporate and group revenue streams and high repeat usage.",
        fit: "Useful for someone willing to invest in themed build-outs, manage bookings and staff, and actively develop corporate accounts.",
        tags: ["local", "venue-based", "experience", "ownership-based", "group"],
        startupCost: "High",
        speed: "Moderate",
        skill: "Moderate",
        location: "Local",
        repeatIncome: "High",
        customerInteraction: "High",
        complexity: "Moderate",
        trainingIds: ["training-operations-basics", "training-business-foundations"],
        serviceIds: ["service-bookkeeping", "service-marketing", "service-legal"],
        officialIds: ["official-state-registration", "official-licensing"]
      },
      {
        id: "income-karaoke-venue",
        title: "Karaoke Box Venue",
        description: "Operate private karaoke rooms booked by the hour, priced per person, with food and beverage as a secondary revenue stream.",
        overview: "The private room model - not public bar karaoke - is a $1.6B industry in Japan. US operators are bringing the concept to urban and suburban markets. High repeat usage from friend groups, birthdays, and corporate outings. Food and beverage adds 30 to 50% to ticket size.",
        whyChoose: "This may fit someone who wants a hospitality-adjacent venue business with strong repeat usage and group booking revenue.",
        fit: "Useful for someone comfortable managing a multi-room facility, licensing requirements, and food and beverage operations.",
        tags: ["local", "venue-based", "experience", "ownership-based", "hospitality"],
        startupCost: "High",
        speed: "Moderate",
        skill: "Moderate",
        location: "Local",
        repeatIncome: "High",
        customerInteraction: "High",
        complexity: "Moderate",
        trainingIds: ["training-operations-basics", "training-business-foundations"],
        serviceIds: ["service-bookkeeping", "service-marketing", "service-legal"],
        officialIds: ["official-state-registration", "official-licensing"]
      },
      {
        id: "income-laundry-pickup",
        title: "Mobile Laundry Pickup Service",
        description: "Operate a door-to-door laundry pickup and delivery route, collecting clothes, processing through laundromat partners, and returning folded within 48 hours.",
        overview: "App-based laundry route businesses with no facility required. Operators partner with local laundromats for processing. High repeat usage from weekly residential subscribers and low churn. Dense urban and suburban markets are most viable.",
        whyChoose: "This may fit someone who wants a route-based service business with subscription recurring revenue and low fixed overhead.",
        fit: "Useful for someone comfortable building a local route, managing laundromat partnerships, and acquiring residential subscribers.",
        tags: ["local", "route-based", "service-based", "subscription", "mobile"],
        startupCost: "Low",
        speed: "Fast",
        skill: "Low",
        location: "Local",
        repeatIncome: "High",
        customerInteraction: "Medium",
        complexity: "Low",
        trainingIds: ["training-operations-basics", "training-business-foundations"],
        serviceIds: ["service-bookkeeping", "service-marketing"],
        officialIds: ["official-state-registration"]
      },
      {
        id: "income-lice-removal",
        title: "Lice Removal Salon",
        description: "Provide professional, chemical-free head lice removal sessions for families, schools, and summer camps from a small studio or mobile operation.",
        overview: "LiceDoctors operates across 150+ US and Canadian markets. Families with multiple children raise per-appointment revenue significantly. Referrals from schools and pediatric offices drive pipeline. No medical license required in most states.",
        whyChoose: "This may fit someone who wants a low-startup health services business with strong referral pipelines and family repeat usage.",
        fit: "Useful for someone comfortable with clinical personal care services, marketing to schools and pediatric offices, and working directly with families.",
        tags: ["local", "service-based", "health", "mobile", "family"],
        startupCost: "Low",
        speed: "Fast",
        skill: "Low",
        location: "Local",
        repeatIncome: "Medium",
        customerInteraction: "High",
        complexity: "Low",
        trainingIds: ["training-operations-basics", "training-business-foundations"],
        serviceIds: ["service-bookkeeping", "service-marketing", "service-legal"],
        officialIds: ["official-state-registration", "official-licensing"]
      },
      {
        id: "income-capsule-hotel",
        title: "Capsule Hotel",
        description: "Operate a micro-lodging facility where guests pay for access to a private sleeping pod and shared amenities rather than a full hotel room.",
        overview: "Originated in Japan for urban commuters. Now operating in New York, Chicago, and US airport markets. Higher pod density per square foot than conventional hotel rooms. Lower per-unit fit-out cost. Strongest demand near transit hubs and airports.",
        whyChoose: "This may fit someone who wants a hospitality ownership model with higher density revenue than conventional lodging and lower per-unit build cost.",
        fit: "Useful for someone willing to navigate hospitality licensing, manage facilities, and acquire urban transit-adjacent real estate or commercial leases.",
        tags: ["local", "venue-based", "hospitality", "ownership-based"],
        startupCost: "High",
        speed: "Slow",
        skill: "High",
        location: "Local",
        repeatIncome: "High",
        customerInteraction: "Medium",
        complexity: "High",
        trainingIds: ["training-operations-basics", "training-business-foundations"],
        serviceIds: ["service-bookkeeping", "service-marketing", "service-legal"],
        officialIds: ["official-state-registration", "official-licensing"]
      },
      {
        id: "income-postpartum-retreat",
        title: "Postpartum Recovery Retreat",
        description: "Operate a structured wellness stay for new mothers providing recovery support, infant care assistance, and rest in a dedicated facility.",
        overview: "South Korea's sanhujori centers have operated this model for decades. Early US operators are running structured wellness stays at strong margins with minimal competition. Insurance reimbursement pathways are developing. Structured as hospitality and wellness rather than a medical facility to manage regulatory exposure.",
        whyChoose: "This may fit someone with a background in women's health, midwifery, postpartum doula work, or hospitality who wants a high-value niche wellness business.",
        fit: "Useful for someone able to develop partnerships with midwives, OBs, and postpartum doulas, and manage a residential wellness operation.",
        tags: ["local", "venue-based", "wellness", "hospitality", "health"],
        startupCost: "High",
        speed: "Slow",
        skill: "High",
        location: "Local",
        repeatIncome: "Medium",
        customerInteraction: "High",
        complexity: "High",
        trainingIds: ["training-operations-basics", "training-business-foundations"],
        serviceIds: ["service-bookkeeping", "service-marketing", "service-legal"],
        officialIds: ["official-state-registration", "official-licensing"]
      },
      {
        id: "income-pet-funeral",
        title: "Pet Funeral and Grief Services",
        description: "Provide full-service pet aftercare including in-home euthanasia coordination, private cremation, memorial ceremonies, and grief support for pet owners.",
        overview: "US pet aftercare market has exceeded $500M. Independent operators are taking share from cremation aggregators by offering local care and personalization. Veterinary and emergency clinic referral relationships are the primary growth channel.",
        whyChoose: "This may fit someone who wants a meaningful service business with strong referral pipelines, recurring demand, and room to build out a full care practice.",
        fit: "Useful for someone able to develop vet referral relationships, manage cremation licensing requirements, and provide compassionate client-facing services.",
        tags: ["local", "service-based", "pet", "memorial", "grief"],
        startupCost: "Medium",
        speed: "Moderate",
        skill: "Moderate",
        location: "Local",
        repeatIncome: "Medium",
        customerInteraction: "High",
        complexity: "Moderate",
        trainingIds: ["training-operations-basics", "training-business-foundations"],
        serviceIds: ["service-bookkeeping", "service-marketing", "service-legal"],
        officialIds: ["official-state-registration", "official-licensing"]
      },
      {
        id: "income-death-doula",
        title: "Death Doula",
        description: "Provide non-medical end-of-life support to individuals and families - advance care planning, legacy projects, home vigil support, and grief accompaniment.",
        overview: "The National End-of-Life Doula Alliance certifies practitioners. Demand is growing alongside home death care, natural burial, and hospice-at-home movements. Most states do not license the role specifically. Low overhead practice.",
        whyChoose: "This may fit someone with a background in hospice, social work, counseling, or caregiving who wants an independent practice with meaningful client work.",
        fit: "Useful for someone comfortable with end-of-life conversations, client documentation, and professional liability considerations in an unregulated space.",
        tags: ["local", "service-based", "health", "grief", "planning", "certification"],
        startupCost: "Low",
        speed: "Moderate",
        skill: "High",
        location: "Local",
        repeatIncome: "Low",
        customerInteraction: "High",
        complexity: "Moderate",
        trainingIds: ["training-operations-basics", "training-business-foundations"],
        serviceIds: ["service-bookkeeping", "service-legal"],
        officialIds: ["official-state-registration"]
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
      },
      {
        id: "income-used-ebike",
        title: "Used E-Bike Refurbish and Resale",
        description: "Source, service, and resell used e-bikes through local showrooms, online listings, or fleet and rental company sales.",
        overview: "US e-bike sales grew 240% between 2019 and 2022 and the used supply is building fast. Broken, abandoned, and estate-sale e-bikes source at $50 to $400. Repair skill requirement is low relative to the margin per unit. Operators can sell retail or pursue fleet and rental company volume orders.",
        whyChoose: "This may fit someone who likes hands-on mechanical work and wants a product-based business with a clear buy-repair-sell cycle and no manufacturing requirement.",
        fit: "Useful for someone comfortable with sourcing, basic electrical and mechanical repairs, and managing a small rotating inventory.",
        tags: ["product-based", "local", "trades", "resale", "circular", "ebike"],
        startupCost: "Low",
        speed: "Moderate",
        skill: "Moderate",
        location: "Local",
        repeatIncome: "Low",
        customerInteraction: "Medium",
        complexity: "Low",
        trainingIds: ["training-operations-basics"],
        serviceIds: ["service-bookkeeping"],
        officialIds: ["official-state-registration"]
      },
      {
        id: "income-mobile-battery",
        title: "Mobile Battery Replacement Service",
        description: "On-demand car battery replacement where the technician comes to the customer with the right battery and installs it on-site.",
        overview: "No shop, no lift, no waiting. Interstate Battery and AAA run this model. Local independent operators compete on speed and price with lower overhead. Five to eight calls per day is achievable with a stocked van and basic territory routing.",
        whyChoose: "This may fit someone who wants an automotive service business with a specific, fast, repeatable job type and no facility overhead.",
        fit: "Useful for someone comfortable with basic automotive service, inventory management, and building referral relationships with roadside assistance services.",
        tags: ["local", "service-based", "automotive", "mobile", "on-demand"],
        startupCost: "Low",
        speed: "Fast",
        skill: "Low",
        location: "Local",
        repeatIncome: "Low",
        customerInteraction: "High",
        complexity: "Low",
        trainingIds: ["training-operations-basics"],
        serviceIds: ["service-bookkeeping", "service-insurance"],
        officialIds: ["official-state-registration"]
      },
      {
        id: "income-storefront-setup",
        title: "Online Storefront Setup Service",
        description: "Build and configure e-commerce storefronts on Shopify, Etsy, Amazon, WooCommerce, and similar platforms for small business clients.",
        overview: "Small businesses launching or expanding online need a professional, functional storefront but lack the technical knowledge to build one themselves. Operators work per-project with optional monthly maintenance retainers. A 3 to 5 project monthly cadence with 10 to 15 retainer clients builds a stable mid-five-figure annual practice.",
        whyChoose: "This may fit someone with e-commerce or web platform experience who wants a freelance or small agency business with recurring revenue potential.",
        fit: "Useful for someone comfortable with Shopify, WooCommerce, Etsy, or similar platforms and able to manage small business client expectations.",
        tags: ["online", "service-based", "digital", "ecommerce", "shopify", "b2b"],
        startupCost: "Low",
        speed: "Fast",
        skill: "Moderate",
        location: "Online",
        repeatIncome: "Medium",
        customerInteraction: "Medium",
        complexity: "Low",
        trainingIds: ["training-digital-marketing", "training-operations-basics"],
        serviceIds: ["service-bookkeeping"],
        officialIds: ["official-state-registration"]
      },
      {
        id: "income-listing-optimization",
        title: "Product Listing Optimization Service",
        description: "Improve e-commerce product listings for Amazon, Etsy, Google Shopping, and Faire clients - titles, descriptions, images, and search terms.",
        overview: "Listing quality directly drives conversion rate and search placement. Operators work per-listing, per-catalog, or on monthly SEO retainers. Clients see measurable results quickly, which drives referrals. A specialist carrying 10 to 20 e-commerce clients can reach full-time income with predictable recurring revenue and no physical overhead.",
        whyChoose: "This may fit someone with e-commerce SEO knowledge who wants a fully remote, low-overhead business with repeatable work and measurable results.",
        fit: "Useful for someone comfortable with Amazon, Etsy, or Google Shopping search mechanics and willing to track performance metrics for clients.",
        tags: ["online", "service-based", "digital", "ecommerce", "seo", "b2b"],
        startupCost: "Low",
        speed: "Fast",
        skill: "Moderate",
        location: "Online",
        repeatIncome: "High",
        customerInteraction: "Low",
        complexity: "Low",
        trainingIds: ["training-digital-marketing"],
        serviceIds: ["service-bookkeeping"],
        officialIds: ["official-state-registration"]
      },
      {
        id: "income-vertical-content",
        title: "Vertical Content Capture Service",
        description: "Visit small business clients with portable equipment, shoot 4 to 8 weeks of short-form video content in one session, and deliver edited clips on a monthly retainer.",
        overview: "Founders and small business operators need consistent short-form video for Instagram Reels, TikTok, and YouTube Shorts but have no time or setup to produce it. The visit is rare. The output is steady. An operator carrying 8 to 15 retainer clients reaches full-time income without daily shoots or heavy editing overhead.",
        whyChoose: "This may fit someone with video production or social media skills who wants a client-based business with predictable recurring income and flexible scheduling.",
        fit: "Useful for someone comfortable with on-site filming, basic editing, and managing a monthly content delivery schedule for multiple small business clients.",
        tags: ["service-based", "local", "digital", "video", "content", "social-media", "b2b"],
        startupCost: "Low",
        speed: "Fast",
        skill: "Moderate",
        location: "Local",
        repeatIncome: "High",
        customerInteraction: "Medium",
        complexity: "Low",
        trainingIds: ["training-digital-marketing", "training-operations-basics"],
        serviceIds: ["service-bookkeeping"],
        officialIds: ["official-state-registration"]
      },
      {
        id: "income-driveway-paver",
        title: "Driveway and Paver Restoration",
        description: "Clean, restore, and seal concrete driveways, paver patios, and brick walkways for residential and commercial property owners.",
        overview: "Restoration - cleaning, joint sand replacement, leveling, and sealing - avoids full replacement at a fraction of the cost. Homeowners who receive a replacement quote often turn immediately to restoration. Property management and HOA contracts provide repeat volume across multiple properties.",
        whyChoose: "This may fit someone who wants a physical outdoor service business with a high close rate driven by clear cost savings over replacement.",
        fit: "Useful for someone comfortable with pressure washing, hardscape repair, and sealing equipment, and willing to pursue property management and HOA contract relationships.",
        tags: ["local", "service-based", "outdoor", "hardscape", "restoration", "property"],
        startupCost: "Low",
        speed: "Fast",
        skill: "Low",
        location: "Local",
        repeatIncome: "Medium",
        customerInteraction: "Medium",
        complexity: "Low",
        trainingIds: ["training-operations-basics"],
        serviceIds: ["service-bookkeeping", "service-insurance"],
        officialIds: ["official-state-registration"]
      },
      {
        id: "income-crawlspace-cleanup",
        title: "Crawlspace Cleanup and Sanitation",
        description: "Remove old insulation, treat mold, replace vapor barriers, and clean debris in residential and commercial crawlspaces.",
        overview: "This work sits between general cleanup and full mold remediation. Homeowners and property managers face steep contractor quotes for work an independent operator can handle at lower rates with proper PPE and equipment. Real estate transactions drive consistent project demand. Property management firms, real estate agents, and home inspectors are reliable referral sources.",
        whyChoose: "This may fit someone willing to do physical, unpleasant work that most operators avoid - low competition, high demand, and above-average ticket size for the time involved.",
        fit: "Useful for someone comfortable with confined space work, proper PPE use, and building referral relationships with real estate and property management professionals.",
        tags: ["local", "service-based", "cleaning", "specialty", "property", "moisture", "remediation"],
        startupCost: "Low",
        speed: "Fast",
        skill: "Low",
        location: "Local",
        repeatIncome: "Medium",
        customerInteraction: "Medium",
        complexity: "Low",
        trainingIds: ["training-operations-basics"],
        serviceIds: ["service-bookkeeping", "service-insurance"],
        officialIds: ["official-state-registration"]
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
        description: "Prep resources for certification-related options that support specific service roles. For ASL interpreting, the NIC (National Interpreter Certification) is the nationally recognized credential - issued by RID but registered and tested through CASLI (casli.org).",
        covers: "Exam prep, skill-building, and readiness for formal certification steps. Includes NIC via CASLI and state programs such as BEI for Texas.",
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
        id: "training-hydroseeding",
        title: "IAHP - Certified Hydroseeding Professional (CHP)",
        provider: "International Association of Hydroseeding Professionals",
        format: "Exam and field experience",
        cost: "Membership and exam fee",
        description: "Industry certification and professional association for hydroseeding operators. The CHP credential is the recognized industry standard for the trade.",
        covers: "Soil science, seed characteristics, machine operation, hydraulic application methods, and business practices.",
        fit: "Useful for someone building a hydroseeding business who wants industry credentialing, network access, and professional standing.",
        tags: ["advanced", "certification", "in-person", "short-form"],
        relatedIncomeIds: ["income-hydroseeding"]
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
        relatedIncomeIds: ["income-mobile-notary", "income-virtual-assistant", "income-commercial-cleaning", "income-government-contracting", "income-hydroseeding"],
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
        relatedIncomeIds: ["income-print-on-demand", "income-commercial-cleaning", "income-hydroseeding"],
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
        relatedIncomeIds: ["income-government-contracting", "income-commercial-cleaning", "income-hydroseeding"],
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
        description: "State-specific interpreter licensure, regulation, and official interpreter-related information. Includes RID (national certifying body, issues the NIC), CASLI (where candidates register and test for the NIC), and BEI (Texas state program, separate from the NIC, required in Texas court and regulated settings).",
        type: "State Information",
        categories: ["licensing", "state regulation"],
        stateLinks: {
          Texas: [
            { label: "Texas interpreter licensure information", href: "asl-official-information-by-state.html" },
            { label: "BEI - Board for Evaluation of Interpreters (Texas)", href: "https://www.hhs.texas.gov/providers/assistive-services-providers/board-evaluation-interpreters-certification-program" }
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
        federalLinks: [
          { label: "CASLI - NIC Exam Portal (administers exam; RID issues credential)", href: "https://www.casli.org/" }
        ],
        tags: ["state"]
      }
    ],
    focus: [],
    articles: []
  };

  const quiz = {
    version: QUIZ_VERSION,
    title: "Find Your Focus",
    intro: `<p>This quiz maps what people are already spending to a business direction that fits how you work. Here is what the questions are built on:</p>
<p><strong>Needs and Wants</strong></p>
<ul>
  <li><strong>Needs</strong> are what people must have - survival, safety, health, shelter, stability.</li>
  <li><strong>Wants</strong> are what people choose - comfort, pleasure, belonging, meaning. Both create real markets. Most income opportunities sit in wants, not survival needs.</li>
</ul>
<p><strong>The Six</strong> - the six things people are actually buying:</p>
<ul>
  <li><strong>Survival and Stability</strong> - keeping finances, routines, and security in place</li>
  <li><strong>Safety and Protection</strong> - reducing risk, avoiding mistakes, reaching what they cannot access alone</li>
  <li><strong>Relief and Health</strong> - removing a problem, burden, or stress from their life</li>
  <li><strong>Pleasure and Comfort</strong> - making life feel better, easier, or more enjoyable</li>
  <li><strong>Belonging and Love</strong> - connection, care, shared meaning, community</li>
  <li><strong>Status and Meaning</strong> - improving their situation, their results, or how they are seen</li>
</ul>
<p><strong>Cost of Living</strong> - what people give up before they spend money:</p>
<ul>
  <li>Time, energy, attention, comfort, and risk are the real costs people carry every day.</li>
  <li>Every business earns by reducing one of these costs for someone who would rather pay than keep carrying it.</li>
</ul>
<p><strong>Niche Is Culture</strong> - a niche is more than a target market:</p>
<ul>
  <li>A culture is a group of people who share the same cost and the same outcome they want.</li>
  <li>Culture shapes what they trust, what they will pay for, and who they choose.</li>
  <li>When you understand the culture you are building for, you can build something that belongs in their world.</li>
</ul>`,
    frameworkNote: "",
    optionPrompt: "Read each one and choose what feels closest. There are no right or wrong answers here, only what fits.",
    questions: [
      {
        id: "driver",
        title: "The Six",
        prompt: "Think about a group of people who keep spending money on the same kind of problem, need, or want. You do not have to have a business idea yet. Just think about spending patterns you have noticed - people around you, situations you have been in, or problems that keep showing up. The six patterns below are what sits underneath most of that spending.",
        question: "Which spending pattern do you recognize most clearly - in your own life, in people around you, or in a market you have noticed?",
        options: [
          { value: "stability", label: "Survival and Stability", detail: "People spending to keep their finances, routines, or security from falling apart." },
          { value: "access", label: "Safety and Protection", detail: "People spending to reduce risk, avoid a costly mistake, or reach something they could not get to on their own." },
          { value: "relief", label: "Relief and Health", detail: "People spending to remove a problem, a burden, or a source of stress from their life." },
          { value: "enjoyment", label: "Pleasure and Comfort", detail: "People spending to make their daily life feel better, easier, or more enjoyable." },
          { value: "connection", label: "Belonging and Love", detail: "People spending for connection, care, shared meaning, or to feel like they belong somewhere." },
          { value: "improvement", label: "Status and Meaning", detail: "People spending to improve their situation, their results, or how they show up in the world." }
        ]
      },
      {
        id: "cost",
        title: "The Cost of Living",
        prompt: "Before people spend money, they are already paying a cost. The Cost of Living is what people spend in time, energy, attention, comfort, and risk to get something done. Every business exists because it reduces one of these costs for someone who would rather pay money than keep carrying it. The higher the cost someone is already paying, the stronger the pull toward a business that reduces it. When you identify the cost the people you want to serve are already paying, you have found the real reason they would hire you, buy from you, or keep coming back.",
        question: "Which cost do you see the people you want to serve paying most heavily?",
        options: [
          { value: "time", label: "Time", detail: "Getting this done takes longer than it should. They would pay to have it faster or handled." },
          { value: "energy", label: "Energy", detail: "This drains them. They would pay to have less of it on their plate." },
          { value: "attention", label: "Attention", detail: "This keeps pulling their focus. They would pay for clarity, simplicity, or someone to handle the complexity." },
          { value: "comfort", label: "Comfort", detail: "This is harder, rougher, or less pleasant than it needs to be. They would pay for ease." },
          { value: "risk", label: "Risk", detail: "This feels uncertain or exposed. They would pay to reduce the chance of getting it wrong." },
          { value: "mix", label: "A mix across these", detail: "More than one of these is clearly stacking up at once." }
        ]
      },
      {
        id: "opportunity",
        title: "Cost of Living Creates Opportunity",
        prompt: "Opportunity is not invented - it is found where the Cost of Living is high and people are already spending to reduce it. When a large group of people share the same cost and keep paying to address it, a market already exists. The Income Spectrum directory is built around this: every income direction, every education resource, and every support service listed exists because a group of people has a cost they would rather pay to have reduced. Your job is not to create demand - it is to find where that demand already lives and where your ability to reduce the cost lines up with it.",
        question: "Which kind of opening do you see most clearly in the cost you identified?",
        options: [
          { value: "save-time", label: "Saving time", detail: "You could provide something faster, do it for them, or remove the steps that slow them down." },
          { value: "use-less-energy", label: "Using less energy", detail: "You could take something heavy off their plate or make the effort significantly lighter." },
          { value: "decide-clearly", label: "Deciding more clearly", detail: "You could help them understand, compare, prepare, or move through a decision with more confidence." },
          { value: "feel-better", label: "Feeling better or more secure", detail: "You could reduce the discomfort, stress, or exposure they are currently carrying." },
          { value: "better-result", label: "Reaching a better result", detail: "You could deliver a stronger outcome, finish, or standard than they can reach on their own." },
          { value: "enjoy-more", label: "Enjoying the process or outcome more", detail: "You could make the experience itself better - more pleasurable, more fitting, more satisfying." }
        ]
      },
      {
        id: "culture",
        title: "Niche Is Culture",
        prompt: "People who keep spending on the same kind of outcome form a culture - a group that shares the same cost and the same thing they are trying to get. That culture shapes what they trust, who they pay, and what makes a business feel like it belongs in their world. The income opportunities and resources in the Income Spectrum directory are organized around these cultures.",
        question: "Which culture are the people you want to build for most likely part of?",
        options: [
          { value: "relief", label: "A relief and health culture", detail: "People dealing with recurring problems, health burdens, or situations that keep needing to be resolved." },
          { value: "stability", label: "A survival and stability culture", detail: "People building or protecting financial security, steady routines, or long-term steadiness." },
          { value: "access", label: "A safety and protection culture", detail: "People trying to reduce risk, avoid costly mistakes, or reach a credential, market, or opportunity they cannot get to alone." },
          { value: "improvement", label: "A status and meaning culture", detail: "People who want better performance, a stronger result, or to be seen as having made a real upgrade." },
          { value: "connection", label: "A belonging and love culture", detail: "People who care about community, care, relationships, or shared identity and meaning." },
          { value: "enjoyment", label: "A pleasure and comfort culture", detail: "People who want things to feel better, be more enjoyable, or be genuinely worth experiencing." }
        ]
      },
      {
        id: "founder",
        title: "Founder Identity",
        prompt: "The same income opportunity can fit very different kinds of founders. A commercial cleaning route run by an owner-operator looks completely different from a cleaning company built by an entrepreneur scaling a team. Which kind of founder you are shapes which opportunities in the directory are right for you - not just which ones sound interesting, but which ones actually fit how you want to work, what you want to own, and what you want to build over time.",
        question: "Which founder identity fits where you are right now?",
        options: [
          { value: "Entrepreneur", label: "Entrepreneur", detail: "Building something with room to grow beyond your direct labor." },
          { value: "Solopreneur", label: "Solopreneur", detail: "Running a business you own and operate yourself, intentionally staying lean." },
          { value: "Small Business Owner", label: "Small Business Owner", detail: "Owning and running a business that serves a defined local or niche market." },
          { value: "Freelancer", label: "Freelancer", detail: "Working independently by offering a skill or service to clients." },
          { value: "Owner-Operator", label: "Owner-Operator", detail: "Owning the business and doing the day-to-day work yourself." },
          { value: "Still sorting", label: "Still defining that", detail: "You are still figuring out which model fits you best." }
        ]
      },
      {
        id: "style",
        title: "Working Style",
        prompt: "The right opportunity is not just the one with the best numbers - it is the one that fits how you naturally work. Someone energized by solving problems will struggle in a business built around constant creative output. Someone who loves organizing systems will feel out of place in a role that demands improvisation. Your working style is a filter: it tells you which income directions in the directory will feel natural and sustainable, and which ones will feel like a grind even when the market demand is real.",
        question: "Which way of working feels most natural to you?",
        options: [
          { value: "solving", label: "Solving", detail: "I like diagnosing, fixing, and figuring things out." },
          { value: "improving", label: "Improving", detail: "I like taking something that works and making it noticeably better." },
          { value: "organizing", label: "Organizing", detail: "I like bringing order, systems, and structure to things." },
          { value: "guiding", label: "Guiding", detail: "I like helping people think through decisions or navigate something." },
          { value: "creating", label: "Creating", detail: "I like making things - objects, content, experiences, or ideas." },
          { value: "connecting", label: "Connecting", detail: "I like bringing people, resources, or opportunities together." }
        ]
      },
      {
        id: "focus",
        title: "Your Focus",
        prompt: "Your focus is where The Six, the Cost of Living, the culture, and your working style all point in the same direction. The Income Spectrum directory is organized around this: income opportunities, education and training, support services, and official resources are all indexed so you can find and build from a clear starting point. This question maps everything you have identified to the section of the directory that fits your focus best - and gives you a working direction to take into the Founder File.",
        question: "Which kind of income opportunity fits the focus taking shape in your answers?",
        options: [
          { value: "service", label: "A service", detail: "You deliver work directly to people using your skills or time." },
          { value: "product", label: "A product", detail: "People buy something you make, source, package, or sell." },
          { value: "ownership", label: "Ownership or acquisition", detail: "You want to buy into or own a business rather than build from scratch." },
          { value: "information", label: "Information or guidance", detail: "You help people understand, decide, or navigate something." },
          { value: "recurring", label: "A recurring or asset-based model", detail: "You want income tied to something you own or have set up, not just your hours." },
          { value: "sorting", label: "Still sorting", detail: "You need to explore more before you can commit to a direction." }
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

  let appState = normalizeQuizState(loadState());
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
    // Firebase auth state listener - restores session across devices
    if (typeof firebase !== "undefined") {
      firebase.auth().onAuthStateChanged(async (user) => {
        if (user && !appState.isSignedIn) {
          const cloudState = await loadStateFromFirestore(user.uid);
          if (cloudState) {
            appState = normalizeQuizState({ ...structuredClone(defaultState), ...cloudState, isSignedIn: true, setupComplete: true });
            saveState();
            renderAll();
            syncGateState();
            if (!appState.isSignedIn && appState.activeView === "saved") {
              appState.activeView = "home";
            }
            showView(appState.activeView || "home");
          }
        } else if (!user && appState.isSignedIn) {
          // Firebase session gone but local state says signed in - clear it
          appState = structuredClone(defaultState);
          localStorage.removeItem(STORAGE_KEY_LOCAL);
          localStorage.removeItem(ACCOUNT_KEY_LOCAL);
          sessionStorage.removeItem(STORAGE_KEY_SESSION);
          renderAll();
          syncGateState();
        }
      });
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
      } else if (action === "add-reminder") {
        const labelInput = document.getElementById("reminderLabel");
        const dateInput = document.getElementById("reminderDate");
        const feedback = document.getElementById("reminderFeedback");
        const label = labelInput ? labelInput.value.trim() : "";
        const date = dateInput ? dateInput.value : "";
        if (!label && !date) {
          if (feedback) feedback.textContent = "Add a reminder and pick a date first.";
          return;
        }
        if (!label) {
          if (feedback) feedback.textContent = "Add a reminder label first.";
          return;
        }
        if (!date) {
          if (feedback) feedback.textContent = "Pick a date first.";
          return;
        }
        const d = date.replace(/-/g, "");
        const url = "https://calendar.google.com/calendar/render?action=TEMPLATE&text=" + encodeURIComponent(label) + "&dates=" + d + "/" + d + "&details=" + encodeURIComponent("Added from your IncomeSpectrum Founder File");
        window.open(url, "_blank");
        if (feedback) feedback.textContent = "Google Calendar opened. Save the event there to confirm.";
        if (labelInput) labelInput.value = "";
        if (dateInput) dateInput.value = "";
      } else if (action === "show-forgot-password") {
        showGate("forgot-password");
      } else if (action === "back-to-signin") {
        setAuthMessage("resetMessage", "");
        showGate("signin");
      } else if (action === "complete-password-reset") {
        completePasswordReset();
      } else if (action === "scroll-founder-file-section") {
        const target = document.getElementById(actionNode.dataset.target);
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      } else if (action === "export-founder-file") {
        openOverlay("exportOverlay");
        document.getElementById("exportConfirmBtn").textContent = "Export PDF";
        const docChecklist = document.getElementById("exportDocChecklist");
        const categories = ["Foundation", "Financial", "Operations"];
        docChecklist.innerHTML = categories.map((cat) => {
          const items = businessDocTypes.filter((d) => d.category === cat && !d.isUpload);
          return `<div style="margin-bottom:4px">
            <p style="font-size:11px;color:#aaa;text-transform:uppercase;letter-spacing:.05em;margin-bottom:6px">${cat}</p>
            ${items.map((d) => `
              <label style="display:flex;align-items:center;gap:10px;font-size:14px;cursor:pointer;margin-bottom:6px">
                <input type="checkbox" class="export-doc-check" data-doc-id="${d.id}" checked style="width:16px;height:16px;accent-color:#19782e">
                ${d.label}
              </label>`).join("")}
          </div>`;
        }).join("");
        document.getElementById("exportConfirmBtn").onclick = () => {
          const includeNotes = document.getElementById("exportIncludeNotes").checked;
          const selectedDocIds = [...document.querySelectorAll(".export-doc-check:checked")].map((el) => el.dataset.docId);
          closeOverlay("exportOverlay");
          exportFounderFile({ includeNotes, selectedDocIds });
        };
      } else if (action === "copy-founder-file-text") {
        openOverlay("exportOverlay");
        const docChecklist = document.getElementById("exportDocChecklist");
        const categories = ["Foundation", "Financial", "Operations"];
        docChecklist.innerHTML = categories.map((cat) => {
          const items = businessDocTypes.filter((d) => d.category === cat && !d.isUpload);
          return `<div style="margin-bottom:4px">
            <p style="font-size:11px;color:#aaa;text-transform:uppercase;letter-spacing:.05em;margin-bottom:6px">${cat}</p>
            ${items.map((d) => `
              <label style="display:flex;align-items:center;gap:10px;font-size:14px;cursor:pointer;margin-bottom:6px">
                <input type="checkbox" class="export-doc-check" data-doc-id="${d.id}" checked style="width:16px;height:16px;accent-color:#19782e">
                ${d.label}
              </label>`).join("")}
          </div>`;
        }).join("");
        const confirmBtn = document.getElementById("exportConfirmBtn");
        confirmBtn.textContent = "Copy to clipboard";
        confirmBtn.onclick = () => {
          const includeNotes = document.getElementById("exportIncludeNotes").checked;
          const selectedDocIds = [...document.querySelectorAll(".export-doc-check:checked")].map((el) => el.dataset.docId);
          closeOverlay("exportOverlay");
          copyFounderFileAsText({ includeNotes, selectedDocIds });
        };
      } else if (action === "confirm-delete-account") {
        document.getElementById("deleteAccountMessage").textContent = "";
        openOverlay("deleteAccountOverlay");
        document.getElementById("deleteAccountConfirmBtn").onclick = () => deleteAccount();
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
        if (typeof firebase !== "undefined") {
          firebase.auth().signOut().catch(() => {});
        }
        appState = structuredClone(defaultState);
        localStorage.removeItem(STORAGE_KEY_LOCAL);
        localStorage.removeItem(ACCOUNT_KEY_LOCAL);
        localStorage.removeItem(FOUNDER_FORMS_KEY);
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
      signupSelect.innerHTML = `<option value="">Select your state</option>` + options;
      if (appState.selectedState) signupSelect.value = appState.selectedState;
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
    const profileState = document.getElementById("profileState");
    const profileGoal = document.getElementById("profileGoal");
    const accountStatusCopy = document.getElementById("accountStatusCopy");
    const profileSignupCard = document.getElementById("profileSignupCard");
    const profileToolsTitle = document.getElementById("profileToolsTitle");
    const topSignOutButton = document.getElementById("topSignOutButton");
    const mobileSignOutButton = document.getElementById("mobileSignOutButton");
    if (signupState) signupState.value = appState.selectedState;
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
    if (mobileSignOutButton) mobileSignOutButton.classList.toggle("hidden", !appState.isSignedIn);
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
        href
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

  async function completeSignup() {
    const name = (document.getElementById("signupName")?.value || "").trim();
    const email = (document.getElementById("signupEmail")?.value || "").trim().toLowerCase();
    const password = (document.getElementById("signupPassword")?.value || "").trim();
    const selectedState = document.getElementById("signupState")?.value || appState.selectedState;
    const initialGoal = appState.goal;
    if (!name || !email || !password || !selectedState) {
      setAuthMessage("signupMessage", "Enter your name, email, password, and state to create your Founder account.");
      return;
    }
    setAuthMessage("signupMessage", "Creating your account...");
    const btn = document.getElementById("completeSignupButton");
    if (btn) btn.disabled = true;
    try {
      const auth = firebase.auth();
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;
      await user.updateProfile({ displayName: name });
      appState.selectedState = selectedState;
      appState.browseOfficialState = selectedState;
      appState.goal = initialGoal;
      appState.isSignedIn = true;
      appState.setupComplete = true;
      saveFounderAccount({ name, email, selectedState, goal: initialGoal });
      clearSignupReturn();
      saveState();
      await saveStateToFirestore(user.uid);
      openApp("home");
      renderPostSignupPrompt();
      openOverlay("progressOverlay", { kind: "post-signup" });
    } catch (err) {
      let msg = "Something went wrong. Try again.";
      if (err.code === "auth/email-already-in-use") msg = "An account with that email already exists. Sign in instead.";
      if (err.code === "auth/weak-password") msg = "Password must be at least 6 characters.";
      if (err.code === "auth/invalid-email") msg = "That doesn't look like a valid email.";
      setAuthMessage("signupMessage", msg);
      if (btn) btn.disabled = false;
    }
  }

  async function completeSignin() {
    const email = (document.getElementById("signinEmail")?.value || "").trim().toLowerCase();
    const password = (document.getElementById("signinPassword")?.value || "").trim();
    if (!email || !password) {
      setAuthMessage("signinMessage", "Enter your email and password to sign in.");
      return;
    }
    setAuthMessage("signinMessage", "Signing in...");
    const btn = document.getElementById("completeSigninButton");
    if (btn) btn.disabled = true;
    try {
      const auth = firebase.auth();
      const userCredential = await auth.signInWithEmailAndPassword(email, password);
      const user = userCredential.user;
      const cloudState = await loadStateFromFirestore(user.uid);
      if (cloudState) {
        appState = normalizeQuizState({ ...structuredClone(defaultState), ...cloudState });
      }
      appState.isSignedIn = true;
      appState.setupComplete = true;
      clearSignupReturn();
      saveState();
      openApp("home");
    } catch (err) {
      let msg = "That email or password is incorrect.";
      if (err.code === "auth/user-not-found") msg = "No account found with that email. Create one first.";
      if (err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") msg = "That email or password is incorrect.";
      if (err.code === "auth/invalid-email") msg = "That doesn't look like a valid email.";
      if (err.code === "auth/too-many-requests") msg = "Too many attempts. Try again in a few minutes.";
      setAuthMessage("signinMessage", msg);
      if (btn) btn.disabled = false;
    }
  }

  async function completePasswordReset() {
    const email = (document.getElementById("resetEmail")?.value || "").trim().toLowerCase();
    if (!email) {
      setAuthMessage("resetMessage", "Enter your email address.");
      return;
    }
    setAuthMessage("resetMessage", "Sending reset email...");
    try {
      await firebase.auth().sendPasswordResetEmail(email);
      setAuthMessage("resetMessage", "Reset email sent. Check your inbox for a link to set a new password.");
      const resetEmail = document.getElementById("resetEmail");
      if (resetEmail) resetEmail.value = "";
      setTimeout(() => {
        setAuthMessage("resetMessage", "");
        showGate("signin");
      }, 3500);
    } catch (err) {
      let msg = "Could not send reset email. Check the address and try again.";
      if (err.code === "auth/user-not-found") msg = "No account found with that email.";
      if (err.code === "auth/invalid-email") msg = "That doesn't look like a valid email.";
      setAuthMessage("resetMessage", msg);
    }
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
    button.disabled = !(name && email && password && selectedState);
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

  async function saveStateToFirestore(uid) {
    try {
      if (!uid || typeof firebase === "undefined") return;
      const db = firebase.firestore();
      const payload = { ...appState };
      delete payload.password;
      await db.collection("users").doc(uid).set({ state: JSON.stringify(payload) }, { merge: true });
    } catch (e) {
      // Firestore save failed silently - localStorage copy is still intact
    }
  }

  async function loadStateFromFirestore(uid) {
    try {
      if (!uid || typeof firebase === "undefined") return null;
      const db = firebase.firestore();
      const doc = await db.collection("users").doc(uid).get();
      if (doc.exists && doc.data().state) {
        return JSON.parse(doc.data().state);
      }
      return null;
    } catch (e) {
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
    if (view === "saved" && !appState.isSignedIn) {
      try {
        const stored = JSON.parse(localStorage.getItem("income-spectrum-app-state-v2-local") || "{}");
        if (stored.isSignedIn) {
          appState.isSignedIn = true;
          appState.planDraft = stored.planDraft || appState.planDraft;
          appState.businessDocs = stored.businessDocs || appState.businessDocs;
          appState.savedIds = stored.savedIds || appState.savedIds;
        }
      } catch (e) {}
    }
    renderAll();
    if (view === "saved") renderSaved();
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
    document.getElementById("continueCopy").textContent = "The Income Spectrum App helps you explore income opportunities, knowledge resources, support services, and official information while building your Founder File in one place.";
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

    if (appState.activeExploreSection === "focus") {
      renderFilterSelector("focus", filter);
      document.getElementById("filterPanel").dataset.section = "focus";
      let focusItems = [...(data.focus || [])];
      if (filter !== "all") {
        focusItems = focusItems.filter((item) => matchesFilter(item, filter));
        if (!focusItems.length) {
          exploreFilter = "all";
          renderFilterSelector("focus", "all");
          focusItems = [...(data.focus || [])];
        }
      }
      content.innerHTML = focusItems.length
        ? `<div class="list-grid">${focusItems.map((item) => renderListItem(item, "focus")).join("")}</div>`
        : `<div class="explore-empty"><p>Business ideas are loading. If this persists, refresh the page.</p></div>`;
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
      income: ["all", "service roles", "auto trades", "beauty & wellness", "counseling & coaching", "product sales", "ownership & acquisition", "business programs", "business ideas"],
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
      official: ["state", "federal"],
      focus: [
        { value: "all", label: "All" },
        { value: "trades and technical", label: "Trades and Technical" },
        { value: "beauty and wellness", label: "Beauty and Wellness" },
        { value: "counseling and coaching", label: "Counseling and Coaching" },
        { value: "home and property", label: "Home and Property" },
        { value: "experience and venue", label: "Experience and Venue" },
        { value: "mobile and route based", label: "Mobile and Route-Based" },
        { value: "from other markets", label: "From Other Markets" },
        { value: "food and agriculture", label: "Food and Agriculture" },
        { value: "digital and tech services", label: "Digital and Tech" },
        { value: "senior and care economy", label: "Senior and Care" },
        { value: "sustainability and green business", label: "Sustainability and Green" },
        { value: "automotive services", label: "Automotive Services" },
        { value: "surface, finish, and restoration", label: "Surface and Restoration" },
        { value: "textile, garment, and fabric", label: "Textile and Garment" },
        { value: "food, beverage, and presentation", label: "Food and Beverage" },
        { value: "retail, display, and experience", label: "Retail and Display" },
        { value: "b2b and founder support", label: "B2B and Founder Support" },
        { value: "small-format production and customization", label: "Small-Format Production" },
        { value: "specialty cleaning and remediation", label: "Specialty Cleaning" },
        { value: "community and social services", label: "Community and Social" },
        { value: "travel and adventure", label: "Travel and Adventure" }
      ]
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
      `<div class="mini-card identity-card"><strong>${founderIdentity}</strong><p class="mini-card__sub">${founderIdentityDescription}</p></div>`,
      `<div class="mini-card"><strong>Selected State</strong><p>${appState.selectedState}</p></div>`
    ].join("");
    const quizResultSummary = appState.quizResult
      ? {
          costOfLiving: appState.quizResult.costOfLivingOpportunitySummary,
          nicheAsCulture: appState.quizResult.nicheAsCultureSummary
        }
      : {
          costOfLiving: "Your quiz results will show the specific cost your business saves future clients once you complete the quiz.",
          nicheAsCulture: "Your quiz results will show the culture and outcome specific to your income path once you complete the quiz."
        };
    const currentFocusMarkup = `
      <div class="mini-card">
        <strong>The Cost of Living Driving Opportunity</strong>
        <p>${quizResultSummary.costOfLiving}</p>
      </div>
      <div class="mini-card">
        <strong>Niche as Culture</strong>
        <p>${quizResultSummary.nicheAsCulture}</p>
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
          <button class="utility-link-pill" data-action="open-notes">Notes</button>
          <button class="utility-link-pill" data-action="scroll-founder-file-section" data-target="founderFileDocsSection">Documents</button>
          <button class="utility-link-pill" data-action="export-founder-file">Export</button>
        </div>
      </section>
    `;

    savedSectionsNode.className = "plan-page-stack";
    savedSectionsNode.innerHTML = `
      <section class="saved-block plan-page-block">
        <p class="section-kicker">Find Your Focus Results</p>
        <div class="plain-list">${currentFocusMarkup}</div>
      </section>
      <section class="saved-block plan-page-block plan-page-block--identity">
        <p class="section-kicker">Founder Identity</p>
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
        <div class="plain-list">${noteEntries}</div>
      </section>
      <section class="saved-block plan-page-block" id="founderFileReminderSection">
        <p class="section-kicker">Save the Date</p>
        <p class="helper-copy" style="margin-top:0">Reminder notes sync directly to Google Calendar.</p>
        <div class="reminder-tool">
          <label class="field plan-draft-field">
            <input type="text" id="reminderLabel" placeholder="Subject/Note" maxlength="120" style="width:100%;padding:8px 10px;border:1px solid #ccc;border-radius:6px;font-size:14px;">
          </label>
          <label class="field plan-draft-field" style="margin-top:8px">
            <input type="date" id="reminderDate" style="width:100%;padding:8px 10px;border:1px solid #ccc;border-radius:6px;font-size:14px;">
          </label>
          <div class="inline-actions" style="margin-top:10px">
            <button class="utility-link" data-action="add-reminder">Add to Calendar</button>
          </div>
          <p id="reminderFeedback" style="font-size:12px;color:#888;margin-top:6px;min-height:16px;"></p>
        </div>
      </section>
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
      <section class="saved-block plan-page-block" id="founderFileDocsSection">
        <p class="section-kicker">Business Documents</p>
        <p class="helper-copy" style="margin-top:0">Track your key documents from formation to operations. Set a status, add notes, and link to where each one lives.</p>
        <div class="doc-modules">${renderBusinessDocsModule()}</div>
      </section>
      <section class="saved-block plan-page-block">
        <p class="section-kicker">Explore Another Set of Ideas</p>
        <p>If you are feeling different, seeing a different opportunity pattern, or want to test another set of ideas, you can revisit Find Your Focus.</p>
        <div class="inline-actions">
          <button class="utility-link" data-action="open-quiz">Revisit Find Your Focus</button>
        </div>
      </section>
      <section class="saved-block plan-page-block" style="display:flex;justify-content:space-between;align-items:center;padding:8px 0 20px;gap:12px;margin-bottom:20px;">
        <div style="display:flex;gap:16px;">
          <button class="utility-link" data-action="export-founder-file" style="font-size:12px;color:#aaa;">Export as PDF</button>
          <button class="utility-link" data-action="copy-founder-file-text" style="font-size:12px;color:#aaa;" id="copyFounderTextBtn">Copy as text</button>
        </div>
        ${appState.isSignedIn ? `<button class="utility-link" data-action="confirm-delete-account" style="font-size:12px;color:#aaa;">Delete my account</button>` : ""}
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
        <p>You can go straight to Find Your Focus to build understanding of what people pay for, or start by exploring opportunities, resources, and official information.</p>
        <div class="inline-actions">
          <button class="app-btn app-btn--secondary" data-action="post-signup-quiz">Find Your Focus</button>
          <button class="app-btn app-btn--ghost" data-action="post-signup-explore">Explore First</button>
        </div>
      </section>
    `;
  }

  function renderSavedQuizResult() {
    const node = document.getElementById("savedQuizResult");
    if (!appState.quizResult) {
      node.innerHTML = `<div class="empty-state">Take the Find Your Focus quiz to generate a first-draft Founder File based on what people pay for and where opportunity may be forming.</div>`;
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
        ${quizIndex === 0 ? `<div class="quiz-intro">${quiz.intro}</div>` : ""}
        <h3>${question.title || question.prompt}</h3>
        ${question.prompt ? `<p>${question.prompt}</p>` : ""}
        ${question.question ? `<p><strong>${question.question}</strong></p>` : ""}
        ${quiz.optionPrompt && quizIndex === 0 ? `<p>${quiz.optionPrompt}</p>` : ""}
        <div class="quiz-options">
          ${question.options.map((option) => `
            <button class="quiz-option ${selected === option.value ? "selected" : ""}" data-action="quiz-option" data-value="${option.value}">
              ${option.label}
              ${option.detail ? `<small>${option.detail}</small>` : ""}
            </button>
          `).join("")}
        </div>
        <div class="quiz-nav">
          <button class="app-btn app-btn--ghost" data-action="quiz-back" ${quizIndex === 0 ? "disabled" : ""}>Back</button>
          <button class="app-btn app-btn--primary" data-action="quiz-next" ${!selected ? "disabled" : ""}>${quizIndex === quiz.questions.length - 1 ? "See Result" : "Next"}</button>
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
    const hookMap = {
      "income-mobile-notary": "Local appointment-based service with low startup cost and a clear certification path.",
      "income-virtual-assistant": "Fully remote, starts with one client, scales through systems and specialization.",
      "income-asl-interpreting": "Certification-backed service with growing demand and referral-driven client work.",
      "income-print-on-demand": "Online product testing with no inventory - design and the platform handles fulfillment.",
      "income-commercial-cleaning": "Recurring commercial contracts that compound over time with the right client mix.",
      "income-hydroseeding": "Equipment-based outdoor service with residential, commercial, and municipal demand.",
      "income-escape-room": "Venue-based experience business with strong corporate and group booking revenue.",
      "income-karaoke-venue": "Private-room hospitality with repeat group traffic and food and beverage upside.",
      "income-laundry-pickup": "Route-based subscription service with low overhead and high residential repeat usage.",
      "income-lice-removal": "Low-startup health service with strong school and pediatric referral pipelines.",
      "income-capsule-hotel": "High-density micro-lodging near transit hubs with lower per-unit build cost than conventional hotels.",
      "income-postpartum-retreat": "Structured wellness stay business with early-mover advantage and minimal US competition.",
      "income-pet-funeral": "Full-service pet aftercare with vet referral pipelines and growing demand for personalized care.",
      "income-death-doula": "Independent practice with low overhead and meaningful end-of-life client work.",
      "income-government-contracting": "A public-sector revenue lane for businesses already delivering services.",
      "income-used-ebike": "Buy, repair, resell - growing supply, clear demand, no manufacturing needed.",
      "income-mobile-battery": "On-demand automotive service - 5 to 8 jobs per day from a stocked van, no shop required.",
      "income-storefront-setup": "Build and configure e-commerce storefronts for small business clients on project and retainer terms.",
      "income-listing-optimization": "Remote e-commerce SEO work with measurable results, repeatable scope, and referral-driven growth.",
      "income-vertical-content": "One filming session delivers 4 to 8 weeks of content - retainer model, 8 to 15 clients.",
      "income-driveway-paver": "Restoration beats replacement on cost - high close rate when clients see the difference.",
      "income-crawlspace-cleanup": "Specialty physical work most operators avoid - low competition, real estate referral pipeline."
    };

    const incomeItems = (result.suggestedIncomeIds || []).map((id) => findItem(id)).filter(Boolean);
    const snapshotRows = result.snapshotRows || [];

    const directorySection = appState.isSignedIn ? `
      <div class="detail-section">
        <h4>From the directory</h4>
        <p class="dir-group-label">Knowledge</p>
        ${renderRelatedLinks(result.suggestedTrainingIds, "training")}
        <p class="dir-group-label">Support</p>
        ${renderRelatedLinks(result.suggestedServiceIds, "services")}
        <p class="dir-group-label">Official</p>
        ${renderRelatedLinks(result.suggestedOfficialIds, "official")}
      </div>
    ` : "";

    return `
      <div class="result-group">
        <h3>${result.planTitle}</h3>
        <p class="result-tagline">${result.founderTagline}</p>

        <div class="founder-snapshot">
          ${snapshotRows.map((row) => `
            <div class="snapshot-row">
              <span class="snap-label">${row.label}</span>
              <span class="snap-value">${row.value}</span>
            </div>
          `).join("")}
        </div>

        <div class="detail-section">
          <h4>Ideas worth looking into</h4>
          <p>${result.ideasContext}</p>
          ${incomeItems.length ? `
            <ul class="idea-list">
              ${incomeItems.map((item) => `
                <li class="idea-row">
                  <button class="text-link" data-action="open-item" data-id="${item.id}" data-type="income">${item.title}</button>
                  <span class="idea-row__hook">${hookMap[item.id] || item.description}</span>
                </li>
              `).join("")}
            </ul>
          ` : `<div class="empty-state">No close matches surfaced yet.</div>`}
        </div>

        ${directorySection}

        <p class="result-file-note">${result.fileNote}</p>

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
    const snapshotText = (result.snapshotRows || []).map((row) => `${row.label}: ${row.value}`).join("\n");
    return {
      founderIdentity: result.founderIdentity || "Founder",
      startingPoint: result.founderTagline || "",
      understanding: snapshotText,
      culture: "",
      opportunity: result.ideasContext || "",
      incomeIdea: (result.suggestedIncomeIds || []).join(", "),
      knowledge: "",
      support: "",
      official: "",
      nextMoves: result.fileNote || "",
      goals: result.planSummary || "",
      proof: result.planSummary || ""
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
    const driver = appState.quizAnswers.driver || "stability";
    const style = appState.quizAnswers.style || "solving";
    const cost = appState.quizAnswers.cost || "time";
    const opportunity = appState.quizAnswers.opportunity || "better-result";
    const culture = appState.quizAnswers.culture || driver;
    const founderIdentity = appState.quizAnswers.founder || "Still sorting";
    const focus = appState.quizAnswers.focus || "sorting";

    const incomeById = Object.fromEntries(data.income.map(function (item) {
      return [item.id, item];
    }));
    const incomeScores = Object.fromEntries(data.income.map(function (item) {
      return [item.id, 0];
    }));
    const trainingScores = Object.fromEntries(data.training.map(function (item) {
      return [item.id, 0];
    }));
    const serviceScores = Object.fromEntries(data.services.map(function (item) {
      return [item.id, 0];
    }));
    const officialScores = Object.fromEntries(data.official.map(function (item) {
      return [item.id, 0];
    }));

    function addScores(bucket, ids, points) {
      (ids || []).forEach(function (id) {
        if (Object.prototype.hasOwnProperty.call(bucket, id)) {
          bucket[id] += points;
        }
      });
    }

    function topKeys(bucket, count) {
      return Object.entries(bucket)
        .sort(function (a, b) { return b[1] - a[1]; })
        .filter(function (entry) { return entry[1] > 0; })
        .slice(0, count)
        .map(function (entry) { return entry[0]; });
    }

    const focusMap = {
      service: {
        focusLabel: "Service focus",
        primarySection: "income",
        incomeIdeaTitle: "Start with service-based options.",
        incomeIdeaSummary: "This reads most clearly as work you do directly for people because the result is what they are coming back for.",
        focusFitSummary: "Start with service-based options first. Stay close to the cost people are already paying and the result they want handled more cleanly.",
        pathSummary: "Start with service-based options and stay close to the actual cost people are already paying.",
        knowledgeSummary: "In the Education & Training section, look for business foundations and operations resources relevant to your service type. In Supportive Services, look for legal setup, bookkeeping, and marketing support to keep the business running cleanly.",
        incomeIds: ["income-mobile-notary", "income-virtual-assistant", "income-commercial-cleaning", "income-hydroseeding", "income-mobile-battery", "income-driveway-paver", "income-crawlspace-cleanup"],
        trainingIds: ["training-business-foundations", "training-operations-basics", "training-certification-prep"],
        serviceIds: ["service-bookkeeping", "service-legal", "service-marketing", "service-advisory"],
        officialIds: ["official-state-registration", "official-licensing", "official-ein-irs"]
      },
      product: {
        focusLabel: "Product focus",
        primarySection: "income",
        incomeIdeaTitle: "Start with product-based options.",
        incomeIdeaSummary: "This reads most clearly as something people can choose, buy, use, keep, or come back for because it fits what they want.",
        focusFitSummary: "Start with product-based options first. Look at what people keep choosing because they want the thing, the fit, the look, or the experience around it.",
        pathSummary: "Start with product-based options and stay close to what people keep choosing on purpose.",
        knowledgeSummary: "In the Education & Training section, look for digital storefront, branding, and business foundations resources. In Supportive Services, look for website setup, branding, and marketing support to get the product in front of the right customers.",
        incomeIds: ["income-print-on-demand", "income-used-ebike", "income-karaoke-venue", "income-escape-room", "income-capsule-hotel"],
        trainingIds: ["training-digital-storefront", "training-brand-basics", "training-business-foundations"],
        serviceIds: ["service-website-setup", "service-branding", "service-marketing", "service-bookkeeping"],
        officialIds: ["official-state-registration", "official-state-tax", "official-licensing"]
      },
      ownership: {
        focusLabel: "Ownership focus",
        primarySection: "income",
        incomeIdeaTitle: "Start with ownership and acquisition.",
        incomeIdeaSummary: "This reads most clearly as owning the business itself or stepping into something that already has operating ground under it.",
        focusFitSummary: "Start with ownership and acquisition first. Look for work worth owning, not just work worth doing.",
        pathSummary: "Start with ownership and acquisition and keep the operating model in view from the beginning.",
        knowledgeSummary: "In the Education & Training section, go to Entrepreneurship & Ownership specifically - acquisition training and business-buying education are there. In Supportive Services, look for legal and advisory support before you commit to anything.",
        incomeIds: ["income-government-contracting", "income-commercial-cleaning", "income-hydroseeding", "income-used-ebike", "income-capsule-hotel"],
        trainingIds: ["training-business-foundations", "training-government-contracting"],
        serviceIds: ["service-legal", "service-bookkeeping", "service-advisory"],
        officialIds: ["official-state-registration", "official-state-tax", "official-licensing", "official-ein-irs"]
      },
      information: {
        focusLabel: "Information focus",
        primarySection: "training",
        incomeIdeaTitle: "Start with information and guidance-based options.",
        incomeIdeaSummary: "This reads most clearly as work that helps people understand, compare, prepare, decide, or move more clearly.",
        focusFitSummary: "Start with information and guidance-based options first. Stay close to confusion, comparison, preparation, and the places people do not want to guess.",
        pathSummary: "Start with information and guidance-based options and keep clarity at the center of the offer.",
        knowledgeSummary: "In the Education & Training section, look for business foundations and certification resources in your area of guidance. In Supportive Services, look for advisory and legal support to structure what you are delivering correctly.",
        incomeIds: ["income-storefront-setup", "income-listing-optimization", "income-vertical-content", "income-government-contracting", "income-virtual-assistant"],
        trainingIds: ["training-business-foundations", "training-digital-storefront", "training-government-contracting", "training-certification-prep"],
        serviceIds: ["service-advisory", "service-website-setup", "service-bookkeeping", "service-legal"],
        officialIds: ["official-state-registration", "official-state-tax", "official-licensing", "official-federal-contracting", "official-state-contracting"]
      },
      recurring: {
        focusLabel: "Recurring focus",
        primarySection: "income",
        incomeIdeaTitle: "Start with recurring and asset-based options.",
        incomeIdeaSummary: "This reads most clearly as work tied to something that keeps paying, keeps running, or keeps getting renewed beyond one-off effort.",
        focusFitSummary: "Start with recurring and asset-based options first. Look for what repeats, renews, or keeps generating demand once it is in place.",
        pathSummary: "Start with recurring and asset-based options and keep repeat demand in view.",
        knowledgeSummary: "In the Education & Training section, look for business operations and foundations resources. In Supportive Services, look for legal, bookkeeping, and advisory support to structure the recurring model correctly from the start.",
        incomeIds: ["income-laundry-pickup", "income-commercial-cleaning", "income-government-contracting", "income-capsule-hotel", "income-used-ebike"],
        trainingIds: ["training-business-foundations", "training-operations-basics", "training-government-contracting"],
        serviceIds: ["service-bookkeeping", "service-legal", "service-advisory"],
        officialIds: ["official-state-registration", "official-state-tax", "official-licensing", "official-ein-irs"]
      },
      sorting: {
        focusLabel: "Still sorting",
        primarySection: "income",
        incomeIdeaTitle: "Start broad in Focus.",
        incomeIdeaSummary: "The signal is there. You do not need to force the label too early for it to be useful.",
        focusFitSummary: "Start broad in Focus. Save what keeps matching, let the weaker signal fall away, and narrow from there.",
        pathSummary: "Start broad and use the Founder File to see what keeps holding up.",
        knowledgeSummary: "Use the Education & Training section to explore business foundations while your focus gets clearer. Save the income ideas and training resources that keep matching - let the pattern in your Founder File show you where to narrow.",
        incomeIds: ["income-mobile-notary", "income-laundry-pickup", "income-government-contracting", "income-virtual-assistant", "income-commercial-cleaning"],
        trainingIds: ["training-business-foundations", "training-digital-storefront"],
        serviceIds: ["service-advisory", "service-bookkeeping"],
        officialIds: ["official-state-registration", "official-licensing"]
      }
    };

    const styleLabels = {
      solving: "Solving",
      improving: "Improving",
      organizing: "Organizing",
      guiding: "Guiding",
      creating: "Creating",
      connecting: "Connecting"
    };
    const styleInsight = {
      solving: "Solvers fit service businesses where diagnosing and fixing is the core of the work. In the income opportunities section, look at repair, inspection, technical services, and problem-resolution businesses - the ones where getting it resolved is exactly what the customer is paying for.",
      improving: "Improvers fit quality-focused service and product businesses where the result is visibly better. In the income opportunities section, look at landscaping, listing optimization, finishing trades, and content work - businesses where the reason someone chooses you is the difference in outcome.",
      organizing: "Organizers fit operational service and logistics businesses where systems and process are the value. In the income opportunities section, look at virtual assistance, route-based operations, compliance support, and admin-heavy services - businesses where order and reliability are what the customer is buying.",
      guiding: "Guiders fit information-based and advisory businesses where helping people navigate something is the product. In the income opportunities section, look at storefront setup support, government contracting guidance, and information services - businesses where the customer's confidence in moving forward is what you are delivering.",
      creating: "Creators fit product, content, and experience businesses where original output is the value. In the income opportunities section, look at print-on-demand, content creation, entertainment venues, and hospitality businesses - the ones where what you make or build is the reason people come to you.",
      connecting: "Connectors fit community, care, and relationship-driven businesses where the human element is central. In the income opportunities section, look at interpreting services, doula work, pet care, and event-based businesses - the ones where the connection between provider and customer is part of what is being delivered."
    };
    const driverLabels = {
      relief: "Relief",
      stability: "Stability",
      access: "Access",
      improvement: "Improvement",
      connection: "Connection",
      enjoyment: "Enjoyment"
    };
    const driverInsight = {
      relief: "Relief-driven markets are where service businesses earn their most reliable customers. People in a relief market hire you because something needs to be handled - and they keep coming back when the problem comes back. In the Income Spectrum directory, start with service income opportunities: cleaning, maintenance, care, repair, and done-for-you work where getting it off the customer's plate is the product.",
      stability: "Stability-driven markets support businesses built on trust, accuracy, and repeat relationships. Customers here are paying to reduce the chance of getting something wrong. Notary work, government contracting, compliance-adjacent services, and professional support all sit here. In the directory, look at service and information income opportunities where reliability and correctness are the reason someone chooses you.",
      access: "Access-driven markets support businesses that open doors. Customers here are paying to reach something they cannot get to alone - a credential, a market, a skill, or a pathway. In the directory, look at education and training resources alongside income opportunities like interpreting, storefront setup support, and government contracting that give people access to something they need.",
      improvement: "Improvement-driven markets support quality-focused services and products. Customers here can already get the job done - they are paying because better matters and the difference is visible. In the directory, look at service and product income opportunities like landscaping, listing optimization, finishing trades, and content creation where the output is the reason someone chooses you over a cheaper option.",
      connection: "Connection-driven markets support businesses where the human element is part of the value. Customers here are paying for care, shared experience, or belonging - not just a task completed. In the directory, look at income opportunities like interpreting services, doula work, pet care, and community-facing businesses where the relationship between provider and customer shapes the outcome.",
      enjoyment: "Enjoyment-driven markets support businesses built on experience. Customers here spend freely when something feels genuinely good. In the directory, look at product and experience income opportunities: entertainment venues, hospitality, print-on-demand, and businesses where the experience itself is the product."
    };
    const costLabels = {
      time: "Time",
      energy: "Energy",
      attention: "Attention",
      comfort: "Comfort",
      risk: "Risk",
      mix: "A mix across these"
    };
    const costInsight = {
      time: "Time is the cost your market is already paying. A business that gets the job done faster, handles it entirely, or removes the back-and-forth has a clear value. In the income opportunities section, look at done-for-you services, route-based businesses, and virtual support - these are built around saving the customer time.",
      energy: "Energy is the cost your market is already paying. People here are tired of carrying heavy work themselves and will pay to hand it off. In the income opportunities section, look at physical service businesses - commercial cleaning, landscaping, crawlspace work, laundry pickup - where the value is that the customer does not have to do the work.",
      attention: "Attention is the cost your market is already paying. People here are overwhelmed by complexity and will pay for clarity and managed decisions. In the income opportunities section, look at information and operational support - virtual assistance, listing optimization, government contracting support, and storefront setup are all built around reducing cognitive load.",
      comfort: "Comfort is the cost your market is already paying. People here are dealing with something harder or more unpleasant than it needs to be and will pay for ease. In the income opportunities section, look at care, hospitality, and comfort-adjacent businesses - doula services, pet care, capsule hotel concepts, and similar work.",
      risk: "Risk is the cost your market is already paying. People here are operating where getting it wrong has real consequences and will pay for accuracy and correct guidance. In the income opportunities section, look at notary services, interpreting, government contracting, and compliance-adjacent businesses where getting it right is the product.",
      mix: "Multiple costs are stacking up at once. That often signals stronger opportunity - the more costs your business reduces, the harder it is to replace. Look broadly across the income opportunities section and save the ones that address more than one of these costs for the customer."
    };
    const opportunityLabels = {
      "save-time": "Saving time",
      "use-less-energy": "Using less energy",
      "decide-clearly": "Deciding more clearly",
      "feel-better": "Feeling better or more secure",
      "better-result": "Reaching a better result",
      "enjoy-more": "Enjoying the process or outcome more"
    };
    const opportunityInsight = {
      "save-time": "The clearest path here is a done-for-you service or route-based business. In the Income Spectrum income opportunities section, look at service businesses built around handling tasks completely - cleaning, virtual support, laundry pickup, and mobile services that compete on convenience and speed.",
      "use-less-energy": "The clearest path here is a physical service or labor business. In the income opportunities section, look at businesses that take the heavy work off the customer entirely - commercial cleaning, landscaping, driveway work, and crawlspace cleanup, where the value is that the customer does not have to do it.",
      "decide-clearly": "The clearest path here is an information or guidance business. In the income opportunities section, look at information-based directions - storefront setup support, listing optimization, government contracting guidance, and virtual assistance where helping people move through a decision is the product.",
      "feel-better": "The clearest path here is a care or comfort business. In the income opportunities section, look at service businesses where how the customer feels is the measure of success - doula services, pet care, lice removal, and comfort-adjacent work that reduces stress or discomfort directly.",
      "better-result": "The clearest path here is a quality-focused service or product. In the income opportunities section, look at businesses where the outcome is the differentiator - hydroseeding, driveway paving, listing optimization, and product businesses where what you deliver is measurably better than what the customer could get elsewhere.",
      "enjoy-more": "The clearest path here is an experience or creative product business. In the income opportunities section, look at entertainment, hospitality, and product businesses - karaoke venues, escape rooms, capsule hotels, print-on-demand, and used e-bikes - where the experience is the product."
    };
    const cultureLabels = {
      relief: "a culture of relief",
      stability: "a culture of stability",
      access: "a culture of access",
      improvement: "a culture of improvement",
      connection: "a culture of connection",
      enjoyment: "a culture of enjoyment"
    };
    const cultureInsight = {
      relief: "In a relief culture, the business earns by being the thing that handles it. Customers here do not want to think about it again once it is done. The businesses that do best here are reliable, available, and known for taking the problem away cleanly. In the directory, these businesses earn through repeat customers and referrals from people who had the same problem.",
      stability: "In a stability culture, the business earns by being the one you trust. Customers here are choosing based on track record, accuracy, and professional consistency. In the directory, businesses in this culture build long-term relationships and earn through reliability over time - notary, contracting, professional services.",
      access: "In an access culture, the business earns by being the bridge. Customers here are paying to get somewhere they cannot reach on their own. In the directory, businesses in this culture are known as the path in - to a credential, a market, a skill, or an opportunity. Education resources and platform-based income both sit here.",
      improvement: "In an improvement culture, the business earns by delivering better. Customers here can see the difference between good and better - and they pay for it. In the directory, businesses in this culture are chosen because their output is visibly stronger, not just cheaper or more available.",
      connection: "In a connection culture, the business earns by being the one that understood. Customers here are paying for how the work made them feel, not just what it produced. In the directory, businesses in this culture build trust through care and communication - and they are chosen because they feel like they belong in the customer's world.",
      enjoyment: "In an enjoyment culture, the business earns by being worth choosing. Customers here are not solving a problem - they are choosing an experience. In the directory, businesses in this culture are the ones that make the thing feel right, taste right, or look right in a way that cannot be easily replaced."
    };

    const currentFocus = focusMap[focus] || focusMap.sorting;

    const styleBoosts = {
      solving: ["income-mobile-battery", "income-commercial-cleaning", "income-crawlspace-cleanup", "income-lice-removal", "income-driveway-paver"],
      improving: ["income-listing-optimization", "income-vertical-content", "income-hydroseeding", "income-driveway-paver", "income-storefront-setup"],
      organizing: ["income-virtual-assistant", "income-storefront-setup", "income-government-contracting", "income-laundry-pickup", "income-mobile-notary"],
      guiding: ["income-mobile-notary", "income-storefront-setup", "income-government-contracting", "income-virtual-assistant", "income-listing-optimization"],
      creating: ["income-print-on-demand", "income-vertical-content", "income-escape-room", "income-karaoke-venue", "income-used-ebike"],
      connecting: ["income-asl-interpreting", "income-death-doula", "income-pet-funeral", "income-postpartum-retreat", "income-virtual-assistant"]
    };
    const driverBoosts = {
      relief: ["income-commercial-cleaning", "income-crawlspace-cleanup", "income-lice-removal", "income-mobile-battery", "income-virtual-assistant", "income-laundry-pickup"],
      stability: ["income-mobile-notary", "income-government-contracting", "income-commercial-cleaning", "income-laundry-pickup"],
      access: ["income-asl-interpreting", "income-storefront-setup", "income-used-ebike", "income-mobile-battery"],
      improvement: ["income-listing-optimization", "income-vertical-content", "income-driveway-paver", "income-hydroseeding", "income-storefront-setup"],
      connection: ["income-asl-interpreting", "income-death-doula", "income-pet-funeral", "income-postpartum-retreat", "income-virtual-assistant"],
      enjoyment: ["income-print-on-demand", "income-karaoke-venue", "income-escape-room", "income-capsule-hotel", "income-used-ebike", "income-vertical-content"]
    };
    const founderBoosts = {
      Entrepreneur: ["income-escape-room", "income-karaoke-venue", "income-capsule-hotel", "income-government-contracting", "income-storefront-setup", "income-vertical-content"],
      Solopreneur: ["income-virtual-assistant", "income-mobile-notary", "income-listing-optimization", "income-storefront-setup", "income-vertical-content", "income-used-ebike"],
      "Small Business Owner": ["income-commercial-cleaning", "income-hydroseeding", "income-laundry-pickup", "income-driveway-paver", "income-mobile-battery"],
      Freelancer: ["income-listing-optimization", "income-vertical-content", "income-storefront-setup", "income-virtual-assistant", "income-mobile-notary"],
      "Owner-Operator": ["income-mobile-battery", "income-hydroseeding", "income-commercial-cleaning", "income-laundry-pickup", "income-driveway-paver", "income-crawlspace-cleanup", "income-mobile-notary"],
      "Still sorting": ["income-mobile-notary", "income-virtual-assistant", "income-commercial-cleaning", "income-government-contracting"]
    };
    const costBoosts = {
      time: ["income-virtual-assistant", "income-mobile-notary", "income-laundry-pickup", "income-mobile-battery", "income-listing-optimization", "income-storefront-setup"],
      energy: ["income-commercial-cleaning", "income-crawlspace-cleanup", "income-driveway-paver", "income-hydroseeding", "income-laundry-pickup"],
      attention: ["income-listing-optimization", "income-storefront-setup", "income-virtual-assistant", "income-government-contracting", "income-mobile-notary"],
      comfort: ["income-capsule-hotel", "income-postpartum-retreat", "income-pet-funeral", "income-death-doula", "income-lice-removal"],
      risk: ["income-government-contracting", "income-mobile-notary", "income-asl-interpreting"],
      mix: ["income-virtual-assistant", "income-commercial-cleaning", "income-government-contracting", "income-storefront-setup", "income-mobile-notary"]
    };
    const opportunityBoosts = {
      "save-time": ["income-virtual-assistant", "income-mobile-battery", "income-mobile-notary", "income-storefront-setup", "income-listing-optimization", "income-laundry-pickup"],
      "use-less-energy": ["income-commercial-cleaning", "income-laundry-pickup", "income-crawlspace-cleanup", "income-driveway-paver", "income-mobile-battery"],
      "decide-clearly": ["income-listing-optimization", "income-government-contracting", "income-mobile-notary", "income-virtual-assistant", "income-storefront-setup"],
      "feel-better": ["income-pet-funeral", "income-death-doula", "income-postpartum-retreat", "income-lice-removal", "income-capsule-hotel"],
      "better-result": ["income-hydroseeding", "income-driveway-paver", "income-listing-optimization", "income-storefront-setup", "income-used-ebike"],
      "enjoy-more": ["income-karaoke-venue", "income-escape-room", "income-capsule-hotel", "income-print-on-demand", "income-vertical-content", "income-used-ebike"]
    };

    addScores(incomeScores, currentFocus.incomeIds, 4);
    addScores(incomeScores, styleBoosts[style] || [], 2);
    addScores(incomeScores, driverBoosts[driver] || [], 2);
    addScores(incomeScores, driverBoosts[culture] || [], 1);
    addScores(incomeScores, founderBoosts[founderIdentity] || [], 1);
    addScores(incomeScores, costBoosts[cost] || [], 1);
    addScores(incomeScores, opportunityBoosts[opportunity] || [], 2);

    const suggestedIncomeIds = topKeys(incomeScores, 3).length
      ? topKeys(incomeScores, 3)
      : currentFocus.incomeIds.slice(0, 3);

    suggestedIncomeIds.forEach(function (id, index) {
      const item = incomeById[id];
      if (!item) return;
      const points = Math.max(3, 5 - index);
      addScores(trainingScores, item.trainingIds || [], points);
      addScores(serviceScores, item.serviceIds || [], points);
      addScores(officialScores, item.officialIds || [], points);
    });

    addScores(trainingScores, currentFocus.trainingIds, 2);
    addScores(serviceScores, currentFocus.serviceIds, 2);
    addScores(officialScores, currentFocus.officialIds, 2);

    if (driver === "connection" || culture === "connection") {
      addScores(trainingScores, ["training-asl-pathways", "training-certification-prep"], 1);
      addScores(serviceScores, ["service-communication-access", "service-advisory"], 1);
      addScores(officialScores, ["official-asl-state"], 1);
    }

    if (driver === "improvement" || opportunity === "better-result") {
      addScores(trainingScores, ["training-brand-basics", "training-digital-storefront", "training-operations-basics"], 1);
      addScores(serviceScores, ["service-branding", "service-marketing"], 1);
    }

    if (cost === "risk" || driver === "stability" || focus === "ownership" || focus === "information") {
      addScores(officialScores, ["official-state-registration", "official-state-tax", "official-licensing", "official-ein-irs"], 1);
    }

    if (opportunity === "decide-clearly") {
      addScores(trainingScores, ["training-business-foundations", "training-government-contracting"], 1);
      addScores(serviceScores, ["service-advisory", "service-bookkeeping"], 1);
      addScores(officialScores, ["official-state-contracting", "official-federal-contracting"], 1);
    }

    const suggestedTrainingIds = topKeys(trainingScores, 3);
    const suggestedServiceIds = topKeys(serviceScores, 3);
    const suggestedOfficialIds = topKeys(officialScores, 3);

    const costVerbs = {
      time: "getting things done and off the plate",
      energy: "taking heavy work off people's plates",
      attention: "reducing complexity and clarifying decisions",
      comfort: "making things easier and less uncomfortable",
      risk: "getting things right and reducing exposure",
      mix: "addressing multiple costs at once"
    };
    const founderTagline = `${founderIdentityDescriptions[founderIdentity] || "Founder"} - ${styleLabels[style].toLowerCase()} style, drawn toward ${costVerbs[cost] || "reducing cost for people"} in ${cultureLabels[culture]}.`;

    const directionPhrases = {
      time: "Helping people hand it off and get it done",
      energy: "Taking the heavy work off people's plates",
      attention: "Cutting through complexity and decisions",
      comfort: "Making hard things easier and less stressful",
      risk: "Helping people get it right and reduce exposure",
      mix: "Reducing multiple costs at once"
    };
    const opportunityAddons = {
      "save-time": "by doing it faster or doing it for them",
      "use-less-energy": "by taking the physical load off",
      "decide-clearly": "by helping them understand and move forward",
      "feel-better": "by making it safer or more comfortable",
      "better-result": "by delivering a noticeably stronger outcome",
      "enjoy-more": "by making the experience worth choosing"
    };
    const styleDescriptions = {
      solving: "Solving - diagnosing, fixing, and figuring things out",
      improving: "Improving - taking what works and making it noticeably better",
      organizing: "Organizing - bringing order, systems, and structure",
      guiding: "Guiding - helping people think through decisions and navigate",
      creating: "Creating - making things, content, experiences, or ideas",
      connecting: "Connecting - bringing people, resources, or opportunities together"
    };
    const marketDescriptions = {
      relief: "Relief - people paying to get something handled or resolved",
      stability: "Stability - people paying for certainty, accuracy, and trust",
      access: "Access - people paying to reach something they cannot get to alone",
      improvement: "Improvement - people paying for a better outcome, not just a completed job",
      connection: "Connection - people paying for care, relationship, and shared meaning",
      enjoyment: "Enjoyment - people paying because it feels right, looks right, or is worth experiencing"
    };

    const snapshotRows = [
      { label: "Direction", value: `${directionPhrases[cost] || "Helping people pay less to get what they need"} - ${opportunityAddons[opportunity] || "through better delivery"}` },
      { label: "Style", value: styleDescriptions[style] || style },
      { label: "Market", value: marketDescriptions[driver] || driver },
      { label: "Focus", value: currentFocus.focusLabel }
    ];

    const ideasContextMap = {
      service: `These service-based options match your ${styleLabels[style].toLowerCase()} style and the ${driver} market you identified.`,
      product: `These product-based options match your ${styleLabels[style].toLowerCase()} direction and the ${driver} market taking shape in your answers.`,
      ownership: `These ownership-oriented options match your direction toward building something rather than starting from scratch.`,
      information: `These information and guidance-based options match your ${styleLabels[style].toLowerCase()} style and the ${driver} market you are drawn toward.`,
      recurring: `These recurring and asset-based options match your direction toward income that compounds beyond single jobs.`,
      sorting: `These are a broad starting point based on the signal in your answers - use Explore to go deeper and save what keeps matching.`
    };
    const ideasContext = ideasContextMap[focus] || `These are the closest matches in the Income Opportunities section based on your answers.`;
    const fileNote = `Save the ideas that keep matching and let the Founder File show you where your focus is landing.`;
    const planSummary = "This Founder File is meant to stay working, not final. Save what keeps matching and let the weaker signal fall away.";

    const costLivingOpportunityStatements = {
      time: "The people you are building for are spending time they would rather not spend. Your business earns by taking the task off their schedule - doing it faster, handling it entirely, or removing the steps that drain their day.",
      energy: "The people you are building for are spending energy on something they would rather hand off. Your business earns by carrying the physical or mental load so they do not have to show up for it.",
      attention: "The people you are building for are spending attention on complexity they want to escape. Your business earns by simplifying, deciding, or handling the overhead so they can focus on what matters to them.",
      comfort: "The people you are building for are spending comfort on something harder or more stressful than it needs to be. Your business earns by reducing the friction, the worry, or the discomfort they are currently carrying.",
      risk: "The people you are building for are absorbing risk exposure on something they cannot afford to get wrong. Your business earns by getting it right for them - reducing the chance they make a costly mistake on their own.",
      mix: "The people you are building for are paying across multiple costs at once - time, energy, attention, comfort, and risk are all stacking up. A business that reduces more than one of these at once is harder to replace and easier to choose."
    };
    const costOfLivingOpportunitySummary = costLivingOpportunityStatements[cost] || costLivingOpportunityStatements.mix;

    const topIncome = incomeById[suggestedIncomeIds[0]];
    const topIncomeTitle = topIncome ? topIncome.title : "your income direction";
    const nicheDriverPhrases = {
      relief: "The driver in this culture is resolution",
      stability: "The driver in this culture is certainty",
      access: "The driver in this culture is reach",
      improvement: "The driver in this culture is quality",
      connection: "The driver in this culture is belonging",
      enjoyment: "The driver in this culture is experience"
    };
    const nicheOutcomePhrases = {
      relief: "people pay to stop carrying the problem, not just to have it addressed",
      stability: "people pay for the confidence that it was handled correctly and will not need to be revisited",
      access: "people pay to get there - to the credential, the market, or the result they could not reach alone",
      improvement: "people pay because the difference between where they are and a better result is visible and worth the cost",
      connection: "people pay for care, shared meaning, and the sense that the business understands them",
      enjoyment: "people pay because the experience itself is the product - comfort, pleasure, or something worth choosing"
    };
    const nicheAsCultureSummary = `${nicheDriverPhrases[culture] || nicheDriverPhrases.relief}. In this culture, ${nicheOutcomePhrases[culture] || nicheOutcomePhrases.relief}. An income path like ${topIncomeTitle} earns inside this culture by delivering exactly that outcome.`;

    return {
      id: "quiz-result",
      quizVersion: QUIZ_VERSION,
      planTitle: focus === "sorting" ? "The signal is there - here is what to work from." : `${currentFocus.focusLabel} - here is what that looks like.`,
      planSummary,
      founderTagline,
      snapshotRows,
      ideasContext,
      fileNote,
      motivator: driver,
      payment: cost,
      culture,
      workingStyle: style,
      value: opportunity,
      primarySection: currentFocus.primarySection,
      pathLabel: currentFocus.focusLabel,
      pathSummary: currentFocus.pathSummary,
      founderIdentity,
      founderIdentityDescription: founderIdentityDescriptions[founderIdentity] || founderIdentityDescriptions.Founder,
      suggestedIncomeIds,
      suggestedTrainingIds,
      suggestedServiceIds,
      suggestedOfficialIds,
      costOfLivingOpportunitySummary,
      nicheAsCultureSummary
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

    detailType.textContent = "Find Your Focus";
    detailTitle.textContent = "Take Find Your Focus";
    detailBody.innerHTML = `
      <div class="detail-section">
        <p>${path.summary}</p>
      </div>
      <div class="detail-section">
        <div class="inline-actions">
          <button class="app-btn app-btn--secondary" data-action="open-quiz">Open Find Your Focus</button>
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
        : type === "income" || type === "focus"
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
    if (type === "focus") return "app-btn--income";
    if (type === "training") return "app-btn--knowledge";
    if (type === "services") return "app-btn--support";
    if (type === "official") return "app-btn--official";
    return "app-btn--secondary";
  }

  function buildNextSteps() {
    return [
      {
        label: "Find Your Focus",
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
      if (typeof firebase !== "undefined") {
        const user = firebase.auth().currentUser;
        if (user) saveStateToFirestore(user.uid);
      }
      return;
    }
    sessionStorage.setItem(STORAGE_KEY_SESSION, payload);
  }

  function loadState() {
    try {
      const localRaw = localStorage.getItem(STORAGE_KEY_LOCAL);
      if (localRaw) {
        const parsed = JSON.parse(localRaw);
        if (parsed.isSignedIn) return normalizeQuizState({ ...structuredClone(defaultState), ...parsed });
      }
      const sessionRaw = sessionStorage.getItem(STORAGE_KEY_SESSION);
      if (sessionRaw) {
        const parsed = JSON.parse(sessionRaw);
        if (!parsed.isSignedIn) return normalizeQuizState({ ...structuredClone(defaultState), ...parsed });
      }
      return normalizeQuizState(structuredClone(defaultState));
    } catch (error) {
      return normalizeQuizState(structuredClone(defaultState));
    }
  }

  function normalizeQuizState(state) {
    const nextState = state || structuredClone(defaultState);
    if (nextState.quizResult && nextState.quizResult.quizVersion !== QUIZ_VERSION) {
      nextState.quizResult = null;
      nextState.quizAnswers = {};
    }
    return nextState;
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

  async function deleteAccount() {
    const confirmBtn = document.getElementById("deleteAccountConfirmBtn");
    const messageEl = document.getElementById("deleteAccountMessage");
    confirmBtn.disabled = true;
    confirmBtn.textContent = "Deleting...";
    try {
      const user = typeof firebase !== "undefined" ? firebase.auth().currentUser : null;
      if (user) {
        const db = firebase.firestore();
        await db.collection("users").doc(user.uid).delete();
        await user.delete();
      }
      appState = structuredClone(defaultState);
      localStorage.removeItem(STORAGE_KEY_LOCAL);
      localStorage.removeItem(ACCOUNT_KEY_LOCAL);
      localStorage.removeItem(FOUNDER_FORMS_KEY);
      sessionStorage.removeItem(STORAGE_KEY_SESSION);
      closeOverlay("deleteAccountOverlay");
      saveState();
      syncGateState();
      renderAll();
    } catch (err) {
      confirmBtn.disabled = false;
      confirmBtn.textContent = "Yes, Delete My Account";
      if (err.code === "auth/requires-recent-login") {
        messageEl.textContent = "For security, please sign out and sign back in before deleting your account.";
      } else {
        messageEl.textContent = "Something went wrong. Please try again.";
      }
    }
  }

  function copyFounderFileAsText({ includeNotes = true, selectedDocIds = null } = {}) {
    const s = appState;
    const lines = [];
    const exportDate = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

    lines.push("INCOME SPECTRUM - FOUNDER FILE");
    lines.push("Generated: " + exportDate);
    lines.push("================================");

    if (s.quizResult?.focus?.length) {
      lines.push("\nFIND YOUR FOCUS RESULTS");
      lines.push("------------------------");
      s.quizResult.focus.forEach(f => lines.push("- " + f));
    }

    const identity = s.founderIdentity || {};
    const identityFields = [
      ["Name", identity.name], ["Location", identity.location],
      ["Business Type", identity.bizType], ["Stage", identity.stage],
    ];
    const filledIdentity = identityFields.filter(([, v]) => v);
    if (filledIdentity.length) {
      lines.push("\nFOUNDER IDENTITY");
      lines.push("-----------------");
      filledIdentity.forEach(([k, v]) => lines.push(k + ": " + v));
    }

    const goals = (s.goals || []).filter(g => g.trim());
    if (goals.length) {
      lines.push("\nGOALS");
      lines.push("------");
      goals.forEach(g => lines.push("- " + g));
    }

    const nextMoves = (s.nextMoves || []).filter(n => n.trim());
    if (nextMoves.length) {
      lines.push("\nNEXT STEPS");
      lines.push("-----------");
      nextMoves.forEach(n => lines.push("- " + n));
    }

    if (includeNotes) {
      const notes = (s.notes || []).filter(n => n.text?.trim());
      if (notes.length) {
        lines.push("\nNOTES");
        lines.push("------");
        notes.forEach(n => lines.push("- " + n.text));
      }
    }

    const ideas = (s.saved || []).filter(i => i.category === "idea" || !i.category);
    if (ideas.length) {
      lines.push("\nSAVED IDEAS");
      lines.push("------------");
      ideas.forEach(i => lines.push("- " + (i.name || i.title || i.text || "")));
    }

    const knowledge = (s.saved || []).filter(i => i.category === "knowledge");
    if (knowledge.length) {
      lines.push("\nKNOWLEDGE");
      lines.push("----------");
      knowledge.forEach(i => lines.push("- " + (i.name || i.title || i.text || "")));
    }

    const support = (s.saved || []).filter(i => i.category === "support");
    if (support.length) {
      lines.push("\nSUPPORT RESOURCES");
      lines.push("------------------");
      support.forEach(i => lines.push("- " + (i.name || i.title || i.text || "")));
    }

    const official = (s.saved || []).filter(i => i.category === "official");
    if (official.length) {
      lines.push("\nOFFICIAL NEEDS");
      lines.push("---------------");
      official.forEach(i => lines.push("- " + (i.name || i.title || i.text || "")));
    }

    if (selectedDocIds && selectedDocIds.length) {
      const docs = s.businessDocs || {};
      const docLines = [];
      ["Foundation", "Financial", "Operations"].forEach((cat) => {
        const items = businessDocTypes.filter(
          (d) => d.category === cat && !d.isUpload && selectedDocIds.includes(d.id)
        );
        if (!items.length) return;
        docLines.push("\n" + cat.toUpperCase());
        items.forEach((doc) => {
          const docData = docs[doc.id] || {};
          const status = docStatusOptions.find((o) => o.value === (docData.status || ""))?.label || "Not set";
          const note = docData.note ? " - " + docData.note : "";
          docLines.push("- " + doc.label + " [" + status + "]" + note);
        });
      });
      if (docLines.length) {
        lines.push("\nBUSINESS DOCUMENTS");
        lines.push("-------------------");
        docLines.forEach(l => lines.push(l));
      }
    }

    lines.push("\n================================");
    lines.push("incomespectrum.com");

    const text = lines.join("\n");

    navigator.clipboard.writeText(text).then(() => {
      const btn = document.getElementById("copyFounderTextBtn");
      if (btn) {
        const original = btn.textContent;
        btn.textContent = "Copied!";
        setTimeout(() => { btn.textContent = original; }, 2000);
      }
    }).catch(() => {
      alert("Could not copy. Please try again or use Export as PDF.");
    });
  }

  function exportFounderFile({ includeNotes = true, selectedDocIds = null } = {}) {
    const planDraft = appState.quizResult
      ? { ...buildPlanDraft(appState.quizResult), ...appState.planDraft }
      : appState.planDraft;
    const founderIdentity = planDraft.founderIdentity || "Founder";
    const selectedState = appState.selectedState || "";
    const goalLabel = setupGoals.find((g) => g.value === appState.goal)?.label || "Explore Options";
    const exportDate = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

    function field(val) {
      const safe = escapeHtml(val || "").replace(/\n/g, "<br>");
      return safe ? `<p class="ef-value">${safe}</p>` : `<p class="ef-empty">Not recorded.</p>`;
    }

    // Founder Notes
    const founderNotes = getFounderNotesEntries();
    const founderNotesHTML = founderNotes.length
      ? founderNotes.map((n) => `
          <div class="ef-note">
            <strong>${escapeHtml(n.subject || "Untitled")}</strong>
            <p>${escapeHtml(n.body || "").replace(/\n/g, "<br>")}</p>
          </div>`).join("")
      : `<p class="ef-empty">No notes recorded.</p>`;

    // Item notes
    const itemNotes = buildSortedNoteEntries();
    const itemNotesHTML = itemNotes.length
      ? itemNotes.map(({ note, item }) => `
          <div class="ef-note">
            <strong>${escapeHtml(item.title)}</strong>
            <p>${escapeHtml(note.text || "").replace(/\n/g, "<br>")}</p>
          </div>`).join("")
      : `<p class="ef-empty">No item notes recorded.</p>`;

    // Saved items by type
    const savedTypes = [
      { type: "income", label: "Income Opportunities" },
      { type: "training", label: "Knowledge and Training" },
      { type: "services", label: "Supportive Services" },
      { type: "official", label: "Official Resources" },
      { type: "focus", label: "Business Ideas" }
    ];
    const savedHTML = savedTypes.map(({ type, label }) => {
      const items = appState.savedIds
        .map((id) => findItem(id))
        .filter(Boolean)
        .filter((item) => detectItemType(item.id) === type);
      if (!items.length) return "";
      return `<div class="ef-group">
        <h4>${label}</h4>
        <ul>${items.map((item) => `<li>${escapeHtml(item.title)}${item.url ? ` <span class="ef-url">${escapeHtml(item.url)}</span>` : ""}</li>`).join("")}</ul>
      </div>`;
    }).filter(Boolean).join("") || `<p class="ef-empty">No saved items.</p>`;

    // Business docs - filter by selectedDocIds if provided
    const docs = appState.businessDocs || {};
    const docsHTML = selectedDocIds && selectedDocIds.length
      ? ["Foundation", "Financial", "Operations"].map((category) => {
          const items = businessDocTypes.filter((d) => d.category === category && !d.isUpload && selectedDocIds.includes(d.id));
          if (!items.length) return "";
          const rows = items.map((doc) => {
            const docData = docs[doc.id] || {};
            const statusLabel = docStatusOptions.find((o) => o.value === (docData.status || ""))?.label || "Not set";
            const note = docData.note || "";
            return `<div class="ef-doc-row">
              <span class="ef-doc-label">${escapeHtml(doc.label)}</span>
              <span class="ef-doc-status">${statusLabel}</span>
              ${note ? `<span class="ef-doc-note">${escapeHtml(note)}</span>` : ""}
            </div>`;
          }).join("");
          return `<div class="ef-group"><h4>${category}</h4>${rows}</div>`;
        }).filter(Boolean).join("")
      : "";

    // Quiz results
    const quizHTML = appState.quizResult
      ? `<div class="ef-group">
          <div class="ef-quiz-item"><strong>The Cost of Living Driving Opportunity</strong><p>${escapeHtml(appState.quizResult.costOfLivingOpportunitySummary || "")}</p></div>
          <div class="ef-quiz-item"><strong>Niche as Culture</strong><p>${escapeHtml(appState.quizResult.nicheAsCultureSummary || "")}</p></div>
        </div>`
      : `<p class="ef-empty">Find Your Focus not yet completed.</p>`;

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Founder File - ${exportDate}</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;font-size:13px;color:#1a1a1a;background:#fff;padding:32px 40px;max-width:800px;margin:0 auto}
  h1{font-size:22px;font-weight:800;margin-bottom:4px}
  h2{font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#666;border-bottom:1px solid #e5e5e5;padding-bottom:6px;margin:28px 0 12px}
  h4{font-size:12px;font-weight:700;color:#444;margin-bottom:8px;text-transform:uppercase;letter-spacing:.04em}
  p{line-height:1.6;color:#444}
  .meta{font-size:12px;color:#999;margin-bottom:28px}
  .ef-identity{display:flex;gap:16px;flex-wrap:wrap;margin-bottom:4px}
  .ef-id-item{background:#f5f5f5;border-radius:6px;padding:10px 14px;min-width:130px}
  .ef-id-item strong{display:block;font-size:10px;color:#888;text-transform:uppercase;letter-spacing:.06em;margin-bottom:3px}
  .ef-id-item span{font-size:14px;font-weight:700;color:#1a1a1a}
  .ef-value{background:#fafafa;border:1px solid #e5e5e5;border-radius:6px;padding:10px 12px;white-space:pre-wrap;min-height:32px;line-height:1.6}
  .ef-empty{color:#bbb;font-style:italic;font-size:12px}
  .ef-note{background:#fafafa;border:1px solid #e5e5e5;border-radius:6px;padding:10px 12px;margin-bottom:8px}
  .ef-note strong{display:block;margin-bottom:4px}
  .ef-group{margin-bottom:14px}
  .ef-group ul{list-style:none;padding:0}
  .ef-group ul li{padding:5px 0;border-bottom:1px solid #f0f0f0}
  .ef-url{color:#aaa;font-size:11px;margin-left:6px}
  .ef-doc-row{display:grid;grid-template-columns:1fr 110px;gap:8px;padding:6px 0;border-bottom:1px solid #f0f0f0;align-items:start}
  .ef-doc-label{font-size:13px}
  .ef-doc-status{font-size:11px;color:#666;text-align:right}
  .ef-doc-note{grid-column:1/-1;font-size:12px;color:#888;padding-left:8px;border-left:2px solid #e5e5e5;margin-top:2px}
  .ef-quiz-item{margin-bottom:10px}
  .ef-quiz-item strong{display:block;font-size:12px;font-weight:700;color:#444;margin-bottom:3px}
  @media print{
    body{padding:20px}
    h2{page-break-after:avoid}
    .ef-note,.ef-group,.ef-value{page-break-inside:avoid}
  }
</style>
</head>
<body>
  <h1>Founder File</h1>
  <p class="meta">Exported ${exportDate} from Income Spectrum App</p>

  <h2>Identity</h2>
  <div class="ef-identity">
    <div class="ef-id-item"><strong>Founder Type</strong><span>${escapeHtml(founderIdentity)}</span></div>
    <div class="ef-id-item"><strong>State</strong><span>${escapeHtml(selectedState)}</span></div>
    <div class="ef-id-item"><strong>Goal Mode</strong><span>${escapeHtml(goalLabel)}</span></div>
  </div>

  <h2>Goals</h2>
  ${field(planDraft.goals || planDraft.proof || "")}

  <h2>Next Steps</h2>
  ${field(planDraft.nextMoves || "")}

  <h2>Ideas</h2>
  ${field(planDraft.incomeIdea || "")}

  <h2>Knowledge</h2>
  ${field(planDraft.knowledge || "")}

  <h2>Support</h2>
  ${field(planDraft.support || "")}

  <h2>Official Needs</h2>
  ${field(planDraft.official || "")}

  ${includeNotes ? `<h2>Founder Notes</h2>${founderNotesHTML}<h2>Item Notes</h2>${itemNotesHTML}` : ""}

  <h2>Saved Resources</h2>
  ${savedHTML}

  ${docsHTML ? `<h2>Business Documents</h2>${docsHTML}` : ""}

  <h2>Find Your Focus Results</h2>
  ${quizHTML}
</body>
</html>`;

    const win = window.open("", "_blank");
    if (!win) {
      alert("Please allow pop-ups for this site to export your Founder File.");
      return;
    }
    win.document.write(html);
    win.document.close();
    setTimeout(() => { win.print(); }, 600);
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

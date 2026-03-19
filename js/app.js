(function () {
  const STORAGE_KEY_LOCAL = "income-spectrum-app-state-v2-local";
  const STORAGE_KEY_SESSION = "income-spectrum-app-state-v2-session";
  const sections = ["income", "training", "services", "official"];
  const sectionLabels = {
    income: "Income Options",
    training: "Education & Training",
    services: "Supportive Services",
    official: "Official Information",
    article: "Article / Resource",
    quiz: "Quiz Result"
  };
  const setupGoals = [
    { value: "explore income options", label: "Explore income options" },
    { value: "confirm an idea", label: "Confirm an idea" },
    { value: "find training", label: "Find training" },
    { value: "find support services", label: "Find support services" },
    { value: "find official information", label: "Find official information" }
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
        tags: ["local", "service-based", "skill-based", "low-cost to start", "ownership-based"],
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
        tags: ["online", "service-based", "skill-based", "low-cost to start", "recurring income"],
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
        overview: "An opportunity path tied to communication access, certification, and service-based client work for public and private settings.",
        whyChoose: "This may fit someone who wants to build an independent service rooted in communication access and specialized skill.",
        fit: "Useful for someone willing to pursue certification, state-specific requirements, and relationship-based service work.",
        tags: ["service-based", "skill-based", "local", "online", "ownership-based"],
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
        tags: ["online", "product-based", "low-cost to start", "ownership-based"],
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
        tags: ["local", "service-based", "hands-on", "recurring income", "ownership-based"],
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
        tags: ["service-based", "ownership-based", "skill-based", "online", "local"],
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
        title: "ASL Education and Interpreter Pathways",
        provider: "RID and interpreter education resources",
        format: "Program and continuing education",
        cost: "Varies",
        description: "State-based interpreter education and continuing education paths.",
        covers: "ASL learning, interpreter pathways, and formal program options.",
        fit: "Useful for someone exploring interpreter work and the training side of that path.",
        tags: ["beginner", "advanced", "online", "in-person", "full program"],
        relatedIncomeIds: ["income-asl-interpreting"]
      },
      {
        id: "training-certification-prep",
        title: "Certification Preparation",
        provider: "Professional certification resources",
        format: "Online and in-person",
        cost: "Varies",
        description: "Prep resources for certification-related pathways that support specific service roles.",
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
        examples: "Assessing an opportunity path, clarifying service structure, or mapping next actions.",
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
        title: "What People Will Pay For",
        description: "Use the six motivators, the cost of living, and cultural motivation to see where opportunity starts.",
        href: "blog/what-people-will-pay-for/"
      },
      {
        id: "article-government-contracting",
        title: "Government Contracting Resources",
        description: "An article on federal contracting basics, registrations, and why some small businesses should not write it off too early.",
        href: "blog/government-contracting-resources/"
      }
    ]
  };

  const quiz = {
    title: "What People Will Pay For",
    intro: "This is not a personality quiz. It helps you read what people pay for, choose a path on the spectrum, and generate a first-draft PBPP.",
    questions: [
      {
        id: "motivator",
        prompt: "Which motivator feels most active in the situation you are looking at?",
        options: [
          { value: "Survival and Stability", label: "Survival and Stability" },
          { value: "Safety and Protection", label: "Safety and Protection" },
          { value: "Relief and Health", label: "Relief and Health" },
          { value: "Pleasure and Comfort", label: "Pleasure and Comfort" },
          { value: "Belonging and Love", label: "Belonging and Love" },
          { value: "Status, Meaning, and Legacy", label: "Status, Meaning, and Legacy" }
        ]
      },
      {
        id: "payment",
        prompt: "What are people paying with most heavily right now?",
        options: [
          { value: "Money and Time", label: "Money and Time" },
          { value: "Energy and Attention", label: "Energy and Attention" },
          { value: "Comfort and Risk", label: "Comfort and Risk" }
        ]
      },
      {
        id: "culture",
        prompt: "Which culture pattern best fits the group you are looking at?",
        options: [
          { value: "People trying to get organized and stable", label: "People trying to get organized and stable" },
          { value: "People trying to protect what they have", label: "People trying to protect what they have" },
          { value: "People trying to reduce strain or pain", label: "People trying to reduce strain or pain" },
          { value: "People trying to make life easier or more enjoyable", label: "People trying to make life easier or more enjoyable" },
          { value: "People trying to stay connected or understood", label: "People trying to stay connected or understood" },
          { value: "People trying to advance, prove something, or leave a mark", label: "People trying to advance, prove something, or leave a mark" }
        ]
      },
      {
        id: "direction",
        prompt: "Where does the strongest business direction seem to come from?",
        options: [
          { value: "Lower the cost", label: "Lower the cost" },
          { value: "Increase the value", label: "Increase the value" },
          { value: "A mix of both", label: "A mix of both" }
        ]
      },
      {
        id: "pathway",
        prompt: "Which area of the spectrum feels closest to where you want to start?",
        options: [
          { value: "Income Options", label: "Income Options" },
          { value: "Education & Training", label: "Education & Training" },
          { value: "Supportive Services", label: "Supportive Services" },
          { value: "Official Information", label: "Official Information" }
        ]
      }
    ]
  };

  const defaultState = {
    isSignedIn: false,
    setupComplete: false,
    selectedState: "Texas",
    goal: "explore income options",
    workPreference: "both",
    activeView: "home",
    activeExploreSection: "income",
    sortMode: "default",
    savedIds: [],
    savedMeta: {},
    compareIds: [],
    notes: {},
    recentlyViewed: [],
    recentSearches: [],
    progress: {
      "just exploring": [],
      interested: [],
      comparing: [],
      launch: []
    },
    quizAnswers: {},
    quizResult: null
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
    syncGateState();
    renderAll();
    await hydrateCatalogFromSite();
    renderAll();
  }

  function bindEvents() {
    document.body.addEventListener("click", handleClick);
    const globalSearchInput = document.getElementById("globalSearchInput");
    if (globalSearchInput) globalSearchInput.addEventListener("input", renderSearchResults);
    document.getElementById("filterSelect").addEventListener("change", (event) => {
      exploreFilter = event.target.value;
      renderExplore(exploreFilter);
    });
    document.getElementById("profileState").addEventListener("change", (event) => {
      appState.selectedState = event.target.value;
      saveState();
      renderAll();
    });
  }

  function handleClick(event) {
    const actionNode = event.target.closest("[data-action]");
    if (actionNode) {
      const action = actionNode.dataset.action;
      if (action === "start-setup") {
        showGate("setup");
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
      } else if (action === "complete-setup") {
        completeSetup();
      } else if (action === "skip-setup") {
        appState.setupComplete = true;
        openApp("home");
      } else if (action === "show-view") {
        closeAllOverlays();
        showView(actionNode.dataset.view);
      } else if (action === "go-explore") {
        closeAllOverlays();
        showView("explore");
      } else if (action === "open-explore-section") {
        appState.activeExploreSection = actionNode.dataset.section;
        exploreFilter = "all";
        closeAllOverlays();
        showView("explore");
      } else if (action === "open-progress") {
        renderProgress();
        openOverlay("progressOverlay");
      } else if (action === "open-notes") {
        renderNotes();
        openOverlay("notesOverlay");
      } else if (action === "open-quiz") {
        quizIndex = 0;
        renderQuiz();
        openOverlay("quizOverlay");
      } else if (action === "close-overlay") {
        closeOverlay(actionNode.dataset.target);
      } else if (action === "open-item") {
        openDetail(actionNode.dataset.id, actionNode.dataset.type);
      } else if (action === "save-item") {
        toggleSaved(actionNode.dataset.id);
      } else if (action === "compare-item") {
        toggleCompare(actionNode.dataset.id);
      } else if (action === "remove-saved") {
        removeSaved(actionNode.dataset.id);
      } else if (action === "set-stage") {
        setStage(actionNode.dataset.id, actionNode.dataset.stage);
      } else if (action === "save-note") {
        saveNote(actionNode.dataset.id);
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
      } else if (action === "reset-app") {
        appState = structuredClone(defaultState);
        localStorage.removeItem(STORAGE_KEY_LOCAL);
        sessionStorage.removeItem(STORAGE_KEY_SESSION);
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
        saveQuizResult();
      } else if (action === "open-state-detail") {
        openStateDetail(actionNode.dataset.state || appState.selectedState);
      } else if (action === "open-all-states") {
        openAllStatesBrowser();
      } else if (action === "open-path-summary") {
        openPathSummary();
      }
      return;
    }

    const sectionTab = event.target.closest(".section-tab");
    if (sectionTab) {
      appState.activeExploreSection = sectionTab.dataset.section;
      exploreFilter = "all";
      saveState();
      renderExplore();
      return;
    }

    const bottomTab = event.target.closest(".bottom-tab");
    if (bottomTab) {
      showView(bottomTab.dataset.view);
      return;
    }

    const choicePill = event.target.closest(".choice-pill");
    if (choicePill) {
      const group = choicePill.closest(".choice-group, .pill-row");
      group.querySelectorAll(".choice-pill").forEach((pill) => pill.classList.remove("active"));
      choicePill.classList.add("active");
      if (group.id === "profileGoal") {
        appState.goal = choicePill.dataset.value;
        saveState();
      } else if (group.id === "profileWorkPref") {
        appState.workPreference = choicePill.dataset.value;
        saveState();
      }
    }

  }

  function populateStateSelects() {
    const setupSelect = document.getElementById("setupState");
    const profileSelect = document.getElementById("profileState");
    const options = allStates.map((state) => `<option value="${state}">${state}</option>`).join("");
    setupSelect.innerHTML = options;
    profileSelect.innerHTML = options;
    setupSelect.value = appState.selectedState;
    profileSelect.value = appState.selectedState;
  }

  function renderSetupChoices() {
    document.getElementById("setupGoal").innerHTML = setupGoals.map((goal) => `
      <button class="choice-pill ${goal.value === appState.goal ? "active" : ""}" type="button" data-value="${goal.value}">${goal.label}</button>
    `).join("");
    document.getElementById("setupWorkPref").innerHTML = workPreferences.map((pref) => `
      <button class="choice-pill ${pref.value === appState.workPreference ? "active" : ""}" type="button" data-value="${pref.value}">${pref.label}</button>
    `).join("");
    renderProfilePrefs();
  }

  function renderProfilePrefs() {
    document.getElementById("profileState").value = appState.selectedState;
    document.getElementById("profileGoal").innerHTML = setupGoals.map((goal) => `
      <button class="choice-pill ${goal.value === appState.goal ? "active" : ""}" type="button" data-value="${goal.value}">${goal.label}</button>
    `).join("");
    document.getElementById("profileWorkPref").innerHTML = workPreferences.map((pref) => `
      <button class="choice-pill ${pref.value === appState.workPreference ? "active" : ""}" type="button" data-value="${pref.value}">${pref.label}</button>
    `).join("");
    document.getElementById("accountStatusCopy").textContent = appState.isSignedIn
      ? "You are signed in. Your state, path, plan, notes, and saved items stay with your account."
      : "You are browsing as a guest. Your state, path, and plan only stay for this session unless you sign in.";
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

  function completeSetup() {
    appState.selectedState = document.getElementById("setupState").value;
    appState.goal = getActiveChoiceValue(document.getElementById("setupGoal")) || appState.goal;
    appState.workPreference = getActiveChoiceValue(document.getElementById("setupWorkPref")) || appState.workPreference;
    appState.setupComplete = true;
    openApp("home");
  }

  function getActiveChoiceValue(node) {
    return node.querySelector(".choice-pill.active")?.dataset.value || "";
  }

  function syncGateState() {
    if (!appState.setupComplete) {
      showGate("opening");
      document.getElementById("mainApp").classList.add("hidden");
      return;
    }
    document.querySelectorAll(".gate-screen").forEach((screen) => screen.classList.remove("active"));
    document.getElementById("mainApp").classList.remove("hidden");
  }

  function showGate(screen) {
    document.querySelectorAll(".gate-screen").forEach((node) => node.classList.remove("active"));
    document.querySelector(`[data-screen="${screen}"]`).classList.add("active");
  }

  function openApp(view) {
    appState.setupComplete = true;
    saveState();
    syncGateState();
    showView(view);
  }

  function showView(view) {
    appState.activeView = view;
    document.querySelectorAll(".view").forEach((node) => node.classList.remove("active"));
    document.querySelector(`[data-view="${view}"]`).classList.add("active");
    document.querySelectorAll(".bottom-tab").forEach((tab) => tab.classList.toggle("active", tab.dataset.view === view));
    document.getElementById("viewTitle").textContent = sectionLabels[view] || capitalize(view);
    saveState();
    renderAll();
  }

  function renderAll() {
    renderProfilePrefs();
    renderHome();
    renderExplore();
    renderSaved();
    renderCompare();
    renderProgress();
    renderNotes();
    renderSearchResults();
    renderSavedQuizResult();
  }

  function renderHome() {
    const lastViewed = appState.recentlyViewed[0] ? findItem(appState.recentlyViewed[0]) : null;
    const currentPath = buildPathSnapshot();
    const currentPlan = buildPlanSnapshot();
    document.getElementById("continueTitle").textContent = lastViewed ? `Continue with ${lastViewed.title}` : "Start building your pathway plan.";
    document.getElementById("continueCopy").textContent = lastViewed
      ? `You last opened ${lastViewed.title}. Keep shaping your path and move the right items into your PBPP.`
      : "Set your state, explore the spectrum, and build a path from what people pay for to where you want to go.";
    document.getElementById("heroStateValue").textContent = appState.selectedState;
    document.getElementById("heroPathValue").textContent = currentPath.label;
    document.getElementById("heroPlanValue").textContent = currentPlan.label;

    const nextSteps = buildNextSteps();
    document.getElementById("nextStepsList").innerHTML = nextSteps.map((step) => `<li>${step}</li>`).join("");

    const savedPreview = appState.savedIds.slice(0, 4).map((id) => renderMiniCard(findItem(id))).join("");
    document.getElementById("savedPreview").innerHTML = savedPreview || `<div class="empty-state">No saved items yet. Save anything you want to revisit later.</div>`;

    const recentMarkup = appState.recentlyViewed.slice(0, 4).map((id) => renderMiniCard(findItem(id))).join("");
    document.getElementById("recentlyViewed").innerHTML = recentMarkup || `<div class="empty-state">Recently viewed items will show up here.</div>`;
  }

  function renderExplore(filter = currentFilter()) {
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
      income: ["all", "online", "local", "both", "service-based", "product-based", "recurring income", "low-cost to start", "skill-based", "hands-on", "ownership-based"],
      training: ["all", "free", "paid", "beginner", "advanced", "online", "in-person", "certification", "short-form", "full program"],
      services: ["all", "legal", "bookkeeping", "accounting", "branding", "websites", "marketing", "operations", "advisory", "communication access", "interpreting services"],
      official: ["all", "state", "federal"]
    };
    const filters = filtersBySection[section];
    document.getElementById("filterSelect").innerHTML = filters.map((filter) => `
      <option value="${filter}" ${filter === activeFilter ? "selected" : ""}>${titleCase(filter)}</option>
    `).join("");
  }

  function renderOfficialList() {
    const selectedState = appState.selectedState;
    const stateItems = data.official.filter((item) => item.tags.includes("state") || item.coverage === selectedState);
    const federalItems = data.official.filter((item) => item.tags.includes("federal"));
    return `
      <div class="card">
        <div class="card-header">
          <div>
            <p class="section-kicker">Official Information</p>
            <h2>${selectedState}</h2>
          </div>
          <div class="inline-actions">
            <button class="app-btn app-btn--secondary" data-action="open-state-detail">Open State Detail</button>
            <button class="app-btn app-btn--ghost" data-action="show-view" data-view="profile">Change State</button>
          </div>
        </div>
        <div class="card-grid card-grid--two">
          <div class="saved-block">
            <h4>State Information</h4>
            <p>Business registration, tax, licensing, agencies, and state contracting resources.</p>
            <div class="plain-list">
              ${stateItems.map((item) => renderOfficialMini(item, selectedState)).join("")}
            </div>
          </div>
          <div class="saved-block">
            <h4>Federal Information</h4>
            <p>EIN, IRS, federal guidance, federal contracting, and related national resources.</p>
            <div class="plain-list">
              ${federalItems.map((item) => renderOfficialMini(item, selectedState)).join("")}
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
    const filters = ["all", "income", "training", "services", "official", "article", "quiz"];
    document.getElementById("savedTypeFilters").innerHTML = filters.map((filter) => `
      <button class="filter-pill ${filter === savedFilter ? "active" : ""}" data-action="filter-saved" data-filter="${filter}">${titleCase(filter)}</button>
    `).join("");

    const grouped = {};
    appState.savedIds.forEach((id) => {
      const item = findItem(id);
      if (!item) return;
      const type = detectItemType(id);
      if (savedFilter !== "all" && savedFilter !== type) return;
      grouped[type] = grouped[type] || [];
      grouped[type].push(item);
    });

    if (appState.quizResult && (savedFilter === "all" || savedFilter === "quiz")) {
      grouped.quiz = grouped.quiz || [];
      grouped.quiz.push({ ...appState.quizResult, id: "saved-quiz-result", title: appState.quizResult.planTitle || "Saved PBPP Draft" });
    }

    const markup = Object.entries(grouped).map(([type, items]) => `
      <section class="saved-block">
        <h4>${sectionLabels[type] || titleCase(type)}</h4>
        <div class="plain-list">
          ${items.map((item) => renderSavedItem(item, type)).join("")}
        </div>
      </section>
    `).join("");

    document.getElementById("savedSections").innerHTML = markup || `<div class="empty-state">Nothing saved yet. Save any option, resource, service, official page, article, or quiz result you want to come back to.</div>`;
  }

  function renderSavedItem(item, type) {
    const id = item.id;
    return `
      <div class="mini-card">
        <strong>${item.title}</strong>
        <p>${item.description || item.explanation || ""}</p>
        <div class="inline-actions inline-actions--saved">
          ${type === "quiz"
            ? `<button class="app-btn app-btn--secondary" data-action="open-quiz">Open Quiz</button>`
            : `<button class="app-btn ${openButtonClass(type)}" data-action="open-item" data-id="${id}" data-type="${type}">Open</button>`
          }
          ${type === "income" ? `<button class="utility-link ${appState.compareIds.includes(id) ? "utility-link--active" : ""}" data-action="compare-item" data-id="${id}">${appState.compareIds.includes(id) ? "Comparing" : "Compare"}</button>` : ""}
          ${type !== "quiz" ? `<button class="utility-link" data-action="open-notes">Notes</button>` : ""}
          ${type !== "quiz" ? `<button class="utility-link utility-link--danger" data-action="remove-saved" data-id="${id}">Remove</button>` : ""}
        </div>
      </div>
    `;
  }

  function renderCompare() {
    const compareSelection = document.getElementById("compareSelection");
    const compareItems = appState.compareIds.map((id) => findItem(id)).filter(Boolean);
    compareSelection.innerHTML = compareItems.length
      ? compareItems.map((item) => `
          <span class="tag">${item.title}</span>
        `).join("")
      : `<div class="empty-state">Save and compare two to four income options to see them side by side.</div>`;

    const wrap = document.getElementById("compareTableWrap");
    if (compareItems.length < 2) {
      wrap.innerHTML = "";
      return;
    }

    const rows = [
      ["Startup cost", "startupCost"],
      ["Speed to start", "speed"],
      ["Skill needed", "skill"],
      ["Online or local", "location"],
      ["Repeat income potential", "repeatIncome"],
      ["Customer interaction", "customerInteraction"],
      ["Complexity", "complexity"]
    ];

    wrap.innerHTML = `
      <table class="compare-table">
        <thead>
          <tr>
            <th>Compare by</th>
            ${compareItems.map((item) => `<th>${item.title}</th>`).join("")}
          </tr>
        </thead>
        <tbody>
          ${rows.map(([label, key]) => `
            <tr>
              <th>${label}</th>
              ${compareItems.map((item) => `<td>${item[key] || "Varies"}</td>`).join("")}
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;
  }

  function renderNotes() {
    const noteEntries = Object.entries(appState.notes);
    document.getElementById("notesList").innerHTML = noteEntries.length
      ? noteEntries.map(([id, note]) => {
          const item = findItem(id);
          if (!item) return "";
          return `
            <div class="note-card">
              <h4>${item.title}</h4>
              <p>${note}</p>
              <div class="inline-actions">
                <button class="app-btn ${openButtonClass(detectItemType(id))}" data-action="open-item" data-id="${id}" data-type="${detectItemType(id)}">Open</button>
                <button class="app-btn app-btn--ghost" data-action="delete-note" data-id="${id}">Delete Note</button>
              </div>
            </div>
          `;
        }).join("")
      : `<div class="empty-state">Notes you add to income options, training, services, and official resources will show up here.</div>`;
  }

  function renderProgress() {
    const stageOrder = ["just exploring", "interested", "comparing", "launch"];
    const plan = buildPlanSnapshot();
    const overview = appState.quizResult ? `
      <section class="progress-stage progress-stage--overview">
        <h4>${appState.quizResult.planTitle}</h4>
        <p>${plan.summary}</p>
      </section>
    ` : `
      <section class="progress-stage progress-stage--overview">
        <h4>Start your PBPP</h4>
        <p>Use the quiz to generate a first-draft personal business pathway plan, then adjust it from there.</p>
      </section>
    `;
    document.getElementById("progressStages").innerHTML = overview + stageOrder.map((stage) => {
      const ids = appState.progress[stage] || [];
      const items = ids.map((id) => findItem(id)).filter(Boolean);
      return `
        <section class="progress-stage">
          <h4>${titleCase(stage)}</h4>
          <p>${stageDescription(stage)}</p>
          ${items.length
            ? items.map((item) => `
                <div class="mini-card">
                  <strong>${item.title}</strong>
                  <div class="inline-actions">
                    <button class="app-btn ${openButtonClass(detectItemType(item.id))}" data-action="open-item" data-id="${item.id}" data-type="${detectItemType(item.id)}">Open</button>
                    ${renderStageButtons(item.id, stage)}
                  </div>
                </div>
              `).join("")
            : `<div class="empty-state">No items in this stage yet.</div>`
          }
        </section>
      `;
    }).join("");
  }

  function renderSavedQuizResult() {
    const node = document.getElementById("savedQuizResult");
    if (!appState.quizResult) {
      node.innerHTML = `<div class="empty-state">Take the quiz to generate a first-draft PBPP based on what people pay for and where you want to start on the spectrum.</div>`;
      return;
    }
    node.innerHTML = renderQuizResult(appState.quizResult, false);
  }

  async function openDetail(id, type) {
    const item = findItem(id);
    if (!item) return;
    registerViewed(id);
    const detailType = document.getElementById("detailType");
    const detailTitle = document.getElementById("detailTitle");
    const detailBody = document.getElementById("detailBody");
    detailType.textContent = sectionLabels[type] || titleCase(type);
    detailTitle.textContent = item.title;
    openOverlay("detailOverlay");
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
          <p>${item.fit || `Useful when ${item.groupTitle ? item.groupTitle.toLowerCase() : "this path"} fits what you are trying to build.`}</p>
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
        ${renderDetailActions(item.id, type)}
        ${renderNoteEditor(item.id)}
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
          <p>${item.fit || `Useful when you are building skills around ${item.groupTitle ? item.groupTitle.toLowerCase() : "this path"}.`}</p>
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
        <div class="detail-section">
          <p>${item.description || "This article is available inside the Income Spectrum resource base."}</p>
        </div>
        ${articleContent?.meta ? `<div class="detail-section"><p><strong>${articleContent.meta}</strong></p></div>` : ""}
        ${articleContent?.lead ? `<div class="detail-section"><p>${articleContent.lead}</p></div>` : ""}
        ${articleContent?.bodyHtml ? `<div class="detail-section article-live-content">${articleContent.bodyHtml}</div>` : ""}
        <div class="detail-section">
          <h3>Keep this connected</h3>
          <p>You can save this article in the app, add notes to it, and use it alongside related income options, training, services, and official information.</p>
        </div>
        ${item.href ? `<div class="detail-section"><a class="app-btn app-btn--secondary" href="${item.href}" target="_blank" rel="noopener noreferrer">Open Website Article</a></div>` : ""}
        ${renderDetailActions(item.id, type)}
        ${renderNoteEditor(item.id)}
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
    return `
      <div class="detail-section">
        <div class="inline-actions">
          <button class="app-btn app-btn--primary" data-action="save-item" data-id="${id}">${isSaved(id) ? "Saved" : "Save"}</button>
          ${type === "income" ? `<button class="app-btn app-btn--secondary" data-action="compare-item" data-id="${id}">${appState.compareIds.includes(id) ? "Comparing" : "Compare"}</button>` : ""}
          <button class="app-btn app-btn--ghost" data-action="open-notes">Open Notes</button>
          <div class="compare-actions">${renderStageButtons(id, currentStageFor(id))}</div>
        </div>
      </div>
    `;
  }

  function renderStageButtons(id, activeStage) {
    return ["just exploring", "interested", "comparing", "launch"].map((stage) => `
      <button class="progress-chip ${stage === activeStage ? "active" : ""}" data-action="set-stage" data-id="${id}" data-stage="${stage}">${titleCase(stage)}</button>
    `).join("");
  }

  function renderNoteEditor(id) {
    return `
      <div class="detail-section note-editor">
        <h3>Add Note</h3>
        <textarea id="note-${id}" placeholder="Add a note about this item...">${appState.notes[id] || ""}</textarea>
        <div class="inline-actions">
          <button class="app-btn app-btn--secondary" data-action="save-note" data-id="${id}">Save Note</button>
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
        ${quizIndex === 0 ? `<p>${quiz.intro}</p>` : ""}
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

  function renderQuizResult(result, includeSaveButton) {
    return `
      <div class="result-group">
        <h3>${result.planTitle}</h3>
        <p>${result.explanation}</p>
        <div class="detail-section">
          <h4>State</h4>
          <p>${appState.selectedState}</p>
        </div>
        <div class="detail-section">
          <h4>Path</h4>
          <p><strong>${result.pathLabel}</strong></p>
          <p>${result.pathSummary}</p>
        </div>
        <div class="detail-section">
          <h4>Plan</h4>
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
        <div class="detail-section">
          <h4>PBPP inputs: Income Options</h4>
          ${renderRelatedLinks(result.suggestedIncomeIds, "income")}
        </div>
        <div class="detail-section">
          <h4>PBPP inputs: Knowledge</h4>
          ${renderRelatedLinks(result.suggestedTrainingIds, "training")}
        </div>
        <div class="detail-section">
          <h4>PBPP inputs: Support</h4>
          ${renderRelatedLinks(result.suggestedServiceIds, "services")}
        </div>
        <div class="detail-section">
          <h4>PBPP inputs: Official Information</h4>
          ${renderRelatedLinks(result.suggestedOfficialIds, "official")}
        </div>
        ${includeSaveButton ? `<div class="inline-actions"><button class="app-btn app-btn--primary" data-action="save-quiz-result">Build PBPP</button></div>` : ""}
      </div>
    `;
  }

  function saveQuizResult() {
    appState.quizResult = buildQuizResult();
    applyQuizResultToPlan(appState.quizResult);
    appState.savedIds = unique(appState.savedIds);
    saveState();
    renderProgress();
    renderSavedQuizResult();
    renderSaved();
  }

  function openAllStatesBrowser() {
    const detailType = document.getElementById("detailType");
    const detailTitle = document.getElementById("detailTitle");
    const detailBody = document.getElementById("detailBody");

    detailType.textContent = "All States";
    detailTitle.textContent = "Browse Official Information by State";
    detailBody.innerHTML = `
      <div class="detail-section">
        <p>Your saved state is <strong>${appState.selectedState}</strong>. Opening another state here will not change your default state in the app.</p>
      </div>
      <div class="state-browser-grid">
        ${allStates.map((state) => `
          <button class="state-browser-card ${state === appState.selectedState ? "state-browser-card--current" : ""}" type="button" data-action="open-state-detail" data-state="${state}">
            <span class="state-browser-card__eyebrow">${state === appState.selectedState ? "Saved State" : "State"}</span>
            <strong>${state}</strong>
            <span class="state-browser-card__meta">Open official information</span>
          </button>
        `).join("")}
      </div>
    `;

    openOverlay("detailOverlay");
  }

  async function openStateDetail(stateName = appState.selectedState) {
    const detailType = document.getElementById("detailType");
    const detailTitle = document.getElementById("detailTitle");
    const detailBody = document.getElementById("detailBody");
    const stateItems = data.official.filter((item) => item.tags.includes("state") || item.coverage === stateName);
    const statePageItems = await loadStateSpecificOfficialItems(stateName);

    detailType.textContent = "State Detail";
    detailTitle.textContent = `${stateName} Official Business Information`;
    detailBody.innerHTML = `
      <div class="detail-section">
        <p>Official business registration, tax, licensing, agency, and state contracting links for ${stateName}.</p>
      </div>
      <div class="detail-section">
        <div class="inline-actions">
          <button class="app-btn app-btn--ghost" data-action="open-all-states">Back to All States</button>
          ${stateName !== appState.selectedState ? `<button class="app-btn app-btn--ghost" data-action="open-state-detail" data-state="${appState.selectedState}">Open Saved State</button>` : ""}
        </div>
      </div>
      ${stateItems.map((item) => `
        <div class="detail-section">
          <h3>${item.title}</h3>
          <ul class="detail-links">
            ${resolveOfficialLinks(item, stateName).map((link) => `<li><a href="${link.href}" target="_blank" rel="noopener noreferrer">${link.label}</a></li>`).join("") || "<li>No direct links for this state in the current seed data.</li>"}
          </ul>
          <div class="inline-actions">
            <button class="app-btn app-btn--ghost" data-action="save-item" data-id="${item.id}">${isSaved(item.id) ? "Saved" : "Save"}</button>
          </div>
        </div>
      `).join("")}
      ${statePageItems.length ? `
        <div class="detail-section">
          <h3>From the ${stateName} state page</h3>
          <ul class="detail-links">
            ${statePageItems.map((item) => `<li><a href="${item.externalHref}" target="_blank" rel="noopener noreferrer">${item.title}</a> ${item.description ? `- ${item.description}` : ""}</li>`).join("")}
          </ul>
        </div>
      ` : ""}
    `;

    openOverlay("detailOverlay");
  }

  function buildQuizResult() {
    const motivator = appState.quizAnswers.motivator || "Survival and Stability";
    const payment = appState.quizAnswers.payment || "Money and Time";
    const culture = appState.quizAnswers.culture || "People trying to get organized and stable";
    const direction = appState.quizAnswers.direction || "Lower the cost";
    const pathway = appState.quizAnswers.pathway || "Income Options";

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
    const sectionMap = {
      "Income Options": "income",
      "Education & Training": "training",
      "Supportive Services": "services",
      "Official Information": "official"
    };
    const directionText = direction === "A mix of both"
      ? "The best opening may come from lowering cost in one area while increasing value in another."
      : direction === "Lower the cost"
        ? "Look for ways to reduce what this group is spending in time, energy, attention, comfort, or risk."
        : "Look for ways to make the result more valuable inside the culture you are looking at.";
    const pathLabel = `${pathway} path`;
    const planTitle = `${pathway} PBPP`;
    return {
      id: "quiz-result",
      title: result.title,
      planTitle,
      explanation: `The strongest pattern here is ${motivator}. People are not just paying money. They are paying with ${payment.toLowerCase()}, and the culture pattern suggests ${culture.toLowerCase()}. This points toward ${pathway.toLowerCase()} as a strong place to start building your PBPP.`,
      motivator,
      payment,
      culture,
      pathway,
      primarySection: sectionMap[pathway],
      pathLabel,
      pathSummary: `Start in ${pathway.toLowerCase()} and build around ${motivator.toLowerCase()}, ${payment.toLowerCase()}, and the shared pressure inside this culture.`,
      planSummary: `Use ${pathway.toLowerCase()} as your entry point, then connect the training, support, and official pieces that help you move from your current position to a workable business direction.`,
      direction: directionText,
      suggestedIncomeIds: result.income,
      suggestedTrainingIds: result.training,
      suggestedServiceIds: result.services,
      suggestedOfficialIds: result.official
    };
  }

  function buildPathSnapshot() {
    if (!appState.quizResult) {
      return {
        label: "Choose a direction",
        summary: "Use the quiz to identify the area of the spectrum you want to start in.",
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
    const totalPlanned = Object.values(appState.progress).reduce((count, ids) => count + ids.length, 0);
    if (!appState.quizResult) {
      return {
        label: "Start your PBPP",
        summary: "Take the quiz to generate a first-draft personal business pathway plan."
      };
    }
    return {
      label: totalPlanned ? `${totalPlanned} items in plan` : "Draft ready",
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

    detailType.textContent = "Path";
    detailTitle.textContent = "Current Path";
    detailBody.innerHTML = `
      <div class="detail-section">
        <p>${path.summary}</p>
      </div>
      <div class="detail-section">
        <h3>Where this path starts</h3>
        <p>${appState.quizResult ? `Your current PBPP starts in ${appState.quizResult.pathway} and uses the What People Will Pay For framework as its base.` : "Take the quiz or explore the four categories to choose where you want to start on the spectrum."}</p>
      </div>
      <div class="detail-section">
        <div class="inline-actions">
          <button class="app-btn app-btn--secondary" data-action="open-quiz">Open Quiz</button>
          <button class="app-btn app-btn--ghost" data-action="go-explore">Open Explore</button>
        </div>
      </div>
    `;
    openOverlay("detailOverlay");
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
          <button class="app-btn app-btn--ghost" data-action="save-item" data-id="${item.id}">${isSaved(item.id) ? "Saved" : "Save"}</button>
          ${type === "income" ? `<button class="app-btn app-btn--ghost" data-action="compare-item" data-id="${item.id}">${appState.compareIds.includes(item.id) ? "Comparing" : "Compare"}</button>` : ""}
        </div>
      </article>
    `;
  }

  function renderMiniCard(item) {
    if (!item) return "";
    return `
      <div class="mini-card">
        <strong>${item.title}</strong>
        <p>${item.description || item.explanation || ""}</p>
        <div class="inline-actions">
          <button class="app-btn ${openButtonClass(detectItemType(item.id))}" data-action="open-item" data-id="${item.id}" data-type="${detectItemType(item.id)}">Open</button>
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
    const path = buildPathSnapshot();
    const steps = [];
    if (!appState.quizResult) {
      steps.push("Take the quiz to turn what people pay for into a first-draft PBPP.");
    }
    if (!appState.savedIds.length) {
      steps.push("Save the items that belong in your path so they can be used in your PBPP.");
    }
    if (!Object.keys(appState.notes).length) {
      steps.push("Add a note to one saved item so your plan reflects what matters to you.");
    }
    if (path.primarySection === "income" && appState.compareIds.length < 2) {
      steps.push("Compare at least two income options so your path is based on a real choice, not a guess.");
    }
    steps.push(`Use ${appState.selectedState} official information to anchor your plan in the rules that apply where you are.`);
    return steps.slice(0, 4);
  }

  function matchesFilter(item, filter) {
    if (!filter || filter === "all") return true;
    if (filter === "both") return item.location === "Both" || (item.tags || []).includes("both");
    return (item.tags || []).includes(filter) || item.category === filter;
  }

  function currentFilter() {
    return document.getElementById("filterSelect")?.value || exploreFilter || "all";
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

  function toggleCompare(id) {
    if (appState.compareIds.includes(id)) {
      appState.compareIds = appState.compareIds.filter((itemId) => itemId !== id);
    } else if (appState.compareIds.length < 4) {
      appState.compareIds.push(id);
      if (!isSaved(id)) {
        appState.savedIds.unshift(id);
      }
    }
    saveState();
    renderAll();
  }

  function saveNote(id) {
    const input = document.getElementById(`note-${id}`);
    if (!input) return;
    const value = input.value.trim();
    if (!value) {
      delete appState.notes[id];
    } else {
      appState.notes[id] = value;
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
      if (sessionRaw) return { ...structuredClone(defaultState), ...JSON.parse(sessionRaw) };
      return structuredClone(defaultState);
    } catch (error) {
      return structuredClone(defaultState);
    }
  }

  function openOverlay(id) {
    document.getElementById(id).classList.remove("hidden");
  }

  function closeOverlay(id) {
    document.getElementById(id).classList.add("hidden");
  }

  function closeAllOverlays() {
    document.querySelectorAll(".overlay").forEach((node) => node.classList.add("hidden"));
  }

  function renderTag(tag) {
    return `<span class="tag">${titleCase(tag)}</span>`;
  }

  function titleCase(value) {
    return value.replace(/\b\w/g, (char) => char.toUpperCase());
  }

  function capitalize(value) {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  function unique(values) {
    return [...new Set(values)];
  }

  function stageDescription(stage) {
    if (stage === "just exploring") return "The starting point for the path you are building.";
    if (stage === "interested") return "Items that support or strengthen the path.";
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

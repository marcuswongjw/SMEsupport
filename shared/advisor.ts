export const schemeIds = ["PSG", "EDG", "MRA", "SFEC", "WDG", "NAIIP"] as const;

export type SchemeId = (typeof schemeIds)[number];
export type StackName =
  | "Digital Foundation"
  | "Innovation Acceleration"
  | "Workforce Activation";
export type Sector =
  | "retail"
  | "manufacturing"
  | "professional-services"
  | "fnb"
  | "other";
export type Challenge =
  | "manual-work"
  | "digital-customer"
  | "process-redesign"
  | "workforce"
  | "overseas-growth"
  | "ai-adoption"
  | "cost-pressure";
export type YesNoUnsure = "yes" | "no" | "unsure";
export type MraMarketStatus =
  | "new-and-under-100k"
  | "not-new-or-over-100k"
  | "unsure";
export type MraActivity =
  | "promotion"
  | "business-development"
  | "market-set-up"
  | "unsure";
export type MraTiming = "within-six-months" | "more-than-six-months" | "unsure";
export type EligibilityStatus = "eligible" | "conditional" | "not-eligible";

export const officialDataAsOf = "30 August 2026";
export const edgeTransitionNotice =
  "EnterpriseSG states that PSG, EDG and MRA remain available only until the EDGE grant launches in 2H 2026. Check the live official scheme page before acting.";

const schemeChallenges: readonly Challenge[] = [
  "manual-work",
  "digital-customer",
  "process-redesign",
  "workforce",
  "overseas-growth",
  "ai-adoption",
  "cost-pressure",
];

export type DiagnosticProfile = {
  challenges: Challenge[];
  sector: Sector;
  companySize: "micro" | "small" | "medium" | "growth";
  annualRevenue: "under-1m" | "1m-10m" | "10m-100m" | "over-100m";
  groupEmployeeCount: number;
  registeredInSingapore: YesNoUnsure;
  localShareholding: YesNoUnsure;
  projectStarted: YesNoUnsure;
  edgFinancialReadiness: YesNoUnsure;
  mraMarketStatus: MraMarketStatus;
  mraActivity: MraActivity;
  mraTiming: MraTiming;
  sfecNotification: YesNoUnsure;
  sfecTotalCreditAvailable: number;
  sfecEnterpriseCreditAvailable: number;
  primaryGoal: "productivity" | "growth" | "workforce" | "market" | "ai";
};

export type Scheme = {
  id: SchemeId;
  name: string;
  stack: StackName;
  colour: "navy" | "coral" | "teal" | "gold";
  plainEnglish: string;
  funding: string;
  bestFor: string;
  eligibility: string[];
  officialUrl: string;
  officialLabel: string;
  compliance: string[];
  caveat: string;
};

export type SchemeAssessment = {
  status: EligibilityStatus;
  reasons: string[];
  supportRate?: number;
};

export type Recommendation = Scheme & {
  fit: "Strong fit" | "Potential fit" | "Capability pathway";
  rationale: string;
  assessment: SchemeAssessment;
};

const sectors: readonly Sector[] = [
  "retail",
  "manufacturing",
  "professional-services",
  "fnb",
  "other",
];
const companySizes: readonly DiagnosticProfile["companySize"][] = [
  "micro",
  "small",
  "medium",
  "growth",
];
const revenueBands: readonly DiagnosticProfile["annualRevenue"][] = [
  "under-1m",
  "1m-10m",
  "10m-100m",
  "over-100m",
];
const yesNoUnsure: readonly YesNoUnsure[] = ["yes", "no", "unsure"];
const mraMarketStatuses: readonly MraMarketStatus[] = [
  "new-and-under-100k",
  "not-new-or-over-100k",
  "unsure",
];
const mraActivities: readonly MraActivity[] = [
  "promotion",
  "business-development",
  "market-set-up",
  "unsure",
];
const mraTimings: readonly MraTiming[] = [
  "within-six-months",
  "more-than-six-months",
  "unsure",
];
const primaryGoals: readonly DiagnosticProfile["primaryGoal"][] = [
  "productivity",
  "growth",
  "workforce",
  "market",
  "ai",
];

function includesValue<T extends string>(
  values: readonly T[],
  value: unknown
): value is T {
  return typeof value === "string" && values.includes(value as T);
}

function finiteCurrency(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0
    ? Math.floor(value)
    : fallback;
}

/** Restores only known, safe browser-session values. It also migrates the old employeeCount field. */
export function sanitizeDiagnosticProfile(
  value: unknown,
  fallback: DiagnosticProfile
): DiagnosticProfile {
  if (!value || typeof value !== "object") return fallback;
  const candidate = value as Record<string, unknown>;
  const challenges = Array.isArray(candidate.challenges)
    ? candidate.challenges.filter((item): item is Challenge =>
        includesValue(schemeChallenges, item)
      )
    : fallback.challenges;
  const legacyEmployeeCount =
    candidate.groupEmployeeCount ?? candidate.employeeCount;

  return {
    challenges,
    sector: includesValue(sectors, candidate.sector)
      ? candidate.sector
      : fallback.sector,
    companySize: includesValue(companySizes, candidate.companySize)
      ? candidate.companySize
      : fallback.companySize,
    annualRevenue: includesValue(revenueBands, candidate.annualRevenue)
      ? candidate.annualRevenue
      : fallback.annualRevenue,
    groupEmployeeCount: finiteCurrency(
      legacyEmployeeCount,
      fallback.groupEmployeeCount
    ),
    registeredInSingapore: includesValue(
      yesNoUnsure,
      candidate.registeredInSingapore
    )
      ? candidate.registeredInSingapore
      : fallback.registeredInSingapore,
    localShareholding: includesValue(yesNoUnsure, candidate.localShareholding)
      ? candidate.localShareholding
      : fallback.localShareholding,
    projectStarted: includesValue(yesNoUnsure, candidate.projectStarted)
      ? candidate.projectStarted
      : fallback.projectStarted,
    edgFinancialReadiness: includesValue(
      yesNoUnsure,
      candidate.edgFinancialReadiness
    )
      ? candidate.edgFinancialReadiness
      : fallback.edgFinancialReadiness,
    mraMarketStatus: includesValue(mraMarketStatuses, candidate.mraMarketStatus)
      ? candidate.mraMarketStatus
      : fallback.mraMarketStatus,
    mraActivity: includesValue(mraActivities, candidate.mraActivity)
      ? candidate.mraActivity
      : fallback.mraActivity,
    mraTiming: includesValue(mraTimings, candidate.mraTiming)
      ? candidate.mraTiming
      : fallback.mraTiming,
    sfecNotification: includesValue(yesNoUnsure, candidate.sfecNotification)
      ? candidate.sfecNotification
      : fallback.sfecNotification,
    sfecTotalCreditAvailable: finiteCurrency(
      candidate.sfecTotalCreditAvailable,
      fallback.sfecTotalCreditAvailable
    ),
    sfecEnterpriseCreditAvailable: finiteCurrency(
      candidate.sfecEnterpriseCreditAvailable,
      fallback.sfecEnterpriseCreditAvailable
    ),
    primaryGoal: includesValue(primaryGoals, candidate.primaryGoal)
      ? candidate.primaryGoal
      : fallback.primaryGoal,
  };
}

export const stackMeta: Record<
  StackName,
  { description: string; eyebrow: string; colour: string }
> = {
  "Digital Foundation": {
    eyebrow: "STACK 01",
    description:
      "The systems, data and digital tools that make better operations possible.",
    colour: "#0b2947",
  },
  "Innovation Acceleration": {
    eyebrow: "STACK 02",
    description:
      "The operating-model, product, process or market change that creates new value.",
    colour: "#bd4a46",
  },
  "Workforce Activation": {
    eyebrow: "STACK 03",
    description:
      "The roles, skills and work practices that make transformation stick.",
    colour: "#127b77",
  },
};

export const schemes: Record<SchemeId, Scheme> = {
  PSG: {
    id: "PSG",
    name: "Productivity Solutions Grant",
    stack: "Digital Foundation",
    colour: "navy",
    plainEnglish:
      "PSG can support the actual purchase, lease or hire cost of an eligible pre-approved IT solution or equipment package used in Singapore.",
    funding:
      "Up to 50% of eligible costs for local SMEs, subject to the actual approved package and the company’s remaining S$30,000 EnterpriseSG annual PSG cap.",
    bestFor:
      "Pre-scoped and pre-approved productivity solutions or qualifying equipment; not a customised transformation project.",
    eligibility: [
      "Registered or incorporated in Singapore, with at least 30% local shareholding.",
      "Group annual sales turnover of no more than S$100 million OR group employment of no more than 200 workers.",
      "The application is submitted before any supplier/vendor payment or deposit, and the package is used in Singapore.",
    ],
    officialUrl:
      "https://www.enterprisesg.gov.sg/resources/all-faqs/productivity-solutions-grant",
    officialLabel: "EnterpriseSG — PSG FAQ",
    compliance: [
      "Confirm the solution is a pre-approved package or that equipment meets the published specifications; delivery and installation charges are generally excluded unless stated otherwise.",
      "Do not sign a contract or make a payment or deposit before the PSG application is submitted.",
      "The S$30,000 EnterpriseSG cap is annual (1 April to 31 March), not an automatic per-project amount.",
    ],
    caveat:
      "The official list, package cost caps, eligibility and approval conditions must be checked on the live EnterpriseSG and GoBusiness pages.",
  },
  EDG: {
    id: "EDG",
    name: "Enterprise Development Grant",
    stack: "Innovation Acceleration",
    colour: "coral",
    plainEnglish:
      "EDG can support a defined transformation project with a proposal, measurable outcomes and qualifying costs; it is not an automatic subsidy for general business spending.",
    funding:
      "Up to 50% of qualifying costs for SMEs and up to 30% for non-SMEs, subject to EnterpriseSG’s assessment and applicable project-category conditions.",
    bestFor:
      "A scoped Core Capabilities, Innovation & Productivity, or Market Access project that can evidence a business plan and outcomes.",
    eligibility: [
      "Registered and operating in Singapore, with at least 30% local shareholding.",
      "Financially viable to start and complete the project; EnterpriseSG assesses group revenue and employment size.",
      "The project has not already commenced and has a suitable proposal, quotation and required supporting information.",
    ],
    officialUrl:
      "https://www.enterprisesg.gov.sg/resources/all-faqs/enterprise-development-grant",
    officialLabel: "EnterpriseSG — EDG FAQ",
    compliance: [
      "Projects that have already commenced are not supported. Verify the relevant project-category conditions before acting.",
      "For management-consultancy projects, use consultants holding the required SAC-accredited certification.",
      "Budget for the project and keep the proposal, quotations, financial information, payment records and outcome evidence required by the Letter of Offer.",
    ],
    caveat:
      "The support rate, qualifying costs, provider requirements and final grant amount are determined through the live application and assessment process.",
  },
  MRA: {
    id: "MRA",
    name: "Market Readiness Assistance",
    stack: "Innovation Acceleration",
    colour: "coral",
    plainEnglish:
      "MRA can support one defined market-promotion, business-development or market-set-up activity for a qualifying new overseas market.",
    funding:
      "Up to 70% of eligible costs for local SMEs. Caps per company per new market are S$20,000 for promotion, S$50,000 for business development and S$30,000 for market set-up, subject to the overall S$100,000 cap.",
    bestFor:
      "A single, specific activity in a new overseas market, with a vendor, timeline and market-entry rationale.",
    eligibility: [
      "Registered and operating in Singapore, with at least 30% local equity and the SME group turnover/employment threshold.",
      "The target market is new: annual sales there did not exceed S$100,000 in any of the preceding three years.",
      "One activity in one overseas market per application, submitted no more than six months before the project starts.",
    ],
    officialUrl:
      "https://www.enterprisesg.gov.sg/financial-support/market-readiness-assistance-grant",
    officialLabel: "EnterpriseSG — Market Readiness Assistance Grant",
    compliance: [
      "Do not begin the project, sign a consultant/vendor contract or make payment before the MRA application is submitted.",
      "Calculate activity costs against the applicable pillar cap; a generic market-cost total is not an MRA entitlement.",
      "MRA claims are subject to audit. Keep the approved scope, evidence of payment, deliverables and required audit records.",
    ],
    caveat:
      "Eligibility also depends on live activity rules, target-market history, documents and EnterpriseSG assessment. This tool does not validate commercial demand.",
  },
  SFEC: {
    id: "SFEC",
    name: "SkillsFuture Enterprise Credit",
    stack: "Workforce Activation",
    colour: "teal",
    plainEnglish:
      "SFEC is a credit for employers that have been notified as eligible; it can offset eligible out-of-pocket costs only after the underlying programme or course is confirmed supportable.",
    funding:
      "The current SFEC is a S$10,000 credit that can offset up to 90% of eligible out-of-pocket costs. Enterprise-transformation use is limited to S$7,000 of the credit.",
    bestFor:
      "Confirmed eligible workforce transformation, skills-framework courses, or supportable enterprise-transformation programmes where an actual wallet balance is available.",
    eligibility: [
      "The employer has been notified as eligible and can see an available credit balance through the relevant official service.",
      "The underlying programme or course is specifically SFEC-supportable.",
      "Current unused credit expires on 30 November 2026; redesigned-SFEC details and eligibility must be confirmed for use from 1 December 2026.",
    ],
    officialUrl:
      "https://skillsfuture.gobusiness.gov.sg/support-and-programmes/funding/skillsfuture-enterprise-credit-sfec",
    officialLabel: "SkillsFuture for Business — SFEC",
    compliance: [
      "Do not infer SFEC eligibility from headcount or a workforce need; eligible current employers have been notified.",
      "Use the actual available wallet balance and the relevant programme/course route. The tool includes no SFEC amount until both are confirmed.",
      "Current unused credit expires on 30 November 2026. Confirm the redesigned-SFEC rules before planning around any new credit.",
    ],
    caveat:
      "A live official balance and confirmed supportability are required before any SFEC scenario can be included in this tool’s estimate.",
  },
  WDG: {
    id: "WDG",
    name: "SkillsFuture Workforce Development Grant",
    stack: "Workforce Activation",
    colour: "teal",
    plainEnglish:
      "WDG (Job Redesign+) is a workforce-transformation route covering areas such as workforce consultancy, capability building and workforce technology solutions.",
    funding:
      "WDG is being rolled out in phases in 2026. Confirm the current live WDG (Job Redesign+) route, conditions and project support before budgeting.",
    bestFor:
      "A transformation case that identifies affected roles, work redesign, capability requirements and adoption outcomes.",
    eligibility: [
      "The live WDG (Job Redesign+) route is available and applicable to the planned project.",
      "The project identifies the affected roles, intended work redesign, capability plan and measurable workforce outcomes.",
      "Current provider, application and evidence conditions are confirmed through the official route before any commitment.",
    ],
    officialUrl:
      "https://skillsfuture.gobusiness.gov.sg/support-and-programmes/funding/workforce-development-grant",
    officialLabel: "SkillsFuture for Business — Workforce Development Grant",
    compliance: [
      "WDG is being rolled out progressively. Verify the live Job Redesign+ route rather than relying on a generic estimate.",
      "Document the before-and-after work design and link capability building to the business and technology change.",
    ],
    caveat:
      "No WDG cash amount is included in this calculator until the live programme terms and project route are verified.",
  },
  NAIIP: {
    id: "NAIIP",
    name: "National AI Impact Programme",
    stack: "Workforce Activation",
    colour: "gold",
    plainEnglish:
      "NAIIP is a national AI-adoption and AI-fluency pathway, including initiatives to help enterprises and workers apply AI to practical workflows responsibly.",
    funding:
      "The official NAIIP factsheet does not state a universal cash grant amount. It describes routes such as DLAB, pre-approved AI solutions supported through PSG, and TeSA AI-fluency initiatives.",
    bestFor:
      "Developing a practical, responsible AI use case linked to a role, workflow and adoption measure.",
    eligibility: [
      "Route, partner, training and application details must be confirmed through the official programme information.",
      "For PSG-backed AI solutions, the separate PSG eligibility, pre-approved package and application requirements apply.",
      "Six months of premium AI-tool access is described separately for Singaporeans enrolling in selected SkillsFuture AI courses; it is not a general NAIIP business entitlement.",
    ],
    officialUrl:
      "https://www.imda.gov.sg/resources/press-releases-factsheets-and-speeches/factsheets/2026/national-ai-impact-programme",
    officialLabel: "IMDA — National AI Impact Programme factsheet",
    compliance: [
      "Do not budget for a specific AI tool or course benefit until the selected official route confirms it.",
      "Build responsible-use, data-handling and human-review controls into the workflow, not only an experimentation plan.",
    ],
    caveat:
      "Programme and route details are evolving. This is a capability pathway, not a funding entitlement or cash calculation.",
  },
};

export const sectorPathways: Record<
  Sector,
  { label: string; focus: string; examples: string[]; idpUrl: string }
> = {
  retail: {
    label: "Retail",
    focus:
      "Connect stock, sales channels and customer follow-up before scaling analytics or regional growth.",
    examples: [
      "Inventory accuracy and fulfilment",
      "Omnichannel customer journeys",
      "Store-manager decision routines",
    ],
    idpUrl:
      "https://www.imda.gov.sg/how-we-can-help/smes-go-digital/industry-digital-plans",
  },
  manufacturing: {
    label: "Manufacturing",
    focus:
      "Start with visibility into quality, planning and shop-floor work, then redesign technician and supervisor roles.",
    examples: [
      "Quality and rework reduction",
      "Production planning visibility",
      "Technician capability and job redesign",
    ],
    idpUrl:
      "https://www.imda.gov.sg/how-we-can-help/smes-go-digital/industry-digital-plans",
  },
  "professional-services": {
    label: "Professional Services",
    focus:
      "Standardise knowledge work and client delivery while protecting professional judgement and data governance.",
    examples: [
      "Workflow automation",
      "Client delivery and CRM",
      "AI-enabled knowledge work",
    ],
    idpUrl:
      "https://www.imda.gov.sg/how-we-can-help/smes-go-digital/industry-digital-plans",
  },
  fnb: {
    label: "F&B",
    focus:
      "Improve demand, outlet operations and workforce consistency before expanding formats or locations.",
    examples: [
      "Demand and inventory discipline",
      "Outlet productivity",
      "Frontline role redesign",
    ],
    idpUrl:
      "https://www.imda.gov.sg/how-we-can-help/smes-go-digital/industry-digital-plans",
  },
  other: {
    label: "Your sector",
    focus:
      "Use a clear business baseline, then find the relevant IMDA Industry Digital Plan and support route.",
    examples: ["Process clarity", "Digital adoption", "Workforce capability"],
    idpUrl:
      "https://www.imda.gov.sg/how-we-can-help/smes-go-digital/industry-digital-plans",
  },
};

const has = (profile: DiagnosticProfile, challenge: Challenge) =>
  profile.challenges.includes(challenge);

function classify(
  checks: Array<{ value: YesNoUnsure | boolean; reason: string }>
): SchemeAssessment {
  const failed = checks
    .filter(check => check.value === "no" || check.value === false)
    .map(check => check.reason);
  if (failed.length) return { status: "not-eligible", reasons: failed };
  const unresolved = checks
    .filter(check => check.value === "unsure")
    .map(check => check.reason);
  return unresolved.length
    ? { status: "conditional", reasons: unresolved }
    : { status: "eligible", reasons: [] };
}

function getSmeStatus(profile: DiagnosticProfile): YesNoUnsure {
  if (profile.annualRevenue !== "over-100m") return "yes";
  if (profile.groupEmployeeCount === 0) return "unsure";
  return profile.groupEmployeeCount <= 200 ? "yes" : "no";
}

/** Evaluates only facts expressly captured by the diagnostic; it never substitutes for official approval. */
export function getSchemeAssessments(
  profile: DiagnosticProfile
): Record<SchemeId, SchemeAssessment> {
  const singaporeCheck = {
    value: profile.registeredInSingapore,
    reason:
      "Confirm that the applicant is registered and operating in Singapore.",
  };
  const localOwnershipCheck = {
    value: profile.localShareholding,
    reason:
      "Confirm at least 30% local shareholding held directly or indirectly by Singaporean(s) and/or Singapore PR(s).",
  };
  const smeCheck = {
    value: getSmeStatus(profile),
    reason:
      "Confirm the group employment size or that the stated group turnover and employment size meet the local-SME threshold for this scheme.",
  };
  const noCommitmentCheck: { value: YesNoUnsure | boolean; reason: string } = {
    value:
      profile.projectStarted === "yes"
        ? false
        : profile.projectStarted === "no"
          ? "yes"
          : "unsure",
    reason:
      "The stated commitment or project-start status may make a retrospective application ineligible; verify the live scheme rule.",
  };

  const psg = classify([
    singaporeCheck,
    localOwnershipCheck,
    smeCheck,
    noCommitmentCheck,
  ]);
  const edg = classify([
    singaporeCheck,
    localOwnershipCheck,
    {
      value: profile.edgFinancialReadiness,
      reason:
        "Confirm the business is financially viable to start and complete the EDG project.",
    },
    noCommitmentCheck,
  ]);
  edg.supportRate = getSmeStatus(profile) === "yes" ? 0.5 : 0.3;
  const mra = classify([
    singaporeCheck,
    localOwnershipCheck,
    smeCheck,
    noCommitmentCheck,
    {
      value:
        profile.mraMarketStatus === "not-new-or-over-100k"
          ? false
          : profile.mraMarketStatus === "new-and-under-100k"
            ? "yes"
            : "unsure",
      reason:
        "Confirm the target market is new and that annual sales there did not exceed S$100,000 in any of the preceding three years.",
    },
    {
      value: profile.mraActivity === "unsure" ? "unsure" : "yes",
      reason:
        "Select one MRA activity: promotion, business development or market set-up.",
    },
    {
      value:
        profile.mraTiming === "more-than-six-months"
          ? false
          : profile.mraTiming === "within-six-months"
            ? "yes"
            : "unsure",
      reason:
        "MRA applications should be submitted no more than six months before the project start date.",
    },
  ]);
  mra.supportRate = 0.7;
  const sfec = classify([
    {
      value: profile.sfecNotification,
      reason: "Confirm the employer has been notified as eligible for SFEC.",
    },
    {
      value: profile.sfecTotalCreditAvailable > 0 ? "yes" : "unsure",
      reason:
        "Confirm a positive current SFEC wallet balance before including any SFEC support in the scenario.",
    },
  ]);
  const wdg: SchemeAssessment = {
    status: "conditional",
    reasons: [
      "WDG is being rolled out in phases in 2026. Confirm the live Job Redesign+ route, terms and availability before budgeting.",
    ],
  };
  const naiip: SchemeAssessment = {
    status: "conditional",
    reasons: [
      "NAIIP route, partner and application details must be confirmed through the live official programme information.",
    ],
  };
  return { PSG: psg, EDG: edg, MRA: mra, SFEC: sfec, WDG: wdg, NAIIP: naiip };
}

function buildRationale(profile: DiagnosticProfile, id: SchemeId): string {
  const sector = sectorPathways[profile.sector].label.toLowerCase();
  if (id === "PSG")
    return `Your focus on ${has(profile, "manual-work") ? "manual work" : "digital customer and operating tools"} may suit a pre-approved productivity solution for a ${sector} business, subject to package and eligibility checks.`;
  if (id === "EDG")
    return "Your needs extend beyond a single tool: a scoped project proposal may connect process change, business outcomes, workforce impact and implementation capability.";
  if (id === "MRA")
    return "Your stated overseas-growth goal may justify one defined new-market activity once the market history, activity, vendor, timing and commercial case are verified.";
  if (id === "SFEC")
    return "Your transformation may involve eligible residual programme or course costs, but an actual SFEC notification, wallet balance and supportable underlying route must be confirmed.";
  if (id === "WDG")
    return "Your workforce and operating goals suggest that job redesign and capability building should be planned alongside the business or technology change.";
  return "Your AI ambition is stronger when it is tied to a real workflow, responsible-use controls, human review and a confirmed official capability route.";
}

function isRelevant(profile: DiagnosticProfile, id: SchemeId): boolean {
  if (id === "PSG")
    return (
      has(profile, "manual-work") ||
      has(profile, "digital-customer") ||
      has(profile, "cost-pressure") ||
      has(profile, "ai-adoption")
    );
  if (id === "EDG")
    return (
      has(profile, "process-redesign") ||
      has(profile, "cost-pressure") ||
      profile.primaryGoal === "growth"
    );
  if (id === "MRA")
    return has(profile, "overseas-growth") || profile.primaryGoal === "market";
  if (id === "SFEC")
    return (
      has(profile, "workforce") ||
      has(profile, "ai-adoption") ||
      profile.primaryGoal === "workforce" ||
      profile.primaryGoal === "ai"
    );
  if (id === "WDG")
    return (
      has(profile, "workforce") ||
      has(profile, "process-redesign") ||
      profile.primaryGoal === "workforce"
    );
  return has(profile, "ai-adoption") || profile.primaryGoal === "ai";
}

export function getRecommendations(
  profile: DiagnosticProfile
): Recommendation[] {
  const assessments = getSchemeAssessments(profile);
  const order: SchemeId[] = ["PSG", "EDG", "MRA", "SFEC", "WDG", "NAIIP"];
  return order
    .filter(
      id => isRelevant(profile, id) && assessments[id].status !== "not-eligible"
    )
    .map(id => {
      const assessment = assessments[id];
      return {
        ...schemes[id],
        assessment,
        fit:
          id === "NAIIP" || id === "WDG"
            ? "Capability pathway"
            : assessment.status === "eligible"
              ? "Strong fit"
              : "Potential fit",
        rationale: buildRationale(profile, id),
      };
    });
}

export type CostInputs = {
  digital: number;
  transformation: number;
  market: number;
  workforce: number;
};
export type SfecEligiblePools = {
  digital: boolean;
  transformation: boolean;
  market: boolean;
  workforce: boolean;
};
export type SupportConfirmations = {
  psgQualifyingCostConfirmed: boolean;
  psgRemainingAnnualCap: number;
  edgQualifyingCostConfirmed: boolean;
  mraQualifyingCostConfirmed: boolean;
  mraPillarCapAvailable: boolean;
};
export type CalculatorRowStatus =
  | "included"
  | "requires-verification"
  | "not-applicable";
export type CostResult = {
  label: string;
  gross: number;
  support: number;
  net: number;
  status: CalculatorRowStatus;
  notes: string[];
};

const mraPillarCaps: Record<Exclude<MraActivity, "unsure">, number> = {
  promotion: 20000,
  "business-development": 50000,
  "market-set-up": 30000,
};

function getRowStatus(
  assessment: SchemeAssessment,
  costConfirmed: boolean
): { status: CalculatorRowStatus; notes: string[] } {
  if (assessment.status === "not-eligible")
    return { status: "not-applicable", notes: assessment.reasons };
  if (assessment.status === "conditional")
    return { status: "requires-verification", notes: assessment.reasons };
  if (!costConfirmed)
    return {
      status: "requires-verification",
      notes: [
        "Confirm that this amount consists only of qualifying costs under the live official programme route.",
      ],
    };
  return { status: "included", notes: [] };
}

export function calculateIndicativeSupport(
  input: CostInputs,
  profile: DiagnosticProfile,
  sfecEligible: SfecEligiblePools = {
    digital: false,
    transformation: false,
    market: false,
    workforce: false,
  },
  confirmations: SupportConfirmations = {
    psgQualifyingCostConfirmed: false,
    psgRemainingAnnualCap: 0,
    edgQualifyingCostConfirmed: false,
    mraQualifyingCostConfirmed: false,
    mraPillarCapAvailable: false,
  }
): {
  rows: CostResult[];
  totalGross: number;
  totalSupport: number;
  totalNet: number;
  sfecEnterprise: number;
  sfecWorkforce: number;
  conditionalCount: number;
} {
  const digital = finiteCurrency(input.digital);
  const transformation = finiteCurrency(input.transformation);
  const market = finiteCurrency(input.market);
  const workforce = finiteCurrency(input.workforce);
  const assessments = getSchemeAssessments(profile);

  const psgRow = getRowStatus(
    assessments.PSG,
    confirmations.psgQualifyingCostConfirmed
  );
  const edgRow = getRowStatus(
    assessments.EDG,
    confirmations.edgQualifyingCostConfirmed
  );
  const mraRow = getRowStatus(
    assessments.MRA,
    confirmations.mraQualifyingCostConfirmed &&
      confirmations.mraPillarCapAvailable
  );
  const psgRemainingCap = Math.min(
    30000,
    finiteCurrency(confirmations.psgRemainingAnnualCap)
  );
  const psg =
    psgRow.status === "included" ? Math.min(digital * 0.5, psgRemainingCap) : 0;
  const edg =
    edgRow.status === "included"
      ? transformation * (assessments.EDG.supportRate ?? 0)
      : 0;
  const mraActivityCap =
    profile.mraActivity === "unsure" ? 0 : mraPillarCaps[profile.mraActivity];
  const mra =
    mraRow.status === "included" ? Math.min(market * 0.7, mraActivityCap) : 0;

  const sfecAssessment = assessments.SFEC;
  const sfecCanBeIncluded = sfecAssessment.status === "eligible";
  const totalCredit = finiteCurrency(profile.sfecTotalCreditAvailable);
  const enterpriseCredit = Math.min(
    7000,
    totalCredit,
    finiteCurrency(profile.sfecEnterpriseCreditAvailable)
  );
  const enterpriseResidual =
    (sfecEligible.digital && psgRow.status === "included"
      ? Math.max(0, digital - psg)
      : 0) +
    (sfecEligible.transformation && edgRow.status === "included"
      ? Math.max(0, transformation - edg)
      : 0) +
    (sfecEligible.market && mraRow.status === "included"
      ? Math.max(0, market - mra)
      : 0);
  const sfecEnterprise = sfecCanBeIncluded
    ? Math.min(enterpriseCredit, enterpriseResidual * 0.9)
    : 0;
  const workforceResidual = sfecEligible.workforce ? workforce : 0;
  const sfecWorkforce = sfecCanBeIncluded
    ? Math.min(
        Math.max(0, totalCredit - sfecEnterprise),
        workforceResidual * 0.9
      )
    : 0;

  const workforceNotes = [
    "No WDG cash amount is included: the official programme is being rolled out in phases and the applicable live route must be verified.",
  ];
  const rows: CostResult[] = [
    {
      label: "Digital Foundation (PSG)",
      gross: digital,
      support: psg,
      net: Math.max(0, digital - psg),
      status: psgRow.status,
      notes:
        psgRow.status === "included"
          ? [
              "PSG scenario: 50% of confirmed qualifying cost, constrained by the declared remaining annual PSG cap.",
            ]
          : psgRow.notes,
    },
    {
      label: "Innovation Acceleration (EDG)",
      gross: transformation,
      support: edg,
      net: Math.max(0, transformation - edg),
      status: edgRow.status,
      notes:
        edgRow.status === "included"
          ? [
              `EDG scenario: ${(assessments.EDG.supportRate ?? 0) * 100}% of confirmed qualifying cost based on the stated SME status.`,
            ]
          : edgRow.notes,
    },
    {
      label: "Market readiness (MRA)",
      gross: market,
      support: mra,
      net: Math.max(0, market - mra),
      status: mraRow.status,
      notes:
        mraRow.status === "included"
          ? [
              `MRA scenario: 70% of confirmed qualifying cost, capped at S$${mraActivityCap.toLocaleString("en-SG")} for the selected activity pillar.`,
            ]
          : mraRow.notes,
    },
    {
      label: "Workforce Activation (WDG)",
      gross: workforce,
      support: 0,
      net: workforce,
      status: "requires-verification",
      notes: workforceNotes,
    },
  ];
  const totalGross = digital + transformation + market + workforce;
  const totalSupport =
    rows.reduce((sum, row) => sum + row.support, 0) +
    sfecEnterprise +
    sfecWorkforce;
  const conditionalCount =
    rows.filter(row => row.status !== "included" && row.gross > 0).length +
    (sfecCanBeIncluded || totalCredit === 0 ? 0 : 1);
  return {
    rows,
    totalGross,
    totalSupport,
    totalNet: Math.max(0, totalGross - totalSupport),
    sfecEnterprise,
    sfecWorkforce,
    conditionalCount,
  };
}

export function getCompliance(
  profile: DiagnosticProfile,
  recommendations: Recommendation[]
) {
  const items: Array<{ scheme: string; rule: string }> =
    recommendations.flatMap(recommendation =>
      recommendation.compliance.map(rule => ({
        scheme: recommendation.id,
        rule,
      }))
    );
  const assessments = getSchemeAssessments(profile);
  const criticalSchemes = (["PSG", "EDG", "MRA"] as SchemeId[]).filter(
    id => assessments[id].status === "not-eligible" && isRelevant(profile, id)
  );
  if (criticalSchemes.length) {
    items.unshift({
      scheme: "Critical",
      rule: `Based on your responses, ${criticalSchemes.join(", ")} is excluded from the verified-support scenario. Review the eligibility facts and live official programme rules before committing.`,
    });
  }
  if (profile.projectStarted === "yes") {
    items.unshift({
      scheme: "Critical",
      rule: "You indicated that a contract, payment, deposit or project work may already have started. PSG, EDG and MRA may not support retrospective applications; verify the exact live rule and any application/qualifying-period status immediately.",
    });
  }
  return items;
}

export function getSequence(
  recommendations: Recommendation[]
): { step: string; title: string; detail: string }[] {
  const ids = recommendations.map(item => item.id);
  const steps = [
    {
      step: "01",
      title: "Frame one transformation outcome",
      detail:
        "Set the baseline, business owner, target measure and separate cost pools for technology, transformation and workforce change.",
    },
    {
      step: "02",
      title: "Verify official route and protect eligibility",
      detail:
        "Before signing, paying, placing a deposit or commencing work, verify the live conditions for each relevant scheme and whether its application has been submitted.",
    },
  ];
  if (ids.includes("PSG"))
    steps.push({
      step: "03",
      title: "Confirm a qualifying Digital Foundation cost",
      detail:
        "Identify a relevant pre-approved solution or qualifying equipment, check the remaining annual cap and apply before the relevant commitment.",
    });
  if (ids.includes("EDG"))
    steps.push({
      step: "04",
      title: "Scope the Innovation Acceleration project",
      detail:
        "Develop outcomes, deliverables, provider capability, financial-readiness evidence and workforce impact before the EDG application.",
    });
  if (ids.includes("MRA"))
    steps.push({
      step: "05",
      title: "Validate the defined market-entry activity",
      detail:
        "Confirm the new-market sales history, select one MRA activity, establish the pillar cap and submit within the permitted timing window.",
    });
  if (ids.includes("SFEC") || ids.includes("WDG") || ids.includes("NAIIP"))
    steps.push({
      step: "06",
      title: "Activate the workforce and capability route",
      detail:
        "Confirm the actual SFEC balance and supportable route, or the live WDG/NAIIP pathway; tie capability evidence to the planned operating change.",
    });
  steps.push({
    step: "07",
    title: "Implement, evidence and claim",
    detail:
      "Track approved scope, invoices, payments, deployment, deliverables, participation and outcomes from day one; claims should not rely on reconstructed evidence.",
  });
  return steps;
}

export function buildActionPlan(
  profile: DiagnosticProfile,
  recommendations: Recommendation[]
): string {
  const pathway = sectorPathways[profile.sector];
  const sequence = getSequence(recommendations);
  return `# Your 90-Day SME Transformation Action Plan\n\n## Your focus\n${pathway.focus}\n\n**Primary goal:** ${profile.primaryGoal}\n**Recommended pathways:** ${recommendations.map(item => item.id).join(", ") || "Verify a suitable official route"}\n\n## Days 1–15 — Diagnose\n- Confirm the one business constraint to improve and record a baseline metric.\n- Review the relevant Industry Digital Plan and current official scheme pages.\n- Name the business owner, workforce lead and evidence owner.\n\n## Days 16–30 — Design\n- Separate Digital Foundation, Innovation Acceleration and Workforce Activation cost pools.\n- Obtain compliant quotations and write a measurable project brief.\n- Confirm that no payment, deposit, contract or project work will compromise eligibility.\n\n## Days 31–60 — Verify and apply\n- Check every live eligibility, vendor, course and funding condition.\n- Submit ready applications through the appropriate official portal.\n- Build your cash-flow and evidence-tracking plan.\n\n## Days 61–90 — Mobilise\n- Begin only activities permitted under the relevant application or Letter of Offer.\n- Launch employee communication, training and role-change activities.\n- Track milestones, deliverables, invoices and before/after measures.\n\n## Suggested sequence\n${sequence.map(item => `- **${item.step} ${item.title}:** ${item.detail}`).join("\n")}\n\n## Important\nThis plan is an indicative planning aid, not an approval, guarantee or official interpretation. Rules are current as at ${officialDataAsOf}, may transition with EDGE, and must be checked against the live official programme page and any Letter of Offer before making commitments.\n`;
}

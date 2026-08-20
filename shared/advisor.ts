export const schemeIds = ["PSG", "EDG", "MRA", "SFEC", "WDG", "NAIIP"] as const;

export type SchemeId = (typeof schemeIds)[number];
export type StackName = "Digital Foundation" | "Innovation Acceleration" | "Workforce Activation";
export type Sector = "retail" | "manufacturing" | "professional-services" | "fnb" | "other";
export type Challenge =
  | "manual-work"
  | "digital-customer"
  | "process-redesign"
  | "workforce"
  | "overseas-growth"
  | "ai-adoption"
  | "cost-pressure";

export type DiagnosticProfile = {
  challenges: Challenge[];
  sector: Sector;
  companySize: "micro" | "small" | "medium" | "growth";
  annualRevenue: "under-1m" | "1m-10m" | "10m-100m" | "over-100m";
  employeeCount: number;
  localShareholding: "yes" | "no" | "unsure";
  projectStarted: "no" | "yes" | "unsure";
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

export type Recommendation = Scheme & {
  fit: "Strong fit" | "Potential fit" | "Capability pathway";
  rationale: string;
};

export const stackMeta: Record<StackName, { description: string; eyebrow: string; colour: string }> = {
  "Digital Foundation": {
    eyebrow: "STACK 01",
    description: "The systems, data and digital tools that make better operations possible.",
    colour: "#0b2947",
  },
  "Innovation Acceleration": {
    eyebrow: "STACK 02",
    description: "The operating-model, product, process or market change that creates new value.",
    colour: "#bd4a46",
  },
  "Workforce Activation": {
    eyebrow: "STACK 03",
    description: "The roles, skills and work practices that make transformation stick.",
    colour: "#127b77",
  },
};

export const schemes: Record<SchemeId, Scheme> = {
  PSG: {
    id: "PSG",
    name: "Productivity Solutions Grant",
    stack: "Digital Foundation",
    colour: "navy",
    plainEnglish: "Use PSG when you can adopt a proven, pre-approved IT solution or equipment to remove manual work and improve productivity.",
    funding: "Indicative support: up to 50% of eligible costs, up to S$30,000 for local SMEs.",
    bestFor: "Ready-made systems such as accounting, HR, CRM, cybersecurity, e-commerce, point-of-sale and other approved solutions.",
    eligibility: [
      "Registered and operating in Singapore.",
      "At least 30% local equity, plus the applicable group turnover or employment-size test.",
      "The approved solution or equipment must be used in Singapore.",
    ],
    officialUrl: "https://www.enterprisesg.gov.sg/financial-support/productivity-solutions-grant",
    officialLabel: "EnterpriseSG — Productivity Solutions Grant",
    compliance: [
      "No retrospective applications: do not sign, pay or place a deposit before the application is submitted.",
      "Use a quotation that matches the approved solution package and selected vendor.",
      "Plan the claim: the solution must be deployed for at least 30 days and paid in full before the claim is submitted.",
    ],
    caveat: "Actual eligibility, approved cost items and grant amount are determined by the live programme terms and Letter of Offer.",
  },
  EDG: {
    id: "EDG",
    name: "Enterprise Development Grant",
    stack: "Innovation Acceleration",
    colour: "coral",
    plainEnglish: "Use EDG when the business needs a customised transformation project, not simply an off-the-shelf technology purchase.",
    funding: "Indicative support: up to 50% of eligible project costs for local SMEs; verify the current rate and scope before applying.",
    bestFor: "Process redesign, automation roadmaps, product development, new operating models and tailored capability projects.",
    eligibility: [
      "A new project with a clear scope, outcomes, deliverables and capable provider.",
      "The company must demonstrate its ability to fund the project before reimbursement.",
      "For management-consultancy costs, certified consultants are generally required, subject to official exceptions.",
    ],
    officialUrl: "https://www.enterprisesg.gov.sg/financial-support/enterprise-development-grant",
    officialLabel: "EnterpriseSG — Enterprise Development Grant",
    compliance: [
      "No retrospective applications: do not start work, make payment or sign a contract with a project provider before applying.",
      "EDG is reimbursement-based: budget for cash outlay until deliverables and claim evidence are accepted.",
      "Keep project reports, invoices, proof of payment and deliverable evidence as implementation happens.",
    ],
    caveat: "Project scope, outcomes, provider capability, approved costs and final support remain subject to EnterpriseSG assessment.",
  },
  MRA: {
    id: "MRA",
    name: "Market Readiness Assistance",
    stack: "Innovation Acceleration",
    colour: "coral",
    plainEnglish: "Use MRA for eligible business-development, promotion and market-set-up activities when entering a genuinely new overseas market.",
    funding: "Indicative support: up to 70% of eligible costs, capped at S$100,000 per company per new market.",
    bestFor: "A defined overseas-market entry plan with market promotion, business-development or set-up activities.",
    eligibility: [
      "A local SME that is new to the proposed overseas market, subject to current programme criteria.",
      "A specific activity, vendor, timeline and deliverable—not a broad overseas ambition.",
      "A project within the permitted timeline and live application window.",
    ],
    officialUrl: "https://www.enterprisesg.gov.sg/financial-support/market-readiness-assistance-grant",
    officialLabel: "EnterpriseSG — Market Readiness Assistance",
    compliance: [
      "No retrospective applications: apply before the activity starts, a payment is made or a contract is signed.",
      "Each project may not exceed 12 months; confirm the current timing rules before submission.",
      "MRA claims are subject to audit, so retain project, payment and deliverable evidence.",
    ],
    caveat: "MRA does not validate commercial demand. The business still needs a market hypothesis, owner and measure of success.",
  },
  SFEC: {
    id: "SFEC",
    name: "SkillsFuture Enterprise Credit",
    stack: "Workforce Activation",
    colour: "teal",
    plainEnglish: "Use SFEC as an additional credit to reduce eligible out-of-pocket costs on supportable enterprise and workforce programmes.",
    funding: "Current credit: S$10,000, offsetting up to 90% of eligible out-of-pocket costs. Up to S$7,000 may be used for enterprise transformation.",
    bestFor: "Eligible training, job-redesign, workplace-learning and approved transformation programmes after the underlying programme is confirmed supportable.",
    eligibility: [
      "Eligible employers were notified; there is no separate SFEC application.",
      "The underlying programme or course must be SFEC-supportable.",
      "Use is governed by the applicable scheme or course claim process.",
    ],
    officialUrl: "https://skillsfuture.gobusiness.gov.sg/support-and-programmes/funding/skillsfuture-enterprise-credit-sfec",
    officialLabel: "SkillsFuture for Business — SkillsFuture Enterprise Credit",
    compliance: [
      "The current SFEC expires on 30 November 2026; unused current credit does not carry forward.",
      "For current SFEC training eligibility, the final training day must be on or before 30 November 2026, subject to SWDA approval.",
      "Treat any stacking estimate as indicative until the underlying programme and claim are approved.",
    ],
    caveat: "A redesigned SFEC is expected from 1 December 2026 for eligible employers. Confirm the live programme page before planning around the new model.",
  },
  WDG: {
    id: "WDG",
    name: "SkillsFuture Workforce Development Grant",
    stack: "Workforce Activation",
    colour: "teal",
    plainEnglish: "Use WDG (Job Redesign+) when technology or a new operating model will materially change roles, skills and work practices.",
    funding: "WDG (Job Redesign+) offers support of up to 70% of project costs, capped at S$150,000 per company, subject to current terms.",
    bestFor: "Workforce consultancy, capability-building initiatives, workforce technology solutions and structured job redesign.",
    eligibility: [
      "A clear transformation case that identifies affected roles and the intended work redesign.",
      "A plan for capability building, adoption and measurable workforce outcomes.",
      "Current programme availability and application-channel requirements must be checked.",
    ],
    officialUrl: "https://skillsfuture.gobusiness.gov.sg/support-and-programmes/funding/workforce-development-grant",
    officialLabel: "SkillsFuture for Business — Workforce Development Grant",
    compliance: [
      "Document the before-and-after work design, not simply a list of training courses.",
      "Align the workforce plan with the technology and business-change implementation plan.",
      "Confirm live application and evidence requirements before appointing providers or commencing work.",
    ],
    caveat: "The broader WDG is being rolled out progressively. Check the current WDG (Job Redesign+) requirements before applying.",
  },
  NAIIP: {
    id: "NAIIP",
    name: "National AI Impact Programme",
    stack: "Workforce Activation",
    colour: "gold",
    plainEnglish: "Use NAIIP as an AI capability-building pathway alongside a concrete business use case; it is not a universal grant for every AI purchase.",
    funding: "Capability support varies by pathway. Selected SkillsFuture AI courses provide six months of premium AI-tool access from the second half of 2026.",
    bestFor: "Building AI fluency, redesigning role-specific workflows and creating confidence to use AI responsibly.",
    eligibility: [
      "Programme, course and participant eligibility vary by pathway.",
      "Selected SkillsFuture AI courses are the route for the six-month premium AI-tool access.",
      "The business should have a practical workflow where AI can be applied responsibly.",
    ],
    officialUrl: "https://www.imda.gov.sg/how-we-can-help/techskills-accelerator-tesa/national-ai-impact-programme",
    officialLabel: "IMDA — National AI Impact Programme",
    compliance: [
      "Do not promise employees a specific AI tool until the selected course confirms it.",
      "Design for responsible use, data handling and human review—not only experimentation.",
      "Pair AI learning with a role-specific workflow and practical adoption measure.",
    ],
    caveat: "Programme details, providers, courses and tools are updated over time. Confirm the live route before enrolling or budgeting.",
  },
};

export const sectorPathways: Record<Sector, { label: string; focus: string; examples: string[]; idpUrl: string }> = {
  retail: {
    label: "Retail",
    focus: "Connect stock, sales channels and customer follow-up before scaling analytics or regional growth.",
    examples: ["Inventory accuracy and fulfilment", "Omnichannel customer journeys", "Store-manager decision routines"],
    idpUrl: "https://www.imda.gov.sg/how-we-can-help/smes-go-digital/industry-digital-plans",
  },
  manufacturing: {
    label: "Manufacturing",
    focus: "Start with visibility into quality, planning and shop-floor work, then redesign technician and supervisor roles.",
    examples: ["Quality and rework reduction", "Production planning visibility", "Technician capability and job redesign"],
    idpUrl: "https://www.imda.gov.sg/how-we-can-help/smes-go-digital/industry-digital-plans",
  },
  "professional-services": {
    label: "Professional Services",
    focus: "Standardise knowledge work and client delivery while protecting professional judgement and data governance.",
    examples: ["Workflow automation", "Client delivery and CRM", "AI-enabled knowledge work"],
    idpUrl: "https://www.imda.gov.sg/how-we-can-help/smes-go-digital/industry-digital-plans",
  },
  fnb: {
    label: "F&B",
    focus: "Improve demand, outlet operations and workforce consistency before expanding formats or locations.",
    examples: ["Demand and inventory discipline", "Outlet productivity", "Frontline role redesign"],
    idpUrl: "https://www.imda.gov.sg/how-we-can-help/smes-go-digital/industry-digital-plans",
  },
  other: {
    label: "Your sector",
    focus: "Use a clear business baseline, then find the relevant IMDA Industry Digital Plan and support route.",
    examples: ["Process clarity", "Digital adoption", "Workforce capability"],
    idpUrl: "https://www.imda.gov.sg/how-we-can-help/smes-go-digital/industry-digital-plans",
  },
};

const has = (profile: DiagnosticProfile, challenge: Challenge) => profile.challenges.includes(challenge);

function buildRationale(profile: DiagnosticProfile, id: SchemeId): string {
  const sector = sectorPathways[profile.sector].label.toLowerCase();
  if (id === "PSG") return `Your focus on ${has(profile, "manual-work") ? "manual work" : "digital customer and operating tools"} makes a proven solution a practical first step for a ${sector} business.`;
  if (id === "EDG") return "Your needs extend beyond a single tool: a scoped redesign project can connect process change, measurable outcomes and implementation capability.";
  if (id === "MRA") return "A defined overseas-growth objective is present, so a new-market activity may be relevant once the commercial case and execution owner are clear.";
  if (id === "SFEC") return "Your transformation will require people to use new systems or ways of working; SFEC may help offset eligible residual programme and training costs.";
  if (id === "WDG") return "Your stated workforce and operating goals indicate that job redesign and capability-building should be planned alongside the technology or process change.";
  return "Your AI ambition will be more credible when it is tied to a real workflow, responsible-use controls and a practical learning pathway.";
}

export function getRecommendations(profile: DiagnosticProfile): Recommendation[] {
  const ids = new Set<SchemeId>();
  if (has(profile, "manual-work") || has(profile, "digital-customer") || has(profile, "cost-pressure") || has(profile, "ai-adoption")) ids.add("PSG");
  if (has(profile, "process-redesign") || has(profile, "cost-pressure") || profile.primaryGoal === "growth") ids.add("EDG");
  if (has(profile, "overseas-growth") || profile.primaryGoal === "market") ids.add("MRA");
  if (has(profile, "workforce") || profile.employeeCount >= 3 || has(profile, "ai-adoption")) ids.add("SFEC");
  if (has(profile, "workforce") || has(profile, "process-redesign") || profile.primaryGoal === "workforce") ids.add("WDG");
  if (has(profile, "ai-adoption") || profile.primaryGoal === "ai") ids.add("NAIIP");
  if (!ids.size) ids.add("PSG");
  const order: SchemeId[] = ["PSG", "EDG", "MRA", "SFEC", "WDG", "NAIIP"];
  return order
    .filter((id) => ids.has(id))
    .map((id) => ({
      ...schemes[id],
      fit: id === "NAIIP" ? "Capability pathway" : id === "SFEC" || id === "WDG" ? "Potential fit" : "Strong fit",
      rationale: buildRationale(profile, id),
    }));
}

export type CostInputs = { digital: number; transformation: number; market: number; workforce: number };
export type CostResult = { label: string; gross: number; support: number; net: number; notes: string[] };

export function calculateIndicativeSupport(input: CostInputs): { rows: CostResult[]; totalGross: number; totalSupport: number; totalNet: number; sfecEnterprise: number; sfecWorkforce: number } {
  const digital = Math.max(0, input.digital || 0);
  const transformation = Math.max(0, input.transformation || 0);
  const market = Math.max(0, input.market || 0);
  const workforce = Math.max(0, input.workforce || 0);
  const psg = Math.min(digital * 0.5, 30000);
  const edg = transformation * 0.5;
  const mra = Math.min(market * 0.7, 100000);
  const wdg = Math.min(workforce * 0.7, 150000);
  const enterpriseResidual = Math.max(0, digital - psg) + Math.max(0, transformation - edg) + Math.max(0, market - mra);
  const sfecEnterprise = Math.min(7000, enterpriseResidual * 0.9);
  const sfecWorkforce = Math.min(Math.max(0, 10000 - sfecEnterprise), Math.max(0, workforce - wdg) * 0.9);
  const rows: CostResult[] = [
    { label: "Digital Foundation", gross: digital, support: psg, net: Math.max(0, digital - psg), notes: ["PSG estimate: 50% of cost, capped at S$30,000."] },
    { label: "Innovation Acceleration", gross: transformation, support: edg, net: Math.max(0, transformation - edg), notes: ["EDG estimate: 50% of cost; actual rate and costs require confirmation."] },
    { label: "Market readiness", gross: market, support: mra, net: Math.max(0, market - mra), notes: ["MRA estimate: 70% of cost, capped at S$100,000 per new market."] },
    { label: "Workforce Activation", gross: workforce, support: wdg, net: Math.max(0, workforce - wdg), notes: ["WDG estimate: 70% of cost, capped at S$150,000."] },
  ];
  const totalGross = digital + transformation + market + workforce;
  const totalSupport = rows.reduce((sum, row) => sum + row.support, 0) + sfecEnterprise + sfecWorkforce;
  return { rows, totalGross, totalSupport, totalNet: Math.max(0, totalGross - totalSupport), sfecEnterprise, sfecWorkforce };
}

export function getCompliance(profile: DiagnosticProfile, recommendations: Recommendation[]) {
  const items: Array<{ scheme: string; rule: string }> = recommendations.flatMap((recommendation) => recommendation.compliance.map((rule) => ({ scheme: recommendation.id, rule })));
  if (profile.projectStarted === "yes") {
    items.unshift({ scheme: "Critical", rule: "Some grants may not support work that has already started. Pause new commitments and verify each scheme’s live retrospective-application rule immediately." });
  }
  return items;
}

export function getSequence(recommendations: Recommendation[]): { step: string; title: string; detail: string }[] {
  const ids = recommendations.map((item) => item.id);
  const steps = [
    { step: "01", title: "Frame one transformation outcome", detail: "Set the baseline, business owner, target measure and separate cost pools for technology, transformation and workforce change." },
    { step: "02", title: "Protect grant eligibility", detail: "Before signing, paying or placing a deposit, verify the exact no-retrospective-application condition that applies to each relevant scheme." },
  ];
  if (ids.includes("PSG")) steps.push({ step: "03", title: "Secure the Digital Foundation", detail: "Identify a relevant approved solution, obtain a compliant quotation and apply before commitment." });
  if (ids.includes("EDG")) steps.push({ step: "04", title: "Scope the Innovation Acceleration project", detail: "Develop outcomes, deliverables, provider capability, cash-flow plan and workforce impact before the EDG application." });
  if (ids.includes("MRA")) steps.push({ step: "05", title: "Validate the market-entry activity", detail: "Define the new-market activity, vendor, deliverables and proof of commercial demand before applying." });
  if (ids.includes("SFEC") || ids.includes("WDG") || ids.includes("NAIIP")) steps.push({ step: "06", title: "Activate the workforce plan", detail: "Map affected roles, choose eligible learning or job-redesign routes, and tie capability evidence to the planned operating change." });
  steps.push({ step: "07", title: "Implement, evidence and claim", detail: "Track invoices, payments, deployment, deliverables, participation and outcomes from day one; claims should not rely on reconstructed evidence." });
  return steps;
}

export function buildActionPlan(profile: DiagnosticProfile, recommendations: Recommendation[]): string {
  const pathway = sectorPathways[profile.sector];
  const sequence = getSequence(recommendations);
  return `# Your 90-Day SME Transformation Action Plan\n\n## Your focus\n${pathway.focus}\n\n**Primary goal:** ${profile.primaryGoal}\n**Recommended pathways:** ${recommendations.map((item) => item.id).join(", ")}\n\n## Days 1–15 — Diagnose\n- Confirm the one business constraint to improve and record a baseline metric.\n- Review the relevant Industry Digital Plan and current official scheme pages.\n- Name the business owner, workforce lead and evidence owner.\n\n## Days 16–30 — Design\n- Separate Digital Foundation, Innovation Acceleration and Workforce Activation cost pools.\n- Obtain compliant quotations and write a measurable project brief.\n- Confirm that no payment, deposit, contract or project work will compromise eligibility.\n\n## Days 31–60 — Verify and apply\n- Check every live eligibility, vendor, course and funding condition.\n- Submit ready applications through the appropriate official portal.\n- Build your cash-flow and evidence-tracking plan.\n\n## Days 61–90 — Mobilise\n- Begin only activities permitted under the relevant application or Letter of Offer.\n- Launch employee communication, training and role-change activities.\n- Track milestones, deliverables, invoices and before/after measures.\n\n## Suggested sequence\n${sequence.map((item) => `- **${item.step} ${item.title}:** ${item.detail}`).join("\n")}\n\n## Important\nThis plan is an indicative planning aid, not an approval, guarantee or official interpretation. Verify the current official terms and your Letter of Offer before making commitments.\n`;
}

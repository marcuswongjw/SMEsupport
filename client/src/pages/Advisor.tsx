import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  calculateIndicativeSupport,
  edgeTransitionNotice,
  getCompliance,
  getRecommendations,
  getSchemeAssessments,
  getSequence,
  officialDataAsOf,
  sanitizeDiagnosticProfile,
  sectorPathways,
  stackMeta,
  type Challenge,
  type CostInputs,
  type DiagnosticProfile,
  type MraActivity,
  type Recommendation,
  type Sector,
  type SfecEligiblePools,
  type StackName,
  type SupportConfirmations,
  type YesNoUnsure,
} from "@shared/advisor";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  CircleDollarSign,
  ClipboardList,
  Download,
  ExternalLink,
  FileCheck2,
  Info,
  Scale,
  ShieldCheck,
  WandSparkles,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const challenges: Array<{ id: Challenge; title: string; detail: string }> = [
  {
    id: "manual-work",
    title: "Manual work and inefficiency",
    detail: "Too much time on repetitive, paper-based or disconnected work.",
  },
  {
    id: "digital-customer",
    title: "Digital customer experience",
    detail: "Sales, fulfilment, service or CRM systems are fragmented.",
  },
  {
    id: "process-redesign",
    title: "Process or operating-model change",
    detail:
      "The business needs a deeper workflow, product or service redesign.",
  },
  {
    id: "workforce",
    title: "Skills and workforce adoption",
    detail:
      "Roles, capability or job design must change alongside the business.",
  },
  {
    id: "overseas-growth",
    title: "New overseas market",
    detail: "The business is preparing a focused new-market entry activity.",
  },
  {
    id: "ai-adoption",
    title: "Responsible AI adoption",
    detail: "The business needs practical AI fluency and a real use case.",
  },
  {
    id: "cost-pressure",
    title: "Cost and capacity pressure",
    detail:
      "Margins, errors or bottlenecks require a productivity intervention.",
  },
];

const goals: Array<{ id: DiagnosticProfile["primaryGoal"]; label: string }> = [
  { id: "productivity", label: "Lift productivity" },
  { id: "growth", label: "Build a new capability" },
  { id: "workforce", label: "Transform workforce roles" },
  { id: "market", label: "Enter a new market" },
  { id: "ai", label: "Build AI readiness" },
];

const formatMoney = (amount: number) =>
  new Intl.NumberFormat("en-SG", {
    style: "currency",
    currency: "SGD",
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
const answerOptions: Array<[YesNoUnsure, string]> = [
  ["yes", "Yes"],
  ["no", "No"],
  ["unsure", "Not sure"],
];

const initialProfile: DiagnosticProfile = {
  challenges: [],
  sector: "retail",
  companySize: "small",
  annualRevenue: "1m-10m",
  groupEmployeeCount: 12,
  registeredInSingapore: "unsure",
  localShareholding: "unsure",
  projectStarted: "unsure",
  edgFinancialReadiness: "unsure",
  mraMarketStatus: "unsure",
  mraActivity: "unsure",
  mraTiming: "unsure",
  sfecNotification: "unsure",
  sfecTotalCreditAvailable: 0,
  sfecEnterpriseCreditAvailable: 0,
  primaryGoal: "productivity",
};

type UpdateProfile = <K extends keyof DiagnosticProfile>(
  key: K,
  value: DiagnosticProfile[K]
) => void;

function ToggleCard({
  active,
  title,
  detail,
  onClick,
}: {
  active: boolean;
  title: string;
  detail: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "group relative w-full rounded-2xl border p-4 text-left transition-all duration-200",
        active
          ? "border-[#3f746d] bg-[#eef7f4] shadow-[0_10px_25px_rgba(32,103,96,.08)]"
          : "border-[#0b2947]/10 bg-white hover:border-[#3f746d]/40 hover:shadow-md"
      )}
    >
      <span
        className={cn(
          "absolute right-4 top-4 flex size-5 items-center justify-center rounded-full border",
          active
            ? "border-[#3f746d] bg-[#3f746d] text-white"
            : "border-slate-200 bg-white text-transparent"
        )}
      >
        <Check className="size-3.5" />
      </span>
      <p className="pr-7 text-sm font-extrabold text-[#0b2947]">{title}</p>
      <p className="mt-1.5 pr-4 text-xs leading-5 text-slate-500">{detail}</p>
    </button>
  );
}

function RecommendationCard({ item }: { item: Recommendation }) {
  const palette =
    item.stack === "Digital Foundation"
      ? "border-[#0b2947]/12 bg-[#f5f8fc]"
      : item.stack === "Innovation Acceleration"
        ? "border-[#bd4a46]/15 bg-[#fff7f6]"
        : "border-[#127b77]/15 bg-[#f2f9f7]";
  return (
    <article className={cn("rounded-2xl border p-5", palette)}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <span className="rounded-full bg-white/75 px-2.5 py-1 text-[10px] font-extrabold tracking-[.12em] text-[#0b2947]/60">
            {item.id} · {item.fit.toUpperCase()}
          </span>
          <h3 className="mt-3 text-lg font-extrabold tracking-tight">
            {item.name}
          </h3>
        </div>
        <span className="rounded-full border border-[#0b2947]/8 bg-white/70 px-2.5 py-1 text-[10px] font-bold text-[#3f746d]">
          {item.stack}
        </span>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-600">{item.rationale}</p>
      <div className="mt-4 rounded-xl border border-white/90 bg-white/75 p-3">
        <p className="text-[10px] font-extrabold tracking-[.13em] text-slate-400">
          WHAT THIS DOES
        </p>
        <p className="mt-1 text-sm font-semibold leading-6">
          {item.plainEnglish}
        </p>
      </div>
      <p className="mt-3 text-xs font-semibold leading-5 text-[#3f746d]">
        {item.funding}
      </p>
      {item.assessment.status !== "eligible" && (
        <div className="mt-3 flex gap-2 rounded-xl border border-[#e0b34c]/30 bg-[#fff9ed] p-3 text-xs leading-5 text-[#725819]">
          <Info className="mt-0.5 size-4 shrink-0" />
          {item.assessment.reasons[0]}
        </div>
      )}
      <a
        href={item.officialUrl}
        target="_blank"
        rel="noreferrer"
        className="mt-4 inline-flex items-center gap-1 text-xs font-extrabold text-[#0b2947] hover:text-[#3f746d]"
      >
        Open official source <ExternalLink className="size-3" />
      </a>
    </article>
  );
}

function SupportCalculator({
  profile,
  updateProfile,
}: {
  profile: DiagnosticProfile;
  updateProfile: UpdateProfile;
}) {
  const [costs, setCosts] = useState<CostInputs>({
    digital: 40000,
    transformation: 80000,
    market: 0,
    workforce: 18000,
  });
  const [sfecEligible, setSfecEligible] = useState<SfecEligiblePools>({
    digital: false,
    transformation: false,
    market: false,
    workforce: false,
  });
  const [confirmations, setConfirmations] = useState<SupportConfirmations>({
    psgQualifyingCostConfirmed: false,
    psgRemainingAnnualCap: 0,
    edgQualifyingCostConfirmed: false,
    mraQualifyingCostConfirmed: false,
    mraPillarCapAvailable: false,
  });
  const result = useMemo(
    () =>
      calculateIndicativeSupport(costs, profile, sfecEligible, confirmations),
    [costs, profile, sfecEligible, confirmations]
  );
  const entries: Array<{
    id: keyof CostInputs;
    label: string;
    detail: string;
  }> = [
    {
      id: "digital",
      label: "Digital Foundation",
      detail:
        "PSG scenario only when you confirm a qualifying pre-approved package/equipment cost.",
    },
    {
      id: "transformation",
      label: "Innovation Acceleration",
      detail:
        "EDG scenario only when you confirm qualifying project cost and pass the diagnostic checks.",
    },
    {
      id: "market",
      label: "Market readiness",
      detail:
        "MRA scenario for one selected activity in one qualifying new market.",
    },
    {
      id: "workforce",
      label: "Workforce Activation",
      detail: "WDG has no cash scenario here until the live route is verified.",
    },
  ];
  const setCost = (key: keyof CostInputs, value: string) =>
    setCosts(current => ({
      ...current,
      [key]: Math.min(999999999, Number(value.replace(/[^0-9]/g, "")) || 0),
    }));

  return (
    <section
      id="calculator"
      className="rounded-[26px] border border-[#0b2947]/10 bg-white p-5 shadow-[0_12px_36px_rgba(11,41,71,.05)] sm:p-7"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">VERIFIED-SUPPORT SCENARIO</p>
          <h2 className="mt-2 font-display text-3xl tracking-[-.035em]">
            Model confirmed qualifying cost pools.
          </h2>
        </div>
        <span className="w-fit rounded-full bg-[#fff5df] px-3 py-1.5 text-[10px] font-extrabold tracking-[.1em] text-[#9c6b0c]">
          NOT AN APPROVAL
        </span>
      </div>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
        The headline total includes only routes that pass the facts entered here
        and have confirmed qualifying costs. Unverified, conditional and
        unavailable routes are shown separately and contribute S$0. Official
        terms remain decisive.
      </p>
      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_.92fr]">
        <div className="space-y-3">
          {entries.map(entry => (
            <div
              key={entry.id}
              className="rounded-xl border border-slate-100 bg-[#faf8f3] p-4"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-extrabold">{entry.label}</p>
                  <p className="mt-1 text-xs text-slate-500">{entry.detail}</p>
                </div>
                <div className="relative w-full sm:w-40">
                  <span className="absolute left-3 top-[11px] text-xs font-bold text-slate-400">
                    S$
                  </span>
                  <Input
                    aria-label={entry.label}
                    value={costs[entry.id] || ""}
                    onChange={event => setCost(entry.id, event.target.value)}
                    className="h-10 border-slate-200 bg-white pl-8 text-right text-sm font-bold"
                    inputMode="numeric"
                  />
                </div>
              </div>
              {entry.id === "digital" && (
                <div className="mt-3 space-y-2">
                  <Label className="flex items-center gap-2 text-xs font-medium text-slate-600">
                    <Checkbox
                      checked={confirmations.psgQualifyingCostConfirmed}
                      onCheckedChange={checked =>
                        setConfirmations(current => ({
                          ...current,
                          psgQualifyingCostConfirmed: checked === true,
                        }))
                      }
                    />
                    I confirmed this is the package/equipment’s qualifying PSG
                    cost.
                  </Label>
                  <div className="relative max-w-64">
                    <span className="absolute left-3 top-[11px] text-xs font-bold text-slate-400">
                      S$
                    </span>
                    <Input
                      aria-label="Remaining PSG annual cap"
                      value={confirmations.psgRemainingAnnualCap || ""}
                      onChange={event =>
                        setConfirmations(current => ({
                          ...current,
                          psgRemainingAnnualCap: Math.min(
                            30000,
                            Number(event.target.value.replace(/[^0-9]/g, "")) ||
                              0
                          ),
                        }))
                      }
                      className="h-10 border-slate-200 bg-white pl-8 text-sm font-bold"
                      inputMode="numeric"
                      placeholder="Remaining PSG annual cap (max S$30k)"
                    />
                  </div>
                </div>
              )}
              {entry.id === "transformation" && (
                <Label className="mt-3 flex items-center gap-2 text-xs font-medium text-slate-600">
                  <Checkbox
                    checked={confirmations.edgQualifyingCostConfirmed}
                    onCheckedChange={checked =>
                      setConfirmations(current => ({
                        ...current,
                        edgQualifyingCostConfirmed: checked === true,
                      }))
                    }
                  />
                  I confirmed this is a qualifying EDG project cost.
                </Label>
              )}
              {entry.id === "market" && (
                <div className="mt-3 space-y-2">
                  <Label className="flex items-center gap-2 text-xs font-medium text-slate-600">
                    <Checkbox
                      checked={confirmations.mraQualifyingCostConfirmed}
                      onCheckedChange={checked =>
                        setConfirmations(current => ({
                          ...current,
                          mraQualifyingCostConfirmed: checked === true,
                        }))
                      }
                    />
                    I confirmed this is qualifying MRA cost for the selected
                    activity.
                  </Label>
                  <Label className="flex items-center gap-2 text-xs font-medium text-slate-600">
                    <Checkbox
                      checked={confirmations.mraPillarCapAvailable}
                      onCheckedChange={checked =>
                        setConfirmations(current => ({
                          ...current,
                          mraPillarCapAvailable: checked === true,
                        }))
                      }
                    />
                    I understand the single activity-pillar cap applies to this
                    scenario.
                  </Label>
                </div>
              )}
              {entry.id !== "workforce" && (
                <Label className="mt-3 flex items-center gap-2 text-xs font-medium text-slate-600">
                  <Checkbox
                    checked={sfecEligible[entry.id]}
                    onCheckedChange={checked =>
                      setSfecEligible(current => ({
                        ...current,
                        [entry.id]: checked === true,
                      }))
                    }
                  />
                  This confirmed cost is also SFEC-supportable.
                </Label>
              )}
              {entry.id === "workforce" && (
                <Label className="mt-3 flex items-center gap-2 text-xs font-medium text-slate-600">
                  <Checkbox
                    checked={sfecEligible.workforce}
                    onCheckedChange={checked =>
                      setSfecEligible(current => ({
                        ...current,
                        workforce: checked === true,
                      }))
                    }
                  />
                  This is a confirmed SFEC-supportable workforce cost.
                </Label>
              )}
            </div>
          ))}
        </div>
        <div className="rounded-2xl bg-[#0b2947] p-5 text-white">
          <p className="text-[10px] font-extrabold tracking-[.13em] text-[#f4be67]">
            VERIFIED-SUPPORT TOTAL
          </p>
          <p className="mt-3 font-display text-5xl tracking-[-.04em]">
            {formatMoney(result.totalSupport)}
          </p>
          <p className="mt-1 text-sm text-white/60">
            Included only after the relevant checks are confirmed
          </p>
          <div className="mt-6 space-y-3 border-t border-white/10 pt-5">
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Total project cost entered</span>
              <strong>{formatMoney(result.totalGross)}</strong>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Verified-support scenario</span>
              <strong className="text-[#9fd3c9]">
                {formatMoney(result.totalSupport)}
              </strong>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Indicative net outlay</span>
              <strong>{formatMoney(result.totalNet)}</strong>
            </div>
          </div>
          <div className="mt-5 rounded-xl bg-white/8 p-3 text-xs leading-5 text-white/65">
            {result.conditionalCount
              ? `${result.conditionalCount} entered cost pool${result.conditionalCount === 1 ? " is" : "s are"} excluded until live conditions are verified.`
              : "All entered cost pools meet the tool’s confirmation requirements; official approval and final eligibility still apply."}
          </div>
          {profile.sfecNotification === "yes" && (
            <div className="mt-4 space-y-2 border-t border-white/10 pt-4">
              <p className="text-[10px] font-extrabold tracking-[.13em] text-[#f4be67]">
                CURRENT SFEC WALLET
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                <div className="relative">
                  <span className="absolute left-3 top-[11px] text-xs font-bold text-white/45">
                    S$
                  </span>
                  <Input
                    aria-label="Current total SFEC credit available"
                    value={profile.sfecTotalCreditAvailable || ""}
                    onChange={event =>
                      updateProfile(
                        "sfecTotalCreditAvailable",
                        Math.min(
                          10000,
                          Number(event.target.value.replace(/[^0-9]/g, "")) || 0
                        )
                      )
                    }
                    className="h-10 border-white/15 bg-white/10 pl-8 text-sm font-bold text-white placeholder:text-white/45"
                    inputMode="numeric"
                    placeholder="Total credit"
                  />
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-[11px] text-xs font-bold text-white/45">
                    S$
                  </span>
                  <Input
                    aria-label="Current SFEC enterprise-transformation credit available"
                    value={profile.sfecEnterpriseCreditAvailable || ""}
                    onChange={event =>
                      updateProfile(
                        "sfecEnterpriseCreditAvailable",
                        Math.min(
                          7000,
                          Number(event.target.value.replace(/[^0-9]/g, "")) || 0
                        )
                      )
                    }
                    className="h-10 border-white/15 bg-white/10 pl-8 text-sm font-bold text-white placeholder:text-white/45"
                    inputMode="numeric"
                    placeholder="Enterprise portion"
                  />
                </div>
              </div>
              <p className="text-[11px] leading-4 text-white/55">
                Use the actual current wallet balance. The
                enterprise-transformation portion cannot exceed S$7,000.
              </p>
            </div>
          )}
        </div>
      </div>
      <div className="mt-5 grid gap-2 sm:grid-cols-2">
        {result.rows.map(row => (
          <div
            key={row.label}
            className={cn(
              "rounded-xl border p-3",
              row.status === "included"
                ? "border-[#3f746d]/25 bg-[#f2f9f7]"
                : row.status === "not-applicable"
                  ? "border-[#d97a56]/20 bg-[#fff6ef]"
                  : "border-slate-200 bg-slate-50"
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-xs font-extrabold text-[#0b2947]">
                {row.label}
              </p>
              <span
                className={cn(
                  "rounded-full px-2 py-1 text-[9px] font-extrabold tracking-wide",
                  row.status === "included"
                    ? "bg-[#dff1ec] text-[#28665f]"
                    : row.status === "not-applicable"
                      ? "bg-[#fde8df] text-[#a55130]"
                      : "bg-slate-200 text-slate-600"
                )}
              >
                {row.status === "included"
                  ? "INCLUDED"
                  : row.status === "not-applicable"
                    ? "EXCLUDED"
                    : "VERIFY"}
              </span>
            </div>
            <p className="mt-2 text-sm font-bold text-[#3f746d]">
              {formatMoney(row.support)}
            </p>
            <p className="mt-1 text-[11px] leading-4 text-slate-500">
              {row.notes[0]}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function Advisor() {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<DiagnosticProfile>(() => {
    if (typeof window === "undefined") return initialProfile;
    try {
      const stored = window.sessionStorage.getItem("sage-diagnostic-profile");
      return stored
        ? sanitizeDiagnosticProfile(JSON.parse(stored), initialProfile)
        : initialProfile;
    } catch {
      return initialProfile;
    }
  });
  const [submitted, setSubmitted] = useState(
    () =>
      typeof window !== "undefined" &&
      window.sessionStorage.getItem("sage-diagnostic-submitted") === "true"
  );
  const assessments = useMemo(() => getSchemeAssessments(profile), [profile]);
  const recommendations = useMemo(() => getRecommendations(profile), [profile]);
  const compliance = useMemo(
    () => getCompliance(profile, recommendations),
    [profile, recommendations]
  );
  const sequence = useMemo(
    () => getSequence(recommendations),
    [recommendations]
  );
  const sector = sectorPathways[profile.sector];
  const update: UpdateProfile = (key, value) =>
    setProfile(current => ({ ...current, [key]: value }));
  const toggleChallenge = (challenge: Challenge) =>
    update(
      "challenges",
      profile.challenges.includes(challenge)
        ? profile.challenges.filter(item => item !== challenge)
        : [...profile.challenges, challenge]
    );
  const canContinue = step !== 1 || profile.challenges.length > 0;
  const isMarketRouteRelevant =
    profile.challenges.includes("overseas-growth") ||
    profile.primaryGoal === "market";
  const excludedSchemes = (
    Object.keys(assessments) as Array<keyof typeof assessments>
  ).filter(id => assessments[id].status === "not-eligible");
  useEffect(() => {
    window.sessionStorage.setItem(
      "sage-diagnostic-profile",
      JSON.stringify(profile)
    );
  }, [profile]);
  useEffect(() => {
    window.sessionStorage.setItem(
      "sage-diagnostic-submitted",
      String(submitted)
    );
  }, [submitted]);
  const resetAdvisor = () => {
    window.sessionStorage.removeItem("sage-diagnostic-profile");
    window.sessionStorage.removeItem("sage-diagnostic-submitted");
    setProfile(initialProfile);
    setSubmitted(false);
    setStep(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const downloadPlanPdf = async () => {
    const { downloadActionPlanPdf } = await import("@/lib/actionPlanPdf");
    downloadActionPlanPdf({
      profile,
      recommendations,
      compliance,
      sequence,
      goalLabel:
        goals.find(goal => goal.id === profile.primaryGoal)?.label ||
        "Transform the business",
      challengeLabels: profile.challenges.map(
        id => challenges.find(item => item.id === id)?.title || id
      ),
    });
  };
  const goResults = () => {
    setSubmitted(true);
    window.setTimeout(
      () =>
        document
          .getElementById("your-pathway")
          ?.scrollIntoView({ behavior: "smooth", block: "start" }),
      50
    );
  };

  return (
    <div className="min-h-screen bg-[#faf8f3] text-[#0b2947]">
      <AppHeader />
      <main>
        <section className="border-b border-[#0b2947]/8 bg-[#0b2947] py-10 text-white sm:py-14">
          <div className="site-shell">
            <p className="eyebrow text-[#f4be67]">
              PERSONALISED SUPPORT PATHWAY
            </p>
            <h1 className="mt-3 max-w-3xl font-display text-4xl leading-none tracking-[-.04em] sm:text-5xl">
              Start with your business reality. Build the next right move.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/65">
              Answer practical eligibility questions as well as your business
              needs. SAGE separates a verified-support scenario from pathways
              that still need live confirmation.
            </p>
            <div className="mt-5 flex max-w-4xl gap-2 rounded-xl border border-[#f4be67]/25 bg-white/5 p-3 text-xs leading-5 text-white/75">
              <Info className="mt-0.5 size-4 shrink-0 text-[#f4be67]" />
              {edgeTransitionNotice}
            </div>
            {submitted && (
              <button
                type="button"
                onClick={resetAdvisor}
                className="mt-5 rounded-full border border-white/25 px-3 py-1.5 text-xs font-bold text-white/80 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4be67]"
              >
                Clear this browser session and start again
              </button>
            )}
          </div>
        </section>
        <section className="site-shell py-8 sm:py-12">
          <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="rounded-[26px] border border-[#0b2947]/10 bg-white p-5 shadow-[0_14px_36px_rgba(11,41,71,.05)] sm:p-8">
              <div className="flex items-center gap-2 text-[10px] font-extrabold tracking-[.12em] text-slate-400">
                {[1, 2, 3].map(item => (
                  <div key={item} className="flex items-center gap-2">
                    <span
                      className={cn(
                        "flex size-6 items-center justify-center rounded-full",
                        item <= step
                          ? "bg-[#0b2947] text-white"
                          : "bg-slate-100 text-slate-400"
                      )}
                    >
                      {item}
                    </span>
                    {item < 3 && (
                      <span
                        className={cn(
                          "h-px w-8 sm:w-14",
                          item < step ? "bg-[#0b2947]" : "bg-slate-100"
                        )}
                      />
                    )}
                  </div>
                ))}
                <span className="ml-2">DIAGNOSTIC</span>
              </div>
              {step === 1 && (
                <div className="mt-7">
                  <p className="eyebrow">STEP 01 · THE BUSINESS PROBLEM</p>
                  <h2 className="mt-2 font-display text-3xl tracking-[-.035em]">
                    What is getting in the way?
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Select every constraint that matters now. We will use this
                    to build a focused pathway and identify the official facts
                    that need confirmation.
                  </p>
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {challenges.map(challenge => (
                      <ToggleCard
                        key={challenge.id}
                        active={profile.challenges.includes(challenge.id)}
                        title={challenge.title}
                        detail={challenge.detail}
                        onClick={() => toggleChallenge(challenge.id)}
                      />
                    ))}
                  </div>
                  <div className="mt-7">
                    <Label className="text-sm font-extrabold">
                      Your primary transformation goal
                    </Label>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {goals.map(goal => (
                        <button
                          key={goal.id}
                          type="button"
                          onClick={() => update("primaryGoal", goal.id)}
                          className={cn(
                            "rounded-full border px-3.5 py-2 text-xs font-bold transition-colors",
                            profile.primaryGoal === goal.id
                              ? "border-[#3f746d] bg-[#eaf5f2] text-[#28665f]"
                              : "border-slate-200 bg-white text-slate-600 hover:border-[#3f746d]/40"
                          )}
                        >
                          {goal.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {step === 2 && (
                <div className="mt-7">
                  <p className="eyebrow">
                    STEP 02 · OFFICIAL ELIGIBILITY FACTS
                  </p>
                  <h2 className="mt-2 font-display text-3xl tracking-[-.035em]">
                    Confirm the facts that change the result.
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    These answers do not replace the official assessment. They
                    prevent the calculator from assuming support before the
                    basic programme conditions are met.
                  </p>
                  <div className="mt-7 grid gap-6 sm:grid-cols-2">
                    <div>
                      <Label className="text-sm font-extrabold">Sector</Label>
                      <Select
                        value={profile.sector}
                        onValueChange={value =>
                          update("sector", value as Sector)
                        }
                      >
                        <SelectTrigger className="mt-2 h-11 bg-[#faf8f3]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(sectorPathways).map(([key, path]) => (
                            <SelectItem key={key} value={key}>
                              {path.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-sm font-extrabold">
                        Company size
                      </Label>
                      <Select
                        value={profile.companySize}
                        onValueChange={value =>
                          update(
                            "companySize",
                            value as DiagnosticProfile["companySize"]
                          )
                        }
                      >
                        <SelectTrigger className="mt-2 h-11 bg-[#faf8f3]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="micro">
                            Micro (1–9 employees)
                          </SelectItem>
                          <SelectItem value="small">
                            Small (10–49 employees)
                          </SelectItem>
                          <SelectItem value="medium">
                            Medium (50–199 employees)
                          </SelectItem>
                          <SelectItem value="growth">
                            Growth stage (200+ employees)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-sm font-extrabold">
                        Group annual turnover
                      </Label>
                      <Select
                        value={profile.annualRevenue}
                        onValueChange={value =>
                          update(
                            "annualRevenue",
                            value as DiagnosticProfile["annualRevenue"]
                          )
                        }
                      >
                        <SelectTrigger className="mt-2 h-11 bg-[#faf8f3]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="under-1m">
                            Under S$1 million
                          </SelectItem>
                          <SelectItem value="1m-10m">S$1–10 million</SelectItem>
                          <SelectItem value="10m-100m">
                            S$10–100 million
                          </SelectItem>
                          <SelectItem value="over-100m">
                            Over S$100 million
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-sm font-extrabold">
                        Group employment size
                      </Label>
                      <Input
                        className="mt-2 h-11 bg-[#faf8f3]"
                        value={profile.groupEmployeeCount || ""}
                        inputMode="numeric"
                        onChange={event =>
                          update(
                            "groupEmployeeCount",
                            Math.min(
                              999999999,
                              Number(
                                event.target.value.replace(/[^0-9]/g, "")
                              ) || 0
                            )
                          )
                        }
                      />
                    </div>
                  </div>
                  <div className="mt-7 grid gap-6 border-t border-slate-100 pt-6 sm:grid-cols-2">
                    <div>
                      <Label className="text-sm font-extrabold">
                        Applicant registered and operating in Singapore?
                      </Label>
                      <RadioGroup
                        value={profile.registeredInSingapore}
                        onValueChange={value =>
                          update("registeredInSingapore", value as YesNoUnsure)
                        }
                        className="mt-3 space-y-2"
                      >
                        {answerOptions.map(([value, label]) => (
                          <Label
                            key={value}
                            className="flex cursor-pointer items-center gap-2 text-sm font-medium"
                          >
                            <RadioGroupItem value={value} />
                            {label}
                          </Label>
                        ))}
                      </RadioGroup>
                    </div>
                    <div>
                      <Label className="text-sm font-extrabold">
                        At least 30% local shareholding?
                      </Label>
                      <RadioGroup
                        value={profile.localShareholding}
                        onValueChange={value =>
                          update("localShareholding", value as YesNoUnsure)
                        }
                        className="mt-3 space-y-2"
                      >
                        {answerOptions.map(([value, label]) => (
                          <Label
                            key={value}
                            className="flex cursor-pointer items-center gap-2 text-sm font-medium"
                          >
                            <RadioGroupItem value={value} />
                            {label}
                          </Label>
                        ))}
                      </RadioGroup>
                    </div>
                    <div>
                      <Label className="text-sm font-extrabold">
                        Any project work started, contract signed, payment or
                        deposit made?
                      </Label>
                      <RadioGroup
                        value={profile.projectStarted}
                        onValueChange={value =>
                          update("projectStarted", value as YesNoUnsure)
                        }
                        className="mt-3 space-y-2"
                      >
                        {answerOptions.map(([value, label]) => (
                          <Label
                            key={value}
                            className="flex cursor-pointer items-center gap-2 text-sm font-medium"
                          >
                            <RadioGroupItem value={value} />
                            {label}
                          </Label>
                        ))}
                      </RadioGroup>
                    </div>
                    <div>
                      <Label className="text-sm font-extrabold">
                        Financially viable to start and complete a possible EDG
                        project?
                      </Label>
                      <RadioGroup
                        value={profile.edgFinancialReadiness}
                        onValueChange={value =>
                          update("edgFinancialReadiness", value as YesNoUnsure)
                        }
                        className="mt-3 space-y-2"
                      >
                        {answerOptions.map(([value, label]) => (
                          <Label
                            key={value}
                            className="flex cursor-pointer items-center gap-2 text-sm font-medium"
                          >
                            <RadioGroupItem value={value} />
                            {label}
                          </Label>
                        ))}
                      </RadioGroup>
                    </div>
                    <div>
                      <Label className="text-sm font-extrabold">
                        Notified that this employer is eligible for current
                        SFEC?
                      </Label>
                      <RadioGroup
                        value={profile.sfecNotification}
                        onValueChange={value =>
                          update("sfecNotification", value as YesNoUnsure)
                        }
                        className="mt-3 space-y-2"
                      >
                        {answerOptions.map(([value, label]) => (
                          <Label
                            key={value}
                            className="flex cursor-pointer items-center gap-2 text-sm font-medium"
                          >
                            <RadioGroupItem value={value} />
                            {label}
                          </Label>
                        ))}
                      </RadioGroup>
                    </div>
                  </div>
                  {isMarketRouteRelevant && (
                    <div className="mt-7 border-t border-slate-100 pt-6">
                      <p className="eyebrow text-[#bd4a46]">
                        MRA FACTS FOR THIS MARKET PATHWAY
                      </p>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        MRA requires one activity in a qualifying new overseas
                        market. These answers control whether a market-support
                        scenario can be included.
                      </p>
                      <div className="mt-5 grid gap-6 sm:grid-cols-3">
                        <div>
                          <Label className="text-sm font-extrabold">
                            Target-market history
                          </Label>
                          <Select
                            value={profile.mraMarketStatus}
                            onValueChange={value =>
                              update(
                                "mraMarketStatus",
                                value as DiagnosticProfile["mraMarketStatus"]
                              )
                            }
                          >
                            <SelectTrigger className="mt-2 h-11 bg-[#faf8f3]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="new-and-under-100k">
                                New; sales under S$100k for each of 3 years
                              </SelectItem>
                              <SelectItem value="not-new-or-over-100k">
                                Not new or sales exceeded S$100k
                              </SelectItem>
                              <SelectItem value="unsure">Not sure</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-sm font-extrabold">
                            One MRA activity
                          </Label>
                          <Select
                            value={profile.mraActivity}
                            onValueChange={value =>
                              update("mraActivity", value as MraActivity)
                            }
                          >
                            <SelectTrigger className="mt-2 h-11 bg-[#faf8f3]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="promotion">
                                Overseas market promotion
                              </SelectItem>
                              <SelectItem value="business-development">
                                Overseas business development
                              </SelectItem>
                              <SelectItem value="market-set-up">
                                Overseas market set-up
                              </SelectItem>
                              <SelectItem value="unsure">Not sure</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-sm font-extrabold">
                            Project start timing
                          </Label>
                          <Select
                            value={profile.mraTiming}
                            onValueChange={value =>
                              update(
                                "mraTiming",
                                value as DiagnosticProfile["mraTiming"]
                              )
                            }
                          >
                            <SelectTrigger className="mt-2 h-11 bg-[#faf8f3]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="within-six-months">
                                Within six months
                              </SelectItem>
                              <SelectItem value="more-than-six-months">
                                More than six months away
                              </SelectItem>
                              <SelectItem value="unsure">Not sure</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              {step === 3 && (
                <div className="mt-7">
                  <p className="eyebrow">STEP 03 · REVIEW YOUR BRIEF</p>
                  <h2 className="mt-2 font-display text-3xl tracking-[-.035em]">
                    Ready to map your support pathway.
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    The output will include only confirmed, eligible scenarios
                    in its headline estimate. Everything else remains a pathway
                    to verify on the official source.
                  </p>
                  <div className="mt-7 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl bg-[#f4f7fb] p-5">
                      <p className="text-[10px] font-extrabold tracking-[.14em] text-slate-400">
                        BUSINESS CONTEXT
                      </p>
                      <p className="mt-3 text-lg font-extrabold">
                        {sector.label} · {profile.groupEmployeeCount} group
                        employees
                      </p>
                      <p className="mt-2 text-sm text-slate-600">
                        Goal:{" "}
                        {
                          goals.find(goal => goal.id === profile.primaryGoal)
                            ?.label
                        }
                      </p>
                    </div>
                    <div className="rounded-2xl bg-[#eef7f4] p-5">
                      <p className="text-[10px] font-extrabold tracking-[.14em] text-slate-400">
                        PRIORITIES
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {profile.challenges.map(id => (
                          <span
                            key={id}
                            className="rounded-full bg-white px-2.5 py-1 text-xs font-bold text-[#28665f]"
                          >
                            {challenges.find(item => item.id === id)?.title}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div
                    className={cn(
                      "mt-5 flex gap-3 rounded-xl border p-4",
                      excludedSchemes.length || profile.projectStarted === "yes"
                        ? "border-[#d97a56]/30 bg-[#fff6ef]"
                        : "border-[#3f746d]/20 bg-[#f2f9f7]"
                    )}
                  >
                    {excludedSchemes.length ||
                    profile.projectStarted === "yes" ? (
                      <AlertTriangle className="mt-0.5 size-5 shrink-0 text-[#d97a56]" />
                    ) : (
                      <ShieldCheck className="mt-0.5 size-5 shrink-0 text-[#3f746d]" />
                    )}
                    <p className="text-sm leading-6 text-slate-600">
                      {excludedSchemes.length
                        ? `The verified-support scenario will exclude ${excludedSchemes.join(", ")} based on the facts currently entered. You can still use the official-source cards to review alternative routes.`
                        : profile.projectStarted === "yes"
                          ? "Your results will not include PSG, EDG or MRA as a verified-support scenario because a commitment or project start may make applications retrospective."
                          : "No automatic exclusion is currently detected. You will still need to confirm live programme conditions and qualifying costs before relying on any amount."}
                    </p>
                  </div>
                </div>
              )}
              <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-6">
                <Button
                  variant="ghost"
                  onClick={() => setStep(current => Math.max(1, current - 1))}
                  disabled={step === 1}
                  className="gap-2 text-slate-600"
                >
                  <ArrowLeft className="size-4" />
                  Back
                </Button>
                {step < 3 ? (
                  <Button
                    onClick={() => setStep(current => current + 1)}
                    disabled={!canContinue}
                    className="gap-2 rounded-full bg-[#0b2947] px-5 text-white hover:bg-[#16466f]"
                  >
                    Continue <ArrowRight className="size-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={goResults}
                    className="gap-2 rounded-full bg-[#0b2947] px-5 text-white hover:bg-[#16466f]"
                  >
                    <WandSparkles className="size-4" />
                    Generate pathway
                  </Button>
                )}
              </div>
            </div>
            <aside className="h-fit rounded-[26px] border border-[#0b2947]/10 bg-[#eef4f1] p-6">
              <p className="eyebrow text-[#3f746d]">WHAT YOU WILL GET</p>
              <h2 className="mt-3 font-display text-3xl leading-none tracking-[-.035em]">
                A useful plan—not a grant promise.
              </h2>
              <div className="mt-7 space-y-5">
                {[
                  [
                    FileCheck2,
                    "Official-source pathways",
                    "Every scheme card links to its current Government source.",
                  ],
                  [
                    Scale,
                    "Eligibility-aware scenarios",
                    "The calculator excludes unverified or inapplicable routes.",
                  ],
                  [
                    CircleDollarSign,
                    "Cost-pool model",
                    "Use confirmed qualifying costs, caps and wallet balances.",
                  ],
                  [
                    ClipboardList,
                    "A downloadable 90-day plan",
                    "Turn recommendations into clear owner actions.",
                  ],
                ].map(([Icon, title, text]) => (
                  <div key={String(title)} className="flex gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#3f746d]">
                      <Icon className="size-4" />
                    </span>
                    <div>
                      <p className="text-sm font-extrabold">{String(title)}</p>
                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        {String(text)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-7 rounded-xl border border-[#e0b34c]/30 bg-[#fff9ed] p-3 text-xs leading-5 text-[#725819]">
                Official data checked {officialDataAsOf}. Programme criteria,
                availability and funding can change; confirm the live source
                before acting.
              </div>
            </aside>
          </div>
        </section>
        {submitted && (
          <section
            id="your-pathway"
            aria-live="polite"
            className="border-t border-[#0b2947]/8 bg-white/60 py-12 sm:py-16"
          >
            <div className="site-shell">
              <div className="max-w-3xl">
                <p className="eyebrow text-[#3f746d]">
                  YOUR PERSONALISED OUTPUT
                </p>
                <h2 className="mt-3 font-display text-5xl leading-none tracking-[-.045em]">
                  Your support pathway starts here.
                </h2>
                <p className="mt-5 text-base leading-7 text-slate-600">
                  For a {sector.label.toLowerCase()} business focused on{" "}
                  {goals
                    .find(goal => goal.id === profile.primaryGoal)
                    ?.label.toLowerCase()}
                  , SAGE separates the official routes that look relevant from
                  the conditions that still require live verification.
                </p>
              </div>
              <div className="mt-9 grid gap-4 md:grid-cols-3">
                {(
                  [
                    "Digital Foundation",
                    "Innovation Acceleration",
                    "Workforce Activation",
                  ] as StackName[]
                ).map(stack => {
                  const items = recommendations.filter(
                    item => item.stack === stack
                  );
                  const meta = stackMeta[stack];
                  return (
                    <article
                      key={stack}
                      className="relative overflow-hidden rounded-2xl border border-[#0b2947]/8 bg-white p-5"
                    >
                      <div
                        className="absolute inset-x-0 top-0 h-1.5"
                        style={{ background: meta.colour }}
                      />
                      <p
                        className="mt-1 text-[10px] font-extrabold tracking-[.14em]"
                        style={{ color: meta.colour }}
                      >
                        {meta.eyebrow}
                      </p>
                      <h3 className="mt-2 text-xl font-extrabold tracking-tight">
                        {stack}
                      </h3>
                      <p className="mt-2 min-h-12 text-xs leading-5 text-slate-500">
                        {meta.description}
                      </p>
                      <div className="mt-5 flex flex-wrap gap-2">
                        {items.length ? (
                          items.map(item => (
                            <span
                              key={item.id}
                              className="rounded-full bg-[#faf8f3] px-2.5 py-1 text-xs font-extrabold"
                            >
                              {item.id}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs font-semibold text-slate-400">
                            No relevant pathway surfaced
                          </span>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
              {recommendations.length ? (
                <div className="mt-8 grid gap-4 lg:grid-cols-2">
                  {recommendations.map(item => (
                    <RecommendationCard key={item.id} item={item} />
                  ))}
                </div>
              ) : (
                <div className="mt-8 rounded-2xl border border-[#d97a56]/30 bg-[#fff6ef] p-5 text-sm leading-6 text-[#725819]">
                  No support route can be presented from the current confirmed
                  facts. Review the official sources and amend the diagnostic
                  only where you can verify a changed fact.
                </div>
              )}
              <section className="mt-8 rounded-[26px] border border-[#bd4a46]/20 bg-[#fff8f6] p-5 sm:p-7">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-[#bd4a46] text-white">
                    <ShieldCheck className="size-5" />
                  </span>
                  <div>
                    <p className="eyebrow text-[#bd4a46]">
                      COMPLIANCE & SEQUENCING
                    </p>
                    <h2 className="mt-1 font-display text-3xl tracking-[-.035em]">
                      Protect the plan before you fund it.
                    </h2>
                  </div>
                </div>
                <div className="mt-6 grid gap-3 lg:grid-cols-2">
                  {compliance.map((item, index) => (
                    <div
                      key={`${item.scheme}-${index}`}
                      className="flex gap-3 rounded-xl border border-[#bd4a46]/12 bg-white/75 p-4"
                    >
                      <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[#f8e3de] text-[9px] font-extrabold text-[#bd4a46]">
                        {item.scheme === "Critical" ? "!" : item.scheme}
                      </span>
                      <p className="text-sm leading-6 text-slate-600">
                        {item.rule}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
              <section className="mt-8">
                <p className="eyebrow">APPLICATION SEQUENCE</p>
                <h2 className="mt-2 font-display text-3xl tracking-[-.035em]">
                  A controlled way to move from idea to evidence.
                </h2>
                <div className="mt-6 overflow-x-auto pb-2">
                  <div className="flex min-w-max gap-3">
                    {sequence.map(item => (
                      <article
                        key={item.step}
                        className="w-[220px] rounded-2xl border border-[#0b2947]/9 bg-white p-5"
                      >
                        <p className="text-xs font-extrabold tracking-[.14em] text-[#d97a56]">
                          {item.step}
                        </p>
                        <h3 className="mt-5 text-sm font-extrabold leading-5">
                          {item.title}
                        </h3>
                        <p className="mt-3 text-xs leading-5 text-slate-500">
                          {item.detail}
                        </p>
                      </article>
                    ))}
                  </div>
                </div>
              </section>
              <section className="mt-8 rounded-[26px] bg-[#0b2947] p-6 text-white sm:p-8">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="eyebrow text-[#f4be67]">
                      YOUR SECTOR PATHWAY · {sector.label.toUpperCase()}
                    </p>
                    <h2 className="mt-2 font-display text-3xl tracking-[-.035em]">
                      {sector.focus}
                    </h2>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {sector.examples.map(item => (
                        <span
                          key={item}
                          className="rounded-full bg-white/8 px-3 py-1.5 text-xs font-semibold text-white/75"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href={sector.idpUrl}
                    className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-[#0b2947] transition-transform hover:-translate-y-0.5 active:scale-[.97]"
                  >
                    Open IMDA Industry Digital Plans{" "}
                    <ExternalLink className="size-4" />
                  </a>
                </div>
              </section>
              <div className="mt-8">
                <SupportCalculator profile={profile} updateProfile={update} />
              </div>
              <section className="mt-8 rounded-[26px] border border-[#0b2947]/10 bg-[#f5f8fc] p-6 sm:p-8">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="eyebrow">MAKE IT ACTIONABLE</p>
                    <h2 className="mt-2 font-display text-3xl tracking-[-.035em]">
                      Download your individual 90-day plan as a PDF.
                    </h2>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                      Your plan is generated in your browser and is not stored
                      by SAGE. It carries your priorities, current
                      official-source pathways, compliance checkpoints and a
                      suggested sequence.
                    </p>
                  </div>
                  <Button
                    onClick={downloadPlanPdf}
                    className="w-fit gap-2 rounded-full bg-[#0b2947] px-5 py-6 text-white hover:bg-[#16466f]"
                  >
                    <Download className="size-4" />
                    Download PDF plan
                  </Button>
                </div>
              </section>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

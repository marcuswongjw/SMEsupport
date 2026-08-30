import { describe, expect, it } from "vitest";
import {
  buildActionPlan,
  calculateIndicativeSupport,
  getCompliance,
  getRecommendations,
  getSchemeAssessments,
  sanitizeDiagnosticProfile,
  type CostInputs,
  type DiagnosticProfile,
  type SfecEligiblePools,
  type SupportConfirmations,
} from "@shared/advisor";

const baseProfile: DiagnosticProfile = {
  challenges: ["manual-work", "workforce"],
  sector: "retail",
  companySize: "small",
  annualRevenue: "1m-10m",
  groupEmployeeCount: 18,
  registeredInSingapore: "yes",
  localShareholding: "yes",
  projectStarted: "no",
  edgFinancialReadiness: "yes",
  mraMarketStatus: "unsure",
  mraActivity: "unsure",
  mraTiming: "unsure",
  sfecNotification: "yes",
  sfecTotalCreditAvailable: 10000,
  sfecEnterpriseCreditAvailable: 7000,
  primaryGoal: "productivity",
};

const confirmedCosts: SupportConfirmations = {
  psgQualifyingCostConfirmed: true,
  psgRemainingAnnualCap: 30000,
  edgQualifyingCostConfirmed: true,
  mraQualifyingCostConfirmed: true,
  mraPillarCapAvailable: true,
};

const sfecEligible: SfecEligiblePools = {
  digital: true,
  transformation: true,
  market: true,
  workforce: true,
};

const zeroCosts: CostInputs = {
  digital: 0,
  transformation: 0,
  market: 0,
  workforce: 0,
};

describe("official-policy recommendation rules", () => {
  it("recommends eligible digital and workforce pathways without treating WDG as cash support", () => {
    const result = getRecommendations(baseProfile);
    expect(result.find(item => item.id === "PSG")?.fit).toBe("Strong fit");
    expect(result.find(item => item.id === "SFEC")?.fit).toBe("Strong fit");
    expect(result.find(item => item.id === "WDG")?.fit).toBe(
      "Capability pathway"
    );
  });

  it("includes MRA only after all official facts needed by this model are confirmed", () => {
    const incomplete = getRecommendations({
      ...baseProfile,
      challenges: ["overseas-growth"],
      primaryGoal: "market",
    });
    expect(incomplete.find(item => item.id === "MRA")?.fit).toBe(
      "Potential fit"
    );

    const confirmed = getRecommendations({
      ...baseProfile,
      challenges: ["overseas-growth"],
      primaryGoal: "market",
      mraMarketStatus: "new-and-under-100k",
      mraActivity: "promotion",
      mraTiming: "within-six-months",
    });
    expect(confirmed.find(item => item.id === "MRA")?.fit).toBe("Strong fit");
  });

  it("excludes PSG, EDG and MRA when local ownership fails", () => {
    const result = getRecommendations({
      ...baseProfile,
      challenges: ["manual-work", "process-redesign", "overseas-growth"],
      localShareholding: "no",
    }).map(item => item.id);
    expect(result).not.toContain("PSG");
    expect(result).not.toContain("EDG");
    expect(result).not.toContain("MRA");
  });

  it("keeps the SME-specific pathways conditional when turnover is above S$100m and group employment is unknown", () => {
    const assessments = getSchemeAssessments({
      ...baseProfile,
      annualRevenue: "over-100m",
      groupEmployeeCount: 0,
    });
    expect(assessments.PSG.status).toBe("conditional");
    expect(assessments.MRA.status).toBe("conditional");
  });

  it("distinguishes the official 30% EDG scenario for non-SMEs", () => {
    const profile = {
      ...baseProfile,
      challenges: ["process-redesign"] as const,
      annualRevenue: "over-100m" as const,
      groupEmployeeCount: 201,
    };
    const assessments = getSchemeAssessments(profile);
    expect(assessments.EDG.status).toBe("eligible");
    expect(assessments.EDG.supportRate).toBe(0.3);
    expect(
      getRecommendations(profile).find(item => item.id === "EDG")?.fit
    ).toBe("Strong fit");
  });

  it("excludes retrospective-scenario grants from recommendations and cash estimates", () => {
    const profile = {
      ...baseProfile,
      challenges: ["manual-work", "process-redesign"] as const,
      projectStarted: "yes" as const,
    };
    expect(getRecommendations(profile).map(item => item.id)).not.toContain(
      "PSG"
    );
    expect(getRecommendations(profile).map(item => item.id)).not.toContain(
      "EDG"
    );

    const calculated = calculateIndicativeSupport(
      { digital: 10000, transformation: 10000, market: 0, workforce: 0 },
      profile,
      sfecEligible,
      confirmedCosts
    );
    expect(calculated.rows[0]?.status).toBe("not-applicable");
    expect(calculated.rows[1]?.status).toBe("not-applicable");
    expect(calculated.rows[0]?.support).toBe(0);
    expect(calculated.rows[1]?.support).toBe(0);
  });
});

describe("verified-support calculator", () => {
  it("uses the entered remaining PSG annual cap rather than assuming a per-project cap", () => {
    const calculated = calculateIndicativeSupport(
      { digital: 100000, transformation: 0, market: 0, workforce: 0 },
      baseProfile,
      sfecEligible,
      { ...confirmedCosts, psgRemainingAnnualCap: 4000 }
    );
    expect(calculated.rows[0]?.support).toBe(4000);
  });

  it("applies the selected official MRA activity cap", () => {
    const profile = {
      ...baseProfile,
      challenges: ["overseas-growth"] as const,
      primaryGoal: "market" as const,
      mraMarketStatus: "new-and-under-100k" as const,
      mraActivity: "promotion" as const,
      mraTiming: "within-six-months" as const,
    };
    const calculated = calculateIndicativeSupport(
      { digital: 0, transformation: 0, market: 200000, workforce: 0 },
      profile,
      sfecEligible,
      confirmedCosts
    );
    expect(calculated.rows[2]?.status).toBe("included");
    expect(calculated.rows[2]?.support).toBe(20000);
  });

  it("does not calculate MRA where market history or timing fails", () => {
    const marketNotNew = {
      ...baseProfile,
      challenges: ["overseas-growth"] as const,
      primaryGoal: "market" as const,
      mraMarketStatus: "not-new-or-over-100k" as const,
      mraActivity: "promotion" as const,
      mraTiming: "within-six-months" as const,
    };
    const timingOutsideWindow = {
      ...baseProfile,
      challenges: ["overseas-growth"] as const,
      primaryGoal: "market" as const,
      mraMarketStatus: "new-and-under-100k" as const,
      mraActivity: "promotion" as const,
      mraTiming: "more-than-six-months" as const,
    };
    expect(
      calculateIndicativeSupport(
        { ...zeroCosts, market: 20000 },
        marketNotNew,
        sfecEligible,
        confirmedCosts
      ).rows[2]?.support
    ).toBe(0);
    expect(
      calculateIndicativeSupport(
        { ...zeroCosts, market: 20000 },
        timingOutsideWindow,
        sfecEligible,
        confirmedCosts
      ).rows[2]?.support
    ).toBe(0);
  });

  it("includes SFEC only with a confirmed notification, wallet balance and supportable cost", () => {
    const costs = {
      digital: 10000,
      transformation: 0,
      market: 0,
      workforce: 10000,
    };
    const eligible = calculateIndicativeSupport(
      costs,
      baseProfile,
      sfecEligible,
      confirmedCosts
    );
    expect(eligible.rows[0]?.support).toBe(5000);
    expect(eligible.sfecEnterprise).toBe(4500);
    expect(eligible.sfecWorkforce).toBe(5500);
    expect(eligible.totalSupport).toBe(15000);

    const unconfirmed = calculateIndicativeSupport(
      costs,
      { ...baseProfile, sfecNotification: "unsure" },
      sfecEligible,
      confirmedCosts
    );
    expect(unconfirmed.sfecEnterprise).toBe(0);
    expect(unconfirmed.sfecWorkforce).toBe(0);

    const noWallet = calculateIndicativeSupport(
      costs,
      {
        ...baseProfile,
        sfecTotalCreditAvailable: 0,
        sfecEnterpriseCreditAvailable: 0,
      },
      sfecEligible,
      confirmedCosts
    );
    expect(noWallet.sfecEnterprise).toBe(0);
    expect(noWallet.sfecWorkforce).toBe(0);
  });

  it("does not insert a WDG cash estimate while the live route remains unverified", () => {
    const calculated = calculateIndicativeSupport(
      { ...zeroCosts, workforce: 300000 },
      baseProfile,
      sfecEligible,
      confirmedCosts
    );
    expect(calculated.rows[3]?.support).toBe(0);
    expect(calculated.rows[3]?.status).toBe("requires-verification");
  });

  it("rejects non-finite and negative inputs rather than propagating them into totals", () => {
    const calculated = calculateIndicativeSupport(
      {
        digital: Number.POSITIVE_INFINITY,
        transformation: -1,
        market: Number.NaN,
        workforce: 2.9,
      },
      baseProfile,
      sfecEligible,
      confirmedCosts
    );
    expect(calculated.totalGross).toBe(2);
    expect(Number.isFinite(calculated.totalSupport)).toBe(true);
  });
});

describe("state safety and output", () => {
  it("sanitizes malformed browser state field by field and migrates legacy employeeCount", () => {
    const result = sanitizeDiagnosticProfile(
      {
        ...baseProfile,
        sector: "invalid",
        challenges: "manual-work",
        groupEmployeeCount: -10,
        employeeCount: 99,
        sfecTotalCreditAvailable: Number.POSITIVE_INFINITY,
        mraActivity: "invalid",
      },
      baseProfile
    );

    expect(result.sector).toBe(baseProfile.sector);
    expect(result.challenges).toEqual(baseProfile.challenges);
    expect(result.groupEmployeeCount).toBe(baseProfile.groupEmployeeCount);
    expect(result.sfecTotalCreditAvailable).toBe(
      baseProfile.sfecTotalCreditAvailable
    );
    expect(result.mraActivity).toBe(baseProfile.mraActivity);

    const legacy = sanitizeDiagnosticProfile(
      { ...baseProfile, groupEmployeeCount: undefined, employeeCount: 99 },
      baseProfile
    );
    expect(legacy.groupEmployeeCount).toBe(99);
  });

  it("flags started projects and excluded schemes in compliance guidance", () => {
    const profile = {
      ...baseProfile,
      challenges: ["manual-work"] as const,
      projectStarted: "yes" as const,
    };
    const rules = getCompliance(profile, getRecommendations(profile));
    expect(rules[0]?.scheme).toBe("Critical");
    expect(rules.some(item => item.rule.includes("retrospective"))).toBe(true);
  });

  it("builds an official-source-aware downloadable action plan", () => {
    const recommendations = getRecommendations(baseProfile);
    const plan = buildActionPlan(baseProfile, recommendations);
    expect(plan).toContain("90-Day SME Transformation Action Plan");
    expect(plan).toContain("current as at 30 August 2026");
    expect(plan).toContain("Digital Foundation");
  });
});

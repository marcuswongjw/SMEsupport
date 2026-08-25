import { describe, expect, it } from "vitest";
import { buildActionPlan, calculateIndicativeSupport, getCompliance, getRecommendations, sanitizeDiagnosticProfile, type DiagnosticProfile } from "@shared/advisor";

const baseProfile: DiagnosticProfile = {
  challenges: ["manual-work", "workforce"],
  sector: "retail",
  companySize: "small",
  annualRevenue: "1m-10m",
  employeeCount: 18,
  localShareholding: "yes",
  projectStarted: "no",
  primaryGoal: "productivity",
};

describe("advisor recommendation rules", () => {
  it("recommends a digital and workforce route for a retail productivity case", () => {
    const result = getRecommendations(baseProfile).map((item) => item.id);
    expect(result).toContain("PSG");
    expect(result).toContain("SFEC");
    expect(result).toContain("WDG");
  });

  it("adds MRA for an overseas-growth case", () => {
    const result = getRecommendations({ ...baseProfile, challenges: ["overseas-growth"], primaryGoal: "market" }).map((item) => item.id);
    expect(result).toContain("MRA");
  });

  it("does not present SME grants when the stated ownership requirement fails", () => {
    const result = getRecommendations({ ...baseProfile, localShareholding: "no" }).map((item) => item.id);
    expect(result).not.toContain("PSG");
    expect(result).not.toContain("EDG");
    expect(result).not.toContain("MRA");
  });

  it("downgrades grant fit when ownership or project-start status is uncertain", () => {
    const uncertain = getRecommendations({ ...baseProfile, localShareholding: "unsure" });
    expect(uncertain.find((item) => item.id === "PSG")?.fit).toBe("Potential fit");

    const started = getRecommendations({ ...baseProfile, projectStarted: "yes" });
    expect(started.find((item) => item.id === "PSG")?.fit).toBe("Potential fit");
  });

  it("applies published caps to the illustrative calculator", () => {
    const result = calculateIndicativeSupport({ digital: 100000, transformation: 10000, market: 200000, workforce: 300000 });
    expect(result.rows[0]?.support).toBe(30000);
    expect(result.rows[2]?.support).toBe(100000);
    expect(result.rows[3]?.support).toBe(150000);
    expect(result.totalNet).toBeGreaterThanOrEqual(0);
  });

  it("only adds SFEC for cost pools explicitly confirmed as supportable", () => {
    const input = { digital: 10000, transformation: 10000, market: 10000, workforce: 10000 };
    expect(calculateIndicativeSupport(input).sfecEnterprise).toBe(0);

    const confirmed = calculateIndicativeSupport(input, { digital: true, transformation: false, market: false, workforce: true });
    expect(confirmed.sfecEnterprise).toBe(4500);
    expect(confirmed.sfecWorkforce).toBe(2700);
  });

  it("sanitizes malformed browser state field by field", () => {
    const result = sanitizeDiagnosticProfile({
      ...baseProfile,
      sector: "invalid",
      challenges: "manual-work",
      employeeCount: -10,
    }, baseProfile);

    expect(result.sector).toBe(baseProfile.sector);
    expect(result.challenges).toEqual(baseProfile.challenges);
    expect(result.employeeCount).toBe(baseProfile.employeeCount);
  });

  it("flags a started project and the SFEC deadline in compliance guidance", () => {
    const profile = { ...baseProfile, projectStarted: "yes" as const };
    const rules = getCompliance(profile, getRecommendations(profile));
    expect(rules[0]?.scheme).toBe("Critical");
    expect(rules.some((item) => item.rule.includes("30 November 2026"))).toBe(true);
  });

  it("builds a personalised downloadable action plan", () => {
    const recommendations = getRecommendations(baseProfile);
    const plan = buildActionPlan(baseProfile, recommendations);
    expect(plan).toContain("90-Day SME Transformation Action Plan");
    expect(plan).toContain("Digital Foundation");
    expect(plan).toContain("Workforce Activation");
  });
});

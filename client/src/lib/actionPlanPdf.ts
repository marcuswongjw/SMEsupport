import { jsPDF } from "jspdf";
import { sectorPathways, type DiagnosticProfile, type Recommendation } from "@shared/advisor";

type PdfInput = {
  profile: DiagnosticProfile;
  recommendations: Recommendation[];
  compliance: Array<{ scheme: string; rule: string }>;
  sequence: Array<{ step: string; title: string; detail: string }>;
  goalLabel: string;
  challengeLabels: string[];
};

export function downloadActionPlanPdf({ profile, recommendations, compliance, sequence, goalLabel, challengeLabels }: PdfInput) {
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;
  let y = 16;

  const ensureSpace = (height: number) => {
    if (y + height <= pageHeight - 17) return;
    pdf.addPage();
    y = 18;
  };
  const paragraph = (text: string, size = 9.5, colour: [number, number, number] = [71, 84, 96], spacing = 5.2) => {
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(size);
    pdf.setTextColor(...colour);
    const lines = pdf.splitTextToSize(text, contentWidth);
    ensureSpace(lines.length * spacing + 4);
    pdf.text(lines, margin, y);
    y += lines.length * spacing + 4;
  };
  const section = (eyebrow: string, title: string) => {
    ensureSpace(20);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(7.5);
    pdf.setTextColor(217, 122, 86);
    pdf.text(eyebrow.toUpperCase(), margin, y);
    y += 6;
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);
    pdf.setTextColor(11, 41, 71);
    pdf.text(title, margin, y);
    y += 8;
  };
  const bullet = (label: string, text: string) => {
    const line = `${label}: ${text}`;
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    pdf.setTextColor(71, 84, 96);
    const lines = pdf.splitTextToSize(line, contentWidth - 6);
    ensureSpace(lines.length * 5 + 3);
    pdf.setFillColor(63, 116, 109);
    pdf.circle(margin + 1.5, y - 1.1, 1.2, "F");
    pdf.text(lines, margin + 6, y);
    y += lines.length * 5 + 3;
  };

  pdf.setFillColor(11, 41, 71);
  pdf.rect(0, 0, pageWidth, 48, "F");
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(9);
  pdf.setTextColor(244, 190, 103);
  pdf.text("SAGE · SME SUPPORT NAVIGATOR", margin, 15);
  pdf.setFontSize(23);
  pdf.setTextColor(255, 255, 255);
  pdf.text("Your 90-Day Transformation Plan", margin, 27);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  pdf.setTextColor(213, 227, 224);
  pdf.text(`Generated ${new Date().toLocaleDateString("en-SG", { day: "numeric", month: "long", year: "numeric" })}`, margin, 38);
  y = 60;

  section("YOUR TRANSFORMATION BRIEF", "The business outcome to focus on");
  paragraph(`${sectorPathways[profile.sector].focus} Your stated primary goal is to ${goalLabel.toLowerCase()}.`);
  bullet("Sector", sectorPathways[profile.sector].label);
  bullet("Business priorities", challengeLabels.join("; ") || "Not specified");
  bullet("Likely support pathways", recommendations.map((item) => `${item.id} — ${item.name}`).join("; "));

  section("DAYS 1–15", "Diagnose and protect eligibility");
  paragraph("Confirm one business constraint and establish a baseline measure. Assign a business owner, workforce lead and evidence owner. Review the relevant Industry Digital Plan and official scheme pages before engaging a provider.");
  section("DAYS 16–30", "Design one integrated transformation plan");
  paragraph("Separate the cost pools for Digital Foundation, Innovation Acceleration and Workforce Activation. Prepare a clear project brief, compliant quotations and a workforce impact plan. Do not create overlapping claims for the same invoice or cost item.");
  section("DAYS 31–60", "Verify live terms and submit ready applications");
  paragraph("Check every live eligibility requirement, eligible cost, provider status, course route and funding condition. Submit only the components that are ready. Ensure the intended activity has not started if the scheme prohibits retrospective applications.");
  section("DAYS 61–90", "Mobilise, evidence and measure");
  paragraph("Begin only activities permitted under the relevant application or Letter of Offer. Track quotations, contracts, invoices, payment evidence, delivery records, staff participation and before-and-after outcome measures as the work happens.");

  section("SUGGESTED SEQUENCE", "Move through the work in a controlled order");
  sequence.forEach((item) => bullet(`${item.step} ${item.title}`, item.detail));

  section("COMPLIANCE CHECKPOINTS", "What to verify before committing");
  compliance.forEach((item) => bullet(item.scheme, item.rule));

  section("IMPORTANT", "Use this as a planning aid");
  paragraph("This personalised plan is not a grant approval, legal opinion or official interpretation. Grant criteria, funding levels, programme availability and claim requirements can change. Verify the current official scheme page and the terms of any Letter of Offer before signing a contract, making payment or commencing work.", 8.7, [112, 85, 29]);
  paragraph("Official starting points: Business Grants Portal (BGP), EnterpriseSG, SkillsFuture for Business, and IMDA SMEs Go Digital.", 8.7, [71, 84, 96]);

  const fileName = `SAGE-90-Day-Transformation-Plan-${sectorPathways[profile.sector].label.replace(/\s+/g, "-")}.pdf`;
  pdf.save(fileName);
}

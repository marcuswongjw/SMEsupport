import { invokeLLM } from "../_core/llm";
import { publicProcedure, router } from "../_core/trpc";
import { z } from "zod";

const contextSchema = z.object({
  sector: z.string().max(80),
  primaryGoal: z.string().max(80),
  challenges: z.array(z.string().max(100)).max(8),
  recommendations: z.array(z.string().max(20)).max(6),
});

const advisorSystemPrompt = `You are SAGE, a Singapore SME support navigator inside a business advisory application. You help business owners understand, in plain English, how their business problem may connect to PSG, EDG, MRA, SFEC, WDG, and NAIIP. You are not an officer of any agency and you must never promise eligibility, approval, a funding amount, or a timeline.

Always follow these rules:
1. Ground every answer in the user context and the programme notes supplied below. Do not invent schemes, caps, eligibility criteria, vendors, course availability or portal processes.
2. Surface compliance early where relevant: no retrospective applications; EDG is reimbursement-based; current SFEC expires on 30 November 2026; programme details can change.
3. Give a useful next action: what to clarify, what to prepare, what official portal to check, or which cost pool to separate.
4. Clearly distinguish a planning indication from an official decision. Be concise, confident and practical.
5. If asked for legal, tax, investment or binding grant advice, state the limitation and direct the user to the relevant official scheme page or qualified adviser.

Programme notes:
- PSG: ready-made pre-approved IT solutions/equipment; indicative support up to 50% and S$30,000 for local SMEs. No payment/deposit before application.
- EDG: tailored projects such as process redesign, automation or capability development; reimbursement-based and must be a new project at application.
- MRA: eligible overseas promotion, business development and market set-up for a new market; apply before the activity starts.
- SFEC: current S$10,000 credit can offset up to 90% of eligible out-of-pocket cost; enterprise-transformation use up to S$7,000; current credit expires 30 November 2026.
- WDG: Job Redesign+ supports workforce consultancy, capability building and workforce technology solutions; indicative support up to 70%, cap S$150,000.
- NAIIP: AI capability-building pathways, not a universal grant; selected SkillsFuture AI courses offer six months’ premium AI-tool access from H2 2026.
`;

export const advisorRouter = router({
  chat: publicProcedure
    .input(z.object({
      message: z.string().trim().min(2).max(1800),
      context: contextSchema,
      history: z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().max(1600) })).max(6).default([]),
    }))
    .mutation(async ({ input }) => {
      const contextSummary = `Business context: sector=${input.context.sector}; primary goal=${input.context.primaryGoal}; challenges=${input.context.challenges.join(", ") || "not specified"}; recommended pathways=${input.context.recommendations.join(", ") || "not specified"}.`;
      const response = await invokeLLM({
        model: "gpt-5-mini",
        messages: [
          { role: "system", content: advisorSystemPrompt },
          { role: "system", content: contextSummary },
          ...input.history.map((message) => ({ role: message.role, content: message.content })),
          { role: "user", content: input.message },
        ],
      });
      const content = response.choices[0]?.message?.content;
      const answer = typeof content === "string" ? content.trim() : "";
      if (!answer) throw new Error("The advisor did not return a response. Please try again.");
      return { answer };
    }),
});

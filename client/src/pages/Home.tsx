import { AppHeader } from "@/components/AppHeader";
import { Link } from "wouter";
import { ArrowRight, BadgeCheck, Building2, ClipboardCheck, Compass, Layers3, ShieldCheck, Sparkles } from "lucide-react";

const principles = [
  { number: "01", title: "Diagnose first", text: "Start with the operating constraint—not the grant name. Name the business problem, metric and owner." },
  { number: "02", title: "Build the right stack", text: "Match distinct cost pools across Digital Foundation, Innovation Acceleration and Workforce Activation." },
  { number: "03", title: "Commit safely", text: "Surface no-retrospective-application rules, cash-flow realities and evidence requirements before you act." },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#faf8f3] text-[#0b2947]">
      <AppHeader />
      <main>
        <section className="relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-[620px] hero-grid opacity-80" />
          <div className="absolute -right-32 top-12 size-[460px] rounded-full bg-[#b9d6d0]/35 blur-3xl" />
          <div className="absolute left-[12%] top-[380px] size-40 rounded-full bg-[#f3c978]/25 blur-3xl" />
          <div className="site-shell relative grid min-h-[650px] items-center gap-12 py-16 lg:grid-cols-[1.1fr_.9fr] lg:py-24">
            <div className="max-w-3xl">
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#0b2947]/10 bg-white/70 px-3 py-1.5 text-[11px] font-extrabold tracking-[.14em] text-[#3f746d] shadow-sm">
                <span className="size-1.5 rounded-full bg-[#d97a56]" /> SINGAPORE SME TRANSFORMATION, SIMPLIFIED
              </div>
              <h1 className="font-display max-w-3xl text-5xl leading-[.96] tracking-[-.045em] text-[#0b2947] sm:text-6xl lg:text-7xl">
                Turn a business challenge into a <span className="text-[#3f746d]">confident next move.</span>
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-600">
                SAGE guides Singapore SME owners from diagnosis to action—connecting practical business problems with relevant grants, programmes and a compliant transformation sequence.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Link href="/advisor" className="inline-flex items-center gap-3 rounded-full bg-[#0b2947] px-6 py-3.5 text-sm font-bold text-white shadow-[0_16px_32px_rgba(11,41,71,.2)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#16466f] active:scale-[.97]">
                  Find your support pathway <ArrowRight className="size-4" />
                </Link>
                <a href="#how-it-works" className="rounded-full px-5 py-3.5 text-sm font-bold text-[#0b2947] transition-colors hover:bg-white">See how it works</a>
              </div>
              <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-sm font-medium text-slate-500">
                <span className="inline-flex items-center gap-2"><ShieldCheck className="size-4 text-[#3f746d]" /> Plain-English guidance</span>
                <span className="inline-flex items-center gap-2"><BadgeCheck className="size-4 text-[#3f746d]" /> Official portal links</span>
                <span className="inline-flex items-center gap-2"><ClipboardCheck className="size-4 text-[#3f746d]" /> 90-day action plan</span>
              </div>
            </div>
            <div className="relative mx-auto w-full max-w-[465px] lg:justify-self-end">
              <div className="rounded-[28px] border border-white/80 bg-white/85 p-5 shadow-[0_30px_80px_rgba(11,41,71,.15)] backdrop-blur-sm">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3"><span className="flex size-9 items-center justify-center rounded-xl bg-[#e8eee9] text-[#3f746d]"><Sparkles className="size-4" /></span><div><p className="text-[11px] font-bold tracking-[.12em] text-slate-400">YOUR TRANSFORMATION MAP</p><p className="text-sm font-extrabold">Retail growth scenario</p></div></div>
                  <span className="rounded-full bg-[#e7f2ef] px-2.5 py-1 text-[10px] font-extrabold tracking-wide text-[#3f746d]">READY TO PLAN</span>
                </div>
                <div className="mt-5 space-y-3">
                  <div className="rounded-2xl border border-[#0b2947]/10 bg-[#f4f7fb] p-4"><p className="text-[10px] font-extrabold tracking-[.15em] text-[#0b2947]/55">DIGITAL FOUNDATION</p><p className="mt-1 text-sm font-bold">PSG for an eligible operating system</p><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#dce5f0]"><div className="h-full w-[78%] rounded-full bg-[#0b2947]" /></div></div>
                  <div className="rounded-2xl border border-[#bd4a46]/15 bg-[#fff6f4] p-4"><p className="text-[10px] font-extrabold tracking-[.15em] text-[#bd4a46]/70">INNOVATION ACCELERATION</p><p className="mt-1 text-sm font-bold">EDG for process redesign</p><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#f5d9d5]"><div className="h-full w-[54%] rounded-full bg-[#bd4a46]" /></div></div>
                  <div className="rounded-2xl border border-[#127b77]/15 bg-[#f0f8f6] p-4"><p className="text-[10px] font-extrabold tracking-[.15em] text-[#127b77]/70">WORKFORCE ACTIVATION</p><p className="mt-1 text-sm font-bold">SFEC and WDG for adoption</p><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#d5ebe7]"><div className="h-full w-[66%] rounded-full bg-[#127b77]" /></div></div>
                </div>
                <div className="mt-5 flex items-center justify-between rounded-2xl bg-[#0b2947] p-4 text-white"><div><p className="text-[10px] font-bold tracking-[.14em] text-white/50">NEXT DECISION</p><p className="mt-1 text-sm font-semibold">Verify before vendor commitment</p></div><ArrowRight className="size-5 text-[#f4be67]" /></div>
              </div>
              <div className="absolute -bottom-8 -left-6 hidden rounded-2xl border border-white/80 bg-white px-4 py-3 shadow-lg sm:block"><p className="text-[10px] font-extrabold tracking-[.13em] text-[#3f746d]">COMPLIANCE FIRST</p><p className="mt-1 text-xs font-bold">No retrospective applications</p></div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="border-y border-[#0b2947]/8 bg-white/60 py-20">
          <div className="site-shell">
            <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:items-end"><div><p className="eyebrow">A BETTER STARTING POINT</p><h2 className="mt-3 font-display text-4xl leading-none tracking-[-.04em]">Grant advice, re-centred on the business.</h2></div><p className="max-w-2xl text-base leading-7 text-slate-600">SAGE is designed to make support systems feel usable. It translates a company’s operating reality into a practical support pathway, then keeps the owner anchored on compliance, cash flow and measurable outcomes.</p></div>
            <div className="mt-12 grid gap-4 md:grid-cols-3">{principles.map((item) => <article key={item.number} className="rounded-2xl border border-[#0b2947]/8 bg-[#faf8f3] p-6 transition-transform duration-200 hover:-translate-y-1"><p className="text-xs font-extrabold tracking-[.16em] text-[#d97a56]">{item.number}</p><h3 className="mt-6 text-xl font-extrabold tracking-tight">{item.title}</h3><p className="mt-3 leading-6 text-slate-600">{item.text}</p></article>)}</div>
          </div>
        </section>

        <section className="site-shell py-20">
          <div className="rounded-[30px] bg-[#0b2947] px-7 py-10 text-white sm:px-12 sm:py-14">
            <div className="grid gap-10 lg:grid-cols-[1.2fr_.8fr] lg:items-center"><div><p className="eyebrow text-[#f4be67]">THE TRIPLE-STACK MODEL</p><h2 className="mt-3 font-display text-4xl leading-none tracking-[-.04em] sm:text-5xl">One transformation plan.<br />Three connected levers.</h2><p className="mt-5 max-w-xl leading-7 text-white/68">Technology without process change is expensive. Process change without adoption is fragile. The right sequence brings Digital Foundation, Innovation Acceleration and Workforce Activation together.</p></div><div className="grid gap-3">{[["Digital Foundation", Building2, "Systems, data and proven tools."], ["Innovation Acceleration", Layers3, "Operating-model and market change."], ["Workforce Activation", Compass, "Skills, role redesign and adoption."]].map(([label, Icon, text]) => <div key={String(label)} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4"><span className="flex size-10 items-center justify-center rounded-xl bg-white/10 text-[#f4be67]"><Icon className="size-5" /></span><div><p className="font-bold">{String(label)}</p><p className="mt-0.5 text-sm text-white/55">{String(text)}</p></div></div>)}</div></div>
          </div>
        </section>

        <section className="border-y border-[#0b2947]/8 bg-[#eef4f1] py-16">
          <div className="site-shell grid gap-8 lg:grid-cols-[.85fr_1.15fr] lg:items-center">
            <div className="rounded-[24px] bg-[#0b2947] p-7 text-white shadow-[0_18px_45px_rgba(11,41,71,.14)] sm:p-9">
              <p className="eyebrow text-[#f4be67]">CREATED BY MARCUS WONG</p>
              <p className="mt-4 font-display text-3xl leading-tight tracking-[-.035em]">A practitioner’s perspective on transformation, not a promise of funding.</p>
              <a href="https://www.linkedin.com/in/marcuswongjw/" target="_blank" rel="noreferrer" className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-[#f4be67] hover:text-white">View LinkedIn profile <ArrowRight className="size-4" /></a>
            </div>
            <div className="max-w-2xl">
              <p className="eyebrow text-[#3f746d]">WHY THIS EXISTS</p>
              <h2 className="mt-3 font-display text-4xl leading-none tracking-[-.04em]">Guidance shaped by work across policy, enterprise and workforce transformation.</h2>
              <p className="mt-5 text-base leading-7 text-slate-600">Marcus Wong has more than a decade of experience across Singapore’s public sector, startup ecosystem and higher education. His work has spanned enterprise and incentive programmes at Enterprise Singapore, transformation and manpower initiatives at CAAS, international innovation partnerships at NUS Enterprise, and current work in national AI and workforce development.</p>
              <p className="mt-4 text-sm leading-6 text-slate-500">SAGE is an independent planning tool informed by that experience. It is not a Government service, does not represent any agency, and does not guarantee scheme eligibility or funding.</p>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t border-[#0b2947]/8 py-8"><div className="site-shell flex flex-col gap-3 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between"><p>Planning guidance, not a grant approval or official interpretation.</p><p className="font-semibold text-[#0b2947]">SAGE · Singapore SME Support Navigator</p></div></footer>
    </div>
  );
}

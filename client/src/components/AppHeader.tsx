import { Link, useLocation } from "wouter";
import { ArrowUpRight, Compass } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Advisor", href: "/advisor" },
  { label: "Resources", href: "/resources" },
];

export function AppHeader() {
  const [location] = useLocation();
  return (
    <header className="sticky top-0 z-40 border-b border-slate-900/5 bg-[#faf8f3]/82 backdrop-blur-xl">
      <div className="site-shell flex h-[74px] items-center justify-between gap-6">
        <Link href="/" className="group flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-xl bg-[#0b2947] text-[#f4be67] shadow-[0_8px_22px_rgba(11,41,71,.18)] transition-transform duration-200 group-hover:-rotate-6">
            <Compass className="size-[18px]" />
          </span>
          <span className="leading-none">
            <strong className="block text-[13px] font-extrabold tracking-[.14em] text-[#0b2947]">SAGE</strong>
            <span className="mt-1 block text-[9px] font-bold tracking-[.18em] text-slate-500">SME SUPPORT NAVIGATOR</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary navigation">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={cn("rounded-full px-4 py-2 text-sm font-semibold transition-colors", location === item.href ? "bg-[#e8eee9] text-[#0b2947]" : "text-slate-600 hover:bg-white hover:text-[#0b2947]")}>
              {item.label}
            </Link>
          ))}
        </nav>
        <Link href="/advisor" className="inline-flex items-center gap-2 rounded-full bg-[#0b2947] px-4 py-2.5 text-xs font-bold text-white shadow-[0_10px_24px_rgba(11,41,71,.16)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#16466f] active:scale-[.97]">
          Start diagnosis <ArrowUpRight className="size-3.5" />
        </Link>
      </div>
    </header>
  );
}

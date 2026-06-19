"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  GraduationCap,
  Route,
  BookOpen,
  Link2,
  BarChart3,
  Coffee,
} from "lucide-react";

// URL de "Invítame a un café" (configúrala en Vercel con NEXT_PUBLIC_COFFEE_URL)
const COFFEE_URL =
  process.env.NEXT_PUBLIC_COFFEE_URL || "https://buymeacoffee.com/samuelaguilar";

const NAV = [
  { href: "/", label: "Inicio", icon: LayoutGrid },
  { href: "/certificaciones", label: "Certificaciones", icon: GraduationCap },
  { href: "/roadmaps", label: "Roadmaps", icon: Route },
  { href: "/libros", label: "Libros", icon: BookOpen },
  { href: "/recursos", label: "Recursos", icon: Link2 },
  { href: "/dashboard", label: "Mi progreso", icon: BarChart3 },
];

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const path = usePathname();
  return (
    <div className="flex h-full w-56 flex-col bg-slate-900 text-slate-300">
      <Link
        href="/"
        onClick={onNavigate}
        className="flex items-center gap-2.5 px-5 py-5 text-white"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded bg-white text-black">
          <Route size={16} />
        </span>
        <span className="text-[15px] font-semibold tracking-tight">
          CertPath
        </span>
      </Link>
      <nav className="flex-1 px-3">
        {NAV.map((n) => {
          const active = n.href === "/" ? path === "/" : path.startsWith(n.href);
          const Icon = n.icon;
          return (
            <Link
              key={n.href}
              href={n.href}
              onClick={onNavigate}
              className={`mb-0.5 flex items-center gap-3 rounded-md px-3 py-2 text-sm transition ${
                active
                  ? "bg-slate-800 text-white"
                  : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
              }`}
            >
              <Icon size={17} />
              {n.label}
            </Link>
          );
        })}
      </nav>
      <div className="px-3 pb-2">
        <a
          href={COFFEE_URL}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-2 rounded-md bg-amber-400 px-3 py-2 text-sm font-medium text-amber-950 transition hover:bg-amber-300"
        >
          <Coffee size={16} /> Invítame a un café
        </a>
      </div>
      <div className="border-t border-slate-800 px-5 py-4 text-xs text-slate-500">
        Plataforma de certificaciones
        <br />y roadmaps técnicos
      </div>
    </div>
  );
}

export function Sidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen shrink-0 border-r border-slate-800 md:block">
      <SidebarNav />
    </aside>
  );
}

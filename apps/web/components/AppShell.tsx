"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Search, Menu } from "lucide-react";
import { Sidebar, SidebarNav } from "./Sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);

  if (path === "/login") return <>{children}</>;

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      {/* Drawer móvil */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full">
            <SidebarNav onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-line bg-canvas/85 px-4 backdrop-blur sm:px-6">
          <button
            onClick={() => setOpen(true)}
            aria-label="Menú"
            className="rounded-md border border-line bg-white p-1.5 text-muted hover:text-ink md:hidden"
          >
            <Menu size={18} />
          </button>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              router.push(`/buscar?q=${encodeURIComponent(q.trim())}`);
            }}
            className="flex max-w-md flex-1 items-center gap-2 rounded-md border border-line bg-white px-3 py-1.5"
          >
            <Search size={15} className="text-muted" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar en todo: certificaciones, roadmaps, libros…"
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted"
            />
          </form>
          <span className="hidden text-xs text-muted sm:block">
            España · Europa · Mundial
          </span>
        </header>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}

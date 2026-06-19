"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    }).catch(() => null);
    setLoading(false);
    if (res && res.ok) {
      router.push("/dashboard");
      router.refresh();
    } else {
      const d = res ? await res.json().catch(() => ({})) : {};
      setError(d.message || "Credenciales inválidas");
    }
  }

  const input =
    "mt-1 w-full rounded-md border border-line bg-white px-3 py-2 text-sm outline-none focus:border-brand";

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="flex items-center justify-center px-6 py-20">
        <form onSubmit={submit} className="card w-full max-w-sm p-8">
          <div className="mb-6 flex items-center gap-2">
            <Lock size={18} className="text-brand" />
            <h1 className="text-lg font-semibold">Acceso</h1>
          </div>
          <label className="block text-sm text-muted">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={input}
          />
          <label className="mt-4 block text-sm text-muted">Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={input}
          />
          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
          <button
            disabled={loading}
            className="mt-6 w-full rounded-md bg-brand px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-dark disabled:opacity-50"
          >
            {loading ? "Entrando…" : "Entrar"}
          </button>
        </form>
      </main>
    </div>
  );
}

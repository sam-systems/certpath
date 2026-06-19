"use client";

import { useEffect, useState } from "react";

// Token de administración recordado en el navegador (lo pones una vez).
const KEY = "certpath_admin_token";

export function useToken() {
  const [token, setTokenState] = useState("");

  useEffect(() => {
    try {
      const v = localStorage.getItem(KEY);
      if (v) setTokenState(v);
    } catch {
      /* ignore */
    }
  }, []);

  const setToken = (v: string) => {
    setTokenState(v);
    try {
      localStorage.setItem(KEY, v);
    } catch {
      /* ignore */
    }
  };

  return [token, setToken] as const;
}

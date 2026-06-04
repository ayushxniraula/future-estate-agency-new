// ============================================================
//  useClientSession.ts  →  src/hooks/useClientSession.ts
//
//  Usage anywhere in your app:
//
//    const { session, logout } = useClientSession();
//    if (session) { /* user is logged in */ }
// ============================================================

import { useState } from "react";
import { CLIENT_SESSION_KEY } from "../components/forms/LoginForm";

interface ClientSession {
  id: string;
  full_name: string;
  email: string;
  username: string;
  ts: number;
}

export function useClientSession() {
  const [session, setSession] = useState<ClientSession | null>(() => {
    try {
      const raw = localStorage.getItem(CLIENT_SESSION_KEY);
      if (!raw) return null;
      const parsed: ClientSession = JSON.parse(raw);

      // Expire after 30 days
      const thirtyDays = 30 * 24 * 60 * 60 * 1000;
      if (Date.now() - parsed.ts > thirtyDays) {
        localStorage.removeItem(CLIENT_SESSION_KEY);
        return null;
      }
      return parsed;
    } catch {
      return null;
    }
  });

  const logout = () => {
    localStorage.removeItem(CLIENT_SESSION_KEY);
    setSession(null);
    window.location.reload();
  };

  return { session, logout };
}

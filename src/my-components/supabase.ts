// ============================================================
//  supabaseClient.ts
//  Drop this in: src/lib/supabaseClient.ts
//  (same Supabase project as the admin panel)
// ============================================================

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://afwvbftvfubboorpiszu.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmd3ZiZnR2ZnViYm9vcnBpc3p1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExNjg4MzksImV4cCI6MjA5Njc0NDgzOX0.vw7hvZMrNeS_vqU7By6C69F1SsN_mWY6gSs2ipliLZY";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

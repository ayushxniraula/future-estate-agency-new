// ============================================================
//  supabaseClient.ts
//  Drop this in: src/lib/supabaseClient.ts
//  (same Supabase project as the admin panel)
// ============================================================

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://wzttfewbiiakxkmgzfre.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6dHRmZXdiaWlha3hrbWd6ZnJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3ODY0MjksImV4cCI6MjA5NTM2MjQyOX0.-00zf6PqvccpLvBGxy4FtveqX5mCeGXJbC-ZF8ziEBk";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

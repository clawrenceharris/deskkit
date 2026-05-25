import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export async function verifySupabaseAccessToken(token: string): Promise<string | null> {
  if (!supabaseUrl || !supabaseKey) {
    console.error("[presence] Missing Supabase env vars");
    return null;
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) {
    console.error("[presence] Auth failed:", error?.message);
    return null;
  }

  return data.user.id;
}

import { createClient, SupabaseClient } from '@supabase/supabase-js';

let _client: SupabaseClient | null = null;

export function getClient(): SupabaseClient {
  if (!_client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
    _client = createClient(url || 'http://localhost', key || 'placeholder');
  }
  return _client;
}

export async function getCredits(userId: string): Promise<number> {
  try {
    const { data, error } = await getClient()
      .from('credits')
      .select('balance')
      .eq('user_id', userId)
      .single();
    if (error || !data) return 0;
    return data.balance;
  } catch {
    return 0;
  }
}

export async function getUserJobs(userId: string) {
  try {
    const { data, error } = await getClient()
      .from('jobs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) return [];
    return data;
  } catch {
    return [];
  }
}

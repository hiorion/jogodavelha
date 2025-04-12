export function createClient() {
  return supabase.createClient(
    'https://your-supabase-url.supabase.co',
    'your-anon-key'
  );
}

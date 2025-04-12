import { supabase } from '../public/supabaseClient.mjs';

export async function createLobby() {
  const { data, error } = await supabase
    .from('lobbies')
    .insert([{ status: 'waiting' }])
    .select();
  return data ? data[0] : null;
}

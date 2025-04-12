import { createClient } from '../src/supabaseClient.js';
import { initializeGame } from '../src/gameLogic.js';

const supabase = createClient();
initializeGame(supabase);

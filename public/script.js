import { createClient } from '/supabaseClient.mjs';
import { initializeGame } from '../src/game';

const supabase = createClient(); // Cria conexão com o Supabase
initializeGame(supabase);        // Inicia o jogo com a lógica

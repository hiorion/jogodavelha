import { createClient } from '/supabaseClient.mjs';
import { initializeGame } from '../src/game.js';

const supabase = createClient(); // Cria conexão com o Supabase
initializeGame(supabase);        // Inicia o jogo com a lógica

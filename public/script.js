import { createClient } from './supabaseClient.mjs';
import { initializeGame } from '../src/gameLogic.js';

const supabase = createClient(); // Cria conexão com o Supabase
initializeGame(supabase);        // Inicia o jogo com a lógica

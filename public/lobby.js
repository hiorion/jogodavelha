import { supabase } from './supabaseClient.mjs';

const lobbyInput = document.getElementById('lobbyId');
const enterLobbyBtn = document.getElementById('enterLobby');
const readyBtn = document.getElementById('readyBtn');
const statusEl = document.getElementById('status');
const waitingRoom = document.getElementById('waiting-room');
const lobbyContainer = document.getElementById('lobby-container');
const currentLobby = document.getElementById('currentLobby');
const playerRoleEl = document.getElementById('playerRole');

let lobbyId = '';
let role = '';

// Entrar ou criar lobby
enterLobbyBtn.addEventListener('click', async () => {
  lobbyId = lobbyInput.value.trim() || crypto.randomUUID();

  // Verifica se o lobby já existe
  const { data, error } = await supabase
    .from('lobbies')
    .select('*')
    .eq('id', lobbyId)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Erro ao buscar lobby:', error);
    return;
  }

  if (!data) {
    // Criar novo lobby
    const { error: insertError } = await supabase.from('lobbies').insert([{
      id: lobbyId,
      player1_ready: false,
      player2_ready: false,
      board: Array(9).fill(''),
      turn: 'player1'
    }]);

    if (insertError) {
      console.error('Erro ao criar lobby:', insertError);
      return;
    }

    role = 'player1';
  } else {
    role = 'player2';
  }

  // Exibir lobby e papel
  currentLobby.textContent = lobbyId;
  playerRoleEl.textContent = role === 'player1' ? '❌' : '⭕';

  // Alternar telas
  lobbyContainer.style.display = 'none';
  waitingRoom.style.display = 'block';
});

// Jogador clica para sinalizar que está pronto
readyBtn.addEventListener('click', async () => {
  const { error } = await supabase
    .from('lobbies')
    .update({ [`${role}_ready`]: true })
    .eq('id', lobbyId);

  if (error) {
    console.error('Erro ao sinalizar prontidão:', error);
    return;
  }

  statusEl.textContent = '⏳ Aguardando outro jogador...';
});

// Escutar mudanças no lobby atual
supabase
  .channel(`lobby-listener-${lobbyId}`)
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'lobbies',
    filter: `id=eq.${lobbyId}`
  }, (payload) => {
    const lobby = payload.new;
    if (lobby.player1_ready && lobby.player2_ready) {
      // Inicia o jogo se ambos estiverem prontos
      window.location.href = `game.html?lobby=${lobbyId}&role=${role}`;
    }
  })
  .subscribe();

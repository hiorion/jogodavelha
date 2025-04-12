import { supabase } from './supabaseClient.js';

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
  lobbyId = lobbyInput.value || crypto.randomUUID();

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
    await supabase.from('lobbies').insert([{
      id: lobbyId,
      player1_ready: false,
      player2_ready: false,
      board: Array(9).fill(''),
      turn: 'player1'
    }]);
    role = 'player1';
  } else {
    // Entrar como player2
    role = 'player2';
  }

  currentLobby.textContent = lobbyId;
  playerRoleEl.textContent = role === 'player1' ? '❌' : '⭕';
  lobbyContainer.style.display = 'none';
  waitingRoom.style.display = 'block';
});

// Sinalizar que está pronto
readyBtn.addEventListener('click', async () => {
  await supabase
    .from('lobbies')
    .update({ [`${role}_ready`]: true })
    .eq('id', lobbyId);

  statusEl.textContent = '⏳ Aguardando outro jogador...';
});

// Escutar mudanças no lobby
supabase.channel('lobby-listener')
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'lobbies'
  }, (payload) => {
    const lobby = payload.new;
    if (lobby.id === lobbyId && lobby.player1_ready && lobby.player2_ready) {
      window.location.href = `game.html?lobby=${lobbyId}&role=${role}`;
    }
  })
  .subscribe();

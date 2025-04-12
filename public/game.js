import { supabase } from './supabaseClient.mjs';

const urlParams = new URLSearchParams(window.location.search);
const lobbyId = urlParams.get('lobby');
const board = document.getElementById("board");
let currentPlayer = 'X';
let gameState = Array(9).fill(null);

function renderBoard() {
  board.innerHTML = '';
  gameState.forEach((val, i) => {
    const cell = document.createElement('div');
    cell.textContent = val || '';
    cell.onclick = () => makeMove(i);
    board.appendChild(cell);
  });
}

async function makeMove(index) {
  if (gameState[index]) return;
  gameState[index] = currentPlayer;
  await supabase.from('moves').insert([{ lobby_id: lobbyId, index, player: currentPlayer }]);
}

supabase.channel('realtime:lobbies')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'moves' }, payload => {
    if (payload.new.lobby_id === lobbyId) {
      gameState[payload.new.index] = payload.new.player;
      renderBoard();
    }
  })
  .subscribe();

renderBoard();

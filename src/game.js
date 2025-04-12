import { supabase } from './supabaseClient.js';

const urlParams = new URLSearchParams(window.location.search);
const lobbyId = urlParams.get('lobby');
const role = urlParams.get('role');

const boardEl = document.getElementById('board');
const statusEl = document.getElementById('status');

let board = Array(9).fill('');
let currentPlayer = 'X';
let isMyTurn = role === 'player1';

function renderBoard() {
  boardEl.innerHTML = '';
  board.forEach((cell, i) => {
    const div = document.createElement('div');
    div.className = 'cell';
    div.textContent = cell;
    div.addEventListener('click', () => makeMove(i));
    boardEl.appendChild(div);
  });
  updateStatus();
}

function updateStatus() {
  statusEl.textContent = isMyTurn ? 'Sua vez!' : 'Aguardando o oponente...';
}

async function makeMove(index) {
  if (!isMyTurn || board[index] !== '') return;

  const symbol = role === 'player1' ? 'X' : 'O';
  board[index] = symbol;
  isMyTurn = false;
  updateStatus();
  renderBoard();

  // Atualiza o board no Supabase e troca o turno
  await supabase
    .from('lobbies')
    .update({
      board,
      turn: role === 'player1' ? 'player2' : 'player1'
    })
    .eq('id', lobbyId);
}

// Canal para ouvir atualizações do Supabase
supabase
  .channel('game-channel')
  .on(
    'postgres_changes',
    { event: 'UPDATE', schema: 'public', table: 'lobbies' },
    (payload) => {
      if (payload.new.id !== lobbyId) return;

      board = payload.new.board || board;
      isMyTurn = payload.new.turn === role;
      renderBoard();
    }
  )
  .subscribe();

renderBoard();

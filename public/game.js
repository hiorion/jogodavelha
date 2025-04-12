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

function makeMove(index) {
  if (!isMyTurn || board[index] !== '') return;

  board[index] = role === 'player1' ? 'X' : 'O';
  isMyTurn = false;
  updateStatus();
  renderBoard();

  supabase.from('lobbies').update({ board }).eq('id', lobbyId);
}

supabase.channel('game-channel')
  .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'lobbies' }, payload => {
    if (payload.new.id !== lobbyId) return;
    board = payload.new.board || board;
    isMyTurn = payload.new.turn === role;
    renderBoard();
  })
  .subscribe();

renderBoard();
import { supabase } from '../public/supabaseClient.mjs';

const urlParams = new URLSearchParams(window.location.search);
const lobbyId = urlParams.get('lobby');
const role = urlParams.get('role');

const boardEl = document.getElementById('board');
const statusEl = document.getElementById('status');

let board = Array(9).fill('');
let currentPlayer = 'X';
let isMyTurn = role === 'player1';
let gameOver = false;

// Função para renderizar o tabuleiro
function renderBoard() {
  boardEl.innerHTML = ''; // Limpa a tela antes de renderizar novamente
  board.forEach((cell, i) => {
    const div = document.createElement('div');
    div.className = 'cell';
    div.textContent = cell;
    div.addEventListener('click', () => makeMove(i));
    boardEl.appendChild(div);
  });
  updateStatus();
}

// Atualiza o status do jogo
function updateStatus() {
  if (gameOver) return;

  statusEl.textContent = isMyTurn ? 'Sua vez!' : 'Aguardando o oponente...';
}

// Verifica se há um vencedor
function checkWinner() {
  const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (const [a, b, c] of winningCombos) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }

  if (!board.includes('')) return 'draw';

  return null;
}

// Faz uma jogada
async function makeMove(index) {
  if (!isMyTurn || board[index] !== '' || gameOver) return;

  const symbol = role === 'player1' ? 'X' : 'O';
  board[index] = symbol;

  const winner = checkWinner();
  if (winner) {
    gameOver = true;
    statusEl.textContent = winner === 'draw' ? 'Empate!' : `${symbol} venceu!`;
  }

  isMyTurn = false;
  updateStatus();
  renderBoard();

  // Atualiza o Supabase com o novo estado do jogo
  await supabase
    .from('lobbies')
    .update({
      board,
      turn: role === 'player1' ? 'player2' : 'player1'
    })
    .eq('id', lobbyId);
}

// Escuta atualizações do Supabase
supabase
  .channel('game-channel')
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'lobbies'
  }, (payload) => {
    if (payload.new.id !== lobbyId) return;

    board = payload.new.board || board;
    isMyTurn = payload.new.turn === role;

    if (!gameOver) {
      const winner = checkWinner();
      if (winner) {
        gameOver = true;
        statusEl.textContent = winner === 'draw' ? 'Empate!' : `${winner} venceu!`;
      }
    }

    renderBoard();
  })
  .subscribe();

renderBoard();

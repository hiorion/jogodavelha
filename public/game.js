import { supabase } from './supabaseClient.mjs';

// Pega o lobby da URL
const urlParams = new URLSearchParams(window.location.search);
const lobbyId = urlParams.get('lobby');
document.getElementById('lobbyInfo').textContent = `Lobby: ${lobbyId}`;

// Estado do jogo
let boardState = Array(9).fill(null);
let currentPlayer = Math.random() < 0.5 ? 'X' : 'O';
let myTurn = currentPlayer === 'X';
let gameOver = false;

const board = document.getElementById('board');
const statusText = document.getElementById('status');

function renderBoard() {
  board.innerHTML = '';
  boardState.forEach((value, index) => {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.textContent = value || '';
    if (!value && myTurn && !gameOver) {
      cell.onclick = () => handleMove(index);
    }
    board.appendChild(cell);
  });

  if (!gameOver) {
    statusText.textContent = myTurn ? 'Seu turno' : 'Esperando o oponente...';
  }
}

async function handleMove(index) {
  if (!myTurn || boardState[index] || gameOver) return;

  // Atualiza localmente
  boardState[index] = currentPlayer;
  myTurn = false;
  renderBoard();

  // Envia para Supabase
  await supabase.from('moves').insert([
    {
      lobby_id: lobbyId,
      index,
      player: currentPlayer
    }
  ]);
}

function checkWinner() {
  const winCombos = [
    [0,1,2], [3,4,5], [6,7,8], // Linhas
    [0,3,6], [1,4,7], [2,5,8], // Colunas
    [0,4,8], [2,4,6]           // Diagonais
  ];

  for (const [a, b, c] of winCombos) {
    if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
      return boardState[a];
    }
  }

  if (boardState.every(cell => cell)) return 'empate';
  return null;
}

function handleGameStateUpdate() {
  const result = checkWinner();
  if (result && !gameOver) {
    gameOver = true;
    if (result === 'empate') {
      statusText.textContent = 'Empate!';
    } else {
      statusText.textContent = `Jogador ${result} venceu!`;
    }
  }
}

// Realtime listener
supabase
  .channel('realtime:moves')
  .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'moves' }, payload => {
    const move = payload.new;
    if (move.lobby_id !== lobbyId) return;

    boardState[move.index] = move.player;
    if (move.player !== currentPlayer) {
      myTurn = true;
    }
    renderBoard();
    handleGameStateUpdate();
  })
  .subscribe();

renderBoard();

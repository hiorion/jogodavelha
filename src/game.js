import { supabase } from './supabaseClient.js';

const urlParams = new URLSearchParams(window.location.search);
const lobbyId = urlParams.get('lobby');
const role = urlParams.get('role');

const boardEl = document.getElementById('board');
const statusEl = document.getElementById('status');

let board = Array(9).fill('');
let currentPlayer = 'X';
let isMyTurn = role === 'player1';

// Função para renderizar o tabuleiro
function renderBoard() {
  boardEl.innerHTML = ''; // Limpa a tela antes de renderizar novamente
  board.forEach((cell, i) => {
    const div = document.createElement('div');
    div.className = 'cell';
    div.textContent = cell;
    div.addEvent

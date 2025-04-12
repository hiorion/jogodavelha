// public/index.js
import { supabase } from './supabaseClient.mjs';

document.getElementById('createLobbyBtn').addEventListener('click', async () => {
  const { data, error } = await supabase
    .from('lobbies')
    .insert([{ status: 'waiting' }])
    .select();

  if (error) {
    alert('Erro ao criar lobby: ' + error.message);
    return;
  }

  const lobbyId = data[0].id;
  window.location.href = `game.html?lobby=${lobbyId}`;
});

document.getElementById('joinLobbyBtn').addEventListener('click', () => {
  const lobbyCode = document.getElementById('lobbyCode').value.trim();

  if (!lobbyCode) {
    alert('Digite o código do lobby.');
    return;
  }

  window.location.href = `game.html?lobby=${lobbyCode}`;
});

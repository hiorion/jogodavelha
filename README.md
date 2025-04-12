# Jogo da Velha Online com Lobby

Este é um projeto simples de Jogo da Velha online com suporte a lobbies via Supabase.

## Como usar

1. Configure um projeto no Supabase com as tabelas:
- **lobbies**: `id`, `status`
- **moves**: `id`, `lobby_id`, `index`, `player`

2. Coloque a URL do seu Supabase e a chave `anon` em `public/supabaseClient.mjs`.

3. Faça deploy na Vercel ou rode localmente.

## Feito por ChatGPT 🤖

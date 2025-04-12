export function initializeGame(supabase) {
  const board = document.getElementById('game-board');
  board.innerHTML = '';

  const cells = Array.from({ length: 9 }, (_, i) => {
    const cell = document.createElement('div');
    cell.dataset.index = i;
    cell.addEventListener('click', () => handleMove(cell));
    board.appendChild(cell);
    return cell;
  });

  let currentPlayer = 'X';

  function handleMove(cell) {
    if (cell.textContent) return;
    cell.textContent = currentPlayer;
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  }
}



const menu = document.querySelector<HTMLDivElement>('#menu')!;

menu.innerHTML=`  <div class="board-start">
  <h1>Choose side</h1>
    <button id='whiteSide'>White</button>
    <button id='blackSide'>Black</button>
  </div>`


document.getElementById('whiteSide')?.addEventListener('click',() => {
    window.location.href = "/whitegame.html"
})
  document.getElementById('blackSide')?.addEventListener('click',() => {
    window.location.href = "/blackgame.html"
  })
import "./style.css";
import type { Sides } from "./types";
import { drawChessBoard, drawChessPieces } from "./draw";
import { isValidMove } from "./movement";
const board = document.querySelector<HTMLDivElement>("#board")!;



const turnSwitch = (side: Sides) => {
  console.log(side)
}

// need dropdown for gmae times

let timer;
let timerInterval: number | undefined;

const formatTime = (totalSeconds: number): string =>  {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const milliseconds = Math.floor((totalSeconds % 1) * 100);

  const mm = String(minutes).padStart(2, '0');
  const ss = String(seconds).padStart(2, '0');
  const msms = String(milliseconds).padStart(2, '0');

  return `${mm}:${ss}:${msms}`;
}

const countDown = (seconds: number) => { 
  const countdownDiv = document.querySelector('.countdown') as HTMLDivElement;
  let timeLeft = seconds;
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
  if (timeLeft <= 0) {
    clearInterval(timerInterval);
    countdownDiv.textContent = '⏱️ 00:00:00';
    return;
  }
    countdownDiv.textContent = `⏱️ ${formatTime(timeLeft)}`;
    timeLeft -= 0.01;
  }, 10);}

const movePiece = () => {
  const board = document.querySelector<HTMLDivElement>(".board-grid")!;
  let selectedSquare: HTMLElement | null;
  board.addEventListener("click", (e) => {
    //general square on our grid can be div or img of a piece
    let square = e.target as HTMLElement | null;
    if (!square) return;

    if (!selectedSquare) {
      // we need to make sure that we are always grabbing an image element so a piece
      // this is the first grab of the player it always has to be a piece then we populate
      // selected square
      if (square instanceof HTMLImageElement) {
        selectedSquare = square;
        selectedSquare.dataset.selected = "true";
        
      } // instance of when selected square actually exists so here we need to validate our move
    } else {
      // we have to validate where we are going from which square
      const isValidMovement = isValidMove(square, selectedSquare);
      if (isValidMovement) {
        const side = selectedSquare.dataset.side;
        delete selectedSquare.dataset.selected;
        selectedSquare = null;
        turnSwitch(side as Sides)
      } else {
        // refresh selectedsquare so we dont get stuck on one piece and unable to move
        delete selectedSquare.dataset.selected;
        selectedSquare = null;
        return;
      }
    }
    selectedSquare?.classList.remove("selected");
  });
};

board.innerHTML = `
  <div class="board-field">
    <div class="board-container">
      <div class="board-numbers"></div>
      <div class="board-grid"></div>
    </div>
    <div class="board-text"></div>
    <div class="countdown">⏱️ ${timer}</div> 
  </div>
  <div class="board-start">
    <h1>Choose a side</h1>
    <button id="black-btn" class="blackbtn">
      <h1>Black</h1>
    </button>
    <button id="white-btn" class="whitebtn">
      <h1>White</h1>
    </button>
    <div class="timer-parent">
    <label for="time">Select a time</label>
    <select name="time" id="time-select">
      <option value="60">1 Minute</option>
      <option value="180">3 Minutes</option>
      <option value="300">5 Minutes</option>
      <option value="600">10 Minutes</option>
      <option value="1800">30 Minutes</option>
    </select>
    </div>
  </div>
`;

const startGame = (side: Sides) => {
  const mainView = document.querySelector('.board-start') as HTMLElement
  const gameView = document.querySelector('.board-field') as HTMLElement
  const timerDuration = document.getElementById('time-select') as HTMLSelectElement
  if (mainView && gameView) {
    mainView.style.display = 'none'
    gameView.style.display = 'block'
    drawChessBoard(side === "black" ? true : false);
    drawChessPieces("white");
    drawChessPieces("black");
    timer = formatTime(Number(timerDuration.value))
    countDown(Number(timerDuration.value));
  }
}

document.getElementById("black-btn")?.addEventListener('click', () => {
  startGame('black')
})
document.getElementById("white-btn")?.addEventListener('click', () => {
  startGame('white')
})

movePiece();
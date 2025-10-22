import "./style.css";
import type { Sides } from "./types";
import { drawChessBoard, drawChessPieces } from "./draw";
import { isValidMove } from "./movement";
import { moves } from "./movement";
import { formatTime, countDown } from "./timer";

const board = document.querySelector<HTMLDivElement>("#board")!;
let playerTimer;
let opponentTimer;
const movePiece = () => {
  const board = document.querySelector<HTMLDivElement>(".board-grid")!;
  let draggable: HTMLImageElement
  //draggable element
  let selectedSquare: HTMLElement | null;

  board.addEventListener("dragstart", (e: DragEvent) => {
    const target = e.target as HTMLElement;
    if (!target) return
    if (target instanceof HTMLImageElement) {
    draggable = target
    target.classList.add("dragging")      
    }
  })
  
  board.addEventListener("dragend", (e: DragEvent) => {
    e.preventDefault()
    const ele = e.target as HTMLElement
    ele.classList.remove("dragging");
  })

  board.addEventListener("dragover", (e: DragEvent) => {
    e.preventDefault()
  })

  board.addEventListener("drop", (e: DragEvent) => {
    e.preventDefault()
    const target = e.target as HTMLElement;
    if (!target) return
    dragElement(draggable, target)
  })


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
      isValidMove(square, selectedSquare);
      delete selectedSquare.dataset.selected;
      selectedSquare = null;
    }
    selectedSquare?.classList.remove("selected");
  });
};

const dragElement = (startPos: HTMLImageElement, target: HTMLElement) => {
  startPos.dataset.selected = "true";
  const valid = isValidMove(target, startPos);
  // stop timer for moved and 
  if (valid) {
    console.log(moves)
    if (moves.length % 2 !== 0) {
      countDown("black")
      // playerTimer = formatTime(Number(timerDuration.value))      
    } else {
      countDown("white")
    }
  }
  delete startPos.dataset.selected;
  startPos.classList.remove("selected")
  return;
}

board.innerHTML = `
  <div class="board-field">
    <div id="opponent-timer">⏱️ ${opponentTimer}</div> 
    <div class="board-container">
      <div class="board-numbers"></div>
      <div class="board-grid"></div>
    </div>
    <div class="board-text"></div>
    <div id="player-timer">⏱️ ${playerTimer}</div> 
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
    drawChessBoard(side);
    drawChessPieces("white");
    drawChessPieces("black");
    playerTimer = formatTime(Number(timerDuration.value))
    opponentTimer = formatTime(Number(timerDuration.value))
    const playerDiv = document.querySelector("#player-timer") as HTMLDivElement;
    playerDiv.textContent = playerTimer;
    const opponentDiv = document.querySelector("#opponent-timer") as HTMLDivElement;
    opponentDiv.textContent = opponentTimer
  }
}

document.getElementById("black-btn")?.addEventListener('click', () => {
  startGame('black')
  const playerTimer = document.getElementById('player-timer') as HTMLElement
  const opponentTimer = document.getElementById('opponent-timer') as HTMLElement
  if (playerTimer && opponentTimer) {
    playerTimer.dataset.timerside = "black"
    opponentTimer.dataset.timerside = "white"
  }
})
document.getElementById("white-btn")?.addEventListener('click', () => {
  startGame('white')
  const playerTimer = document.querySelector('#player-timer') as HTMLElement
  const opponentTimer = document.querySelector('#opponent-timer') as HTMLElement
  if (playerTimer && opponentTimer) {
    playerTimer.dataset.timerside = "white"
    opponentTimer.dataset.timerside = "black"
  }
})

movePiece();
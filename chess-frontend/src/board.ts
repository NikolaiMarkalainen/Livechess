import "./style.css";
import { Pieces, type boardPositions, type BoardState, type IPieces, Sides, type ISides } from "./types";
import { drawChessBoard, drawChessPieces, getInitialBoardMap } from "./draw";
import { movePieceAction, history } from "./movement";
import { formatTime } from "./timer";
import { showValidMoves } from "./simulate";

const board = document.querySelector<HTMLDivElement>("#board")!;
let playerTimer;
let opponentTimer;
let validMoves: boardPositions[];
const boardState: BoardState[][] = getInitialBoardMap();

const pieceImages: Record<string, HTMLImageElement> = {};

const preloadPieces = () => {
  Object.values(Sides).forEach((side) => {
    Object.values(Pieces).forEach((piece) => {
      const key = `${piece}-${side}`;
      const img = new Image();
      img.src = `/pieces/${key}.png`;
      pieceImages[key] = img;
    });
  });
};

const movePiece = () => {
  const board = document.querySelector<HTMLDivElement>(".board-grid")!;
  console.log(boardState);
  let draggable: HTMLDivElement;
  let selectedSquare: HTMLElement | undefined;

  board.addEventListener("dragstart", (e: DragEvent) => {
    const target = e.target as HTMLElement;
    const img = pieceImages[`${target.dataset.piece}-${target.dataset.side}`];
    e.dataTransfer?.setDragImage(img, 32, 32);
    validMoves = showValidMoves(target, boardState);
    validMoves.forEach((m) => {
      const square = document.querySelector<HTMLDivElement>(`div[data-row="${m.row}"][data-column="${m.column}"]`);
      square?.classList.add("highlight");
    });
    if (!target) return;
    if (target instanceof HTMLDivElement) {
      draggable = target;
      target.classList.add("dragging");
    }
  });

  board.addEventListener("dragend", (e: DragEvent) => {
    e.preventDefault();
    const ele = e.target as HTMLElement;
    ele.classList.remove("dragging");
    const highlights = document.querySelectorAll<HTMLDivElement>(`div.highlight`);
    highlights.forEach((h) => {
      h.classList.remove("highlight");
    });
  });

  board.addEventListener("dragover", (e: DragEvent) => {
    e.preventDefault();
  });

  board.addEventListener("drop", (e: DragEvent) => {
    e.preventDefault();
    const target = e.target as HTMLElement;
    if (!target) return;
    dragElement(draggable, target, validMoves);
  });

  board.addEventListener("click", (e) => {
    const side = history.length % 2 !== 0 ? Sides.Black : Sides.White;
    let square = e.target as HTMLElement | null;
    if (!square) return;

    if (!selectedSquare) {
      if (square.dataset.piece && square.dataset.side === side) {
        selectedSquare = square;
        selectedSquare.dataset.selected = "true";
        validMoves = showValidMoves(square, boardState);
        validMoves.forEach((m) => {
          const square = document.querySelector<HTMLDivElement>(`div[data-row="${m.row}"][data-column="${m.column}"]`);
          square?.classList.add("highlight");
        });
      }
    } else {
      console.log(validMoves);
      movePieceAction(square, selectedSquare, validMoves);
      delete selectedSquare.dataset.selected;
      selectedSquare = undefined;
      const highlights = document.querySelectorAll<HTMLDivElement>(`div.highlight`);
      highlights.forEach((h) => {
        h.classList.remove("highlight");
      });
    }
    selectedSquare?.classList.remove("selected");
  });
};

const dragElement = (startPos: HTMLDivElement, target: HTMLElement, validMoves: boardPositions[]) => {
  startPos.dataset.selected = "true";
  movePieceAction(target, startPos, validMoves);
  delete startPos.dataset.selected;
  startPos.classList.remove("selected");
  return;
};

board.innerHTML = `
  <div class="board-field">
      <div id="opponent-div" class="board-footer">
        <div id="timer" class="countdown">⏱️ ${opponentTimer}</div> 
        <div id="pieces" class="pieces"> </div>
      </div>
    <div id="board-container" class="board-container">
      <div class="board-numbers"></div>
      <div class="board-grid"></div>
    </div>
    <div class="board-text"></div>
    <div id="player-div" class="board-footer">
      <div id="timer" class="countdown-low">⏱️ ${playerTimer}</div> 
      <div id="pieces" class="pieces"></div>
    </div>
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

const startGame = (side: ISides) => {
  const mainView = document.querySelector(".board-start") as HTMLElement;
  const gameView = document.querySelector(".board-field") as HTMLElement;
  const timerDuration = document.getElementById("time-select") as HTMLSelectElement;
  if (mainView && gameView) {
    mainView.style.display = "none";
    gameView.style.display = "block";
    drawChessBoard(side);
    drawChessPieces();
    playerTimer = formatTime(Number(timerDuration.value));
    opponentTimer = formatTime(Number(timerDuration.value));
    const playerDiv = document.querySelector("#player-div #timer") as HTMLDivElement;
    playerDiv.textContent = playerTimer;
    const opponentDiv = document.querySelector("#opponent-div #timer") as HTMLDivElement;
    opponentDiv.textContent = opponentTimer;
  }
};

// document.getElementById("black-btn")?.addEventListener("click", () => {
//   startGame("black");
//   const playerDiv = document.getElementById("player-div") as HTMLElement;
//   const opponentDiv = document.getElementById("opponent-div") as HTMLElement;
//   if (playerDiv && opponentDiv) {
//     playerDiv.dataset.cside = "black";
//     opponentDiv.dataset.cside = "white";
//   }
// });
// document.getElementById("white-btn")?.addEventListener("click", () => {
//   startGame("white");
//   const playerDiv = document.getElementById("player-div") as HTMLElement;
//   const opponentDiv = document.getElementById("opponent-div") as HTMLElement;
//   if (playerDiv && opponentDiv) {
//     playerDiv.dataset.cside = "white";
//     opponentDiv.dataset.cside = "black";
//   }
// });
preloadPieces();
startGame(Sides.White);

movePiece();

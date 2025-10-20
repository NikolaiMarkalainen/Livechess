import "./style.css";
import type { Sides } from "./types";
import { drawChessBoard, drawChessPieces } from "./draw";
import { isValidMove } from "./movement";
const board = document.querySelector<HTMLDivElement>("#board")!;



const turnSwitch = (side: Sides) => {
  console.log(side)
}

const gameStart = () => {

}

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
  <div class="view board block">
    <div class="board-container">
      <div class="board-numbers"></div>
      <div class="board-grid"></div>
    </div>
    <div class="board-text"></div>
  </div>
  <div class="board-start">
    <h1>Choose a side</h1>
    <button id="black-btn" class="blackbtn">
      <h1>Black</h1>
    </button>
    <button id="white-btn" class="whitebtn">
      <h1>White</h1>
    </button>
  </div>
`;

drawChessBoard();
drawChessPieces("white");
drawChessPieces("black");
movePiece();

// const boardWrapper = document.querySelector<HTMLDivElement>('.board-wrapper')!;
// const boardText = document.querySelector<HTMLDivElement>('.board-text')!;
// const boardStart = document.querySelector<HTMLDivElement>('.board-start')!;

// document.getElementById("white-btn")!.addEventListener("click", () => {
//   boardStart.remove()
//       const boardWrapper = document.querySelector<HTMLDivElement>('.board-wrapper')!;
//     const boardText = document.querySelector<HTMLDivElement>('.board-text')!;

//     boardWrapper.style.display = "block";
//     boardText.style.display = "block";
// })
// document.getElementById("black-btn")!.addEventListener("click", () => {
//   console.log("paskaa black",)
// })

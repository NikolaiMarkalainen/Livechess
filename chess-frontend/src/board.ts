import "./style.css";
import type { boardPositions, Pieces, Sides } from "./types";

const board = document.querySelector<HTMLDivElement>("#board")!;
const boardValues = ["A", "B", "C", "D", "E", "F", "G", "H"];

const boardSquareToNumber = (square: string | undefined): boardPositions => {
  console.log(square);
  if (!square) return { row: 0, column: 0 };
  const column = boardValues.indexOf(square[0].toUpperCase()) + 1;
  return {
    column: column,
    row: Number(square[1]),
  };
};

const setNewSquare = (targetSquare: HTMLElement, capture: boolean) => {
  // fetch the selected piece
  const movingPiece = document.querySelector<HTMLImageElement>(`img[data-selected="true"]`);
  if (!movingPiece) return;

  if (capture) {
    if (targetSquare instanceof HTMLImageElement) {
      const cellDiv = document.querySelector<HTMLDivElement>(`div[data-square=${targetSquare.dataset.square}]`);
      console.log(cellDiv, targetSquare, movingPiece);
      if (!cellDiv) return;
      cellDiv.replaceChild(movingPiece, targetSquare);
      movingPiece.dataset.square = targetSquare.dataset.square;
      clearSelected();
      return;
    }
  }
  // update the piece position with new one to monitor whats happening
  // the piece is no longer moving we need to remove the selected flag from it
  movingPiece.dataset.square = targetSquare.dataset.square;
  clearSelected();
  targetSquare.appendChild(movingPiece);
};

const clearSelected = () => {
  const movingPiece = document.querySelector<HTMLImageElement>(`img[data-selected="true"]`);
  delete movingPiece?.dataset.selected;
};

const validateMove = (target: HTMLElement, piece: HTMLElement) => {
  const pieceSquare = boardSquareToNumber(piece.dataset.square);
  const targetSquare = boardSquareToNumber(target.dataset.square);
  console.log(target instanceof HTMLImageElement);

  switch (piece.dataset.piece) {
    case "pawn":
      // we are moving on correct column this is allowed
      if (pieceSquare.column === targetSquare.column) {
        // create logic for pawns moving forward on the board with substraction
        const columnDifference =
          piece.dataset.side === "white" ? targetSquare.row - pieceSquare.row : pieceSquare.row - targetSquare.row;

        const startingRow = piece.dataset.side === "white" ? 2 : 7;
        // when walking forward with a pawn we always need to check whether there is collision
        if (target instanceof HTMLImageElement) {
          clearSelected();
          return false;
        }
        // allow starterOpening to move 2 rows at once
        if (columnDifference === 1 || (columnDifference === 2 && pieceSquare.row === startingRow)) {
          setNewSquare(target, false);
          return true;
        }
        clearSelected();
        return false;
      }
      // capture event
      if (pieceSquare.column - 1 === targetSquare.column || pieceSquare.column + 1 === targetSquare.column) {
        if (
          target instanceof HTMLImageElement &&
          // avoid taking own pieces lol
          target.dataset.side !== piece.dataset.side
        ) {
          setNewSquare(target, true);
          return true;
        }
      }
    // case "knight":
    //   //knight can move in L shape so +2 in one axis and 1 on the other
    //   if (pieceSquare.column) {
    //     return false;
    //   }
  }
};
const drawChessPieces = (side: Sides) => {
  const knightSquares = side === "white" ? ["B1", "G1"] : ["B8", "G8"];
  const bishopSquares = side === "white" ? ["C1", "F1"] : ["C8", "F8"];
  const rookSquares = side === "white" ? ["A1", "H1"] : ["A8", "H8"];
  const queenSquare = side === "white" ? ["D1"] : ["D8"];
  const kingSquare = side === "white" ? ["E1"] : ["E8"];
  const pawnRow = side === "white" ? "2" : "7";

  const setPieceDataSet = (side: Sides, piece: Pieces, square: string): HTMLImageElement => {
    const element = document.createElement("img");
    element.alt = `${piece}-${side}`;
    element.src = `/pieces/${piece}-${side}.png`;
    element.dataset.piece = piece;
    element.dataset.side = side;
    element.dataset.square = square;
    return element;
  };

  // pawns rendered
  for (let i = 0; i < 8; i++) {
    let square = document.querySelector(`[data-square="${boardValues[i]}${pawnRow}"]`)!;
    const pawn = setPieceDataSet(side, "pawn", `${boardValues[i]}${pawnRow}`);
    square.appendChild(pawn);
  }
  // render knight conditionally
  knightSquares.forEach((k) => {
    const knight = setPieceDataSet(side, "knight", k);
    document.querySelector(`[data-square="${k}"]`)?.appendChild(knight);
  });
  // render rook conditionally
  rookSquares.forEach((r) => {
    const rook = setPieceDataSet(side, "rook", r);
    document.querySelector(`[data-square="${r}"]`)?.appendChild(rook);
  });
  // render bishop conditionally
  bishopSquares.forEach((b) => {
    const bishop = setPieceDataSet(side, "bishop", b);
    document.querySelector(`[data-square="${b}"]`)?.appendChild(bishop);
  });
  // render queen conditionally
  queenSquare.forEach((q) => {
    const queen = setPieceDataSet(side, "queen", q);
    document.querySelector(`[data-square="${q}"]`)?.appendChild(queen);
  });
  // render king conditionally
  kingSquare.forEach((k) => {
    const king = setPieceDataSet(side, "king", k);
    document.querySelector(`[data-square="${k}"]`)?.appendChild(king);
  });
};

const drawChessBoard = () => {
  const boardGrid = document.querySelector<HTMLDivElement>(".board-grid")!;
  const boardText = document.querySelector<HTMLDivElement>(".board-text")!;
  const boardNumbers = document.querySelector<HTMLDivElement>(".board-numbers")!;

  const boardValues = ["A", "B", "C", "D", "E", "F", "G", "H"];
  boardValues.forEach((value) => {
    const textBox = document.createElement("p");
    textBox.textContent = value;
    boardText.appendChild(textBox);
  });

  for (let row = 0; row < 8; row++) {
    const numberBox = document.createElement("p");
    numberBox.textContent = (8 - row).toString();
    for (let col = 0; col < 8; col++) {
      const square = document.createElement("div");
      square.dataset.square = `${boardValues[col]}${8 - row}`;
      if ((row + col) % 2 === 0) {
        square.className = "board-primary";
      } else {
        square.className = "board-secondary";
      }
      boardGrid.appendChild(square);
    }
    boardNumbers.appendChild(numberBox);
  }
};

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
      console.log(square, selectedSquare);
      const isValidMove = validateMove(square, selectedSquare);
      if (isValidMove) {
        selectedSquare = null;
        return;
      } else {
        // refresh selectedsquare so we dont get stuck on one piece and unable to move
        selectedSquare = null;
        return;
      }
    }
    selectedSquare?.classList.remove("selected");
  });
};

board.innerHTML = `
  <div class="board-wrapper">
    <div class="board-numbers"></div>
    <div class="board-grid"></div>
  </div>
  <div class="board-text"></div>
`;

drawChessBoard();
drawChessPieces("white");
drawChessPieces("black");
movePiece();

import type { Sides, Pieces } from "./types";
import { boardValues } from "./types";

export const drawChessPieces = (side: Sides) => {
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

export const drawChessBoard = (reverseBoard: boolean) => {
  const boardGrid = document.querySelector<HTMLDivElement>(".board-grid")!;
  const boardText = document.querySelector<HTMLDivElement>(".board-text")!;
  const boardNumbers = document.querySelector<HTMLDivElement>(".board-numbers")!;

  const boardValues = ["A", "B", "C", "D", "E", "F", "G", "H"];
  boardValues.forEach((value) => {
    const textBox = document.createElement("p");
    textBox.textContent = value;
    boardText.appendChild(textBox);
  });

  for (let row = reverseBoard ? 7 : 0;
    reverseBoard ? row >= 0 : row < 8;
    reverseBoard ? row-- : row++) {
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
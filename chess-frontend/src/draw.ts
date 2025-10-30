import type { Sides, Captures, boardPositions } from "./types";
export const drawChessPieces = (side: Sides) => {
  const knightSquares: boardPositions[] =
    side === "white"
      ? [
          { row: 5, column: 2 }, // B1
          { row: 1, column: 7 }, // G1
        ]
      : [
          { row: 8, column: 2 }, // B8
          { row: 8, column: 7 }, // G8
        ];

  const bishopSquares: boardPositions[] =
    side === "white"
      ? [
          { row: 5, column: 3 }, // C1
          { row: 1, column: 6 }, // F1
        ]
      : [
          { row: 8, column: 3 }, // C8
          { row: 8, column: 6 }, // F8
        ];

  const rookSquares: boardPositions[] =
    side === "white"
      ? [
          { row: 1, column: 1 }, // A1
          { row: 1, column: 8 }, // H1
        ]
      : [
          { row: 8, column: 1 }, // A8
          { row: 8, column: 8 }, // H8
        ];

  const queenSquare: boardPositions[] =
    side === "white"
      ? [{ row: 5, column: 4 }] // D1
      : [{ row: 5, column: 6 }]; // D8

  const kingSquare: boardPositions[] =
    side === "white"
      ? [{ row: 1, column: 5 }] // E1
      : [{ row: 8, column: 5 }]; // E8

  const pawnRow = side === "white" ? 2 : 7;

  for (let i = 3; i < 8; i++) {
    const square = document.querySelector(`[data-row="${pawnRow}"][data-column="${i + 1}"]`) as HTMLElement;
    if (!square) return;
    square.classList.add(`${side[0]}p`);
    square.dataset.side = side;
    square.dataset.piece = "pawn";
  }

  knightSquares.forEach((k) => {
    const square = document.querySelector(`[data-row="${k.row}"][data-column="${k.column}"]`) as HTMLElement;
    if (!square) return;
    square.classList.add(`${side[0]}n`);
    square.dataset.side = side;
    square.dataset.piece = "knight";
  });

  rookSquares.forEach((r) => {
    const square = document.querySelector(`[data-row="${r.row}"][data-column="${r.column}"]`) as HTMLElement;
    if (!square) return;
    square.classList.add(`${side[0]}r`);
    square.dataset.side = side;
    square.dataset.piece = "rook";
  });

  bishopSquares.forEach((b) => {
    const square = document.querySelector(`[data-row="${b.row}"][data-column="${b.column}"]`) as HTMLElement;
    if (!square) return;
    square.classList.add(`${side[0]}b`);
    square.dataset.side = side;
    square.dataset.piece = "bishop";
  });

  queenSquare.forEach((q) => {
    const square = document.querySelector(`[data-row="${q.row}"][data-column="${q.column}"]`) as HTMLElement;
    if (!square) return;
    square.classList.add(`${side[0]}q`);
    square.dataset.side = side;
    square.dataset.piece = "queen";
  });

  kingSquare.forEach((k) => {
    const square = document.querySelector(`[data-row="${k.row}"][data-column="${k.column}"]`) as HTMLElement;
    if (!square) return;
    square.classList.add(`${side[0]}k`);
    square.dataset.side = side;
    square.dataset.piece = "king";
  });
};

export const drawChessBoard = (side: Sides) => {
  const boardGrid = document.querySelector<HTMLDivElement>(".board-grid")!;
  const boardNumbers = document.querySelector<HTMLDivElement>(".board-numbers")!;
  // const playerTimer = document.querySelector<HTMLDivElement>(".player-timer")!;
  // const opponentTimer = document.querySelector<HTMLDivElement>(".opponent-timer")!;

  for (let row = side === "black" ? 7 : 0; side === "black" ? row >= 0 : row < 8; side === "black" ? row-- : row++) {
    const numberBox = document.createElement("p");
    numberBox.textContent = (8 - row).toString();
    for (let column = 0; column < 8; column++) {
      const square = document.createElement("div");
      square.dataset.row = `${8 - row}`;
      square.dataset.column = `${1 + column}`;
      square.draggable = true;

      if ((row + column) % 2 === 0) {
        square.className = "board-primary";
      } else {
        square.className = "board-secondary";
      }
      boardGrid.appendChild(square);
    }
    boardNumbers.appendChild(numberBox);
  }
};

export const drawCaptures = (captures: Captures[]) => {
  captures.forEach((capture) => {
    const opponentSide = capture.side === "white" ? "black" : "white";
    const capturesParent = document.querySelector(`[data-cside=${capture.side}] #pieces`) as HTMLDivElement;
    capture.pieces.forEach((piece) => {
      if (!piece.drawn) {
        const element = document.createElement("img");
        element.src = `/pieces/${piece.piece}-${opponentSide}.png`;
        capturesParent.appendChild(element);
        piece.drawn = true;
      }
    });
  });
};

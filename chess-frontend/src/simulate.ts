import type { boardPositions, BoardState, Pieces, Sides } from "./types";

export const showValidMoves = (start: HTMLElement) => {
  console.log(start);
  if (!start.dataset.piece) return;

  const row = Number(start.dataset.row);
  const col = Number(start.dataset.column);
  const boardDivs = document.querySelectorAll<HTMLDivElement>(`.board-grid div`);
  const boardState: BoardState[] = [];
  boardDivs.forEach((div) => {
    boardState.push({
      piece: div.dataset.piece as Pieces,
      row: Number(div.dataset.row),
      column: Number(div.dataset.column),
      side: div.dataset.side as Sides,
    });
  });
  simulateMovements(row, col, start, boardState);
};

const simulateMovements = (row: number, col: number, start: HTMLElement, boardState: BoardState[]) => {
  const moves: boardPositions[] = [];
  console.log(boardState);
  switch (start.dataset.piece as Pieces) {
    case "pawn": {
      const direction = start.dataset.side === "white" ? 1 : -1;
      const startRow = start.dataset.side === "white" ? 2 : 7;
      break;
    }
    case "rook": {
      break;
    }
    case "knight": {
      break;
    }
    case "bishop": {
      break;
    }
    case "queen": {
      break;
    }
    case "king": {
      break;
    }
  }
};

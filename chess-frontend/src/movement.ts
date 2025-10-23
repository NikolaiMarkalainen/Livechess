import { drawCaptures } from "./draw";
import { countDown } from "./timer";
import type { Sides, boardPositions, Move, Pieces, Captures } from "./types";

export const history: Move[] = [];
export const captures: Captures[] = [
  {
    side: "white",
    pieces: [],
  },
  {
    side: "black",
    pieces: [],
  },
];

const removePieces = (elem: HTMLElement) => {
  elem.classList.remove("wp", "wn", "wb", "wr", "wq", "wk", "bp", "bn", "bb", "br", "bq", "bk");
  if (elem.dataset.side && elem.dataset.piece) {
    delete elem.dataset.piece;
    delete elem.dataset.side;
  }
};

// clear out data from target and add new from start
const pushDataToSquare = (target: HTMLElement, start: HTMLElement) => {
  let knight;
  if (start.dataset.piece === "knight") {
    knight = "n";
  }
  removePieces(target);
  target.dataset.piece = start.dataset.piece;
  target.dataset.side = start.dataset.side;
  target.classList.add(`${start.dataset.side![0]}${knight ?? start.dataset.piece![0]}`);
  removePieces(start);
  clearSelected(start);
};

const clearSelected = (start: HTMLElement) => {
  delete start.dataset.selected;
};

const pushNewMove = (target: HTMLElement, start: HTMLElement, capture: boolean) => {
  let move: Move = {
    from: { row: 1, column: 1 },
    to: { row: 1, column: 1 },
    piece: "" as Pieces,
    captured: undefined,
    side: "" as Sides,
  };
  move.piece = target.dataset.piece as Pieces;
  move.side = target.dataset.side as Sides;

  if (move.piece === "king" && Number(start.dataset.column) === 5 && Number(target.dataset.column) === 7) {
    const rookRow = move.side === "white" ? 1 : 8;

    // Remove rook from its original square (h1/h8)
    const oldRookSquare = document.querySelector<HTMLDivElement>(`div[data-row="${rookRow}"][data-column="8"]`);
    removePieces(oldRookSquare!);

    // Place rook on its new square (f1/f8)
    const newRookSquare = document.querySelector<HTMLDivElement>(`div[data-row="${rookRow}"][data-column="6"]`);
    newRookSquare!.dataset.piece = "rook";
    newRookSquare!.dataset.side = move.side;
    newRookSquare?.classList.add(`${move.side[0]}r`);
  }

  move.from = { row: Number(start.dataset.row), column: Number(start.dataset.column) };
  move.to = { row: Number(target.dataset.row), column: Number(target.dataset.column) };

  if (capture) {
    move.captured = target.dataset.piece! as Pieces;
    captures
      .find((c) => c.side === start.dataset.side)
      ?.pieces.push({
        piece: move.captured,
        drawn: false,
      });
    drawCaptures(captures);
  }
  history.push(move);
};

export const assignMove = (target: HTMLElement, start: HTMLElement) => {
  const setNewSquare = (targetSquare: HTMLElement, capture: boolean) => {
    if (!start) return false;
    pushDataToSquare(targetSquare, start);
    pushNewMove(targetSquare, start, capture);
  };

  if (target.dataset.piece !== undefined) {
    if (target.dataset.side !== start.dataset.side) {
      setNewSquare(target, true);
    }
  } else {
    setNewSquare(target, false);
  }
};

export const movePieceAction = (target: HTMLElement, start: HTMLElement, validMoves: boardPositions[]) => {
  let turnToMove: Sides = "white";
  if (history.length % 2 !== 0) {
    turnToMove = "black";
  } else {
    turnToMove = "white";
  }
  if (start.dataset.side !== turnToMove) {
    return;
  }
  validMoves.forEach((move) => {
    if (Number(target.dataset.row) === move.row && Number(target.dataset.column) === move.column) {
      assignMove(target, start);
    }
  });
  return;
};

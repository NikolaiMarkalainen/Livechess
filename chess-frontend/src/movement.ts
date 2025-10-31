import { drawCaptures } from "./draw";
import { type ISides, type IPieces, type boardPositions, type Move, Pieces, Sides, type Captures } from "./types";

export const history: Move[] = [];
export const captures: Captures[] = [
  {
    side: Sides.White,
    pieces: [],
  },
  {
    side: Sides.Black,
    pieces: [],
  },
];

const removePieces = (elem: HTMLElement) => {
  elem.classList.remove("wp", "wn", "wb", "wr", "wq", "wk", "bp", "bn", "bb", "br", "bq", "bk");
  if (elem.dataset.side && elem.dataset.piece) {
    console.log(elem);
    delete elem.dataset.piece;
    delete elem.dataset.side;
  }
};

// clear out data from target and add new from start
const pushDataToSquare = (target: HTMLElement, start: HTMLElement) => {
  let knight;
  if (start.dataset.piece === Pieces.Knight) {
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
    piece: "" as IPieces,
    captured: undefined,
    side: "" as ISides,
  };
  move.piece = target.dataset.piece as IPieces;
  move.side = target.dataset.side as ISides;

  if (move.piece === Pieces.King && Number(start.dataset.column) === 5) {
    const rookRow = move.side === Sides.White ? 1 : 8;
    let oldRookSquare;
    let newRookSquare;

    if (Number(target.dataset.column) === 7) {
      newRookSquare = document.querySelector<HTMLDivElement>(`div[data-row="${rookRow}"][data-column="6"]`);
      oldRookSquare = document.querySelector<HTMLDivElement>(`div[data-row="${rookRow}"][data-column="8"]`);
    }
    if (Number(target.dataset.column) === 2) {
      newRookSquare = document.querySelector<HTMLDivElement>(`div[data-row="${rookRow}"][data-column="3"]`);
      oldRookSquare = document.querySelector<HTMLDivElement>(`div[data-row="${rookRow}"][data-column="1"]`);
    }
    // Remove rook from its original square (h1/h8)
    removePieces(oldRookSquare!);

    // Place rook on its new square (f1/f8)
    newRookSquare!.dataset.piece = Pieces.Rook;
    newRookSquare!.dataset.side = move.side;
    newRookSquare?.classList.add(`${move.side[0]}r`);
  }

  move.from = { row: Number(start.dataset.row), column: Number(start.dataset.column) };
  move.to = { row: Number(target.dataset.row), column: Number(target.dataset.column) };

  if (capture) {
    move.captured = target.dataset.piece! as IPieces;
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
  let turnToMove = Sides.White;
  if (history.length % 2 !== 0) {
    turnToMove = Sides.Black;
  } else {
    turnToMove = Sides.White;
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

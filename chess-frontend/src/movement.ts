import { drawCaptures } from "./draw";
import {
  type ISides,
  type IPieces,
  type boardPositions,
  type Move,
  Pieces,
  Sides,
  type Captures,
  type BoardState,
} from "./types";

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

const updateState = (state: BoardState[][], target: HTMLElement, start: HTMLElement) => {};

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

  //castling
  if (move.piece === Pieces.King && Number(start.dataset.column) === 4) {
    const rookRow = move.side === Sides.White ? 0 : 7;
    let oldRookSquare;
    let newRookSquare;
    // kingside castling
    if (Number(target.dataset.column) === 6) {
      newRookSquare = document.querySelector<HTMLDivElement>(`div[data-row="${rookRow}"][data-column="6"]`);
      oldRookSquare = document.querySelector<HTMLDivElement>(`div[data-row="${rookRow}"][data-column="8"]`);
    }
    //queen side castling
    if (Number(target.dataset.column) === 1) {
      newRookSquare = document.querySelector<HTMLDivElement>(`div[data-row="${rookRow}"][data-column="3"]`);
      oldRookSquare = document.querySelector<HTMLDivElement>(`div[data-row="${rookRow}"][data-column="1"]`);
    }
    removePieces(oldRookSquare!);

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

export const assignMove = (target: HTMLElement, start: HTMLElement, boardState: BoardState[][]) => {
  const setNewSquare = (targetSquare: HTMLElement, capture: boolean) => {
    pushDataToSquare(targetSquare, start);
    pushNewMove(targetSquare, start, capture);
    updateState(boardState);
  };

  if (target.dataset.piece !== undefined) {
    if (target.dataset.side !== start.dataset.side) {
      setNewSquare(target, true);
    }
  } else {
    setNewSquare(target, false);
  }
};

export const movePieceAction = (
  target: HTMLElement,
  start: HTMLElement,
  validMoves: boardPositions[],
  boardState: BoardState[][]
) => {
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
      assignMove(target, start, boardState);
    }
  });
  return;
};

import { drawCaptures } from "./draw";
import { isCheckMate } from "./gameover";
import { countDown } from "./timer";
import {
  type ISides,
  type IPieces,
  type boardPositions,
  Move,
  Pieces,
  Sides,
  type Captures,
  type BoardState,
  DOMPiece,
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

const removePieces = (elem: HTMLElement) => {
  elem.classList.remove("wp", "wn", "wb", "wr", "wq", "wk", "bp", "bn", "bb", "br", "bq", "bk");
  if (elem.dataset.side && elem.dataset.piece) {
    delete elem.dataset.piece;
    delete elem.dataset.side;
  }
};

// clear out data from target and add new from start
const pushDataToSquare = (start: DOMPiece, end: DOMPiece) => {
  let knight;
  if (start.piece === Pieces.Knight) {
    knight = "n";
  }
  const startDOM = document.querySelector<HTMLDivElement>(
    `div[data-row="${start.pos.row}"][data-column="${start.pos.column}"]`
  );
  const endDOM = document.querySelector<HTMLDivElement>(
    `div[data-row="${end.pos.row}"][data-column="${end.pos.column}"]`
  );
  if (startDOM && endDOM) {
    removePieces(endDOM);
    endDOM.dataset.piece = start.piece;
    endDOM.dataset.side = start.side;
    endDOM.classList.add(`${start.side[0]}${knight ?? start.piece[0]}`);
    removePieces(startDOM);
    clearSelected(startDOM);
  }
};

const clearSelected = (start: HTMLElement) => {
  delete start.dataset.selected;
};

const pushNewMove = (start: DOMPiece, end: DOMPiece, capture: boolean, boardState: BoardState[][]) => {
  let move = new Move();
  //castling
  if (move.piece === Pieces.King && Number(start.pos.column) === 4) {
    const rookRow = move.side === Sides.White ? 0 : 7;
    let oldRookSquare;
    let newRookSquare;
    // kingside castling
    if (end.pos.column === 6) {
      newRookSquare = document.querySelector<HTMLDivElement>(`div[data-row="${rookRow}"][data-column="5"]`);
      oldRookSquare = document.querySelector<HTMLDivElement>(`div[data-row="${rookRow}"][data-column="7"]`);
    }
    //queen side castling
    if (end.pos.column === 1) {
      newRookSquare = document.querySelector<HTMLDivElement>(`div[data-row="${rookRow}"][data-column="3"]`);
      oldRookSquare = document.querySelector<HTMLDivElement>(`div[data-row="${rookRow}"][data-column="1"]`);
    }
    removePieces(oldRookSquare!);

    newRookSquare!.dataset.piece = Pieces.Rook;
    newRookSquare!.dataset.side = move.side;
    newRookSquare?.classList.add(`${move.side[0]}r`);
  }

  if (start.piece === Pieces.Pawn && !capture && start.pos.column !== end.pos.column) {
    const enPassantSqr = start.side === Sides.White ? 4 : 3;
    // delete pawn and from our state the square data
    const delPawn = document.querySelector<HTMLDivElement>(
      `div[data-row="${enPassantSqr}"][data-column="${end.pos.column}"]`
    );
    boardState[enPassantSqr][end.pos.column] = undefined;
    removePieces(delPawn);
  }

  // populate move object with data which piece moved where ect.
  move.from = { row: start.pos.row, column: start.pos.column };
  move.to = { row: end.pos.row, column: end.pos.column };
  move.piece = start.piece;
  move.side = start.side;
  if (capture) {
    move.captured = end.piece;
    captures
      .find((c) => c.side === start.side)
      ?.pieces.push({
        piece: move.captured,
        drawn: false,
      });
    drawCaptures(captures);
  }
  history.push(move);

  // empty our array from old data and new data to end square
  boardState[end.pos.row][end.pos.column] = {
    piece: start.piece,
    side: start.side,
  };
  boardState[start.pos.row][start.pos.column] = undefined;
  countDown(start.side);
  console.log(boardState);
  isCheckMate(start.side === Sides.White ? Sides.Black : Sides.White, boardState);
};

export const assignMove = (start: DOMPiece, end: DOMPiece, boardState: BoardState[][]) => {
  const setNewSquare = (capture: boolean) => {
    pushDataToSquare(start, end);
    pushNewMove(start, end, capture, boardState);
  };

  if (end.piece !== undefined) {
    if (end.side !== start.side) {
      setNewSquare(true);
    }
  } else {
    setNewSquare(false);
  }
};

export const movePieceAction = (
  start: DOMPiece,
  end: DOMPiece,
  validMoves: boardPositions[],
  boardState: BoardState[][]
) => {
  let turnToMove = Sides.White;
  if (history.length % 2 !== 0) {
    turnToMove = Sides.Black;
  } else {
    turnToMove = Sides.White;
  }
  if (start.side !== turnToMove) {
    return;
  }
  validMoves.forEach((move) => {
    if (end.pos.row === move.row && end.pos.column === move.column) {
      assignMove(start, end, boardState);
    }
  });
  return;
};

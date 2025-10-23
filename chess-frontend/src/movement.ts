import { drawCaptures } from "./draw";
import { countDown } from "./timer";
import type { Sides, boardPositions, Move, Pieces, Captures } from "./types";
import { boardValues } from "./types";

export const moves: Move[] = [];
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
  console.log(elem);
  if (elem.dataset.side && elem.dataset.piece) {
    delete elem.dataset.piece;
    delete elem.dataset.side;
  }
};

const boardDatasetToArray = (row: string, col: string): boardPositions => {
  if (!row || !col) return { row: 0, column: 0 };
  return {
    column: Number(col),
    row: Number(row),
  };
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

  clearSelected();
};

const clearSelected = () => {
  const movingPiece = document.querySelector<HTMLDivElement>(`div[data-selected="true"]`);
  delete movingPiece?.dataset.selected;
};

const pushNewMove = (target: HTMLElement, start: HTMLElement, capture: boolean) => {
  let move: Move = {
    from: { row: 1, column: 1 },
    to: { row: 1, column: 1 },
    piece: "" as Pieces,
    captured: undefined,
  };
  move.piece = start.dataset.piece as Pieces;
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
  moves.push(move);
};

export const assignMove = (target: HTMLElement, side: Sides) => {
  const setNewSquare = (targetSquare: HTMLElement, capture: boolean) => {
    const movingPiece = document.querySelector<HTMLDivElement>(`div[data-selected="true"]`);
    if (!movingPiece) return false;
    pushDataToSquare(targetSquare, movingPiece);
    pushNewMove(targetSquare, movingPiece, capture);
  };

  if (target.dataset.piece !== undefined) {
    if (target.dataset.side !== side) {
      setNewSquare(target, true);
    }
  } else {
    setNewSquare(target, false);
  }
};

export const collidesWithPieces = (target: boardPositions, start: boardPositions) => {
  const rowDiff = target.row - start.row;
  const columnDiff = target.column - start.column;

  let currentRow = start.row;
  let currentCol = start.column;

  const isPathBlocked = (target: boardPositions, rowMove: number, colMove: number) => {
    while (currentRow !== target.row || currentCol !== target.column) {
      currentRow += rowMove;
      currentCol += colMove;
      if (currentRow === target.row && currentCol === target.column) {
        break;
      }
      const square = document.querySelector<HTMLDivElement>(
        `div[data-row="${currentRow}"][data-column="${currentCol}"]`
      );
      console.log("SQUARE", square);
      if (square?.dataset.piece) {
        return true;
      }
    }
    return false;
  };

  // diag queen / bishop
  if (Math.abs(rowDiff) === Math.abs(columnDiff)) {
    const rowMove = rowDiff > 0 ? 1 : -1;
    const colMove = columnDiff > 0 ? 1 : -1;
    return isPathBlocked(target, rowMove, colMove);
    // rook / queen mov
  } else if (rowDiff === 0 || columnDiff === 0) {
    const rowMove = rowDiff === 0 ? 0 : rowDiff > 0 ? 1 : -1;
    const colMove = columnDiff === 0 ? 0 : columnDiff > 0 ? 1 : -1;
    return isPathBlocked(target, rowMove, colMove);
  }
};

export const movePieceAction = (target: HTMLElement, piece: HTMLElement) => {
  let turnToMove: Sides = "white";
  if (moves.length % 2 !== 0) {
    turnToMove = "black";
  } else {
    turnToMove = "white";
  }
  if (piece.dataset.side !== turnToMove) {
    return;
  }
  // const isChecked = locateKing(turnToMove);
  // if (isChecked) {

  //   return;
  // }
  const isValid = isValidMove(target, piece);

  if (isValid) {
    assignMove(target, piece.dataset.side as Sides);
    countDown(turnToMove);
    return;
  }

  return;
};

export const isValidMove = (target: HTMLElement, piece: HTMLElement): boolean => {
  const pieceSquare = boardDatasetToArray(piece.dataset.row!, piece.dataset.column!);
  const targetSquare = boardDatasetToArray(target.dataset.row!, target.dataset.column!);
  switch (piece.dataset.piece) {
    case "pawn": {
      const columnDifference =
        piece.dataset.side === "white" ? targetSquare.row - pieceSquare.row : pieceSquare.row - targetSquare.row;
      if (pieceSquare.column === targetSquare.column) {
        const startingRow = piece.dataset.side === "white" ? 2 : 7;
        if (columnDifference === 1 || (columnDifference === 2 && pieceSquare.row === startingRow)) {
          // dont allow capturin from front
          if (target.dataset.piece !== undefined) {
            return false;
          }
          return true;
        }
        return false;
      }
      if (target.dataset.piece !== undefined) {
        if (
          (pieceSquare.column - 1 === targetSquare.column && columnDifference === 1) ||
          (pieceSquare.column + 1 === targetSquare.column && columnDifference === 1)
        ) {
          return true;
        }
        return false;
      }
      return false;
    }
    case "knight": {
      const columnMove = Math.abs(pieceSquare.column - targetSquare.column);
      const rowMove = Math.abs(pieceSquare.row - targetSquare.row);
      if ((columnMove === 2 && rowMove === 1) || (columnMove === 1 && rowMove === 2)) {
        return true;
      }
      return false;
    }
    case "bishop": {
      const columnMove = Math.abs(pieceSquare.column - targetSquare.column);
      const rowMove = Math.abs(pieceSquare.row - targetSquare.row);
      if (columnMove >= 1 && rowMove >= 1 && rowMove === columnMove) {
        const isColliding = collidesWithPieces(targetSquare, pieceSquare);
        if (isColliding) {
          return false;
        } else {
          return true;
        }
      }
      return false;
    }
    case "rook": {
      const columnMove = Math.abs(pieceSquare.column - targetSquare.column);
      const rowMove = Math.abs(pieceSquare.row - targetSquare.row);
      if ((columnMove >= 1 && rowMove === 0) || (rowMove >= 1 && columnMove === 0)) {
        const isColliding = collidesWithPieces(targetSquare, pieceSquare);
        if (isColliding) {
          return false;
        } else {
          return true;
        }
      }
      return false;
    }
    case "queen": {
      const columnMove = Math.abs(pieceSquare.column - targetSquare.column);
      const rowMove = Math.abs(pieceSquare.row - targetSquare.row);
      if (
        (columnMove >= 1 && rowMove >= 1 && rowMove === columnMove) ||
        (columnMove >= 1 && rowMove === 0) ||
        (rowMove >= 1 && columnMove === 0)
      ) {
        const isColliding = collidesWithPieces(targetSquare, pieceSquare);
        if (isColliding) {
          return false;
        } else {
          return true;
        }
      }
      return false;
    }
    case "king": {
      const columnMove = Math.abs(pieceSquare.column - targetSquare.column);
      const rowMove = Math.abs(pieceSquare.row - targetSquare.row);
      if (
        (columnMove === 1 && rowMove === 1) ||
        (rowMove === 1 && columnMove === 1) ||
        (rowMove === 1 && columnMove === 0) ||
        (columnMove === 1 && rowMove === 0)
      ) {
        return true;
      }
      return false;
    }
    default: {
      return false;
    }
  }
};

import { drawCaptures } from "./draw";
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

const boardSquareToNumber = (square: string | undefined): boardPositions => {
  if (!square) return { row: 0, column: 0 };
  const column = boardValues.indexOf(square[0].toUpperCase()) + 1;
  return {
    column: column,
    row: Number(square[1]),
  };
};

const boardNumberToLetter = (column: number): string => {
  return boardValues[column - 1];
};

export const assignMove = (target: HTMLElement, side: Sides) => {
  let move: Move = {
    from: "A1",
    to: "A2",
    piece: "" as Pieces, // or a default value
    captured: undefined,
  };

  const setNewSquare = (targetSquare: HTMLElement, capture: boolean): boolean => {
    // fetch the selected piece
    const movingPiece = document.querySelector<HTMLImageElement>(`img[data-selected="true"]`);
    if (!movingPiece) return false;
    move.piece = movingPiece.dataset.piece as Pieces;
    move.from = movingPiece.dataset.square!;
    if (capture) {
      if (targetSquare instanceof HTMLImageElement) {
        const cellDiv = document.querySelector<HTMLDivElement>(`div[data-square=${targetSquare.dataset.square}]`);
        if (!cellDiv) return false;
        cellDiv.replaceChild(movingPiece, targetSquare);
        movingPiece.dataset.square = targetSquare.dataset.square;
        clearSelected();
        move.to = targetSquare.dataset.square!;
        move.captured = targetSquare.dataset.piece! as Pieces;
        captures
          .find((c) => c.side === side)
          ?.pieces.push({
            piece: move.captured,
            drawn: false,
          });
        moves.push(move);
        drawCaptures(captures);
        return true;
      }
    }
    // update the piece position with new one to monitor whats happening
    // the piece is no longer moving we need to remove the selected flag from it
    movingPiece.dataset.square = targetSquare.dataset.square;
    clearSelected();
    targetSquare.appendChild(movingPiece);
    moves.push(move);
    return true;
  };

  const clearSelected = () => {
    const movingPiece = document.querySelector<HTMLImageElement>(`img[data-selected="true"]`);
    delete movingPiece?.dataset.selected;
  };

  if (target instanceof HTMLImageElement) {
    // capture event
    if (target.dataset.side !== side) {
      return setNewSquare(target, true);
    }
  } else {
    return setNewSquare(target, false);
  }
};

export const collidesWithPieces = (targetSquare: boardPositions, pieceSquare: boardPositions) => {
  // check from pos 1 to pos 2 for different pieces so for example we need rook bishop and queen
  const rowDiff = targetSquare.row - pieceSquare.row;
  const columnDiff = targetSquare.column - pieceSquare.column;

  let currentRow = pieceSquare.row;
  let currentCol = pieceSquare.column;

  const isPathBlocked = (targetSquare: boardPositions, rowMove: number, colMove: number) => {
    while (currentRow !== targetSquare.row || currentCol !== targetSquare.column) {
      currentRow += rowMove;
      currentCol += colMove;
      // exit early and validate last square during assignMove function
      if (currentRow === targetSquare.row && currentCol === targetSquare.column) {
        break;
      }
      const columnLetter = boardNumberToLetter(currentCol);
      const square = document.querySelector<HTMLDivElement>(`div[data-square=${columnLetter}${currentRow}]`);

      // check if it has nested image
      if (square?.hasChildNodes()) {
        return true;
      }
    }
    return false;
  };

  // diag queen / bishop
  if (Math.abs(rowDiff) === Math.abs(columnDiff)) {
    const rowMove = rowDiff > 0 ? 1 : -1;
    const colMove = columnDiff > 0 ? 1 : -1;
    return isPathBlocked(targetSquare, rowMove, colMove);
    // rook / queen mov
  } else if (rowDiff === 0 || columnDiff === 0) {
    const rowMove = rowDiff === 0 ? 0 : rowDiff > 0 ? 1 : -1;
    const colMove = columnDiff === 0 ? 0 : columnDiff > 0 ? 1 : -1;
    return isPathBlocked(targetSquare, rowMove, colMove);
  }
};

export const isValidMove = (target: HTMLElement, piece: HTMLElement) => {
  console.log(captures);

  const pieceSquare = boardSquareToNumber(piece.dataset.square);
  const targetSquare = boardSquareToNumber(target.dataset.square);
  let turnToMove: Sides = "white";

  // denote a logic here for who moves here
  if (moves.length % 2 !== 0) {
    turnToMove = "black";
  }
  if (piece.dataset.side !== turnToMove) {
    return false;
  }
  switch (piece.dataset.piece) {
    case "pawn": {
      const columnDifference =
        piece.dataset.side === "white" ? targetSquare.row - pieceSquare.row : pieceSquare.row - targetSquare.row;
      // we are moving on correct column this is allowed
      if (pieceSquare.column === targetSquare.column) {
        const startingRow = piece.dataset.side === "white" ? 2 : 7;
        // when walking forward with a pawn we always need to check whether there is collision
        // allow starterOpening to move 2 rows at once
        if (columnDifference === 1 || (columnDifference === 2 && pieceSquare.row === startingRow)) {
          // dont allow capturin from front
          if (target instanceof HTMLImageElement) {
            return false;
          }
          assignMove(target, piece.dataset.side as Sides);
          return true;
        }
        return false;
      }
      // capture event check if we move onto image here and not blank div
      if (target instanceof HTMLImageElement) {
        if (
          (pieceSquare.column - 1 === targetSquare.column && columnDifference === 1) ||
          (pieceSquare.column + 1 === targetSquare.column && columnDifference === 1)
        ) {
          return assignMove(target, piece.dataset.side as Sides);
        }
        return false;
      }
      return false;
    }
    case "knight": {
      //knight can move in L shape so +2 in one axis and 1 on the other
      const columnMove = Math.abs(pieceSquare.column - targetSquare.column);
      const rowMove = Math.abs(pieceSquare.row - targetSquare.row);
      if ((columnMove === 2 && rowMove === 1) || (columnMove === 1 && rowMove === 2)) {
        return assignMove(target, piece.dataset.side as Sides);
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
          return assignMove(target, piece.dataset.side as Sides);
        }
      }
      return false;
    }
    case "rook": {
      //rook either moves columns or rows
      const columnMove = Math.abs(pieceSquare.column - targetSquare.column);
      const rowMove = Math.abs(pieceSquare.row - targetSquare.row);
      if ((columnMove >= 1 && rowMove === 0) || (rowMove >= 1 && columnMove === 0)) {
        const isColliding = collidesWithPieces(targetSquare, pieceSquare);
        if (isColliding) {
          return false;
        } else {
          return assignMove(target, piece.dataset.side as Sides);
        }
      }
      return false;
    }
    case "queen": {
      const columnMove = Math.abs(pieceSquare.column - targetSquare.column);
      const rowMove = Math.abs(pieceSquare.row - targetSquare.row);
      // checks for bishop or roo ktype mvoes
      if (
        (columnMove >= 1 && rowMove >= 1 && rowMove === columnMove) ||
        (columnMove >= 1 && rowMove === 0) ||
        (rowMove >= 1 && columnMove === 0)
      ) {
        const isColliding = collidesWithPieces(targetSquare, pieceSquare);
        if (isColliding) {
          return false;
        } else {
          assignMove(target, piece.dataset.side as Sides);
          return true;
        }
      }
      return false;
    }
    case "king": {
      const columnMove = Math.abs(pieceSquare.column - targetSquare.column);
      const rowMove = Math.abs(pieceSquare.row - targetSquare.row);
      if (columnMove === 1 || rowMove === 1) {
        console.log(rowMove, columnMove);
        assignMove(target, piece.dataset.side as Sides);
        return true;
      }
      return false;
    }
  }
};

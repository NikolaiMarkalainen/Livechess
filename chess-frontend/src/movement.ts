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
};

const boardDatasetToArray = (row: string, col: string): boardPositions => {
  if (!row || !col) return { row: 0, column: 0 };
  return {
    column: Number(col),
    row: Number(row),
  };
};

const boardNumberToLetter = (column: number): string => {
  return boardValues[column - 1];
};

export const assignMove = (target: HTMLElement, side: Sides): boolean => {
  let move: Move = {
    from: { row: 1, column: 1 },
    to: { row: 1, column: 1 },
    piece: "" as Pieces,
    captured: undefined,
  };

  const setNewSquare = (targetSquare: HTMLElement, capture: boolean): boolean => {
    // fetch the selected piece
    const movingPiece = document.querySelector<HTMLDivElement>(`div[data-selected="true"]`);
    if (!movingPiece) return false;
    move.piece = movingPiece.dataset.piece as Pieces;
    move.from = { row: Number(movingPiece.dataset.row), column: Number(movingPiece.dataset.column) };
    if (capture) {
      if (targetSquare.dataset.piece !== undefined) {
        const cellDiv = document.querySelector<HTMLDivElement>(`div[data-square=${targetSquare.dataset.square}]`);
        if (!cellDiv) return false;
        cellDiv.replaceChild(movingPiece, targetSquare);
        movingPiece.dataset.square = targetSquare.dataset.square;
        clearSelected();
        move.from = { row: Number(targetSquare.dataset.row), column: Number(targetSquare.dataset.column) };
        move.captured = targetSquare.dataset.piece! as Pieces;
        captures
          .find((c) => c.side === side)
          ?.pieces.push({
            piece: move.captured,
            drawn: false,
          });
        moves.push(move);
        drawCaptures(captures);
        console.log("?");
        return true;
      }
    }
    // update the piece position with new one to monitor whats happening
    // the piece is no longer moving we need to remove the selected flag from it
    movingPiece.dataset.column = targetSquare.dataset.column;
    movingPiece.dataset.row = targetSquare.dataset.row;
    removePieces(movingPiece);
    removePieces(targetSquare);
    targetSquare.classList.add(`${side[0]}${movingPiece.dataset.piece![0]}`);
    clearSelected();
    moves.push(move);
    return true;
  };

  const clearSelected = () => {
    const movingPiece = document.querySelector<HTMLDivElement>(`img[data-selected="true"]`);
    delete movingPiece?.dataset.selected;
  };

  if (target.dataset.piece !== undefined) {
    // capture event
    if (target.dataset.side !== side) {
      return setNewSquare(target, true);
    }
  } else {
    return setNewSquare(target, false);
  }
  return false;
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

// generate moves where
// const generatePseudoMoves = (king: HTMLDivElement, filteredPieces: HTMLDivElement[]): boolean => {
//   let canCapture: boolean[] | undefined = [];
//   filteredPieces.forEach((element) => {
//     canCapture.push(isValidMove(king, element));
//   });
//   return canCapture.includes(true);
// };

// const locateKing = (turnToMove: Sides): boolean => {
//   const boardGridImgs = document.querySelectorAll<HTMLDivElement>(`#board-container .board-grid`);
//   const imgsArray = Array.from(boardGridImgs);
//   // select a king that is of the same side as the one moving
//   const kingPiece = imgsArray.filter((img) => img.dataset.piece === "king" && img.dataset.side === turnToMove);
//   //choose black pieces to be checked for if they can land on the tile where the king is
//   const filteredPieces = imgsArray.filter((img) => img.dataset.side !== turnToMove);

//   const isInCheck = generatePseudoMoves(kingPiece[0], filteredPieces);
//   return isInCheck;
// };

export const movePieceAction = (target: HTMLElement, piece: HTMLElement) => {
  let turnToMove: Sides = "white";
  console.log(moves);
  if (moves.length % 2 !== 0) {
    turnToMove = "black";
  } else {
    turnToMove = "white";
  }
  if (piece.dataset.side !== turnToMove) {
    console.log(piece.dataset.side);
    return;
  }
  // const isChecked = locateKing(turnToMove);
  // if (isChecked) {
  //   console.log("wht");

  //   return;
  // }
  console.log(target, piece);
  const isValid = isValidMove(target, piece);
  console.log(isValid);

  if (isValid) {
    assignMove(target, piece.dataset.side as Sides);
    countDown(turnToMove);
  }

  return;
};

export const isValidMove = (target: HTMLElement, piece: HTMLElement): boolean => {
  //before a validmove we have to check for kings position
  // then we check each pieces potential moves ?
  console.log(target, piece);

  const pieceSquare = boardDatasetToArray(piece.dataset.row!, target.dataset.column!);
  const targetSquare = boardDatasetToArray(target.dataset.row!, target.dataset.column!);
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
          if (target.dataset.piece !== undefined) {
            return false;
          }
          return true;
        }
        return false;
      }
      // capture event check if we move onto image here and not blank div
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
      //knight can move in L shape so +2 in one axis and 1 on the other
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
      //rook either moves columns or rows
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

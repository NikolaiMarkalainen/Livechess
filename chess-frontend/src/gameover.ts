import { showValidMoves } from "./simulate";
import type { boardPositions, BoardState, DOMPiece, ISides } from "./types";

export const isCheckMate = (side: ISides, boardState: BoardState[][]) => {
  const availablePieces: DOMPiece[] = [];
  console.log(side);
  for (let i = 0; i < boardState.length; i++) {
    for (let j = 0; j < boardState[i].length; j++) {
      if (boardState[i][j] && boardState[i][j].side === side) {
        availablePieces.push({
          pos: {
            row: i,
            column: j,
          },
          piece: boardState[i][j].piece,
          side: side,
        });
      }
    }
  }
  const moves: boardPositions[][] = [];
  for (let i = 0; i < availablePieces.length; i++) {
    moves.push(showValidMoves(availablePieces[i], boardState));
  }
  const noMoves = moves.every((m) => m.length === 0);
  if (noMoves) {
    console.log("checkmate");
    return true;
  }
  return false;
};

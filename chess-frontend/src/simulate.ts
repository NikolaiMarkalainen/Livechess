import { Pieces, Sides, type boardPositions, type BoardState, type DOMPiece, type ISides } from "./types";
import { history } from "./movement";

export const showValidMoves = (selectedPiece: DOMPiece, boardState: BoardState[][]): boardPositions[] => {
  const moves: boardPositions[] = [];
  const row = selectedPiece.pos.row;
  const col = selectedPiece.pos.column;
  console.log(boardState);
  switch (selectedPiece.piece) {
    case Pieces.Pawn: {
      const direction = selectedPiece.side === Sides.White ? 1 : -1;
      const startRow = selectedPiece.side === Sides.White ? 1 : 6;
      const mvmnt: boardPositions = { row: row + direction, column: col };
      if (!boardState[mvmnt.row][mvmnt.column]?.piece) {
        moves.push(mvmnt);
      }
      if (row === startRow) {
        const mvmnt: boardPositions = { row: row + 2 * direction, column: col };
        if (!boardState[mvmnt.row][mvmnt.column]?.piece) {
          moves.push(mvmnt);
        }
      }
      for (const dc of [-1, 1]) {
        const targetCol = col + dc;
        const targetRow = row + direction;
        const targetSquare = boardState[targetRow][targetCol];
        if (targetSquare?.piece && targetSquare.side !== selectedPiece.side) {
          moves.push({ row: targetRow, column: targetCol });
        }
      }
      break;
    }
    case Pieces.Rook: {
      const directions = [
        { dr: 1, dc: 0 },
        { dr: -1, dc: 0 },
        { dr: 0, dc: 1 },
        { dr: 0, dc: -1 },
      ];

      for (const { dr, dc } of directions) {
        let r = row + dr;
        let c = col + dc;

        while (r >= 0 && r < 8 && c >= 0 && c < 8) {
          const target = boardState[r][c];
          if (!target?.piece) {
            moves.push({ row: r, column: c });
          } else {
            if (target.side !== selectedPiece.side) {
              moves.push({ row: r, column: c });
            }
            break;
          }
          r += dr;
          c += dc;
        }
      }

      break;
    }
    case Pieces.Knight: {
      const knightMoves = [
        { dr: 2, dc: 1 },
        { dr: 2, dc: -1 },
        { dr: -2, dc: 1 },
        { dr: -2, dc: -1 },
        { dr: 1, dc: 2 },
        { dr: 1, dc: -2 },
        { dr: -1, dc: 2 },
        { dr: -1, dc: -2 },
      ];

      for (const { dr, dc } of knightMoves) {
        const r = row + dr;
        const c = col + dc;
        if (r < 0 || r > 7 || c < 0 || c > 7) continue;

        const target = boardState[r][c];
        if (!target?.piece || target.side !== selectedPiece.side) {
          moves.push({ row: r, column: c });
        }
      }

      break;
    }

    case Pieces.Bishop: {
      const directions = [
        { dr: 1, dc: 1 },
        { dr: 1, dc: -1 },
        { dr: -1, dc: 1 },
        { dr: -1, dc: -1 },
      ];

      for (const { dr, dc } of directions) {
        let r = row + dr;
        let c = col + dc;

        while (r >= 0 && r < 8 && c >= 0 && c < 8) {
          const target = boardState[r][c];
          if (!target?.piece) {
            moves.push({ row: r, column: c });
          } else {
            if (target.side !== selectedPiece.side) moves.push({ row: r, column: c });
            break;
          }
          r += dr;
          c += dc;
        }
      }

      break;
    }

    case Pieces.Queen: {
      const directions = [
        { dr: 1, dc: 0 },
        { dr: -1, dc: 0 },
        { dr: 0, dc: 1 },
        { dr: 0, dc: -1 },
        { dr: 1, dc: 1 },
        { dr: 1, dc: -1 },
        { dr: -1, dc: 1 },
        { dr: -1, dc: -1 },
      ];

      for (const { dr, dc } of directions) {
        let r = row + dr;
        let c = col + dc;

        while (r >= 0 && r < 8 && c >= 0 && c < 8) {
          const target = boardState[r][c];
          if (!target?.piece) {
            moves.push({ row: r, column: c });
          } else {
            if (target.side !== selectedPiece.side) moves.push({ row: r, column: c });
            break;
          }
          r += dr;
          c += dc;
        }
      }

      break;
    }

    case Pieces.King: {
      const directions = [
        { dr: 1, dc: 0 },
        { dr: -1, dc: 0 },
        { dr: 0, dc: 1 },
        { dr: 0, dc: -1 },
        { dr: 1, dc: 1 },
        { dr: 1, dc: -1 },
        { dr: -1, dc: 1 },
        { dr: -1, dc: -1 },
      ];

      for (const { dr, dc } of directions) {
        const r = row + dr;
        const c = col + dc;
        if (r < 0 || r > 7 || c < 0 || c > 7) continue;

        const target = boardState[r][c];
        if (!target?.piece || target.side !== selectedPiece.side) {
          moves.push({ row: r, column: c });
        }
      }
      const kingHasMoved = history.some((m) => m.piece === Pieces.King && m.side === selectedPiece.side);

      if (kingHasMoved) break;
      const rookKingside = selectedPiece.side === Sides.Black ? { row: 7, column: 6 } : { row: 0, column: 6 };
      const rookQueenside = selectedPiece.side === Sides.Black ? { row: 7, column: 1 } : { row: 0, column: 1 };
      const rookKingsideHasMoved = history.some(
        (m) =>
          m.piece === Pieces.Rook &&
          m.side === selectedPiece.side &&
          m.from.row === rookKingside.row &&
          m.from.column === rookKingside.column
      );

      const rookQueensideHasMoved = history.some(
        (m) =>
          m.piece === Pieces.Rook &&
          m.side === selectedPiece.side &&
          m.from.row === rookQueenside.row &&
          m.from.column === rookQueenside.column
      );
      if (!rookKingsideHasMoved) {
        // castling allowed push the move
        let collisions: boolean[] = [];
        for (let i = 0; i < 3; i++) {
          if (boardState[row][col + i].piece) {
            collisions.push(true);
          }
        }
        if (!collisions.includes(true)) {
          moves.push(rookKingside);
        }
      }

      if (!rookQueensideHasMoved) {
        let collisions: boolean[] = [];
        for (let i = 1; i <= 3; i++) {
          if (boardState[row][5].piece) {
            collisions.push(true);
          }
        }
        console.log(collisions);
        if (!collisions.includes(true)) {
          moves.push(rookQueenside);
        }
      }
      break;
      // check kingside
    }
  }
  const pos = getKingSquare(selectedPiece.side, boardState);
  if (!pos) return [];
  return validateSimulatedMoves(pos!, selectedPiece, moves, boardState);
};

export const getKingSquare = (side: ISides, boardState: BoardState[][]): boardPositions | undefined => {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const pos = boardState[r][c];
      if (pos) {
        if (pos.piece === Pieces.King && pos.side === side) {
          return { row: r, column: c };
        }
      }
    }
  }
  return undefined;
};

export const validateSimulatedMoves = (
  kingPos: boardPositions,
  selectedPiece: DOMPiece,
  moves: boardPositions[],
  boardState: BoardState[][]
) => {
  const inChecks: boolean[] = [];
  const validMoves: boardPositions[] = [];
  moves.forEach((m) => {
    const newBoard = boardState.map((row) => row.map((cell) => ({ ...cell })));
    const startPosition: boardPositions = { row: selectedPiece.pos.row, column: selectedPiece.pos.column };
    const piece = newBoard[startPosition.row][startPosition.column];
    newBoard[m.row][m.column] = { ...piece };
    newBoard[startPosition.row][startPosition.column].piece = undefined;
    newBoard[startPosition.row][startPosition.column].side = undefined;

    const simulatedKingPos = selectedPiece.piece === Pieces.King ? m : kingPos;
    // CASE OF CASTLING
    if (Math.abs(selectedPiece.pos.column - m.column) > 2 && selectedPiece.piece === Pieces.King) {
      if (inChecks.includes(true)) {
        return [];
      }
    }
    inChecks.push(isSquareUnderAttack(simulatedKingPos, selectedPiece.side, newBoard));
  });
  inChecks.forEach((r, i) => {
    if (!r) {
      validMoves.push(moves[i]);
    }
  });
  console.log(validMoves);
  return validMoves;
};

export const isSquareUnderAttack = (pos: boardPositions, side: ISides, boardState: BoardState[][]): boolean => {
  const opponent = side === Sides.White ? Sides.Black : Sides.White;
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = boardState[r][c];
      if (!piece?.piece || piece.side !== opponent) continue;

      switch (piece.piece) {
        case Pieces.Pawn: {
          const dir = opponent === Sides.White ? 1 : -1;
          if (r + dir === pos.row && (c === pos.column || c === pos.column)) return true;
          break;
        }

        case Pieces.Knight: {
          const knightMoves = [
            { dr: 2, dc: 1 },
            { dr: 2, dc: -1 },
            { dr: -2, dc: 1 },
            { dr: -2, dc: -1 },
            { dr: 1, dc: 2 },
            { dr: 1, dc: -2 },
            { dr: -1, dc: 2 },
            { dr: -1, dc: -2 },
          ];
          for (const { dr, dc } of knightMoves) {
            if (r + dr === pos.row && c + dc === pos.column) return true;
          }
          break;
        }

        case Pieces.Bishop:
        case Pieces.Rook:
        case Pieces.Queen: {
          const directions: { dr: number; dc: number }[] = [];

          if (piece.piece === Pieces.Bishop || piece.piece === Pieces.Queen)
            directions.push({ dr: 1, dc: 1 }, { dr: 1, dc: -1 }, { dr: -1, dc: 1 }, { dr: -1, dc: -1 });

          if (piece.piece === Pieces.Rook || piece.piece === Pieces.Queen)
            directions.push({ dr: 1, dc: 0 }, { dr: -1, dc: 0 }, { dr: 0, dc: 1 }, { dr: 0, dc: -1 });

          for (const { dr, dc } of directions) {
            let rr = r + dr;
            let cc = c + dc;
            while (rr >= 0 && rr < 8 && cc >= 0 && cc < 8) {
              const target = boardState[rr][cc];
              if (rr === pos.row && cc === pos.column) return true;
              if (target?.piece) break; // blocked
              rr += dr;
              cc += dc;
            }
          }
          break;
        }

        case Pieces.King: {
          const kingDirs = [
            { dr: 1, dc: 0 },
            { dr: -1, dc: 0 },
            { dr: 0, dc: 1 },
            { dr: 0, dc: -1 },
            { dr: 1, dc: 1 },
            { dr: 1, dc: -1 },
            { dr: -1, dc: 1 },
            { dr: -1, dc: -1 },
          ];
          for (const { dr, dc } of kingDirs) {
            if (r + dr === pos.row && c + dc === pos.column) return true;
          }
          break;
        }
      }
    }
  }

  return false;
};

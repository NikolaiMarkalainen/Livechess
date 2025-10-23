import type { boardPositions, BoardState, Pieces, Sides } from "./types";
import { history } from "./movement";

export const getKingSquare = (side: Sides, boardState: BoardState[][]): boardPositions | undefined => {
  for (let r = 1; r <= 8; r++) {
    for (let c = 1; c <= 8; c++) {
      const pos = boardState[r][c];
      if (pos.piece === "king" && pos.side === side) {
        return { row: r, column: c };
      }
    }
  }
  return undefined;
};

export const showValidMoves = (start: HTMLElement): boardPositions[] => {
  if (!start.dataset.piece) return [];

  const row = Number(start.dataset.row);
  const col = Number(start.dataset.column);
  const boardDivs = document.querySelectorAll<HTMLDivElement>(`.board-grid div`);
  const boardState: BoardState[][] = Array.from({ length: 9 }, () => Array(9).fill(null));
  boardDivs.forEach((div) => {
    const row = Number(div.dataset.row);
    const col = Number(div.dataset.column);
    boardState[row][col] = {
      piece: div.dataset.piece as Pieces | undefined,
      side: div.dataset.side as Sides | undefined,
    };
  });
  return simulateMovements(row, col, start, boardState);
};

export const isSquareUnderAttack = (pos: boardPositions, side: Sides, boardState: BoardState[][]): boolean => {
  const opponent = side === "white" ? "black" : "white";
  console.log(history);
  for (let r = 1; r <= 8; r++) {
    for (let c = 1; c <= 8; c++) {
      const piece = boardState[r][c];
      if (!piece?.piece || piece.side !== opponent) continue;

      switch (piece.piece) {
        case "pawn": {
          const dir = opponent === "white" ? 1 : -1;
          if (r + dir === pos.row && (c + 1 === pos.column || c - 1 === pos.column)) return true;
          break;
        }

        case "knight": {
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

        case "bishop":
        case "rook":
        case "queen": {
          const directions: { dr: number; dc: number }[] = [];

          if (piece.piece === "bishop" || piece.piece === "queen")
            directions.push({ dr: 1, dc: 1 }, { dr: 1, dc: -1 }, { dr: -1, dc: 1 }, { dr: -1, dc: -1 });

          if (piece.piece === "rook" || piece.piece === "queen")
            directions.push({ dr: 1, dc: 0 }, { dr: -1, dc: 0 }, { dr: 0, dc: 1 }, { dr: 0, dc: -1 });

          for (const { dr, dc } of directions) {
            let rr = r + dr;
            let cc = c + dc;
            while (rr >= 1 && rr <= 8 && cc >= 1 && cc <= 8) {
              const target = boardState[rr][cc];
              if (rr === pos.row && cc === pos.column) return true;
              if (target?.piece) break; // blocked
              rr += dr;
              cc += dc;
            }
          }
          break;
        }

        case "king": {
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

export const validateSimulatedMoves = (
  kingPos: boardPositions,
  side: Sides,
  start: HTMLElement,
  move: boardPositions,
  boardState: BoardState[][]
) => {
  const newBoard = boardState.map((row) => row.map((cell) => ({ ...cell })));
  const startPosition: boardPositions = { row: Number(start.dataset.row), column: Number(start.dataset.column) };
  const piece = newBoard[startPosition.row][startPosition.column];
  newBoard[move.row][move.column] = { ...piece };
  newBoard[startPosition.row][startPosition.column].piece = undefined;
  newBoard[startPosition.row][startPosition.column].side = undefined;

  const simulatedKingPos = piece.piece === "king" ? move : kingPos;

  const inCheck = isSquareUnderAttack(simulatedKingPos, side, newBoard);

  return !inCheck;
};

const shiftPiecePosition = (piece: Pieces) => {};

const simulateMovements = (
  row: number,
  col: number,
  start: HTMLElement,
  boardState: BoardState[][]
): boardPositions[] => {
  const moves: boardPositions[] = [];
  switch (start.dataset.piece as Pieces) {
    case "pawn": {
      const direction = start.dataset.side === "white" ? 1 : -1;
      const startRow = start.dataset.side === "white" ? 2 : 7;
      const mvmnt: boardPositions = { row: row + 1 * direction, column: col };
      if (!boardState[mvmnt.row][mvmnt.column].piece) {
        moves.push(mvmnt);
      }
      if (row === startRow) {
        const mvmnt: boardPositions = { row: row + 2 * direction, column: col };
        if (!boardState[mvmnt.row][mvmnt.column].piece) {
          moves.push(mvmnt);
        }
      }
      for (const dc of [-1, 1]) {
        const targetCol = col + dc;
        const targetRow = row + direction;
        const targetSquare = boardState[targetRow][targetCol];
        if (targetSquare?.piece && targetSquare.side !== start.dataset.side) {
          moves.push({ row: targetRow, column: targetCol });
        }
      }
      break;
    }
    case "rook": {
      const directions = [
        { dr: 1, dc: 0 },
        { dr: -1, dc: 0 },
        { dr: 0, dc: 1 },
        { dr: 0, dc: -1 },
      ];

      for (const { dr, dc } of directions) {
        let r = row + dr;
        let c = col + dc;

        while (r >= 1 && r <= 8 && c >= 1 && c <= 8) {
          const target = boardState[r][c];
          if (!target?.piece) {
            moves.push({ row: r, column: c });
          } else {
            if (target.side !== start.dataset.side) {
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
    case "knight": {
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
        if (r < 1 || r > 8 || c < 1 || c > 8) continue;

        const target = boardState[r][c];
        if (!target?.piece || target.side !== start.dataset.side) {
          moves.push({ row: r, column: c });
        }
      }

      break;
    }

    case "bishop": {
      const directions = [
        { dr: 1, dc: 1 },
        { dr: 1, dc: -1 },
        { dr: -1, dc: 1 },
        { dr: -1, dc: -1 },
      ];

      for (const { dr, dc } of directions) {
        let r = row + dr;
        let c = col + dc;

        while (r >= 1 && r <= 8 && c >= 1 && c <= 8) {
          const target = boardState[r][c];
          if (!target?.piece) {
            moves.push({ row: r, column: c });
          } else {
            if (target.side !== start.dataset.side) moves.push({ row: r, column: c });
            break;
          }
          r += dr;
          c += dc;
        }
      }

      break;
    }

    case "queen": {
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

        while (r >= 1 && r <= 8 && c >= 1 && c <= 8) {
          const target = boardState[r][c];
          if (!target?.piece) {
            moves.push({ row: r, column: c });
          } else {
            if (target.side !== start.dataset.side) moves.push({ row: r, column: c });
            break;
          }
          r += dr;
          c += dc;
        }
      }

      break;
    }

    case "king": {
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
        if (r < 1 || r > 8 || c < 1 || c > 8) continue;

        const target = boardState[r][c];
        if (!target?.piece || target.side !== start.dataset.side) {
          moves.push({ row: r, column: c });
        }
      }
      const kingHasMoved = history.some((m) => m.piece === "king" && m.side === start.dataset.side);

      if (kingHasMoved) break;
      const rookKingside = start.dataset.side === "black" ? { row: 8, column: 8 } : { row: 1, column: 8 };
      const rookQueenside = start.dataset.side === "black" ? { row: 8, column: 1 } : { row: 1, column: 1 };
      const rookKingsideHasMoved = history.some(
        (m) =>
          m.piece === "rook" &&
          m.side === start.dataset.side &&
          m.from.row === rookKingside.row &&
          m.from.column === rookKingside.column
      );

      const rookQueensideHasMoved = history.some(
        (m) =>
          m.piece === "rook" &&
          m.side === start.dataset.side &&
          m.from.row === rookQueenside.row &&
          m.from.column === rookQueenside.column
      );
      if (!rookKingsideHasMoved) {
        for (let i = 7; i === 6; i--) {
          isSquareUnderAttack({ row: rookKingside.row, column: i }, start.dataset.side, boardState);
        }
      }

      if (!rookQueensideHasMoved) {
      }
      break;
      // check kingside
    }
  }
  const pos = getKingSquare(start.dataset.side as Sides, boardState);
  return moves.filter((m) => validateSimulatedMoves(pos!, start.dataset.side as Sides, start, m, boardState));
};

import type { boardPositions, BoardState, Pieces, Sides } from "./types";

export const showValidMoves = (start: HTMLElement): boardPositions[] => {
  console.log(start);
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
  console.log(boardState);
  return simulateMovements(row, col, start, boardState);
};

const simulateMovements = (
  row: number,
  col: number,
  start: HTMLElement,
  boardState: BoardState[][]
): boardPositions[] => {
  const moves: boardPositions[] = [];
  console.log(boardState);
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
      return moves;
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

      return moves;
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

      return moves;
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

      return moves;
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

      return moves;
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

      return moves;
    }
  }
};

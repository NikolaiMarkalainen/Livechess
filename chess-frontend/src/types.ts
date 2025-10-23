export type Pieces = "knight" | "bishop" | "rook" | "queen" | "king" | "pawn";

export type Sides = "white" | "black";

export type boardPositions = {
  row: number;
  column: number;
};

export const boardValues = ["A", "B", "C", "D", "E", "F", "G", "H"];

export type Move = {
  from: boardPositions;
  to: boardPositions;
  piece: Pieces;
  captured?: Pieces;
  side: Sides;
};

export type CapturedPiece = {
  piece: Pieces;
  drawn: boolean;
};

export type Captures = {
  side: Sides;
  pieces: CapturedPiece[];
};

export type BoardState = {
  piece?: Pieces;
  side?: Sides;
};

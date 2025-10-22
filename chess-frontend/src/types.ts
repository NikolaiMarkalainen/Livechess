export type Pieces = "knight" | "bishop" | "rook" | "queen" | "king" | "pawn";

export type Sides = "white" | "black";

export type boardPositions = {
  row: number;
  column: number;
};

export const boardValues = ["A", "B", "C", "D", "E", "F", "G", "H"];

export type Move = {
  from: string;
  to: string;
  piece: Pieces;
  captured?: Pieces;
};

export type CapturedPiece = {
  piece: Pieces;
  drawn: boolean;
};

export type Captures = {
  side: Sides;
  pieces: CapturedPiece[];
};

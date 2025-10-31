export type IPieces = "knight" | "bishop" | "rook" | "queen" | "king" | "pawn";

export type ISides = "white" | "black";

export type IPieceClasses = "p" | "n" | "b" | "r" | "q" | "k";

export const Pieces: Record<string, IPieces> = {
  Knight: "knight",
  Bishop: "bishop",
  Rook: "rook",
  Queen: "queen",
  King: "king",
  Pawn: "pawn",
};

export const Classes: Record<string, IPieceClasses> = {
  Pawn: "p",
  Knight: "n",
  Bishop: "b",
  Rook: "r",
  Queen: "q",
  King: "k",
};

export type IDrawPieces = {
  piece: IPieces;
  class: IPieceClasses;
};

export const Sides: Record<string, ISides> = {
  White: "white",
  Black: "black",
};

export type boardPositions = {
  row: number;
  column: number;
};

export const boardValues = ["A", "B", "C", "D", "E", "F", "G", "H"];

export type Move = {
  from: boardPositions;
  to: boardPositions;
  piece: IPieces;
  captured?: IPieces;
  side: ISides;
};

export type CapturedPiece = {
  piece: IPieces;
  drawn: boolean;
};

export type Captures = {
  side: ISides;
  pieces: CapturedPiece[];
};

export type BoardState = {
  piece?: IPieces;
  side?: ISides;
};

export type IPieces = "knight" | "bishop" | "rook" | "queen" | "king" | "pawn";

export type ISides = "white" | "black";

// export type IPieceClasses = "wp" | "wn" | "wb" | "wr" | "wq" | "wk" | "bp" | "bn" | "bb" | "br" | "bq" | "bk";

export const Pieces: Record<string, IPieces> = {
  Knight: "knight",
  Bishop: "bishop",
  Rook: "rook",
  Queen: "queen",
  King: "king",
  Pawn: "pawn",
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

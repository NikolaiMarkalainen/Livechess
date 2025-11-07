import {
  type ISides,
  type IPieces,
  type Captures,
  type boardPositions,
  Sides,
  Pieces,
  type BoardState,
  type IDrawPieces,
  Classes,
} from "./types";

export const getInitialBoardMap = (): BoardState[][] => {
  const initialBoardState: BoardState[][] = Array.from({ length: 8 }, () => Array(8).fill(undefined));

  const pieces: IPieces[] = [
    Pieces.Rook,
    Pieces.Knight,
    Pieces.Bishop,
    Pieces.Queen,
    Pieces.King,
    Pieces.Bishop,
    Pieces.Knight,
    Pieces.Rook,
  ];

  for (let i = 0; i < 8; i++) {
    initialBoardState[7][i] = { piece: pieces[i], side: Sides.Black };
    initialBoardState[6][i] = { piece: Pieces.Pawn, side: Sides.Black };
    initialBoardState[0][i] = { piece: pieces[i], side: Sides.White };
    initialBoardState[1][i] = { piece: Pieces.Pawn, side: Sides.White };
  }
  return initialBoardState;
};

export const drawChessPieces = () => {
  const pieces: IDrawPieces[] = [
    { piece: Pieces.Rook, class: Classes.Rook },
    { piece: Pieces.Knight, class: Classes.Knight },
    { piece: Pieces.Bishop, class: Classes.Bishop },
    { piece: Pieces.Queen, class: Classes.Queen },
    { piece: Pieces.King, class: Classes.King },
    { piece: Pieces.Bishop, class: Classes.Bishop },
    { piece: Pieces.Knight, class: Classes.Knight },
    { piece: Pieces.Rook, class: Classes.Rook },
  ];
  Object.values(Sides).forEach((side) => {
    const pr = side === Sides.White ? 1 : 6;
    const br = side === Sides.White ? 0 : 7;
    for (let i = 0; i < 8; i++) {
      const square = document.querySelector(`[data-row="${pr}"][data-column="${i}"]`) as HTMLElement;
      if (!square) return;
      square.classList.add(`${side[0]}${Classes.Pawn}`);
      square.dataset.side = side;
      square.dataset.piece = Pieces.Pawn;

      const square2 = document.querySelector(`[data-row="${br}"][data-column="${i}"]`) as HTMLElement;
      if (!square2) return;
      square2.classList.add(`${side[0]}${pieces[i].class}`);
      square2.dataset.side = side;
      square2.dataset.piece = pieces[i].piece;
    }
  });
};

export const drawChessBoard = (side: ISides) => {
  const boardGrid = document.querySelector<HTMLDivElement>(".board-grid")!;
  const boardNumbers = document.querySelector<HTMLDivElement>(".board-numbers")!;
  // const playerTimer = document.querySelector<HTMLDivElement>(".player-timer")!;
  // const opponentTimer = document.querySelector<HTMLDivElement>(".opponent-timer")!;

  for (
    let row = side === Sides.Black ? 7 : 0;
    side === Sides.Black ? row >= 0 : row < 8;
    side === Sides.Black ? row-- : row++
  ) {
    const numberBox = document.createElement("p");
    numberBox.textContent = (7 - row).toString();
    for (let column = 0; column < 8; column++) {
      const square = document.createElement("div");
      square.dataset.row = `${7 - row}`;
      square.dataset.column = `${column}`;
      square.draggable = true;

      if ((row + column) % 2 === 0) {
        square.className = "board-primary";
      } else {
        square.className = "board-secondary";
      }
      boardGrid.appendChild(square);
    }
    boardNumbers.appendChild(numberBox);
  }
};

export const drawCaptures = (captures: Captures[]) => {
  console.log(captures);
  captures.forEach((capture) => {
    const opponentSide = capture.side === Sides.White ? Sides.Black : Sides.White;
    const capturesParent = document.querySelector(`[data-cside=${capture.side}] #pieces`) as HTMLDivElement;
    capture.pieces.forEach((piece) => {
      if (!piece.drawn) {
        const element = document.createElement("img");
        element.src = `/pieces/${piece.piece}-${opponentSide}.png`;
        capturesParent.appendChild(element);
        piece.drawn = true;
      }
    });
  });
};

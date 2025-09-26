import "./style.css";

const board = document.querySelector<HTMLDivElement>("#board")!;

board.innerHTML = `
  <div class="board-wrapper">
    <div class="board-numbers"></div>
    <div class="board-grid"></div>
  </div>
  <div class="board-text"></div>
`;

const boardGrid = document.querySelector<HTMLDivElement>(".board-grid")!;
const boardText = document.querySelector<HTMLDivElement>(".board-text")!;
const boardNumbers = document.querySelector<HTMLDivElement>(".board-numbers")!;

const boardValues = ["A", "B", "C", "D", "E", "F", "G", "H"];

boardValues.forEach((value) => {
  const textBox = document.createElement("p");
  textBox.textContent = value;
  boardText.appendChild(textBox);
});

for (let row = 0; row < 8; row++) {
  const numberBox = document.createElement("p");
  numberBox.textContent = (8 - row).toString();
  for (let col = 0; col < 8; col++) {
    const square = document.createElement("div");
    square.dataset.square = `${boardValues[col]}${8 - row}`;
    if ((row + col) % 2 === 0) {
      square.className = "board-primary";
    } else {
      square.className = "board-secondary";
    }
    boardGrid.appendChild(square);
  }
  boardNumbers.appendChild(numberBox);
}

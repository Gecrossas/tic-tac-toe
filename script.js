const gameBoard = (function () {
    const board = [
        "X", "O", "X",
        "", "", "",
        "", "", "O"
    ];

    function addPiece(piece, coordinate) {
        board[coordinate] = piece;
    };

    function getBoard() {
        return board;
    };

    return { addPiece, getBoard };
})();

const displayController = (function () {
    const boardElement = document.querySelector(".board");

    function createCellElement(piece, index) {
        const element = document.createElement("div");
        element.className = "cell";
        element.setAttribute("data-index", index)
        element.textContent = piece;
        if (piece === "X") {
            element.className = "piece-x";
        } else if (piece === "O") {
            element.className = "piece-o";
        }
        
        return element;
    }

    function render(board) {
        let index = 0;
        board.forEach(cell => {
            console.log(cell);
            boardElement.appendChild(createCellElement(cell, index));
            index++;
        });
    }

    return { render };
})();

displayController.render(gameBoard.getBoard());





function Player(name, piece) {
    this.name = name,
        this.piece = piece,
        this.score = 0;
}

const player1 = new Player("human", "X");
const player2 = new Player("computer", "O");

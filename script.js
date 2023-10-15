const X = "X";
const O = "O";

let currentPiece = X;

const boardController = (function () {
    const board = [
        X, O, X,
        "", O, "",
        "", "", O
    ];

    function addPiece(piece, coordinate) {
        if (board[coordinate] === "") {
            board[coordinate] = piece;
        }
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
        element.setAttribute("data-index", index)
        element.textContent = piece;
        if (piece === X) {
            element.className = "cell piece-x";
        } else if (piece === O) {
            element.className = "cell piece-o";
        } else {
            element.className = "cell";
        }

        return element;
    }

    function clearBoard() {
        let children = Array.from(boardElement.children);
        children.forEach(child => {
            child.remove();
        })
    }

    function render(board) {
        clearBoard();
        let index = 0;
        board.forEach(cell => {
            boardElement.appendChild(createCellElement(cell, index));
            index++;
        });
    }

    return { render };
})();

displayController.render(boardController.getBoard());

const boardElement = document.querySelector(".board");
boardElement.addEventListener("click", (event) => {
    if (event.target.classList.contains("cell")) {
        let index = event.target.getAttribute("data-index")
        boardController.addPiece(currentPiece, index);
        displayController.render(boardController.getBoard());
    }
});



function Player(name, piece) {
    this.name = name,
        this.piece = piece,
        this.score = 0;
}

const player1 = new Player("human", X);
const player2 = new Player("computer", O);

const gameBoard = (function() {
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

const displayController = (function() {
    function render(board) {
        console.table(board);
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

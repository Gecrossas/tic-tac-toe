(function() {
    const X = "X";
    const O = "O";
    const BOARD_ELEMENT = document.querySelector(".board");

    const boardController = (function () {
        const _board = [
            "", "", "",
            "", "", "",
            "", "", ""
        ];

        function addPiece(piece, coordinate) {
            if (piece != X && piece != O)
                return false;

            if (_board[coordinate] === "") {
                _board[coordinate] = piece;
                return true;
            }
            return false;
        };

        function getBoard() {
            return _board;
        };

        return { addPiece, getBoard };
    })();

    const displayController = (function () {
        const _boardElement = document.querySelector(".board");
        let _scoreElement = document.querySelector(".score");

        function renderBoard(board) {
            _clearBoard();
            let index = 0;
            board.forEach(cell => {
                _boardElement.appendChild(_createCellElement(cell, index));
                index++;
            });
        }

        function renderScore(player1, player2) {
            _scoreElement.querySelector("[id='1']").textContent = `${player1.getName()} (${player1.getPiece()}): ${player1.getScore()}`;
            _scoreElement.querySelector("[id='2']").textContent = `${player2.getName()} (${player2.getPiece()}): ${player2.getScore()}`;

        }

        function getBoardElement() {
            return _boardElement;
        }

        function _createCellElement(piece, index) {
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

        function _clearBoard() {
            let children = Array.from(_boardElement.children);
            children.forEach(child => {
                child.remove();
            })
        }

        return { getBoardElement, renderBoard, renderScore };
    })();

    const gameController = (function () {
        let _currentPlayer;
        let _player1;
        let _player2;

        function init(player1, player2) {
            _player1 = player1;
            _player2 = player2;
            _currentPlayer = _player1;
            displayController.renderBoard(boardController.getBoard());
            displayController.getBoardElement().addEventListener("click", (cell) => {
                if (cell.target.classList.contains("cell")) {
                    _renderPiece(cell);
                }
            });
        }

        function _renderPiece(cellElement) {
            let index = cellElement.target.getAttribute("data-index")
            let success = boardController.addPiece(_currentPlayer.getPiece(), index);
            displayController.renderBoard(boardController.getBoard());
            if (success) _switchPlayer();
        }

        function _switchPlayer() {
            _currentPlayer = (_currentPlayer === _player1) ? _player2 : _player1;
        }

        return { init };
    })();

    function createPlayer (name, piece) {
        if (name === "") {
            return console.error("Player name connot be empty.");
        }
        if (piece != X && piece != O) {
            return console.error("Piece value cannot be: " + piece) 
        }

        let _score = 0;
        const increseScore = () => _score++;
        const getScore = () => { return _score; };
        const getName = () => { return name; };
        const getPiece = () => { return piece; };

        return { getName, getPiece, increseScore, getScore };
    }

    const bob = createPlayer("Ren", X);
    const ren = createPlayer("Sam", O);

    displayController.renderBoard(boardController.getBoard());
    displayController.renderScore(bob, ren);
    gameController.init(bob, ren);
})();
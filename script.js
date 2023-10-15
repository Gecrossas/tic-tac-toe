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
        let _boardElement;

        function init(boardElement) {
            _boardElement = boardElement;
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

        function renderBoard(board) {
            _clearBoard();
            let index = 0;
            board.forEach(cell => {
                _boardElement.appendChild(_createCellElement(cell, index));
                index++;
            });
        }

        return { init, render: renderBoard };
    })();

    const gameController = (function () {
        let _currentPiece;
        let _boardElement;

        function init(startingPiece, boardElement) {
            _currentPiece = startingPiece;
            _boardElement = boardElement;
            _boardElement.addEventListener("click", (cell) => {
                if (cell.target.classList.contains("cell")) {
                    _renderPiece(cell);
                }
            });
        }

        function _renderPiece(cellElement) {
            let index = cellElement.target.getAttribute("data-index")
            let success = boardController.addPiece(_currentPiece, index);
            displayController.render(boardController.getBoard());
            if (success) _switchPiece();
        }

        function _switchPiece() {
            _currentPiece = (_currentPiece === X) ? O : X;
        }

        function getCurrentPiece() {
            return _currentPiece;
        }

        return { init, getCurrentPiece };
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

    const bob = createPlayer("bob", X);
    const ren = createPlayer("ren", O);




    displayController.init(BOARD_ELEMENT);
    displayController.render(boardController.getBoard());
    gameController.init(X, BOARD_ELEMENT);
})();
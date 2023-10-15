(function () {
    const X = "X";
    const O = "O";

    const boardController = (function () {
        let _board = [
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

        function resetBoard() {
            _board = [
                "", "", "",
                "", "", "",
                "", "", ""
            ];
        }

        return { addPiece, getBoard, resetBoard };
    })();

    const displayController = (function () {
        const _boardElement = document.querySelector(".board");
        let _scoreElement = document.querySelector(".score");

        async function renderBoard(board) {
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

        async function init(player1, player2) {
            _player1 = player1;
            _player2 = player2;
            _currentPlayer = _player1;
            displayController.renderBoard(boardController.getBoard());
            displayController.renderScore(bob, ren);
            displayController.getBoardElement().addEventListener("click", (cell) => {
                if (cell.target.classList.contains("cell")) {
                    let index = cell.target.getAttribute("data-index")
                    let piecePlaced = boardController.addPiece(_currentPlayer.getPiece(), index);
                    if (piecePlaced) {
                        _handleRound();
                    }
                }
            });
        }

        function _checkWinCondition() {
            const winCombinations = [
                [0, 1, 2],
                [3, 4, 5],
                [6, 7, 8],
                [0, 3, 6],
                [1, 4, 7],
                [2, 5, 8],
                [0, 4, 8],
                [2, 4, 6],
            ];
            const currentBoard = boardController.getBoard();
            const currentPiece = _currentPlayer.getPiece();
            for (const combination of winCombinations) {
                const [a, b, c] = combination;
                if (currentBoard[a] === currentPiece && currentBoard[b] === currentPiece && currentBoard[c] === currentPiece) {
                    return true;
                }
            }
            return false;
        }

        function _resetGame() {
            boardController.resetBoard();
            displayController.renderBoard(boardController.getBoard());
        }

        async function _handleRound() {
            displayController.renderBoard(boardController.getBoard());
            if (_checkWinCondition() === true) {
                _currentPlayer.increseScore();
                displayController.renderScore(bob, ren);
                setTimeout(() => {
                    alert(_currentPlayer.getName() + " has won the round!");
                    _resetGame();
                }, 100);
            };
            _switchPlayer();
        }

        function _switchPlayer() {
            _currentPlayer = (_currentPlayer === _player1) ? _player2 : _player1;
        }

        return { init };
    })();

    function createPlayer(name, piece) {
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

    gameController.init(bob, ren);

    console.log('Start');
    setTimeout(() => {
        console.log('After 1000ms');
    }, 1000);
    console.log('End');
})();
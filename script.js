(function () {
    const X = "X";
    const O = "O";

    const boardController = (function () {
        let _board = Array(9).fill("");

        function addPiece(piece, coordinate) {
            if (piece != X && piece != O)
                return false;

            if (_board[coordinate] === "") {
                _board[coordinate] = piece;
                return true;
            }
            return false;
        }

        function getBoard() {
            return _board;
        }

        function resetBoard() {
            _board = Array(9).fill("");
        }

        return { addPiece, getBoard, resetBoard };
    })();

    const displayController = (function () {
        const _boardElement = document.querySelector(".board");
        const _scoreElement = document.querySelector(".score");
        const _resultElement = document.querySelector(".result");


        function renderBoard(board) {
            _clearBoard();
            board.forEach((cell, index) => {
                _boardElement.appendChild(_createCellElement(cell, index));
            });
        }

        function renderScore(player1, player2) {
            _scoreElement.querySelector("[id='1']").textContent = `${player1.getName()} (${player1.getPiece()}): ${player1.getScore()}`;
            _scoreElement.querySelector("[id='2']").textContent = `${player2.getName()} (${player2.getPiece()}): ${player2.getScore()}`;
        }

        function getBoardElement() {
            return _boardElement;
        }

        function renderResultMessage(name) {
            if (name === null) {
                _resultElement.textContent = "It's a tie!";
            } else {
                _resultElement.textContent = `${name} has won the round!`;
            }
        }

        function removeResultMessage() {
            _resultElement.textContent = "";
        }

        function _createCellElement(piece, index) {
            const element = document.createElement("div");
            element.setAttribute("data-index", index);
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

        return { getBoardElement, renderBoard, renderScore, renderResultMessage, removeResultMessage };
    })();

    const gameController = (function () {
        const _nextRoundButton = document.querySelector("button");
        let _play = true;
        let _isResetting = false;
        let _currentPlayer;
        let _player1;
        let _player2;

        function init(player1, player2) {
            _player1 = player1;
            _player2 = player2;
            _currentPlayer = _player1;
            _nextRoundButton.disabled = true;
            displayController.renderBoard(boardController.getBoard());
            displayController.renderScore(_player1, _player2);
            displayController.getBoardElement().addEventListener("click", (cell) => {
                if (cell.target.classList.contains("cell")) {
                    if (_play) {
                        if (_currentPlayer.isHuman()) {
                            const index = cell.target.getAttribute("data-index")
                            const piecePlaced = boardController.addPiece(_currentPlayer.getPiece(), index);
                            if (piecePlaced) {
                                _handleRound();
                                //Computer player:
                                if (_play) {
                                    boardController.addPiece(
                                        _currentPlayer.getPiece(),
                                        _currentPlayer.makeRandomMove(boardController.getBoard())
                                    );
                                    _handleRound();
                                }
                            }
                        }
                    }
                }
            });
            _nextRoundButton.addEventListener("click", () => {
                if (!_isResetting) {
                    _isResetting = true;
                    _resetGame();
                    _nextRoundButton.disabled = true;
                }
                //If computer goes first on new game:
                if (!_currentPlayer.isHuman()) {
                    boardController.addPiece(
                        _currentPlayer.getPiece(),
                        _currentPlayer.makeRandomMove(boardController.getBoard())
                    );
                    _handleRound();
                }
            })
        };

        function _handleRound() {
            displayController.renderBoard(boardController.getBoard());
            if (_checkWinCondition()) {
                _currentPlayer.increaseScore();
                displayController.renderScore(_player1, _player2);
                displayController.renderResultMessage(_currentPlayer.getName());
                _play = false;
            } else if (_checkTieCondition()) {
                displayController.renderResultMessage(null);
                _play = false;
            }
            _switchPlayer();
            if (!_play) _nextRoundButton.disabled = false;
        }

        function _checkTieCondition() {
            const board = boardController.getBoard();
            return !board.some(value => value === "");
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
            displayController.removeResultMessage();
            _play = true;
            _isResetting = false;
        }

        function _switchPlayer() {
            _currentPlayer = (_currentPlayer === _player1) ? _player2 : _player1;
        }

        return { init };
    })();

    function createPlayer(name, piece) {
        if (name === "") {
            console.error("Player name connot be empty.");
            return null;
        }
        if (piece != X && piece != O) {
            console.error("Piece value cannot be: " + piece);
            return null;
        }

        let _score = 0;

        const increaseScore = () => _score++;
        const getScore = () => { return _score; };
        const getName = () => { return name; };
        const getPiece = () => { return piece; };
        const isHuman = () => { return true };

        return { getName, getPiece, increaseScore, getScore, isHuman };
    }

    function createComputerPlayer(piece) {
        const player = createPlayer("Computer", piece);

        const isHuman = () => { return false };
        const makeRandomMove = function (board) {
            let possibleMoves = [];
            board.forEach((value, index) => {
                if (value === "") {
                    possibleMoves.push(index);
                }
            })
            if (possibleMoves.length === 0) return undefined;
            const randomIndex = Math.floor(Math.random() * possibleMoves.length);
            return possibleMoves[randomIndex];
        }
        return { ...player, makeRandomMove, isHuman };
    }

    const bob = createPlayer("Bob", X);
    const ren = createPlayer("Ren", O);
    const computer = createComputerPlayer(O);

    gameController.init(bob, computer);
})();
// Cell Object
function Cell() {
    let value = '';

    const changeValue = (char) => {if (value === '') value = char};
    const getValue = () => value;

    return { value, changeValue, getValue };
}

// Board Object
const Board = (function Board() {
    const rows = 3;
    const columns = 3;
    const board = [];

    for (let i = 0; i < rows; i++) {
        let row = [];
        for (let j = 0; j < columns; j++) {
            row.push(Cell());
        }
        board.push(row);
    };

    const getBoard = () => board.map(row => row.map(cell => cell.getValue()));

    const displayBoard = () => {
        let currentBoard = getBoard();
        for (let row in currentBoard) {
            console.log(currentBoard[row]);
        }
    };

    const changeValueBoard = (x, y, marker) => {
        board[x][y].changeValue(marker);
    } 

    return { getBoard, displayBoard, changeValueBoard };
}) ();

const boardChecker = (function () {

    const columnCheck = (board) => {
        for (let i = 0; i < 3; i++) {
            if (board[0][i] == board[1][i] && board[0][i] == board[2][i] && board[0][i] !== '') {
                return true;
            }
        }
    };

    const rowCheck = (board) => {
        for (let i = 0; i < 3; i++) {
            if (board[i][0] == board[i][1] && board[i][1] == board[i][2] && board[i][0] !== '') {
                return true;
            }
        }
    };

    const diagonalCheck = (board) => {
        const firstDiagonal = board[0][0] == board[1][1] && board[1][1] == board[2][2] && board[1][1] !== '';
        const secondDiagonal = board[0][2] == board[1][1] && board[2][0] == board[1][1] && board[1][1] !== '';
        if (firstDiagonal || secondDiagonal) {
            return true;
        }
        else {
            return false;
        }
    }

    return { columnCheck, rowCheck, diagonalCheck };
}) ();

// Player Object
function Player(name, marker) {
    return { name, marker };
}

// const pOne = Player(prompt("Enter Player One name"), "X");
// const pTwo = Player(prompt("Enter Player One name"), "O");

// GameController Object
const GameController = (function (playerOne, playerTwo) {
    
    let activePlayer = playerOne;
    
    const switchPlayer = () => {
        activePlayer = (activePlayer === playerOne) ? playerTwo : playerOne;
    };

    const getActivePlayer = () => activePlayer;

    const playRound = () => {
        console.log("Round Starting!");
        let targetRow = prompt(`${activePlayer.name}, enter row number (1|2|3)`);
        let targetCol = prompt(`${activePlayer.name}, enter column number (1|2|3)`);
        Board.changeValueBoard(targetRow, targetCol, activePlayer.marker);
        Board.displayBoard();
    }

    return { getActivePlayer, switchPlayer, playRound };
}) (pOne, pTwo);

// Game Function
function Game() {
    let gameOver = false;

    while (!gameOver) {
        GameController.playRound();
        let currentBoard = Board.getBoard()
        if (boardChecker.columnCheck(currentBoard) || boardChecker.rowCheck(currentBoard) || boardChecker.diagonalCheck(currentBoard)) {
            gameOver = true;
            console.log(`${GameController.getActivePlayer().name} won!`);
        }
        else if (currentBoard.flat().filter(elem => elem != '').length === 9) {
            gameOver = true;
            console.log("Its a draw!")
        }
        GameController.switchPlayer();
    }
}


// Game();
// const cells = document.querySelectorAll(".box");
const square = document.querySelector(".square");
const turnText = document.querySelector(".current-player-text");
const modalBox = document.querySelector(".modal");
const closeBtn = document.querySelector(".close");
const result = document.querySelector(".result-message");

// cells.forEach(cell => cell.addEventListener("click", () => {
//     cell.textContent = GameController.getActivePlayer().marker;
// }))

closeBtn.addEventListener("click", () => modalBox.style.display = 'none');

// Cell Factory Function
function Cell() {
    let value = '';
    let cellRowNum;
    let cellColNum;
    let setChangeValue = true;
    let cellColor = '#36EEE0';

    const changeValue = (char) => {if (value === '' && char !== '') {
        value = char
        setChangeValue = false;
    }};

    const setColor = (color) => {cellColor = color};
    const getColor = () => cellColor;
    const getValue = () => value;
    const getSetChangeValue = () => setChangeValue;

    const changeCellRowNum = (row) => cellRowNum = row;
    const getCellRowNum = () => cellRowNum;

    const changeCellColNum = (col) => cellColNum = col;
    const getCellColNum = () => cellColNum;

    return { changeValue, getValue, changeCellColNum, changeCellRowNum, getCellColNum, getCellRowNum, getSetChangeValue, getColor, setColor };
}

// Board Object
const Board = (function Board() {
    const rows = 3;
    const columns = 3;
    const board = [];

    for (let i = 0; i < rows; i++) {
        let row = [];
        for (let j = 0; j < columns; j++) {
            let newCell = Cell()
            newCell.changeCellRowNum(i+1);
            newCell.changeCellColNum(j+1);
            row.push(newCell);
        }
        board.push(row);
    };

    const getPureBoard = () => board;

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

    return { getBoard, displayBoard, changeValueBoard, getPureBoard };
}) ();

const boardChecker = (function () {

    let gameWinDetails = [];

    const getGameWinDetails = () => gameWinDetails;

    const columnCheck = (board) => {
        for (let i = 0; i < 3; i++) {
            if (board[0][i] == board[1][i] && board[0][i] == board[2][i] && board[0][i] !== '') {
                gameWinDetails[0] = 'c';
                gameWinDetails[1] = i+1;
                return true;
            }
        }
    };

    const rowCheck = (board) => {
        for (let i = 0; i < 3; i++) {
            if (board[i][0] == board[i][1] && board[i][1] == board[i][2] && board[i][0] !== '') {
                gameWinDetails[0] = 'r';
                gameWinDetails[1] = i+1;
                return true;
            }
        }
    };

    const diagonalCheck = (board) => {
        const firstDiagonal = board[0][0] == board[1][1] && board[1][1] == board[2][2] && board[1][1] !== '';
        const secondDiagonal = board[0][2] == board[1][1] && board[2][0] == board[1][1] && board[1][1] !== '';
        if (firstDiagonal) {
            gameWinDetails[0] = 'd';
            gameWinDetails[1] = 1;
            return true;
        }
        else if (secondDiagonal) {
            gameWinDetails[0] = 'd';
            gameWinDetails[1] = 2;
            return true;
        }
    }

    return { columnCheck, rowCheck, diagonalCheck, getGameWinDetails };
}) ();

// Player Factory Function
function Player(name, marker, playerColor) {
    return { name, marker, playerColor };
}

const pOne = Player(localStorage.getItem('playerOneName'), "X", '#36EEE0');
const pTwo = Player(localStorage.getItem('playerTwoName'), "O", '#F652A0');

// GameController Object
const GameController = (function (playerOne, playerTwo) {
    
    let activePlayer = playerOne;
    
    const switchPlayer = () => {
        activePlayer = (activePlayer === playerOne) ? playerTwo : playerOne;
    };

    const getActivePlayer = () => activePlayer;

    return { getActivePlayer, switchPlayer };
}) (pOne, pTwo);

let possiblePlayerChange = true;
const Game = (function () {
    let gameOver = false;

    const getGameOver = () => gameOver;

    const gameLogic = () => {
        let currentBoard = Board.getBoard()
        if (boardChecker.columnCheck(currentBoard) || boardChecker.rowCheck(currentBoard) || boardChecker.diagonalCheck(currentBoard)) {
            gameOver = true;
            let details = boardChecker.getGameWinDetails();
            let selectQuery = `.${details[0]}-${details[1]}`;
            const line = document.querySelector(selectQuery);
            line.style.display = "block";
            result.textContent = `${GameController.getActivePlayer().name} won`;
            modalBox.style.display = 'block';
        }
        else if (currentBoard.flat().filter(elem => elem != '').length === 9) {
            gameOver = true;
            result.textContent = "Its a draw!";
            modalBox.style.display = 'block';
        }
        else {
            if (possiblePlayerChange) GameController.switchPlayer();
            turnText.textContent = `${GameController.getActivePlayer().name}'s turn`;
        }
    };

    return { getGameOver, gameLogic }
}) ();


function addMark() {
    currentRow = this.classList[0].split("-")[0];
    currentCol = this.classList[0].split("-")[1];
    createUIGrid(GameController.getActivePlayer().marker, currentCol, currentRow);
}

function createUILines () {
    const c1 = document.createElement("div");
    c1.classList.add('c-1');
    const c2 = document.createElement("div");
    c2.classList.add('c-2');
    const c3 = document.createElement("div");
    c3.classList.add('c-3');
    const r1 = document.createElement("div");
    r1.classList.add('r-1');
    const r2 = document.createElement("div");
    r2.classList.add('r-2');
    const r3 = document.createElement("div");
    r3.classList.add('r-3');
    const d1 = document.createElement("div");
    d1.classList.add('d-1');
    const d2 = document.createElement("div");
    d2.classList.add('d-2');
    const lineArray = [c1, c2, c3, r1, r2, r3, d1, d2];
    for (let i = 0; i < lineArray.length; i++) {
        lineArray[i].classList.add('line');
        square.appendChild(lineArray[i]);
    }
};

let currentCol = 1;
let currentRow = 1;
turnText.textContent = `${GameController.getActivePlayer().name}'s turn`;
createUIGrid('', 1, 1);

function createUIGrid(mark, col, row) {
    if (!Game.getGameOver()) {
        // Remove exisitng board
        square.replaceChildren();

        // Create new board ui
        createUILines();
        let cells = Board.getPureBoard().flat();
        for (let i = 0; i < cells.length; i++) {
            let cell = document.createElement("div")
            cell.classList.add(`${cells[i].getCellRowNum()}-${cells[i].getCellColNum()}`);
            cell.classList.add("box");
            cell.style.color = cells[i].getColor();
            cell.textContent = cells[i].getValue();
            if (Game.getGameOver()) {
                console.log("Hello, I am here")
                cell.removeEventListener("click", addMark)
                cell.removeEventListener("click", Game.gameLogic);
            };

            // Add symbol to board ui
            cell.addEventListener("click", addMark)
            // Check for win cases
            cell.addEventListener("click", Game.gameLogic);

            // Add cells to the board
            square.appendChild(cell);
            if (cells[i].getCellRowNum() == row && cells[i].getCellColNum() == col) {
                if (Board.getPureBoard()[cells[i].getCellRowNum()-1][cells[i].getCellColNum()-1].getSetChangeValue()) {
                    Board.changeValueBoard(cells[i].getCellRowNum()-1, cells[i].getCellColNum()-1, mark)
                    cell.textContent = Board.getPureBoard()[cells[i].getCellRowNum()-1][cells[i].getCellColNum()-1].getValue();
                    cell.style.color = GameController.getActivePlayer().playerColor;
                    Board.getPureBoard()[cells[i].getCellRowNum()-1][cells[i].getCellColNum()-1].setColor(GameController.getActivePlayer().playerColor);
                    possiblePlayerChange = true;
                }
                else {
                    possiblePlayerChange = false;
                }
                
            }
        }       
    } 
    turnText.textContent = '';
}


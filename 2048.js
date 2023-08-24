// Constants
const GRID_SIZE = 4;
const EMPTY_CELL = 0;

// Initialize the board
let board = new Array(GRID_SIZE).fill(0).map(() => new Array(GRID_SIZE).fill(EMPTY_CELL));
let prevBoard = JSON.parse(JSON.stringify(board));

// Function to print the board
function printBoard() {
    for (let row of board) {
        console.log(row.map(tile => tile.toString().padStart(4)).join(' '));
    }
}

// Function to add a random tile (2 or 4) to an empty cell
function addRandomTile(value1, value2) {
    let emptyCells = [];
    for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
            if (board[row][col] === EMPTY_CELL) {
                emptyCells.push({ row, col });
            }
        }
    }

    if (emptyCells.length > 0) {
        let { row, col } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        board[row][col] = Math.random() < 0.9 ? value1 : value2;
    }
}

// Function to check for a winning condition
function hasWon() {
    for (let row of board) {
        if (row.includes(1)) {
            return true;
        }
    }
    return false;
}

// Function to check for a losing condition
function hasLost() {
    let directions = ["left", "right", "up", "down"];
    for (let direction of directions) {
        let prevBoardCopy = JSON.parse(JSON.stringify(board));
        move(direction);
        if (!arraysEqual(prevBoardCopy, board)) {
            board = JSON.parse(JSON.stringify(prevBoardCopy));
            return false;
        }
    }
    return true;
}

// Function to move tiles in a given direction
function move(direction) {
    // Store the previous board state
    prevBoard = JSON.parse(JSON.stringify(board));

    if (direction === "left") {
        for (let row of board) {
            // Move tiles to the left and merge if possible
            let newRow = row.filter(tile => tile !== EMPTY_CELL);
            while (newRow.length < GRID_SIZE) {
                newRow.push(EMPTY_CELL);
            }
            for (let i = 0; i < GRID_SIZE - 1; i++) {
                if (newRow[i] === newRow[i + 1] && newRow[i] !== EMPTY_CELL) {
                    newRow[i] = collatz(newRow[i]);
                    newRow[i + 1] = EMPTY_CELL;
                }
            }
            row.length = newRow.length;
            for (let i = 0; i < newRow.length; i++) {
                row[i] = newRow[i];
            }
        }
        if (!arraysEqual(prevBoard, board)) {
            addRandomTile(value1, value2);
        }
    } else if (direction === "right") {
        for (let row of board) {
            // Move tiles to the right and merge if possible
            let newRow = row.filter(tile => tile !== EMPTY_CELL);
            while (newRow.length < GRID_SIZE) {
                newRow.unshift(EMPTY_CELL);
            }
            for (let i = GRID_SIZE - 1; i > 0; i--) {
                if (newRow[i] === newRow[i - 1] && newRow[i] !== EMPTY_CELL) {
                    newRow[i] = collatz(newRow[i]);
                    newRow[i - 1] = EMPTY_CELL;
                }
            }
            row.length = newRow.length;
            for (let i = 0; i < newRow.length; i++) {
                row[i] = newRow[i];
            }
        }
        if (!arraysEqual(prevBoard, board)) {
            addRandomTile(value1, value2);
        }
    } else if (direction === "up") {
        // Transpose the board, move tiles up, and transpose it back
        board = transpose(board);
        move("left");
        board = transpose(board);
    } else if (direction === "down") {
        // Transpose the board, move tiles down, and transpose it back
        board = transpose(board);
        move("right");
        board = transpose(board);
    }
}

// Function to perform the Collatz operation
function collatz(num) {
    return num % 2 === 1 ? 3 * num + 1 : num / 2;
}

// Function to transpose a matrix
function transpose(matrix) {
    return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
}

// Function to compare two arrays for equality
function arraysEqual(arr1, arr2) {
    return JSON.stringify(arr1) === JSON.stringify(arr2);
}

// Initialize the game
let value1 = parseInt(prompt("Enter the first value for random tiles: "));
let value2 = collatz(value1)

addRandomTile(value1, value2);
addRandomTile(value1, value2);
printBoard();

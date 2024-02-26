/*----- constants -----*/
// audio for boat taking a shot (BONUS)
// audio for computer hitting a boat (BONUS)
const BOAT_SIZES = {
    5: "Aircraft Carrier",
    4: "Battleship",
    3: "Destroyer",
    3: "Submarine",
    2: "Patrol Boat"
}

// Coordinates for the game board grids
const COORDINATE_LOOKUP = {
    1: 'a', 2: 'b', 
    3: 'c', 4: 'd', 
    5: 'e', 6: 'f', 
    7: 'g', 8: 'h',
    9: 'i', 10: 'j'
}

// Values for the game board grid squares  ---- TODO MAKE ANOTHER TO FIX TWO BOATS NEXT TO EACH OTHER ----
const SQUARE_VALUE = {
    EMPTY: 0,
    MISS: 1,
    HIT: 2,
    BOAT: 3
}

// Value assigned to each player
const PLAYER_VALUE = {
    "1": "Player 1",
    "-1": "Player 2"
}

const TOTAL_HITS_TO_WIN = 17;  // sum of the amount of hits for all boats


/*----- app's state (variables) -----*/
let turn;                               // player1 = 1 || player2 = -1
let winner;                             // null=no winner || winner=1/-1
let gameStart;                          // game start flag
let player1BoatBoard;                   // player1 board with boats
let player1GuessBoard;                  // player2 board with boats
let player2BoatBoard;                   // player1 board with guesses
let player2GuessBoard;                  // player2 board with guesses
let player1NumBoats;                    // number of boats player1 has on the board
let player2NumBoats;                    // number of boats player2 has on the board
let moreLogInfo;                        // more info to append to the game log if needed
let directHits = { "1": 0, "-1": 0 };   // number of hits each player has taken
let p1BoatsPlaced = {                   // player 1's placed boats
    "Aircraft Carrier": false,
    "Battleship": false,
    "Destroyer": false,
    "Submarine": false,
    "Patrol Boat": false,
}
let p2BoatsPlaced = {                   // player 2's placed boats
    "Aircraft Carrier": false,
    "Battleship": false,
    "Destroyer": false,
    "Submarine": false,
    "Patrol Boat": false,
}


/*----- cached element references -----*/
const boatBtns = document.getElementById("boat-buttons");                                    // boat placement buttons
const messageEl = document.getElementById("game-log");                                       // game log 
const takeGuessBtn = document.getElementById("take-guess-btn");                              // take guess button
const placeAircraftCarrierBtn = document.getElementById("place-aircraft-carrier-btn");       // place aircraft carrier boat button
const placeBattleshipBtn = document.getElementById("place-battleship-btn");                  // place battleship boat button
const placeDestroyerBtn = document.getElementById("place-destroyer-btn");                    // place destoryer boat button
const placeSubmarinepBtn = document.getElementById("place-submarine-btn");                   // place submarine boat button
const placePatrolBoatBtn = document.getElementById("place-patrol-boat-btn");                 // place patrol boat boat button
const lockFleetBtn = document.getElementById("lock-fleet-btn");                              // lock fleet button
const newGameBtn = document.getElementById("new-game-btn");                                  // new game button
const p1bSquareEls = [...document.querySelectorAll("#player1-boat-board > div")];            // squares in the P1 Boat Board
const p1gSquareEls = [...document.querySelectorAll("#player1-guess-board > div")];           // squares in the P1 GUess Board
const p2gSquareEls = [...document.querySelectorAll("#player2-guess-board > div")];           // squares in the P2 Guess Board
const p2bSquareEls = [...document.querySelectorAll("#player2-boat-board > div")];            // squares in the P2 Boat Board


/*----- event listeners -----*/
placeAircraftCarrierBtn.addEventListener("click", handleBoatSave);                           // listens for click on aircraft carrier button
placeBattleshipBtn.addEventListener("click", handleBoatSave);                                // listens for click on battle button
placeDestroyerBtn.addEventListener("click", handleBoatSave);                                 // listens for click on destoryer button
placeSubmarinepBtn.addEventListener("click", handleBoatSave);                                // listens for click on submarine button
placePatrolBoatBtn.addEventListener("click", handleBoatSave);                                // listens for click on patrol boat button
lockFleetBtn.addEventListener("click", handleLockFleet);                                     // listens for click on lock fleet button
newGameBtn.addEventListener("click", init);                                                  // listens for click on new game button
document.getElementById("player1-boat-board").addEventListener("click", handleSquare);       // listens for click on P1 Boat Board button
document.getElementById("player1-guess-board").addEventListener("click", handleSquare);      // listens for click on P1 Guess Board button
document.getElementById("player2-guess-board").addEventListener("click", handleSquare);      // listens for click on P2 Guess Board button
document.getElementById("player2-boat-board").addEventListener("click", handleSquare);       // listens for click on P2 Boat Board button


/*----- functions -----*/
init();  // start the game 

// Starts the game by initializing the state variables
function init() {
    // Game boards for both players set to empty
    // The game boards here are the same orientation as on screen
    player1BoatBoard = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];
    player1GuessBoard = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];
    player2BoatBoard = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];
    player2GuessBoard = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];
    
    //clear all hits, misses, and boats   ---------TODO: SLIGHT BOARD CHANGE -----------
    [...document.querySelectorAll(".board > div")].forEach(sq => {
        sq.style.backgroundColor = "transparent";
        // maybe add a pseudo-class?
    });

    p1BoatsPlaced = {
        "Aircraft Carrier": false,
        "Battleship": false,
        "Destroyer": false,
        "Submarine": false,
        "Patrol Boat": false,
    }
    p2BoatsPlaced = {
        "Aircraft Carrier": false,
        "Battleship": false,
        "Destroyer": false,
        "Submarine": false,
        "Patrol Boat": false,
    }

    turn = 1;                           // play starts with player1
    winner = null;                      // there is no winner on initialization
    player1NumBoats = 0;                // player1 starts with 0 boats
    player2NumBoats = 0;                // player2 starts with 0 boats
    gameStart = false;                  // game has not started
    moreLogInfo = "";                   // there isn't any more info the tell the player
    directHits = { "1": 0, "-1": 0 };   // no hits have been made
    render();                           // render the initiated game
    submarineChosen = false;            // submarine boat hasn't been chosen
    destoyerChosen= false;             // destroyer boat hasn't been chosen
    return;
}

// Checks if the number of boats left for a player is 0 and returns the opponent if true or nothing if there is no winner
function getWinner(turn) {
    if (directHits[turn] === TOTAL_HITS_TO_WIN) {
        winner = turn;
    }
    return;
}


// ------------------------------------------------------------------------------------------------------------
function handleBoatSave(boardId, board, col, row) {
    let square = board[col][row];
    if (square !== SQUARE_VALUE.BOAT) {
        board[col][row] = 3;
        return;
    }
    let startCnt = square === SQUARE_VALUE.BOAT ? 1 : 0;
    let upCnt = checkUpSquare(board, col, row);
    let downCnt = checkDownSquare(board, col, row);
    let rightCnt = checkRightSquare(board, col, row);
    let leftCnt = checkLeftSquare(board, col, row);

    let upDownCnt = upCnt + downCnt + startCnt;
    let leftRightCnt = rightCnt + leftCnt + startCnt;
    
    if (boardId == "player1-boat-board" && player1NumBoats !== 5) {
        if (upDownCnt === 5 || leftRightCnt == 5 && !p1BoatsPlaced["Aircraft Carrier"]) {
            p1BoatsPlaced["Aircraft Carrier"] = true;
            player1NumBoats++;
        } else if (upDownCnt === 4 || leftRightCnt == 4 && !p1BoatsPlaced["Battleship"]) {
            p1BoatsPlaced["Battleship"] = true;
            player1NumBoats++;
        } else if (upDownCnt === 3 || leftRightCnt == 3 && !p1BoatsPlaced["Destroyer"]) {
            p1BoatsPlaced["Destroyer"] = true;
            player1NumBoats++;
        } else if (upDownCnt === 3 || leftRightCnt == 3 && !p1BoatsPlaced["Submarine"]) {
            p1BoatsPlaced["Submarine"] = true;
            player1NumBoats++;
        } else if (upDownCnt === 2 || leftRightCnt == 2 && !p1BoatsPlaced["Patrol Boat"]) {
            p1BoatsPlaced["Patrol Boat"] = true;
            player1NumBoats++;
        }
    } else if (boardId == "player2-boat-board" && player2NumBoats !== 5) {
        if (upDownCnt === 5 || leftRightCnt == 5 && !p2BoatsPlaced["Aircraft Carrier"]) {
            p2BoatsPlaced["Aircraft Carrier"] = true;
            player2NumBoats++;
        } else if (upDownCnt === 4 || leftRightCnt == 4 && !p2BoatsPlaced["Battleship"]) {
            p2BoatsPlaced["Battleship"] = true;
            player2NumBoats++;
        } else if (upDownCnt === 3 || leftRightCnt == 3 && !p2BoatsPlaced["Destroyer"]) {
            p2BoatsPlaced["Destroyer"] = true;
            player2NumBoats++;
        } else if (upDownCnt === 3 || leftRightCnt == 3 && !p2BoatsPlaced["Submarine"]) {
            p2BoatsPlaced["Submarine"] = true;
            player2NumBoats++;
        } else if (upDownCnt === 2 || leftRightCnt == 2 && !p2BoatsPlaced["Patrol Boat"]) {
            p2BoatsPlaced["Patrol Boat"] = true;
            player2NumBoats++;
        }
    }
    if (player1NumBoats === 5 && player2NumBoats === 5) {
        moreLogInfo = "Commence bombardment!";
        gameStart = true;
    }
}

// Checks the squares to the below of the current square
function checkUpSquare(board, col, row) {
    return countAdjacent(board, col, row, -1, 0);
}

// Checks the squares to the below of the current square
function checkDownSquare(board, col, row) {
    return countAdjacent(board, col, row, +1, 0);
}

// Checks the squares to the right of the current square
function checkRightSquare(board, col, row) {
    return countAdjacent(board, col, row, 0, +1);
}

// Checks the squares to the left of the current square
function checkLeftSquare(board, col, row) {
    return countAdjacent(board, col, row, 0, -1);
}

// Counts the adjacent squares to to determine the length of the boat squares next to current square
function countAdjacent(board, col, row, colOffset, rowOffset) {
    const val = board[col][row];   // value in the current square
    let count = 0;                 // initiate a count
    col += colOffset;              // set the current square column position to the offset
    row += rowOffset;              // set the current square row position to the offset

    // while the current square position is on the board, equal to the same value, and a boat square
    // increase the count, column position, and row position to continue moving in the required direction
    while (
        board[col] !== undefined &&
        board[col][row] !== undefined &&
        board[col][row] === val &&
        board[col][row] === SQUARE_VALUE.BOAT
        ) {
            count++;
            col += colOffset;
            row += rowOffset;
    }
    return count;
}
// ------------------------------------------------------------------------------------------------------------


function handleLockFleet() {}

//  Click event handlers for the squares on each board
function handleSquare(evt) {
    const boardId = evt.currentTarget.id;   // id of the board clicked on
    let square; let board;
    let col; let row;

    // assign the board being used and the square clicked to saved variables
    if (boardId === "player1-boat-board") {
        square = p1bSquareEls.indexOf(evt.target);
        board = player1BoatBoard;
    } else if (boardId === "player1-guess-board") {
        square = p1gSquareEls.indexOf(evt.target);
        board = player1GuessBoard;
    } else if (boardId === "player2-guess-board") {
        square = p2gSquareEls.indexOf(evt.target);
        board = player2GuessBoard;
    } else if (boardId === "player2-boat-board") {
        square = p2bSquareEls.indexOf(evt.target);
        board = player2BoatBoard;
    } 

    // split the square clicked on into an array for the column and row numbers
    const arr = square.toString().split("");

    // determine the row and column numbers from the split square array
    // once the coordinates are determined, check the square to determine if it's a hit or miss
    if (0 <= square && square < 10) {
        col = 0;
        row = parseInt(arr[0]);
        checkSquare(boardId, board, col, row);
    } else if (10 <= square && square < 20) {
        col = parseInt(arr[0]);
        row = parseInt(arr[1]);
        checkSquare(boardId, board, col, row);
    } else if (20 <= square && square < 30) {
        col = parseInt(arr[0]);
        row = parseInt(arr[1]);
        checkSquare(boardId, board, col, row);
    } else if (30 <= square && square < 40) {
        col = parseInt(arr[0]);
        row = parseInt(arr[1]);
        checkSquare(boardId, board, col, row);
    } else if (40 <= square && square < 50) {
        col = parseInt(arr[0]);
        row = parseInt(arr[1]);
        checkSquare(boardId, board, col, row);
    } else if (50 <= square && square < 60) {
        col = parseInt(arr[0]);
        row = parseInt(arr[1]);
        checkSquare(boardId, board, col, row);
    } else if (60 <= square && square < 70) {
        col = parseInt(arr[0]);
        row = parseInt(arr[1]);
        checkSquare(boardId, board, col, row);
    } else if (70 <= square && square < 80) {
        col = parseInt(arr[0]);
        row = parseInt(arr[1]);
        checkSquare(boardId, board, col, row);
    } else if (80 <= square && square < 90) {
        col = parseInt(arr[0]);
        row = parseInt(arr[1]);
        checkSquare(boardId, board, col, row);
    } else if (90 <= square && square < 100) {
        col = parseInt(arr[0]);
        row = parseInt(arr[1]);
        checkSquare(boardId, board, col, row);
    }
    render();
    return;
}

// Check the squares clicked by the player
function checkSquare(boardId, board, col, row) {
    let oppBoard;
    
    // determine the opponent's board from the player guessing to link them
    if (boardId === "player1-guess-board") {
        oppBoard = player2BoatBoard;
    } else if (boardId === "player2-guess-board") {
        oppBoard = player1BoatBoard;
    } else if (boardId === "player1-boat-board") {
        handleBoatSave(boardId, board, col, row);
        return;
    } else if (boardId === "player2-boat-board") {
        handleBoatSave(boardId, board, col, row);
        return;
    }

    const square = board[col][row];         // save the square clicked
    const oppSquare = oppBoard[col][row];   // save the respective square in the opponent's board

    // if the square is empty of a hit, miss, or boat, then set it to a missed shot and switch turns
    // else if the square is already a miss or hit (a previous guess) then let the player guess again
    // else if the square is a boat, notify the player of a boat hit and switch turns
    if (oppSquare === SQUARE_VALUE.EMPTY) {
        board[col][row] = 1;
        moreLogInfo = `${PLAYER_VALUE[turn]}'s shot missed!`;
        turn *= -1;
    } else if (oppSquare === SQUARE_VALUE.MISS || square === SQUARE_VALUE.HIT) {
        moreLogInfo = "You've already guess here. Take a different shot.";
    } else if (oppSquare === SQUARE_VALUE.BOAT) {
        board[col][row] = 2;
        moreLogInfo = `${PLAYER_VALUE[turn]} had a direct hit!`;
        directHits[turn]++;
        turn *= -1;
    }
    
    // check if the most recent turn was the final hit to find a winner
    let lastTurn = turn * -1;
    getWinner(lastTurn);
    return;
}

// Updates the UI with changes throughout gameplay
function render() {
    renderPlayer1BoatBoard();                     // updates player1's guess board
    renderPlayer1GuessBoard();                    // updates player1's guess board
    renderPlayer2BoatBoard();                     // updates player2's boat board
    renderPlayer2GuessBoard();                    // updates player2's boat board
    renderGameLog();                              // updates the game log to display gameplay moments
    renderControls();                             // hides the boat placement buttons
    if (gameStart) renderBoardVisibility();       // switches between the players' board's visibility
    return;
}

// ------------------------------ Updates game boards with boats and hits/misses ------------------------------
function renderPlayer1BoatBoard() {
    // iterate over Player 1's fleet rows and columns
    player1BoatBoard.forEach((colArr, colIdx) => {
        colArr.forEach((cellVal, rowIdx) => {
            // determine the coordinate from the column and row indices and link the respective HTML element
            const coords = `${COORDINATE_LOOKUP[colIdx+1]}${rowIdx+1}`;
            const coordsEl = document.querySelector(`#player1-boat-board > #${coords}`);
            
            // using each cell value, color the square based on if it's a hit, miss, or boat
            renderSquareColor(cellVal, coordsEl);
        });
    });
    return;
}

function renderPlayer1GuessBoard() {
    // iterate over Player 1's fleet rows and columns
    player1GuessBoard.forEach((colArr, colIdx) => {
        colArr.forEach((cellVal, rowIdx) => {
            // determine the coordinate from the column and row indices and link the respective HTML element
            const coords = `${COORDINATE_LOOKUP[colIdx+1]}${rowIdx+1}`;
            const coordsEl = document.querySelector(`#player1-guess-board > #${coords}`);

            // using each cell value, color the square based on if it's a hit, miss, or boat
            renderSquareColor(cellVal, coordsEl);
        });
    });
    return;
}

function renderPlayer2GuessBoard() {
    // iterate over Player 1's fleet rows and columns
    player2GuessBoard.forEach((colArr, colIdx) => {
        colArr.forEach((cellVal, rowIdx) => {
            // determine the coordinate from the column and row indices and link the respective HTML element
            const coords = `${COORDINATE_LOOKUP[colIdx+1]}${rowIdx+1}`;
            const coordsEl = document.querySelector(`#player2-guess-board > #${coords}`);

            // using each cell value, color the square based on if it's a hit, miss, or boat
            renderSquareColor(cellVal, coordsEl);
        });
    });
    return;
}

function renderPlayer2BoatBoard() {
    // iterate over Player 1's fleet rows and columns
    player2BoatBoard.forEach((colArr, colIdx) => {
        colArr.forEach((cellVal, rowIdx) => {
            // determine the coordinate from the column and row indices and link the respective HTML element
            const coords = `${COORDINATE_LOOKUP[colIdx+1]}${rowIdx+1}`;
            const coordsEl = document.querySelector(`#player2-boat-board > #${coords}`);

            // using each cell value, color the square based on if it's a hit, miss, or boat
            renderSquareColor(cellVal, coordsEl);
        });
    });
    return;
}
// ------------------------------------------------------------------------------------------------------------

// Change the color of the square based on the value of the square
function renderSquareColor(cellVal, coordsEl) {
    switch(cellVal) {
        case SQUARE_VALUE.EMPTY:
            break;
        case SQUARE_VALUE.MISS:
            coordsEl.style.backgroundColor = "white";
            coordsEl.style.opacity = 0.4;
            break;
        case SQUARE_VALUE.HIT:
            coordsEl.style.backgroundColor = "red";
            coordsEl.style.opacity = 0.4;
            break;
        case SQUARE_VALUE.BOAT:
            coordsEl.style.backgroundColor = "dimgrey";
            break;
    }
    return;
}

// Updates the game log to display winner and more game info
function renderGameLog() {
    // if there's a winner, then display it, set the game to end, and show all boards
    // else display the current turn and other info
    if (winner !== null) {
        messageEl.innerText = `${PLAYER_VALUE[winner]} wins!`;
        gameStart = false;
        document.getElementsByClassName("p2boards")[0].style.visibility = "visible";
        document.getElementsByClassName("p2boards")[1].style.visibility = "visible";
        document.getElementsByClassName("p1boards")[0].style.visibility = "visible";
        document.getElementsByClassName("p1boards")[1].style.visibility = "visible";
    } else {
        messageEl.innerHTML = `${PLAYER_VALUE[turn]}'s turn.<br>${moreLogInfo}`;
    }
    return;
}

// Hides the boat placement buttons once the both fleets have been locked and the game has begun
function renderControls() {
    boatBtns.style.visibility = (player1NumBoats === 5 
                              && player2NumBoats === 5 
                              && !gameStart) 
                               ? "hidden" 
                               : "visible";
    return;
}

// // Hides the boards of the opposite players
function renderBoardVisibility() {
    // if it's Player 2's turn, hide Player 1's boards, else hide Player 2's boards
    if (turn === -1) {
        document.getElementsByClassName("p1boards")[0].style.visibility = "hidden";
        document.getElementsByClassName("p1boards")[1].style.visibility = "hidden";

        // give the players time to switch control of the UI to makiing cheating harder
        setTimeout(()=>{
            document.getElementsByClassName("p2boards")[0].style.visibility = "visible";
            document.getElementsByClassName("p2boards")[1].style.visibility = "visible";
        }, 10);
    } else {
        document.getElementsByClassName("p2boards")[0].style.visibility = "hidden";
        document.getElementsByClassName("p2boards")[1].style.visibility = "hidden";
        
        // give the players time to switch control of the UI to makiing cheating harder
        setTimeout(()=>{
            document.getElementsByClassName("p1boards")[0].style.visibility = "visible";
            document.getElementsByClassName("p1boards")[1].style.visibility = "visible";
        }, 10);        
    }
}
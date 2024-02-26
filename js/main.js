/*----- constants -----*/
// audio for boat taking a shot (BONUS)
// audio for computer hitting a boat (BONUS)
// const BOAT_SIZES = {
//     "Aircraft Carrier": 5,
//     "Battleship": 4,
//     "Destroyer": 3,
//     "Submarine": 3,
//     "Patrol Bost": 2
// }

const COORDINATE_LOOKUP = {
    0: 'a', 1: 'b', 
    2: 'c', 3: 'd', 
    4: 'e', 5: 'f', 
    6: 'g', 7: 'h',
    8: 'i', 9: 'j'
}


const SQUARE_VALUE = {
    EMPTY: 0,
    MISS: 1,
    HIT: 2,
    BOAT: 3
}

const PLAYER_VALUE = {
    '1': "Player 1",
    '-1': "Player 2"
}


/*----- app's state (variables) -----*/
let turn;                  // player1 = 1 || player2 = -1
let winner;                // null=no winner || winner=1/-1
let gameStart;             // game start flag
let player1BoatBoard;      // player1 board with boats
let player1GuessBoard;     // player2 board with boats
let player2BoatBoard;      // player1 board with guesses
let player2GuessBoard;     // player2 board with guesses
let player1NumBoats;       // number of boats player1 has on the board
let player2NumBoats;       // number of boats player2 has on the board
let moreLogInfo;           // more info to append to the game log if needed


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
const p2bSquareEls = [...document.querySelectorAll("#player2-boat-board > div")];            // squares in the P2 Boat Board
const p2gSquareEls = [...document.querySelectorAll("#player2-guess-board > div")];           // squares in the P2 Guess Board


/*----- event listeners -----*/
takeGuessBtn.addEventListener("click", handleGuess);                                         // listens for click on take guess button
placeAircraftCarrierBtn.addEventListener("click", handleBoatSave);                           // listens for click on aircraft carrier button
placeBattleshipBtn.addEventListener("click", handleBoatSave);                                // listens for click on battle button
placeDestroyerBtn.addEventListener("click", handleBoatSave);                                 // listens for click on destoryer button
placeSubmarinepBtn.addEventListener("click", handleBoatSave);                                // listens for click on submarine button
placePatrolBoatBtn.addEventListener("click", handleBoatSave);                                // listens for click on patrol boat button
lockFleetBtn.addEventListener("click", handleLockFleet);                                     // listens for click on lock fleet button
newGameBtn.addEventListener("click", init);                                                  // listens for click on new game button
document.getElementById("player1-boat-board").addEventListener("click", handleP1bSquare);    // listens for click on P1 Boat Board button
document.getElementById("player1-guess-board").addEventListener("click", handleP1gSquare);   // listens for click on P1 Boat Board button
document.getElementById("player2-boat-board").addEventListener("click", handleP2bSquare);    // listens for click on P1 Boat Board button
document.getElementById("player2-guess-board").addEventListener("click", handleP2gSquare);   // listens for click on P1 Boat Board button


/*----- functions -----*/
init();  // start the game 

// Starts the game by initializing the state variables
function init() {
    // Game boards for both players set to empty
    // The game boards here mirror the on screen (i.e a9 is the top right or arr[0][9])
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
    turn = 1;              // play starts with player1
    winner = null;         // there is no winner on initialization
    player1NumBoats = 0;   // player1 starts with 0 boats
    player2NumBoats = 0;   // player2 starts with 0 boats
    gameStart = false;     // game has not started
    moreLogInfo = "";      // there isn't any more info the tell the player
    render();              // render the initiated game
}

// Checks if the number of boats left for a player is 0 and returns the opponent if true or nothing if there is no winner
function getWinner() {
    return player1NumBoats === 0 
         ? 1 
         : player2NumBoats === 0 
         ? -1
         : null;
}

function handleGuess() {}
function handleBoatSave() {}
function handleLockFleet() {}

// ------------------------------ Click event handlers for the squares on each board ------------------------------
function handleP1bSquare(evt) {
    const square = p1bSquareEls.indexOf(evt.target);
    const arr = square.toString().split("");
    let col;
    let row;

    if (0 <= square && square < 10) {
        col = 0;
        row = parseInt(arr[0]);
        checkSquare(player1BoatBoard, col, row);
    } else if (10 <= square && square < 20) {
        col = parseInt(arr[0]);
        row = parseInt(arr[1]);
        checkSquare(player1BoatBoard, col, row);
    } else if (20 <= square && square < 30) {
        col = parseInt(arr[0]);
        row = parseInt(arr[1]);
        checkSquare(player1BoatBoard, col, row);
    } else if (30 <= square && square < 40) {
        col = parseInt(arr[0]);
        row = parseInt(arr[1]);
        checkSquare(player1BoatBoard, col, row);
    } else if (40 <= square && square < 50) {
        col = parseInt(arr[0]);
        row = parseInt(arr[1]);
        checkSquare(player1BoatBoard, col, row);
    } else if (50 <= square && square < 60) {
        col = parseInt(arr[0]);
        row = parseInt(arr[1]);
        checkSquare(player1BoatBoard, col, row);
    } else if (60 <= square && square < 70) {
        col = parseInt(arr[0]);
        row = parseInt(arr[1]);
        checkSquare(player1BoatBoard, col, row);
    } else if (70 <= square && square < 80) {
        col = parseInt(arr[0]);
        row = parseInt(arr[1]);
        checkSquare(player1BoatBoard, col, row);
    } else if (80 <= square && square < 90) {
        col = parseInt(arr[0]);
        row = parseInt(arr[1]);
        checkSquare(player1BoatBoard, col, row);
    } else if (90 <= square && square < 100) {
        col = parseInt(arr[0]);
        row = parseInt(arr[1]);
        checkSquare(player1BoatBoard, col, row);
    }
    render();
}
function handleP1gSquare(evt) {
    const square = p1gSquareEls.indexOf(evt.target);
    const arr = square.toString().split("");
    let col;
    let row;
    if (0 <= square && square < 10) {
        col = 0;
        row = parseInt(arr[0]);
        checkSquare(player1GuessBoard, col, row);
    } else if (10 <= square && square < 20) {
        col = parseInt(arr[0]);
        row = parseInt(arr[1]);
        checkSquare(player1GuessBoard, col, row);
    } else if (20 <= square && square < 30) {
        col = parseInt(arr[0]);
        row = parseInt(arr[1]);
        checkSquare(player1GuessBoard, col, row);
    } else if (30 <= square && square < 40) {
        col = parseInt(arr[0]);
        row = parseInt(arr[1]);
        checkSquare(player1GuessBoard, col, row);
    } else if (40 <= square && square < 50) {
        col = parseInt(arr[0]);
        row = parseInt(arr[1]);
        checkSquare(player1GuessBoard, col, row);
    } else if (50 <= square && square < 60) {
        col = parseInt(arr[0]);
        row = parseInt(arr[1]);
        checkSquare(player1GuessBoard, col, row);
    } else if (60 <= square && square < 70) {
        col = parseInt(arr[0]);
        row = parseInt(arr[1]);
        checkSquare(player1GuessBoard, col, row);
    } else if (70 <= square && square < 80) {
        col = parseInt(arr[0]);
        row = parseInt(arr[1]);
        checkSquare(player1GuessBoard, col, row);
    } else if (80 <= square && square < 90) {
        col = parseInt(arr[0]);
        row = parseInt(arr[1]);
        checkSquare(player1GuessBoard, col, row);
    } else if (90 <= square && square < 100) {
        col = parseInt(arr[0]);
        row = parseInt(arr[1]);
        checkSquare(player1GuessBoard, col, row);
    }
    render();
}
function handleP2bSquare(evt) {
    const square = p2bSquareEls.indexOf(evt.target);
    const arr = square.toString().split("");
    let col;
    let row;
    if (0 <= square && square < 10) {
        col = 0;
        row = parseInt(arr[0]);
        checkSquare(player2BoatBoard, col, row);
    } else if (10 <= square && square < 20) {
        col = parseInt(arr[0]);
        row = parseInt(arr[1]);
        checkSquare(player2BoatBoard, col, row);
    } else if (20 <= square && square < 30) {
        col = parseInt(arr[0]);
        row = parseInt(arr[1]);
        checkSquare(player2BoatBoard, col, row);
    } else if (30 <= square && square < 40) {
        col = parseInt(arr[0]);
        row = parseInt(arr[1]);
        checkSquare(player2BoatBoard, col, row);
    } else if (40 <= square && square < 50) {
        col = parseInt(arr[0]);
        row = parseInt(arr[1]);
        checkSquare(player2BoatBoard, col, row);
    } else if (50 <= square && square < 60) {
        col = parseInt(arr[0]);
        row = parseInt(arr[1]);
        checkSquare(player2BoatBoard, col, row);
    } else if (60 <= square && square < 70) {
        col = parseInt(arr[0]);
        row = parseInt(arr[1]);
        checkSquare(player2BoatBoard, col, row);
    } else if (70 <= square && square < 80) {
        col = parseInt(arr[0]);
        row = parseInt(arr[1]);
        checkSquare(player2BoatBoard, col, row);
    } else if (80 <= square && square < 90) {
        col = parseInt(arr[0]);
        row = parseInt(arr[1]);
        checkSquare(player2BoatBoard, col, row);
    } else if (90 <= square && square < 100) {
        col = parseInt(arr[0]);
        row = parseInt(arr[1]);
        checkSquare(player2BoatBoard, col, row);
    }
    render();
}
function handleP2gSquare(evt) {
    const square = p2gSquareEls.indexOf(evt.target);
    const arr = square.toString().split("");
    let col;
    let row;
    if (0 <= square && square < 10) {
        col = 0;
        row = parseInt(arr[0]);
        checkSquare(player2GuessBoard, col, row);
    } else if (10 <= square && square < 20) {
        col = parseInt(arr[0]);
        row = parseInt(arr[1]);
        checkSquare(player2GuessBoard, col, row);
    } else if (20 <= square && square < 30) {
        col = parseInt(arr[0]);
        row = parseInt(arr[1]);
        checkSquare(player2GuessBoard, col, row);
    } else if (30 <= square && square < 40) {
        col = parseInt(arr[0]);
        row = parseInt(arr[1]);
        checkSquare(player2GuessBoard, col, row);
    } else if (40 <= square && square < 50) {
        col = parseInt(arr[0]);
        row = parseInt(arr[1]);
        checkSquare(player2GuessBoard, col, row);
    } else if (50 <= square && square < 60) {
        col = parseInt(arr[0]);
        row = parseInt(arr[1]);
        checkSquare(player2GuessBoard, col, row);
    } else if (60 <= square && square < 70) {
        col = parseInt(arr[0]);
        row = parseInt(arr[1]);
        checkSquare(player2GuessBoard, col, row);
    } else if (70 <= square && square < 80) {
        col = parseInt(arr[0]);
        row = parseInt(arr[1]);
        checkSquare(player2GuessBoard, col, row);
    } else if (80 <= square && square < 90) {
        col = parseInt(arr[0]);
        row = parseInt(arr[1]);
        checkSquare(player2GuessBoard, col, row);
    } else if (90 <= square && square < 100) {
        col = parseInt(arr[0]);
        row = parseInt(arr[1]);
        checkSquare(player2GuessBoard, col, row);
    }
    render();
}
// ----------------------------------------------------------------------------------------------------------------

// Check the squares clicked by the player
function checkSquare(board, col, row) {
    const square = board[col][row];   // save the square clicked

    // if the square is empty of a hit, miss, or boat, then set it to a missed shot and switch turns
    // else if the square is already a miss or hit (a previous guess) then let the player guess again
    // else if the square is a boat, notify the player of a boat hit and switch turns
    if (square === SQUARE_VALUE.EMPTY) {
        board[col][row] = 1;
        square == SQUARE_VALUE.MISS;
        turn *= -1;
        moreLogInfo = `${PLAYER_VALUE[turn]}'s shot missed!`;
    } else if (square === SQUARE_VALUE.MISS || square === SQUARE_VALUE.HIT) {
        moreLogInfo = "You've already guess here. Take a different shot.";
    } else if (square === SQUARE_VALUE.BOAT) {
        square == SQUARE_VALUE.HIT;
        board[col][row] = 2;
        moreLogInfo = `${PLAYER_VALUE[turn]} had a direct hit!`;
        turn *= -1;
    }
    // TODO: getWinner()
    return;
}


// Updates the UI with changes throughout gameplay
function render() {
    renderGuess();                  // updates UI each guess
    renderGameLog();                // updates the game log to display gameplay moments
    renderControls();               // hides the boat placement buttons
    renderBoardVisibility();        // switches between the players' board's visibility
}

function renderGuess() {
    if (turn === 1) {
        renderPlayer1GuessBoard();      // updates player1's guess board
        renderPlayer2BoatBoard();       // updates player2's boat board
    } else {
        renderPlayer1BoatBoard();      // updates player1's guess board
        renderPlayer2GuessBoard();       // updates player2's boat board
    }
}

// ------------------------------ Updates game boards with boats and hits/misses ------------------------------
function renderPlayer1BoatBoard() {
    player1BoatBoard.forEach((colArr, colIdx) => {
        colArr.forEach((cellVal, rowIdx) => {
            const coords = `${COORDINATE_LOOKUP[colIdx]}${rowIdx}`;
            const coordsEl = document.getElementById(coords);
            
            if (colIdx === -1) return;
            
            switch(player1BoatBoard[colIdx][rowIdx]) {
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
                    coordsEl.style.backgroundColor = "grey";
                    break;
            }
        });
    });
    return;
}

function renderPlayer1GuessBoard() {
    player1GuessBoard.forEach((colArr, colIdx) => {
        colArr.forEach((cellVal, rowIdx) => {
            const coords = `${COORDINATE_LOOKUP[colIdx]}${rowIdx}`;
            const coordsEl = document.getElementById(coords);
            
            if (colIdx === -1) return;
            
            switch(player1GuessBoard[colIdx][rowIdx]) {
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
                    coordsEl.style.backgroundColor = "grey";
                    break;
            }
        });
    });
    return;
}

function renderPlayer2BoatBoard() {
    player2BoatBoard.forEach((colArr, colIdx) => {
        colArr.forEach((cellVal, rowIdx) => {
            const coords = `${COORDINATE_LOOKUP[colIdx]}${rowIdx}`;
            const coordsEl = document.getElementById(coords);

            if (colIdx === -1) return;
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
                    coordsEl.style.backgroundColor = "grey";
                    break;
            }
        });
    });
    return;
}

function renderPlayer2GuessBoard() {
    player2GuessBoard.forEach((colArr, colIdx) => {
        colArr.forEach((cellVal, rowIdx) => {
            const coords = `${COORDINATE_LOOKUP[colIdx]}${rowIdx}`;
            const coordsEl = document.getElementById(coords);
            
            if (colIdx === -1) return;
            
            switch(player2GuessBoard[colIdx][rowIdx]) {
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
                    coordsEl.style.backgroundColor = "grey";
                    break;
            }
        });
    });
    return;
}
// ------------------------------------------------------------------------------------------------------------

// Updates the game log to display winner and more game info
function renderGameLog() {
    if (player1NumBoats === 0 && winner) {
        messageEl.innerText = "Player 2 wins!";
    } else if (player2NumBoats === 0 && winner) {
        messageEl.innerText = "Player 1 wins!";
    } else {
        messageEl.innerText = `${PLAYER_VALUE[turn]}'s turn. ${moreLogInfo}`
    }
}

// Hides the boat placement buttons once the both fleets have been locked and the game has begun
function renderControls() {
    boatBtns.style.visibility = (player1NumBoats === 5 
                              && player2NumBoats === 5 
                              && !gameStart) 
                               ? "hidden" 
                               : "visible";
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
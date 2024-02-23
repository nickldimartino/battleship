/*----- constants -----*/
// audio for boat taking a shot (BONUS)
// audio for computer hitting a boat (BONUS)
// different boat sizes
const COORDINATE_LOOKUP = {
    0: 'a', 1: 'b', 
    2: 'c', 3: 'd', 
    4: 'e', 5: 'f', 
    6: 'g', 7: 'h',
    8: 'i', 9: 'j'
}

const SQUARE_VALUE = {
    0: "empty",
    1: "miss",
    2: "hit",
    3: "boat"
}


/*----- app's state (variables) -----*/
let turn;                  // player1 = 1 || player2 = -1
let winner;                // null=no winner || winner=1/-1
let player1BoatBoard;      // player1 board with boats
let player1GuessBoard;     // player2 board with boats
let player2BoatBoard;      // player1 board with guesses
let player2GuessBoard;     // player2 board with guesses
let player1NumBoats;       // number of boats player1 has on the board
let player2NumBoats;       // number of boats player2 has on the board


/*----- cached element references -----*/
const boatBtns = document.getElementById("boat-buttons");
// button for take shot
// button for new game
// button for boat positions
// button for starting a game
// player's boat board
// player's guess board
// display to log messages of in-game moments
// each square element square
// each board element square


/*----- event listeners -----*/
// listen for button click when the player wants to take a shot
// listen for button click when a new game wants to be started (reset)
// listen for button click when player chooses to set boat positions
// listen for button click when player chooses to start a game
// listen for square clicked


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
    render();              // render the initiated game
}

// Updates the UI with changes throughout gameplay
function render() {
    renderGuess();                  // updates UI each guess
    renderPlayer1BoatBoard();       // updates player1's boat board
    renderPlayer2BoatBoard();       // updates player2's boat board
    renderPlayer1GuessBoard();      // updates player1's guess board
    renderPlayer2GuessBoard();      // updates player2's guess board
    renderGameLog();                // updates the game log to display gameplay moments
    renderControls();               // hides the boat placement buttons
}

// ------------------------------ Updates Game Boards with boats and hits/misses ------------------------------
function renderPlayer1BoatBoard() {
    for (let colIdx = 0; colIdx < player1BoatBoard.length; colIdx++) {
        for (let rowIdx = 0; rowIdx < player1BoatBoard[colIdx].length; rowIdx++) {
            const coords = `${COORDINATE_LOOKUP[colIdx]}${rowIdx}`;
            const coordsEl = document.getElementById(coords);
            if (coordsEl === null) {
                continue;
            }
            
            // TODO: change square color based on boat, hit, miss, no boat
            switch(player1BoatBoard[colIdx][rowIdx]) {
                case 0:
                    break;
                case 1:
                    coordsEl.style.backgroundColor = "white";
                    coordsEl.style.opacity = 0.4;
                    break;
                case 2:
                    coordsEl.style.backgroundColor = "red";
                    coordsEl.style.opacity = 0.4;
                    break;
                case 3:
                    coordsEl.style.backgroundColor = "grey";
                    coordsEl.style.opacity = 0.7;
                    break;
            }
        }
    }
}

function renderPlayer2BoatBoard() {
    player2BoatBoard.forEach((colArr, colIdx) => {
        colArr.forEach((cellVal, rowIdx) => {
            const coords = `${COORDINATE_LOOKUP[colIdx]}${rowIdx}`;
            const coordsEl = document.getElementById(coords);

            // TODO: changed square colors based on boat, hit, miss, no boat
        });
    });
}

function renderPlayer1GuessBoard() {
    player1GuessBoard.forEach((colArr, colIdx) => {
        colArr.forEach((cellVal, rowIdx) => {
            const coords = `${COORDINATE_LOOKUP[colIdx]}${rowIdx}`;
            const coordsEl = document.getElementById(coords);

            // TODO: changed square colors based on hit or miss
        });
    });
}

function renderPlayer2GuessBoard() {
    player2GuessBoard.forEach((colArr, colIdx) => {
        colArr.forEach((cellVal, rowIdx) => {
            const coords = `${COORDINATE_LOOKUP[colIdx]}${rowIdx}`;
            const coordsEl = document.getElementById(coords);

            // TODO: changed square colors based on hit or miss
        });
    });
}
// ------------------------------------------------------------------------------------------------------------

// Updates the game log to display hit, miss, turn, and winner
function renderGameLog() {}

function renderGuess() {}

// Hides the boat placement buttons once the both fleets have been locked and the game has begun
function renderControls() {
    boatBtns.style.visibility = (player1NumBoats === 5 && player2NumBoats === 5) ? "hidden" : "visible";
}

// handleGuess()     // checks for hit or miss
// getWinner()       // determines if all boats were hit
// getRandomGuess()  // gets computer guess
// placeBoat()       // places a boat when creating fleet layout
// getRandomBoats()  // creates computer fleet layout (not necessary)  CAN MAKE THIS A TWO PLAYER GAME
// startGame()       // starts a game after the player creates their fleet layout 
// resetGame()       // resets the game board and scores


// To add sound -> tutorial to add sound on the TI
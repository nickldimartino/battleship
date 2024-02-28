/*----- constants -----*/
// Size of each boat
const BOAT_SIZES = {
    "Aircraft Carrier": 5,
    "Battleship": 4,
    "Destroyer": 3,
    "Submarine": 3,
    "Patrol Boat": 2
}

// Coordinates for the game board grid squares
const COORDINATE_LOOKUP = {
    1: 'a', 2: 'b', 
    3: 'c', 4: 'd', 
    5: 'e', 6: 'f', 
    7: 'g', 8: 'h',
    9: 'i', 10: 'j'
}

// Values for the game board grid squares
const SQUARE_VALUE = {
    EMPTY: 0,
    MISS: 1,
    HIT: 2,
    BOAT: 3,
    UNSAVED_BOAT: 4
}

// Value assigned to each player
const PLAYER_VALUE = {
    "1": "Player 1",
    "-1": "Player 2"
}

// Audio sounds
const AUDIO = {
    GAME_START: new Audio("./audio/game_start.m4a"),
    SPLASH: new Audio("./audio/splash.m4a"),
    EXPLOSION: new Audio("./audio/explosion.m4a"),
    VICTORY: new Audio("./audio/victory.m4a")
}


/*----- testing constants -----*/
const TOTAL_HITS_TO_WIN = 17;             // sum of the amount of hits needed for all boats
const TOTAL_NUM_BOATS = 5;                // total number of boats a player needs  


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
let lastPlacedBoard;                    // holds the last clicked board
let lastPlacedBoatSquareCol;            // holds the last clicked board column
let lastPlacedBoatSquareRow;            // holds the last clicked board row
let lastPlacedBoardId;                  // holds the last clicked board id
let timeIntervalBoardSwitch             // holds the time interval for the boards when alternating turns
let themeValue;                         // value for the game color theme (1 or 2)
let playAudio;                          // holds sound playing boolean
let directHits = {                      // number of hits each player has taken
    "1": 0, 
    "-1": 0 
}
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
const boatPlacementInstructions = document.getElementById("boat-placement-instructions");    // boat placement instructions button
const gameRules = document.getElementById("rules");                                          // game rules
const messageEl = document.getElementById("game-log");                                       // game log  
const changeThemeBtn = document.getElementById("change-theme");                              // change theme button
const newGameBtn = document.getElementById("new-game-btn");                                  // new game button
const setTimeBtn = document.getElementById("set-time");                                      // set time interval of the boards switching
const timeInputField = document.getElementById("time-input");                                // input field for a user inputted time
const muteBtn = document.getElementById("mute-btn");                                         // mutes audio for the game
const undoBtn = document.getElementById("undo-btn");                                         // undo button
const p1HitCount = document.getElementById("p1-hit-count");                                  // hit count for player 1
const p2HitCount = document.getElementById("p2-hit-count");                                  // hit count for player 2
const p1bSquareEls = [...document.querySelectorAll("#player1-boat-board > div")];            // squares in the P1 Boat Board
const p1gSquareEls = [...document.querySelectorAll("#player1-guess-board > div")];           // squares in the P1 GUess Board
const p2gSquareEls = [...document.querySelectorAll("#player2-guess-board > div")];           // squares in the P2 Guess Board
const p2bSquareEls = [...document.querySelectorAll("#player2-boat-board > div")];            // squares in the P2 Boat Board


/*----- event listeners -----*/
changeThemeBtn.addEventListener("click", handleChangeTheme);                                           // listens for click on change theme button
newGameBtn.addEventListener("click", init);                                                            // listens for click on new game button
setTimeBtn.addEventListener("click", handleSetTime);                                                   // listens for click on set time button
undoBtn.addEventListener("click", handleUndo);                                                         // listens for click on undo button
muteBtn.addEventListener("click", handleMuteSound);                                                    // listens for click on mute sound button
document.getElementById("show-hide-rules-btn").addEventListener("click", handleShowHideGameRules);     // listens for click on show/hide rules button
document.getElementById("player1-boat-board").addEventListener("click", handleSquare);                 // listens for click on P1 Boat Board button
document.getElementById("player1-guess-board").addEventListener("click", handleSquare);                // listens for click on P1 Guess Board button
document.getElementById("player2-guess-board").addEventListener("click", handleSquare);                // listens for click on P2 Guess Board button
document.getElementById("player2-boat-board").addEventListener("click", handleSquare);                 // listens for click on P2 Boat Board button


/*----- functions -----*/
// Start the game 
init();

// Starts the game by initializing the state variables
function init() {
    // Game boards for both players set to empty. They are same orientation as seen on screen
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
    
    // clear all hits, misses, and boats and re-adds original hover properties of each grid square
    [...document.querySelectorAll(".board > div")].forEach(sq => {
        sq.style.backgroundColor = "transparent";
        sq.style.opacity = 1;
        sq.classList.add("SquareHoverClass");
    });

    p1BoatsPlaced = {                   // keeps track of the boats player 1 has placed
        "Aircraft Carrier": false,
        "Battleship": false,
        "Destroyer": false,
        "Submarine": false,
        "Patrol Boat": false,
    }
    p2BoatsPlaced = {                   // keeps track of the boats player 1 has placed
        "Aircraft Carrier": false,
        "Battleship": false,
        "Destroyer": false,
        "Submarine": false,
        "Patrol Boat": false,
    }

    turn = 1;                               // play starts with player2
    winner = null;                          // there is no winner on initialization
    player1NumBoats = 0;                    // player1 starts with 0 boats
    player2NumBoats = 0;                    // player2 starts with 0 boats
    gameStart = false;                      // game has not started
    moreLogInfo = "";                       // there isn't any more info the tell the player
    directHits = { "1": 0, "-1": 0 };       // no hits have been made
    gameRulesShowing = true;                // game rules should be visible on game start
    lastPlacedBoard = null;                 // the board has not been clicked yet
    lastPlacedBoatSquareCol = null;         // the board has not been clicked yet
    lastPlacedBoatSquareRow = null;         // the board has not been clicked yet
    lastPlacedBoardId = null;               // the board has not been clicked yet
    undoBtn.style.visibility = "visible";   // should be visible on new game
    timeIntervalBoardSwitch = 2000;         // time for boards to switch is 2 second;
    themeValue = 1;                         // inital value for the UI theme to use
    playAudio = true;                       // start game with sound on

    // start the game with on Player 1's Boat Board showing so they can pick their fleet
    document.getElementsByClassName("p1boards")[0].style.visibility = "visible";
    document.getElementsByClassName("p1boards")[1].style.visibility = "hidden";
    document.getElementsByClassName("p2boards")[0].style.visibility = "hidden";
    document.getElementsByClassName("p2boards")[1].style.visibility = "hidden";
    
    render();                               // render the initiated game
    return;
}

// Plays sounds based on game events
function playSound(action) {
    if (action === AUDIO.GAME_START) {
        AUDIO.GAME_START.play();
    } else if (action === AUDIO.SPLASH) {
        AUDIO.SPLASH.play();
    } else if (action === AUDIO.EXPLOSION) {
        AUDIO.EXPLOSION.play();
    } else if (action === AUDIO.VICTORY) {
        AUDIO.VICTORY.play();
    } 
    return;
}

// Toggles the games audio
function handleMuteSound() {
    playAudio = !playAudio;   // flips the value of playAudio
    return;
}

// Changes the theme of the game
function handleChangeTheme() {
    if (themeValue === 1) {
        document.querySelector(":root").style.setProperty("--hud-image", "steelblue");
        document.querySelector(":root").style.setProperty("--hit-count-background-color", "tomato");
        document.querySelector(":root").style.setProperty("--hit-count-color", "black");
        document.querySelector(":root").style.setProperty("--hit-count-border", "black");
        document.querySelector(":root").style.setProperty("--body-background", "white");
        document.querySelector(":root").style.setProperty("--rules-background", "beige");
        document.querySelector(":root").style.setProperty("--buttons-border", "black");
        document.querySelector(":root").style.setProperty("--buttons-color", "black");
        document.querySelector(":root").style.setProperty("--buttons-background-color", "tomato");
        document.querySelector(":root").style.setProperty("--time-input-placehold-color", "darkslategrey");
        themeValue = 2;
        return;
    } else if (themeValue === 2) {
        document.querySelector(":root").style.setProperty("--hud-image", "slategrey");
        document.querySelector(":root").style.setProperty("--hit-count-background-color", "black");
        document.querySelector(":root").style.setProperty("--hit-count-color", "white");
        document.querySelector(":root").style.setProperty("--hit-count-border", "white");
        document.querySelector(":root").style.setProperty("--body-background", "radial-gradient(khaki, crimson)");
        document.querySelector(":root").style.setProperty("--rules-background", "white");
        document.querySelector(":root").style.setProperty("--buttons-border", "white");
        document.querySelector(":root").style.setProperty("--buttons-color", "white");
        document.querySelector(":root").style.setProperty("--buttons-background-color", "black");
        document.querySelector(":root").style.setProperty("--time-input-placeholder-color", "grey");
        themeValue = 1;
        return;
    }
}

// Removes the last placed boat square
function handleUndo() {
    // if the last square clicked was already locked into a boat, then notify the player it can't be undone
    if (lastPlacedBoard[lastPlacedBoatSquareCol][lastPlacedBoatSquareRow] === SQUARE_VALUE.BOAT) {
        messageEl.innerText = "You can't undo a ship once it's been locked in place";
        return;
    }

    // sets the plast placed boat square value to 0 to mark as "empty"
    lastPlacedBoard[lastPlacedBoatSquareCol][lastPlacedBoatSquareRow] = SQUARE_VALUE.EMPTY;
    let pfx;
    
    // determines the prefix of the id for each grid square based on the last board clicked
    if (lastPlacedBoardId === "player1-boat-board") {
        pfx = "p1b-";
    } else if (lastPlacedBoardId === "player1-guess-board") {
        pfx = "p1g-";
    } else if (lastPlacedBoardId === "player2-guess-board") {
        pfx = "p2g-";
    } else if (lastPlacedBoardId === "player2-boat-board") {
        pfx = "p2b-";
    }  
    
    // gets the element that was last clicked
    const coords = `${pfx}${COORDINATE_LOOKUP[lastPlacedBoatSquareCol+1]}${lastPlacedBoatSquareRow+1}`;
    const coordsEl = document.querySelector(`#${lastPlacedBoardId} > #${coords}`);

    // remove the grey color that designates a placed boat square
    coordsEl.style.backgroundColor = 'transparent';

    return;
}

// Toggle the view of the Game Rules and Instructions boxes
function handleShowHideGameRules() {
    if (gameRulesShowing) {
        gameRules.style.visibility = "hidden";
        boatPlacementInstructions.style.visibility = "hidden";
        gameRulesShowing = false;
    } else {
        gameRules.style.visibility = "visible";
        boatPlacementInstructions.style.visibility = "visible";
        gameRulesShowing = true;
    } 
    return;
}

function handleSetTime() {
    let inputTime = timeInputField.value;
    timeIntervalBoardSwitch = inputTime * 1000;
    return;
}

// Click event handlers for the squares on each board
function handleSquare(evt) {
    const boardId = evt.currentTarget.id;   // id of the board from the square clicked
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
    let oppBoard;                     // opponent's board
    lastPlacedBoatSquareCol = col;    // last placed boat square column
    lastPlacedBoatSquareRow = row;    // last placed boat square row
    lastPlacedBoardId = boardId;      // last placed boat square boardId

    // determine the opponent's board from the player guessing to link them
    // if it's the fleet boards, save off the last clicked square and try to place the boat square
    if (boardId === "player1-guess-board") {
        oppBoard = player2BoatBoard;
    } else if (boardId === "player2-guess-board") {
        oppBoard = player1BoatBoard;
    } else if (boardId === "player1-boat-board" && !gameStart) {
        lastPlacedBoard = player1BoatBoard;
        placeBoatSquare(boardId, board, col, row);
        return;
    } else if (boardId === "player2-boat-board" && !gameStart) {
        lastPlacedBoard = player2BoatBoard;
        placeBoatSquare(boardId, board, col, row);
        return;
    }

    const square = board[col][row];         // save the square clicked
    const oppSquare = oppBoard[col][row];   // save the respective square in the opponent's board

    // if the square is empty of a hit, miss, or boat, then set it to a missed shot and switch turns
    // else if the square is already a miss or hit (a previous guess) then let the player guess again
    // else if the square is a boat, notify the player of a boat hit and switch turns
    if (square === SQUARE_VALUE.EMPTY && oppSquare === SQUARE_VALUE.EMPTY) {
        board[col][row] = SQUARE_VALUE.MISS;
        moreLogInfo = `${PLAYER_VALUE[turn]}'s shot missed at ${COORDINATE_LOOKUP[lastPlacedBoatSquareCol].toUpperCase()}-${lastPlacedBoatSquareRow}!`;
        turn *= -1;
        if (playAudio) playSound(AUDIO.SPLASH);
    } else if (square === SQUARE_VALUE.MISS || square === SQUARE_VALUE.HIT) {
        moreLogInfo = `You've already guessed ${COORDINATE_LOOKUP[lastPlacedBoatSquareCol].toUpperCase()}-${lastPlacedBoatSquareRow}. Take a different shot.`;
    } else if (square === SQUARE_VALUE.EMPTY && oppSquare === SQUARE_VALUE.BOAT) {
        board[col][row] = SQUARE_VALUE.HIT;
        if (playAudio) playSound(AUDIO.EXPLOSION);
        moreLogInfo = `${PLAYER_VALUE[turn]} had a direct hit at ${COORDINATE_LOOKUP[lastPlacedBoatSquareCol].toUpperCase()}-${lastPlacedBoatSquareRow}!`;
        directHits[turn]++;
        turn *= -1;
    }

    // check if the most recent turn was the final hit to find a winner
    let lastTurn = turn * -1;
    getWinner(lastTurn);
    return;
}

// Saves the boats the player enters onto their fleet board and determines if the players have enough boats
function placeBoatSquare(boardId, board, col, row) {
    let square = board[col][row];  // value of the square
    
    // if the square isn't a boat, make it a boat and return
    if (square !== SQUARE_VALUE.UNSAVED_BOAT) {
        board[col][row] = SQUARE_VALUE.UNSAVED_BOAT;
        return;
    }

    // count the number of adjacent boat squares in each direction
    let startCnt = square === SQUARE_VALUE.UNSAVED_BOAT ? 1 : 0;    // the starting square should be added if it's a boat
    let upCnt = checkUpSquare(board, col, row);                     // count in the up direction 
    let downCnt = checkDownSquare(board, col, row);                 // count in the down direction
    let rightCnt = checkRightSquare(board, col, row);               // count in the right direction
    let leftCnt = checkLeftSquare(board, col, row);                 // count in the left direction

    // sum the vertical and horizontal counts
    let upDownCnt = upCnt + downCnt + startCnt;
    let leftRightCnt = rightCnt + leftCnt + startCnt;

    // for each player board and that player has less than 5 boats determine if that player has placed that length boat yet
    // if so, add the boat, increase the number of boats for that player, and save the selected boat
    if (boardId == "player1-boat-board" && player1NumBoats !== TOTAL_NUM_BOATS) {
        if (upDownCnt === BOAT_SIZES["Aircraft Carrier"] || leftRightCnt == BOAT_SIZES["Aircraft Carrier"] && !p1BoatsPlaced["Aircraft Carrier"]) {
            p1BoatsPlaced["Aircraft Carrier"] = true;
            player1NumBoats++;
            saveSelectedBoat(board);
        } else if (upDownCnt === BOAT_SIZES["Battleship"] || leftRightCnt == BOAT_SIZES["Battleship"] && !p1BoatsPlaced["Battleship"]) {
            p1BoatsPlaced["Battleship"] = true;
            player1NumBoats++;
            saveSelectedBoat(board);
        } else if (upDownCnt === BOAT_SIZES["Destroyer"] || leftRightCnt == BOAT_SIZES["Destroyer"] && !p1BoatsPlaced["Destroyer"]) {
            p1BoatsPlaced["Destroyer"] = true;
            player1NumBoats++;
            saveSelectedBoat(board);
        } else if (upDownCnt === BOAT_SIZES["Submarine"] || leftRightCnt == BOAT_SIZES["Submarine"] && !p1BoatsPlaced["Submarine"]) {
            p1BoatsPlaced["Submarine"] = true;
            player1NumBoats++;
            saveSelectedBoat(board);
        } else if (upDownCnt === BOAT_SIZES["Patrol Boat"] || leftRightCnt == BOAT_SIZES["Patrol Boat"] && !p1BoatsPlaced["Patrol Boat"]) {
            p1BoatsPlaced["Patrol Boat"] = true;
            player1NumBoats++;
            saveSelectedBoat(board);
        }
    } else if (boardId == "player2-boat-board" && player2NumBoats !== TOTAL_NUM_BOATS) {
        if (upDownCnt === BOAT_SIZES["Aircraft Carrier"] || leftRightCnt == BOAT_SIZES["Aircraft Carrier"] && !p2BoatsPlaced["Aircraft Carrier"]) {
            p2BoatsPlaced["Aircraft Carrier"] = true;
            player2NumBoats++;
            saveSelectedBoat(board);
        } else if (upDownCnt === BOAT_SIZES["Battleship"] || leftRightCnt == BOAT_SIZES["Battleship"] && !p2BoatsPlaced["Battleship"]) {
            p2BoatsPlaced["Battleship"] = true;
            player2NumBoats++;
            saveSelectedBoat(board);
        } else if (upDownCnt === BOAT_SIZES["Destroyer"] || leftRightCnt == BOAT_SIZES["Destroyer"] && !p2BoatsPlaced["Destroyer"]) {
            p2BoatsPlaced["Destroyer"] = true;
            player2NumBoats++;
            saveSelectedBoat(board);
        } else if (upDownCnt === BOAT_SIZES["Submarine"] || leftRightCnt == BOAT_SIZES["Submarine"] && !p2BoatsPlaced["Submarine"]) {
            p2BoatsPlaced["Submarine"] = true;
            player2NumBoats++;
            saveSelectedBoat(board);
        } else if (upDownCnt === BOAT_SIZES["Patrol Boat"] || leftRightCnt == BOAT_SIZES["Patrol Boat"] && !p2BoatsPlaced["Patrol Boat"]) {
            p2BoatsPlaced["Patrol Boat"] = true;
            player2NumBoats++;
            saveSelectedBoat(board);
        }
    }

    // flip the board visibility if Player 1 has already completed their fleet layout
    let player1BoatsSet = false;
    if (player1NumBoats === TOTAL_NUM_BOATS && !player1BoatsSet) {
        player1BoatsSet = true;
        document.getElementsByClassName("p1boards")[0].style.visibility = "hidden";
        document.getElementsByClassName("p1boards")[1].style.visibility = "hidden";
        document.getElementsByClassName("p2boards")[0].style.visibility = "hidden";
        document.getElementsByClassName("p2boards")[1].style.visibility = "visible";
    }

    // once both players choose their fleet layouts, the game can begin
    if (player1NumBoats === TOTAL_NUM_BOATS && player2NumBoats === TOTAL_NUM_BOATS) {
        moreLogInfo = "Commence bombardment!";
        gameStart = true;
        undoBtn.style.visibility = "hidden";
        if (playAudio) playSound(AUDIO.GAME_START);
    }
    return;
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
        board[col][row] === SQUARE_VALUE.UNSAVED_BOAT
        ) {
            count++;
            col += colOffset;
            row += rowOffset;
    }
    return count;
}

// Save the selected boat into the player's fleet
function saveSelectedBoat(board) {
    // iterate through the board to look for any UNSAVED_BOAT values (4), if found, replace with a BOAT value (3)
    board.forEach((colArr, colIdx) => {
        colArr.forEach((cellVal, rowIdx) => {
            if (cellVal === SQUARE_VALUE.UNSAVED_BOAT) {
                board[colIdx][rowIdx] = SQUARE_VALUE.BOAT;
            }
        });
    });
    return;
}

// Checks if the number of boats left for a player is 0 and returns the opponent if true or nothing if there is no winner
function getWinner(turn) {
    if (directHits[turn] === TOTAL_HITS_TO_WIN) {
        winner = turn;
        if (playAudio) playSound(AUDIO.VICTORY);
    }
    return;
}

// Updates the UI with changes throughout gameplay
function render() {
    renderPlayer1BoatBoard();                     // updates player1's guess board
    renderPlayer1GuessBoard();                    // updates player1's guess board
    renderPlayer2BoatBoard();                     // updates player2's boat board
    renderPlayer2GuessBoard();                    // updates player2's boat board
    renderGameLog();                              // updates the game log to display gameplay moments
    renderHitCount();                             // updates the hit count for each player
    if (gameStart) renderBoardVisibility();       // switches between the players' board's visibility
    return;
}

// Updates Player 1's Boat Board with boats and hits/misses
function renderPlayer1BoatBoard() {
    // iterate over Player 1's fleet rows and columns
    player1BoatBoard.forEach((colArr, colIdx) => {
        colArr.forEach((cellVal, rowIdx) => {
            // determine the coordinate from the column and row indices and link the respective HTML element
            const coords = `p1b-${COORDINATE_LOOKUP[colIdx+1]}${rowIdx+1}`;
            const coordsEl = document.querySelector(`#player1-boat-board > #${coords}`);
            
            // using each cell value, color the square based on if it's a hit, miss, or boat
            renderSquareColor(cellVal, coordsEl);
        });
    });
    return;
}

// Updates Player 1's Guess Board with boats and hits/misses
function renderPlayer1GuessBoard() {
    // iterate over Player 1's fleet rows and columns
    player1GuessBoard.forEach((colArr, colIdx) => {
        colArr.forEach((cellVal, rowIdx) => {
            // determine the coordinate from the column and row indices and link the respective HTML element
            const coords = `p1g-${COORDINATE_LOOKUP[colIdx+1]}${rowIdx+1}`;
            const coordsEl = document.querySelector(`#player1-guess-board > #${coords}`);

            // using each cell value, color the square based on if it's a hit, miss, or boat
            renderSquareColor(cellVal, coordsEl);
        });
    });
    return;
}

// Updates Player 2's Guess Board with boats and hits/misses
function renderPlayer2GuessBoard() {
    // iterate over Player 1's fleet rows and columns
    player2GuessBoard.forEach((colArr, colIdx) => {
        colArr.forEach((cellVal, rowIdx) => {
            // determine the coordinate from the column and row indices and link the respective HTML element
            const coords = `p2g-${COORDINATE_LOOKUP[colIdx+1]}${rowIdx+1}`;
            const coordsEl = document.querySelector(`#player2-guess-board > #${coords}`);

            // using each cell value, color the square based on if it's a hit, miss, or boat
            renderSquareColor(cellVal, coordsEl);
        });
    });
    return;
}

// Updates Player 2's Boat Board with boats and hits/misses
function renderPlayer2BoatBoard() {
    // iterate over Player 1's fleet rows and columns
    player2BoatBoard.forEach((colArr, colIdx) => {
        colArr.forEach((cellVal, rowIdx) => {
            // determine the coordinate from the column and row indices and link the respective HTML element
            const coords = `p2b-${COORDINATE_LOOKUP[colIdx+1]}${rowIdx+1}`;
            const coordsEl = document.querySelector(`#player2-boat-board > #${coords}`);

            // using each cell value, color the square based on if it's a hit, miss, or boat
            renderSquareColor(cellVal, coordsEl);
        });
    });
    return;
}

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
        case SQUARE_VALUE.UNSAVED_BOAT:
            coordsEl.style.backgroundColor = "grey";
            break;
    }
    return;
}

// Updates the hit count for each player
function renderHitCount() {
    p1HitCount.innerText = `${directHits[1]}/${TOTAL_HITS_TO_WIN}`;
    p2HitCount.innerText = `${directHits[-1]}/${TOTAL_HITS_TO_WIN}`;
}

// Updates the game log to display winner and more game info
function renderGameLog() {
    // if there's a winner, then display it, set the game to end, and show all boards
    // else display the current turn and other info
    if (winner !== null) {
        let opponent = winner * -1;
        messageEl.innerHTML = `${PLAYER_VALUE[opponent]}'s fleet has been sunk!<br>${PLAYER_VALUE[winner]} wins!`;
        gameStart = false;

        // show all the game boards
        document.getElementsByClassName("p2boards")[0].style.visibility = "visible";
        document.getElementsByClassName("p2boards")[1].style.visibility = "visible";
        document.getElementsByClassName("p1boards")[0].style.visibility = "visible";
        document.getElementsByClassName("p1boards")[1].style.visibility = "visible";
    } else if (!gameStart) {
        messageEl.innerText = "Create your fleet layout!";
    } else {
        messageEl.innerHTML = `${moreLogInfo}<br>${PLAYER_VALUE[turn]}'s turn`;
    }
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
        }, timeIntervalBoardSwitch);
    } else {
        document.getElementsByClassName("p2boards")[0].style.visibility = "hidden";
        document.getElementsByClassName("p2boards")[1].style.visibility = "hidden";
        
        // give the players time to switch control of the UI to makiing cheating harder
        setTimeout(()=>{
            document.getElementsByClassName("p1boards")[0].style.visibility = "visible";
            document.getElementsByClassName("p1boards")[1].style.visibility = "visible";
        }, timeIntervalBoardSwitch);        
    }
    return;
}

/* ------ CPU Player (In Progress: not implemented into above game) ------ */
let cpuBoard1 = [
    [3, 3, 3, 3, 3, 0, 0, 0, 0, 0], 
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 3, 3, 3, 3, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 3, 3, 3, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 3, 3, 3, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 3, 3, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];
let cpuBoard2 = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
    [0, 3, 3, 3, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 3, 3, 0, 3, 3, 3],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [3, 3, 3, 3, 3, 0, 3, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 3, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 3, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 3, 0, 0, 0],
];
    
// Generate random Guess
function generateCPUGuess() {
    let col; let row; 
    let guess;
    const guessedCoords = [];

    while (guessedCoords.length < 100) {
        col = Math.floor(Math.random() * 10)+1;
        row = Math.floor(Math.random() * 10)+1;
        guess = (`${COORDINATE_LOOKUP[col]}${row}`);
        if (!guessedCoords.includes(guess)) {
            guessedCoords.push(guess);
        }
    }

    return [col, row];
}

// Generate random CPU Board
function generateCPUBoard() {
    // let cpuBoard = [
    //     [0, 0, 0, 0, 0, 0, 4, 0, 0, 0], 
    //     [0, 0, 0, 0, 0, 0, 4, 0, 0, 0],
    //     [0, 0, 0, 0, 0, 0, 4, 0, 0, 0],
    //     [4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
    //     [0, 0, 0, 4, 0, 0, 4, 0, 0, 0],
    //     [0, 0, 0, 4, 0, 0, 4, 0, 0, 0],
    //     [0, 0, 0, 4, 4, 4, 4, 0, 0, 0],
    //     [0, 0, 0, 0, 0, 0, 4, 0, 0, 0],
    //     [0, 0, 0, 0, 0, 0, 4, 0, 0, 0],
    //     [0, 0, 0, 0, 0, 0, 4, 0, 0, 0],
    // ];
    // const randomRowCol = Math.round(Math.random());
    // const randomBoatLength = Math.floor(Math.random() * (6-2) )+2;

    // let guess = generateCPUGuess();
    // let guessCol = guess[0];
    // let guessRow = guess[1];

    // if (randomRowCol === 1) {
    //     let upCnt = checkUpSquare(cpuBoard, guessCol, guessRow);
    //     let downCnt = checkDownSquare(cpuBoard, guessCol, guessRow);
    //     console.log(upCnt, downCnt);
    // } else if (randomRowCol === 0) {
    //     let leftCnt = checkLeftSquare(cpuBoard, guessCol, guessRow);
    //     let rightCnt = checkRightSquare(cpuBoard, guessCol, guessRow);
    //     console.log(leftCnt, rightCnt);
    // }
}

let mode = 'gravit'
let board;
const huPlayer = 'O';
const aiPlayer = 'X';
let current;
let availableSpots;
let reset = false;
const winCombos = [    // specifies the winning cells
    [0, 1, 2],    //top row win
    [3, 4, 5],    //middle row win
    [6, 7, 8],    //bottom row win
    [0, 3, 6],    //left diagonal win
    [1, 4, 7],     //right diaonal win
    [2, 5, 8],      //middle col win
    [0, 4, 8],      //left col win
    [6, 4, 2]       //right col win
]

//Sets the display of endgame back to none, removes all configurations and colours
function startGame() {
    board = [];
    current = huPlayer;
    availableSpots = [6, 7, 8];
    document.querySelector(".endgame").style.display = "none";
    for (let i = 0; i < 9; i++) {
        board.push(document.getElementById(String(i)));
        board[i].innerHTML = "";
        board[i].classList.remove("color");
        if (mode !== 'demo')
            board[i].addEventListener('click', handleClick);
    }
}

//Responsible for the graphic visualization of 
//falling effect of 'O' or 'X' from 2nd or 1st row to the last row
//Also sets the turn of each player on the possible bottom-most row

function fall(startId, endId, player, top) {
    if (!top) {
        settingFalse();
        top = 0;
        board[startId].innerHTML = '<p class="falling">' + player + '</p>';
    }
    if (top < (endId - startId) * 100 / 3) {
        const elem = document.querySelector(`#\\3${startId}  .falling`);
        elem.style.top = top + 'px';

        setTimeout(() => fall(startId, endId, player, top + 5), 20)
    } else {
        for (let i = 0; i < 9; i++) {
            board[i].addEventListener('click', handleClick);
        }
        board[startId].innerHTML = ''
        board[endId].innerHTML = player;
        checkWin(player);
    }
}

//Handles the turn of the next player 
//Valid for the Gravity (On Earth) mode
//Allows player to play only in the row above the row filled just below it
function handleClickGravity(e) {
    const cellId = Number(e.target.id);
    const col = cellId % 3;
    if (availableSpots[col] >= cellId) {
        availableSpots[col] -= 3;
        fall(cellId, availableSpots[col] + 3, current)
        setLoading();
        current = (current === huPlayer) ? aiPlayer : huPlayer;
    }
}

//Handles the turn of the next player 
//Valid for the Anti-gravity (On Mars) mode
function handleClickNormal(e) {
    const cellId = Number(e.target.id);
    if (board[cellId].innerHTML === "") {
        board[cellId].innerHTML = current;
        checkWin(current);
        setLoading();
        current = (current === huPlayer) ? aiPlayer : huPlayer;
    }
}

//Handles the turn of the next player 
//Valid for the Attack (Dragon) mode
function handleClickattack(e) {
    const cellId = Number(e.target.id);
    if (board[cellId].innerHTML === "") {
        attack_caller(e);
        console.log("C");
        board[cellId].innerHTML = current;
        checkWin(current);
        setLoading();
        current = (current === huPlayer) ? aiPlayer : huPlayer;
    }
}

/*Function randomly removes a player's turn from the cell if the turn is played in that cell
otherwise displays fire in that cell in the Dragon mode.
The function allows equal probability of removing turns of any player,
thus, there is no bias between player 'O' and 'X'
*/
function attack_caller(e) {

    let call = Math.floor((Math.random() * 2));
    if (call < 1) {
        let ind = Math.floor((Math.random() * 9));
        board[ind].innerHTML = "<img src=./img/fire.gif>"
        setTimeout(() => {
            board[ind].innerHTML = "";
        }, 1000)
    }
}

//Calls the appropriate handleClick function corresponding to each mode
//handleClick in each mode handles the turn of next player
function handleClick(e) {
    console.log("hi")
    if (document.URL.includes('AvsA.html')) {
        if (mode === 'anti-gravity') {
            return handleClickNormal(e);
        }
        else if (mode === 'gravity') {
            return handleClickGravity(e);
        }
        else if (mode === 'attack') {

            return handleClickattack(e);
        }
    }
}

var button_id_menu = "10";
var button_id_internal = "20";
onkeydown = function (e) {

    console.log("keyDown");
    // removing border ================
    var enter_id_menu = button_id_menu - 1;
    var enter_id_internal = button_id_internal - 1;
    if (document.querySelector('.menu-grid') && enter_id_menu > "9")
        document.getElementById(enter_id_menu).style.border = "none";
    else if ((document.URL.includes('AvsA.html')) && enter_id_internal > "19")
        document.getElementById(enter_id_internal).style.border = "none";


    // for controlling buttons ==============================

    if (event.keyCode === 39) { // right arraow key
        if (document.querySelector('.menu-grid')) {
            console.log("menu")
            if (button_id_menu == "16")
                button_id_menu = "10";
            document.getElementById(button_id_menu).style.border = "thick solid #0000FF";
            button_id_menu++;
        }

        else if (document.URL.includes('AvsA.html')) {
            console.log("AvsA")
            if (button_id_internal == "22")
                button_id_internal = "20";
            console.log(button_id_internal)
            document.getElementById(button_id_internal).style.border = "thick solid #0000FF";
            button_id_internal++;
        }
    }

    else if (event.keyCode === 13) { // enter key
        if (document.querySelector('.menu-grid') && enter_id_menu > "9")
            document.getElementById(enter_id_menu).click();
        else if (document.URL.includes('AvsA.html') && enter_id_internal > "19") {
            document.getElementById(enter_id_internal).click();
        }
    }

    else if (event.keyCode === 72) // H key
    if (document.querySelector('.menu-grid')) {
            console.log(document.getElementById(help))
            document.getElementById("help").click();
        }

    // if (event.keyCode === 27 && document.URL.includes('help.html')) { // esc key
    //     console.log(document.getElementById("21"))
    //     document.getElementById("21").style.border = "thick solid white";
    //     document.getElementById("21").click();
    // }

    // for deciding mode via keyboard =====================
    if (mode === 'anti-gravity') {
        return myKeyPressNormal(e);
    }
    else if (mode === 'gravity') {
        return myKeyPressGravity(e);
    }
    else if (mode === 'attack') {
        return myKeyPressDragon(e);
    }
};

function myKeyPressNormal(e) {
    var keynum;
    var key = event.which || event.keyCode;
    if ((key >= 49 && key <= 57) || (key >= 97 && key <= 105)) {
        const ind = ((key - 97 < 0) ? (key - 49) : (key - 97));
        if (board[ind].innerHTML === "") {
            board[ind].innerHTML = current;
            checkWin(current);
            setLoading();
            current = (current === huPlayer) ? aiPlayer : huPlayer;
        }
    }
    console.log(key - 49);
}
function myKeyPressGravity(e) {
    var keynum;
    var key = event.which || event.keyCode;
    if ((key >= 49 && key <= 57) || (key >= 97 && key <= 105)) {
        const ind = ((key - 97 < 0) ? (key - 49) : (key - 97));
        const col = ind % 3;
        console.log(availableSpots[col] + " " + key + " " + current)
        if (availableSpots[col] >= ind) {
            availableSpots[col] -= 3;
            console.log(ind + " " + availableSpots[col] + 3)
            fall(ind, availableSpots[col] + 3, current)
            setLoading();
            current = (current === huPlayer) ? aiPlayer : huPlayer;
        }
    }
    console.log(key - 49);
}
function myKeyPressDragon(e) {
    var keynum;
    var key = event.which || event.keyCode;
    if ((key >= 49 && key <= 57) || (key >= 97 && key <= 105)) {
        const ind = ((key - 97 < 0) ? (key - 49) : (key - 97));
        if (board[ind].innerHTML == "") {
            board[ind].innerHTML = current;
            checkWin(current);
            setLoading();
            attack_caller();
            current = (current === huPlayer) ? aiPlayer : huPlayer;
        }
    }
    console.log(key - 49);
}

//Responsible for showing "???" on the respective player's turn above the player's image
function setLoading() {
    let p = Number(current === huPlayer);
    document.querySelector(".player" + p).classList.remove("loading");
    p = 1 - p;
    document.querySelector(".player" + p).classList.add("loading");
}

//Function to revoke another player from playing once the game is over.
function settingFalse() {
    for (let i = 0; i < 9; i++)
        board[i].removeEventListener('click', handleClick);
}


/*Finds all the cells in board played already and stores in plays. 
    intialize accumulator to empty array,e is present board element,i is index.
    if the element equals the player, we take the accumulator array, add the index to the array 
    otherwise send it without changes
    */
function checkWin(player, newBoard = board) {
    for (let i = 0; i < 8; i++) {
        let win = true;
        for (let j = 0; j < 3; j++) {
            if (newBoard[winCombos[i][j]].innerHTML !== player)
                win = false;
        }
        if (win) {
            settingFalse();
            declareWinner(player + " Player Wins!");
            for (let j = 0; j < 3; j++) {
                newBoard[winCombos[i][j]].classList.add('color')
            }
            return true;
        }
    }
    if (checkTie()) {
        settingFalse();
        declareWinner('Tie Game!');
    }
}

/*If there are no empty squares and if no one has won
    implies a tie */
function checkTie() {
    for (let i = 0; i < 9; i++) {
        if (board[i].innerHTML === "")
            return false;
    }
    return true;

}


function declareWinner(who) {
    document.querySelector(".endgame").style.display = "block";
    document.querySelector(".endgame .text").innerText = who;
}

//Runs the demo tic-tac-toe on the Menu page over and over again
function runDemo(player = aiPlayer) {

    setTimeout(() => {
        if (reset) {
            startGame();
            reset = false;
        }
        if (!checkWin((player === aiPlayer) ? huPlayer : aiPlayer) && !checkTie()) {
            let ind = -1;
            while (ind === -1 || board[ind].innerHTML !== "")
                ind = Math.floor((Math.random() * 9));

            if (board[ind].innerHTML === "") {
                board[ind].innerHTML = player
            }
            player = (player === aiPlayer) ? huPlayer : aiPlayer;


            runDemo(player);
        }
        else {
            reset = true;
            runDemo();
        }
    }, 1200)
}

//Selects mode from Demo or Astronaut vs Astronaut
function setMode(m) {
    console.log("setMode")
    localStorage.setItem("AvsA-mode", m);
    window.location.href = 'AvsA.html'
}

//Selects difficulty from Easy/Medium/Hard in Aliens vs Astronaut mode
//Maintains the mode presently being played in Astronaut vs Astronaut mode
function setDifficulty(m) {
    localStorage.setItem("AvsA-difficulty", m);
    window.location.href = 'AlienvsA.html'
}

mode = localStorage.getItem("AvsA-mode") || 'demo';

if (document.querySelector('.menu-grid')) mode = 'demo'

document.querySelector('body').classList.add('mode-' + mode)


if (!document.URL.includes('help.html')) {
    startGame();
    if (mode === 'demo') runDemo();
}
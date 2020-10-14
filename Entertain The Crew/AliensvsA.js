var level;
var origBoard; //initialize the board. Array keeping track of 'X' or 'O' or empty cell
const huPlayer = "<img src=./img/knott.png>";
const aiPlayer = "<img src=./img/cross.gif>"; //"<img src=./img/dragon__4.png>";
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

const cells = document.querySelectorAll('.cell');

function setLoading() {
    document.querySelector(".player0").classList.remove("loading");
    document.querySelector(".player1").classList.add("loading");
}

function setLevel(e) {
    if (e === 'easy') {
        return bestSpot_level0();
    }
    else if (e === 'medium') {
        return bestSpot_Med();
    }
    else if (e === 'hard') {
        return bestSpot_hard();
    }
}

function startGame() {
    document.querySelector(".endgame").style.display = "none"; //sets the display of endgame back to none
    origBoard = Array.from(Array(9).keys());
    for (var i = 0; i < cells.length; i++) {                   //removes 'X' and 'O' from the board
        cells[i].innerHTML = '';
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click', turnClick, false);
    }
}

function turnClick(square) {
    /* if the type of cell/id just clicked is not a number. 
    'O' or 'X' specifies played position.
    number is replaced with 'O' or 'X' whenever a turn is played
    */
    setLoading()
    if (typeof origBoard[square.target.id] == 'number') {
        turn(square.target.id, huPlayer)  //human player plays his turn
        /*check if there is a tie. all squares are full but no player has won
        AI plays his turn if it is not a tie and human player has played
         */
        if (!checkWin(origBoard, huPlayer) && !checkTie()) turn(setLevel(level), aiPlayer);
    }
}

function turn(squareId, player) {
    origBoard[squareId] = player;
    document.getElementById(squareId).innerHTML = player; //puts 'O' on the cell where human clicks
    let gameWon = checkWin(origBoard, player)             //checks if the game has been won already. returns value to gameWon
    if (gameWon) gameOver(gameWon)                        //gameWon stores index and player if the game is won and calls gameOver 
}

var button_id_internal = "20";
onkeydown = function (e) {



    var enter_id_internal = button_id_internal - 1;

    if ((document.URL.includes('AlienvsA.html')) && enter_id_internal > "19")
        document.getElementById(enter_id_internal).style.border = "none";
    if (event.keyCode === 39) {
        if (document.URL.includes('AlienvsA.html')) {
            console.log("AvsA")
            if (button_id_internal == "22")
                button_id_internal = "20";
            console.log(button_id_internal)
            document.getElementById(button_id_internal).style.border = "thick solid #0000FF";
            button_id_internal++;
        }
    }
    else if (event.keyCode === 13) {
        if (document.URL.includes('AlienvsA.html') && enter_id_internal > "19") {
            document.getElementById(enter_id_internal).click();
        }
    }



    // for playing game ========================
    var keynum;
    var key = event.which || event.keyCode;
    if (key >= 49 && key <= 57) {
        const ind = key - 49;
        setLoading()
        if (typeof origBoard[ind] == 'number') {
            turn(ind, huPlayer)
            if (!checkWin(origBoard, huPlayer) && !checkTie()) turn(setLevel(level), aiPlayer);
        }
    }
    console.log(key - 49);
};

function checkWin(board, player) {
    /*finds all the cells in board played already and stores in plays. 
    intialize accumulator to empty array,e is present board element,i is index.
    if the element equals the player, we take the accumulator array, add the index to the array 
    otherwise send it without changes
    */
    let plays = board.reduce((a, e, i) =>
        (e === player) ? a.concat(i) : a, []);
    let gameWon = null;
    for (let [index, win] of winCombos.entries()) {  //iterating through all possibilities of a win
        if (win.every(elem => plays.indexOf(elem) > -1)) {  //checks if the player has played in all the winning cells
            gameWon = { index: index, player: player };      //sets the gameWon to which player has won and the index of win
            break;
        }
    }
    return gameWon;
}

function gameOver(gameWon) {
    /* highlight squares that are part of winning combination.
    stops user from selecting more cells as game is over
    */
    /*iterates through each index of the win combo and sets the background colour of winning trio 
    to blue if the human player wins and to red if he loses*/
    for (let index of winCombos[gameWon.index]) {
        document.getElementById(index).style.backgroundColor =
            gameWon.player == huPlayer ? "blue" : "red";
    }
    /* no further cells can be clicked after game is over*/
    for (var i = 0; i < cells.length; i++) {
        cells[i].removeEventListener('click', turnClick, false);
    }
    /*declares the winner of the game*/
    declareWinner(gameWon.player == huPlayer ? "Colonization Successful!" : "Aliens invaded.");
}

//basic AI and winner box

function declareWinner(who) {
    document.querySelector(".endgame").style.display = "block";
    document.querySelector(".endgame .text").innerHTML = who;
}


function emptySquares() {
    /*returns all the empty cells that is have a number instead of 'O' or 'X'*/
    return origBoard.filter(s => typeof s == 'number');
}

function checkTie() {
    /*if there are no empty squares and if no one has won
    implies a tie */
    if (emptySquares().length == 0) {
        for (var i = 0; i < cells.length; i++) {
            cells[i].style.backgroundColor = "green";
            cells[i].removeEventListener('click', turnClick, false);
        }
        declareWinner("Tie Game!")   //declare a tie
        return true;
    }
    return false;
}

/*MEDIUM******************************************************************************************/

function bestSpot_Med() {
    return emptySquares()[0];
}

/*HARD**************************************************************************************************/

function bestSpot_hard() {
    //return emptySquares()[0];  //AI player will put its turn in the first empty square of the board
    return minimax(origBoard, aiPlayer).index;
}


/* A Minimax algorithm is defined as a recursive function that does the following things:
 
    return a value if a terminal state is found (+10, 0, -10)
    go through available spots on the board
    call the minimax function on each available spot (recursion)
    evaluate returning values from function calls
    and return the best value
    */

function minimax(newBoard, player) {
    var availSpots = emptySquares();                 //returns all empty  cells

    if (checkWin(newBoard, huPlayer)) {              //human player wins
        return { score: -10 };
    } else if (checkWin(newBoard, aiPlayer)) {       //AI player wins
        return { score: 10 };
    } else if (availSpots.length === 0) {            //tie game
        return { score: 0 };
    }
    /*collect scores from each of empty spots to evaluate later */
    var moves = [];
    for (var i = 0; i < availSpots.length; i++) {
        var move = {};                               //stores the score after each move
        move.index = newBoard[availSpots[i]];        //sets index number of the empty cell stored as number in original board to index property of move
        newBoard[availSpots[i]] = player;            //sets empty spot on new board to current player
        //call minimax function to other player

        if (player == aiPlayer) {
            var result = minimax(newBoard, huPlayer);
            move.score = result.score;
        } else {
            var result = minimax(newBoard, aiPlayer);
            move.score = result.score;
        }
        /*if the minimax function does not find a terminal state,it keeps recursively going deeper until 
        it reaches state having better score
        */

        newBoard[availSpots[i]] = move.index;        //resets new board to previous state 

        moves.push(move);                           //push move to move array
    }

    /*evaluation of best move from moves array
    chooses highest score of AI and lowest score for human player
    */
    var bestMove;
    if (player === aiPlayer) {
        var bestScore = -10000;
        for (var i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        var bestScore = 10000;
        for (var i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove];
}


/*  EASY****************************************************************************************  */

function bestSpot_level0() {
    return minimax_level0(origBoard, aiPlayer).index;
}

function minimax_level0(newBoard, player) {
    var availSpots = emptySquares();                 //returns all empty  cells

    if (checkWin(newBoard, huPlayer)) {              //human player wins
        return { score: -10 };
    } else if (checkWin(newBoard, aiPlayer)) {       //AI player wins
        return { score: 10 };
    } else if (availSpots.length === 0) {            //tie game
        return { score: 0 };
    }
    /*collect scores from each of empty spots to evaluate later */
    var moves = [];
    for (var i = 0; i < availSpots.length; i++) {
        var move = {};                               //stores the score after each move
        move.index = newBoard[availSpots[i]];        //sets index number of the empty cell stored as number in original board to index property of move
        newBoard[availSpots[i]] = player;            //sets empty spot on new board to current player
        //call minimax function to other player

        if (player == aiPlayer) {
            var result = minimax_level0(newBoard, huPlayer);
            move.score = result.score;
        } else {
            var result = minimax_level0(newBoard, aiPlayer);
            move.score = result.score;
        }
        /*if the minimax function does not find a terminal state,it keeps recursively going deeper until 
        it reaches state having better score
        */

        newBoard[availSpots[i]] = move.index;        //resets new board to previous state 

        moves.push(move);                           //push move to move array
    }

    var bestMove;
    if (player === huPlayer) {
        var bestScore = -10000;
        for (var i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        var bestScore = 10000;
        for (var i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove];
}




level = localStorage.getItem("AvsA-difficulty") || 'medium';

if (level === 'easy') {
    document.querySelector('.player0 img').src = "./img/alien.png"
}
else if (level === 'medium') {
    // console.log(document.querySelector('.player0').classList)
    document.querySelector('.player0 img').src = "./img/alien_med.png"
    document.querySelector('.player0').classList.add("alien_med");
}
else if (level === 'hard') {
    console.log("Hard")
    document.querySelector('.player0 img').src = "./img/alien_hard.png"
    document.querySelector('.player0').classList.add("alien_hard");
}

startGame();

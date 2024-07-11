"use strict"
const container = document.querySelector(".game-container");
const dialog = document.querySelector(".modal");
const dialogButton = document.querySelector(".modal-btn");
// Object
let gameBoard = {
    board: [0,0,0,0,0,0,0,0,0],
    checkHorizontal: function(player) {
        if(this.board[0] == player.tag && this.board[1] == player.tag && this.board[2] == player.tag) {
            return player.options.name;
        }
        else if(this.board[3] == player.tag && this.board[4] == player.tag && this.board[5] == player.tag) {
            return player.options.name;
        }
        else if(this.board[6] == player.tag && this.board[7] == player.tag && this.board[8] == player.tag) {
            return player.options.name;
        }
        else
            return "F";
    },
    checkVertical: function(player) {
        if(this.board[0] == player.tag && this.board[3] == player.tag && this.board[6] == player.tag) {
            return player.options.name;
        }
        else if(this.board[1] == player.tag && this.board[4] == player.tag && this.board[7] == player.tag) {
            return player.options.name;
        }
        else if(this.board[2] == player.tag && this.board[5] == player.tag && this.board[8] == player.tag) {
            return player.options.name;
        }
        else
            return "F";
    },
    checkDiagonal: function(player) {
        if(this.board[0] == player.tag && this.board[4] == player.tag && this.board[8] == player.tag) {
            return player.options.name;
        }
        else if(this.board[2] == player.tag && this.board[4] == player.tag && this.board[6] == player.tag) {
            return player.options.name;
        }
        else
            return "F";
    },
    checkWinner: function(player) {
        if(this.checkHorizontal(player) != "F") {
            return this.checkHorizontal(player);
        }
        if(this.checkVertical(player) != "F") {
            return this.checkVertical(player);
        }
        if(this.checkDiagonal(player) != "F") {
            return this.checkGameEnd(player);
        }
        return "F";
    },
    checkGameEnd: function(player1, player2) {
        for(let i = 0; i < 9; i++)
            if(this.board[i] == 0)
                return false;
        return true;
    },
    resetBoard: function() {
        for(let i = 0; i < 9; i++)
            this.board[i] = 0;
    }
};

// Factory
function createPlayer(name) {
    let turn = true;
    name = name;
    return {turn, name};
}

// IIFE
const control = (function() {
    const playMove = function(player1, player2, choice) {
        if(player1.options.turn) {
            if(gameBoard.board[choice] == 0) {
                gameBoard.board[choice] = player1.tag;
                player1.options.turn = false;
                player2.options.turn = true;
                return true;
            }
            console.log("Block already occupied");
            return false;
        }
        else if(player2.options.turn) {
            if(gameBoard.board[choice] == 0) {
                gameBoard.board[choice] = player2.tag;
                player2.options.turn = false;
                player1.options.turn = true;
                return true;
            }
            console.log("Block already occupied");
            return false;
        }
        //console.log("Not " + player1.tag + "'s turn!");
        return false;
    };

    const assignPlayers = function(player1, player2) {
        player1.options.name = document.querySelector("#player1").value;
        player2.options.name = document.querySelector("#player2").value;
    }

    const swap = function(player1, player2) {
        let temp = player1;
        player1 = player2;
        player2 = temp;
    }

    // const playGame = function(player1, player2) {
    //     let choice;
    //     while(true) {
    //         choice = DOMHandler.handleClick();
    //         if(playMove(player1, player2, parseInt(choice))) {
                
    //             // Swap players to fit arguements
    //             let temp = player1;
    //             player1 = player2;
    //             player2 = temp;
                
    //             DOMHandler.updateScreen();
    //             if(gameBoard.checkWinner(player2) != "F"){
    //                 //DOMHandler.
    //                 return player2.options.name + " wins";
    //             }
    //             if(gameBoard.checkGameEnd() == true) {
    //                 console.log("tie");
    //                 //DOMHandler.
    //                 return "Tie";
    //             }
    //         }
    //     }
    // }

    return {playMove, assignPlayers};
})();


// Player Objects
let player1 = {
    options: createPlayer("player 1"),
    tag: "X",
}
let player2 = {
    options: createPlayer("player 2"),
    tag: "O",
}

let DOMHandler = {
    updateScreen: function() {
        for(let i = 0; i < 9; i++) {
            if(gameBoard.board[i] == "X")
                document.querySelector(`#${CSS.escape(i)}`).textContent = "X";
            else if(gameBoard.board[i] == "O")
                document.querySelector(`#${CSS.escape(i)}`).textContent = "O";
            else
            document.querySelector(`#${CSS.escape(i)}`).textContent = "";
        }
    },
    handleClick: function(player1, player2) {
        container.addEventListener("click", (e) => {
            if(e.target.id) {
                if(control.playMove(player1, player2, parseInt(e.target.id))) {
                    this.updateScreen();
                    control.assignPlayers(player1, player2);
                    if(gameBoard.checkWinner(player2) != "F"){
                        console.log("player 2 win");
                        document.querySelector(".game-end-text").textContent = `${player2.options.name} wins!`
                        dialog.showModal();
                        this.reset(dialogButton);
                        return player2.options.name + " wins";
                    }
                    if(gameBoard.checkWinner(player1) != "F"){
                        console.log("player 1 win");
                        document.querySelector(".game-end-text").textContent = `${player1.options.name} wins!`
                        dialog.showModal();
                        this.reset(dialogButton);
                        return player1.options.name + " wins";
                    }
                    if(gameBoard.checkGameEnd() == true) {
                        console.log("tie");
                        document.querySelector(".game-end-text").textContent = "Draw!"
                        dialog.showModal();
                        this.reset(dialogButton);
                        return "Tie";
                    }
                }
            }
        })
    },
    reset: function(button) {
        button.addEventListener("click", () => {
            gameBoard.resetBoard();
            this.updateScreen();
            dialog.close();
        })
    }
}

// Using this method to avoid having to deal with Promise and multiple threads..
// control.playGame(player1, player2);
DOMHandler.handleClick(player1, player2);
import {Controller, boardSetup} from "./controller.js";
import {ChessPiece} from "./piece.js";


//*** GAME BEGINS ***//
$(document).ready(()=>{

    //initializes event handlers
    initialize();

    //Model - The model will simply be the set of Chess Pieces which hold their own state
    const pieces = createPieces();

    //View - The view will be updated by the controller
    const rows = window.document.getElementsByClassName("row");

    //Controller - The controller is responsible for manipulating the View and
    const controller = new Controller(pieces, rows);

    
    //initializes event handlers
    function initialize() {

        $("button").click(()=>{
            location.reload();
        });

        $(".col").click(function(event) {

            if(controller.pieceSelected === false){

                controller.selectPiece(event);

                return;

            } else if(event.currentTarget.classList.contains("valid")) {

                controller.movePiece(event);

            } 

            //either a piece was moved or and invalid target was selected, so we'll reset the selection
            controller.resetTargets();

        });

    }

    //creates and returns an array of chess piece objects
    function createPieces() {

        const pieces = [];

        for(let i = 0; i < 2; i++){
            for(let j = 0; j < 8; j++){
            
                const type = boardSetup.rows[i][j];
                const color = "white";
                const xPos = j;
                const yPos = i;
            
                const piece = new ChessPiece(type, color, xPos, yPos, color + type);
            
                pieces.push(piece);
            }
        }

        for(let i = 7; i > 5; i--){
            for(let j = 7; j > -1; j--){
            
                const type = boardSetup.rows[Math.abs(i-7)%6][j];
                const color = "black";
                const yPos = i;
                const xPos = j;
            
                const piece = new ChessPiece(type, color, xPos, yPos, color + type);
            
                pieces.push(piece);
            }
        }

        return pieces;

    }

});






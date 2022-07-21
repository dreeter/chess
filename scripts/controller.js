

//defines an initial board setup, rows[0] = backrow, rows[1] = frontrow
const boardSetup = {
    rows: [
        ["rook", "knight", "bishop", "king", "queen", "bishop", "knight", "rook"],
        ["pawn", "pawn", "pawn", "pawn", "pawn", "pawn", "pawn", "pawn"]
    ]   
}

//stores coordinate object into an array
function storeCoordinates(xPos, yPos, coordinates){
    coordinates.push(
        {xPos: xPos, yPos: yPos}
    );
}


//class defines a controller that handles events from the view and maps the model to the view
//initialized with a view and a model
class Controller {

    constructor(pieces, rows){
        this.pieces = pieces;
        this.rows = rows;
        this.selectedCoordinates = {xPos: -1, yPos: -1};
        this.pieceSelected = false;
        this.selectedElement = undefined;
        this.movedLast = "black";
        this.setImages();
    }

    //initializes the view with the image of each chess piece
    setImages() {
        this.pieces.forEach((piece)=>{
            this.rows[piece.yPos].children[piece.xPos].firstElementChild.setAttribute("src", piece.image);
        });
     }

     //when a piece is deselected, valid and selection classes will be removed
    resetTargets(){
        this.setSelectedCoordinates(-1, -1);
        this.pieceSelected = false;
        this.removeSelected();
        this.removeValid();
        this.setSelectedElement(undefined);
    }

    getSelectedCoordinates(){
        return this.selectedCoordinates;
    }

    setSelectedCoordinates(xPos, yPos){
        this.selectedCoordinates.xPos = xPos;
        this.selectedCoordinates.yPos = yPos;
    }

    getSelectedElement() {
        return this.selectedElement;
    }

    setSelectedElement(element) {
        this.selectedElement = element;
    }

    //returns ChessPiece object at coordinate - undefined if no object exists
    getPiece(xPos, yPos) {

        return this.pieces.find((piece)=>{              
            return (piece.xPos === xPos && piece.yPos === yPos);
        });
        
    }

    //returns valid coordinate positions for a given piece
    getValidMoves(xPos, yPos, pieceType, pieceColor){

        let validMoves;

        switch(pieceType){
            case "rook":
                validMoves = this.getValidRookMoves(xPos, yPos, pieceColor);
                break;
            case "knight":
                validMoves = this.getValidKnightMoves(xPos, yPos, pieceColor);
                break;
            case "bishop":
                validMoves = this.getValidBishopMoves(xPos, yPos, pieceColor);
                break;
            case "queen":
                validMoves = this.getValidQueenMoves(xPos, yPos, pieceColor)
                break;
            case "king":
                validMoves = this.getValidKingMoves(xPos, yPos, pieceColor);
                break;
            case "pawn":
                validMoves = this.getValidPawnMoves(xPos, yPos, pieceColor);
                break;
            default:
                console.log("Invalid Piece Type " + pieceType);
        }

        return validMoves;

    }

    //valid cross coordinates (vertical and horizontal movements, queen, king, rook)
    getCrossCoordinates(xPos, yPos, pieceColor){

        const moves = [];

        //verticals
        for(let j = yPos + 1; j < 8; j++){

            if(this.isCollision(xPos, j)){
                //determine if collision is OK

                if(this.getPiece(xPos, j).color !== pieceColor){
                    //do not store coordinates
                    storeCoordinates(xPos, j, moves);
                }
                break;

            } else {
                storeCoordinates(xPos, j, moves);
            }
        }

        for(let j = yPos - 1; j > -1; j--){

            if(this.isCollision(xPos, j)){
                //determine if collision is OK

                if(this.getPiece(xPos, j).color !== pieceColor){
                    //do not store coordinates
                    storeCoordinates(xPos, j, moves);
                }
                break;

            } else {
                storeCoordinates(xPos, j, moves);
            }
        }

        //horizontals
        for(let i = xPos + 1; i < 8; i++){

            
            if(this.isCollision(i, yPos)){
                //determine if collision is OK

                if(this.getPiece(i, yPos).color !== pieceColor){
                    //do not store coordinates
                    storeCoordinates(i, yPos, moves);
                }
                break;

            } else {
                storeCoordinates(i, yPos, moves);
            }

        }      
        for(let i = xPos - 1; i > -1; i--){
         
            if(this.isCollision(i, yPos)){
                //determine if collision is OK

                if(this.getPiece(i, yPos).color !== pieceColor){
                    //do not store coordinates
                    storeCoordinates(i, yPos, moves);
                }
                break;

            } else {
                storeCoordinates(i, yPos, moves);
            }


        }

        return moves;

    }

    //valid diagonal coordinates (queen, king, bishop)
    getDiagonalCoordinates(xPos, yPos, pieceColor){

        const moves = [];

        for(let i = xPos + 1, j = yPos + 1; i < 8, j < 8; i++, j++){

            if(this.isCollision(i, j)){
                //determine if collision is OK

                if(this.getPiece(i, j).color !== pieceColor){
                    //do not store coordinates
                    storeCoordinates(i,j, moves);
                }
                break;

            } else {
                storeCoordinates(i, j, moves);
            }

        }

        for(let i = xPos - 1, j = yPos - 1; i > -1, j > -1; i--, j--){

            if(this.isCollision(i, j)){
                //determine if collision is OK

                if(this.getPiece(i, j).color !== pieceColor){
                    //do not store coordinates
                    storeCoordinates(i,j, moves);
                }
                break;

            } else {
                storeCoordinates(i, j, moves);
            }
        }

        for(let i = xPos + 1, j = yPos - 1; i < 8, j > -1; i++, j--){

            if(this.isCollision(i, j)){
                //determine if collision is OK

                if(this.getPiece(i, j).color !== pieceColor){
                    //do not store coordinates
                    storeCoordinates(i,j, moves);
                }
                break;

            } else {
                storeCoordinates(i, j, moves);
            }
        }

        for(let i = xPos - 1, j = yPos + 1; i > -1, j < 8; i--, j++){

            if(this.isCollision(i, j)){
                //determine if collision is OK

                if(this.getPiece(i, j).color !== pieceColor){
                    //do not store coordinates
                    storeCoordinates(i,j, moves);
                }
                break;

            } else {
                storeCoordinates(i, j, moves);
            }
        }

        return moves;
    }

    //determines if a move would result in a collision
    isCollision(xPos, yPos){
        return this.getPiece(xPos, yPos) !== undefined;
    }

    getValidRookMoves(xPos, yPos, pieceColor) {
        return this.getCrossCoordinates(xPos, yPos, pieceColor);
    }

    getValidBishopMoves(xPos, yPos, pieceColor){
        return this.getDiagonalCoordinates(xPos, yPos, pieceColor);
    }

    getValidKingMoves(xPos, yPos, pieceColor){

        let validMoves = this.getCrossCoordinates(xPos, yPos, pieceColor).concat(this.getDiagonalCoordinates(xPos, yPos, pieceColor));

        validMoves = validMoves.filter((coordinate)=>{
            if(Math.abs(coordinate.xPos - xPos) <= 1 && Math.abs(coordinate.yPos - yPos) <= 1){
                return true;
            }
         });

         return validMoves;
    }

    getValidQueenMoves(xPos, yPos, pieceColor){
        return this.getCrossCoordinates(xPos, yPos, pieceColor).concat(this.getDiagonalCoordinates(xPos, yPos, pieceColor));
    }

    getValidKnightMoves(xPos, yPos, pieceColor){

        const moves = [];

        storeCoordinates(xPos + 1, yPos + 2, moves);
        storeCoordinates(xPos - 1, yPos - 2, moves);
        storeCoordinates(xPos + 1, yPos - 2, moves);
        storeCoordinates(xPos - 1, yPos + 2, moves);
        storeCoordinates(xPos + 2, yPos + 1, moves);
        storeCoordinates(xPos - 2, yPos - 1, moves);
        storeCoordinates(xPos + 2, yPos - 1, moves);
        storeCoordinates(xPos - 2, yPos + 1, moves);

        return moves;
    }

    getValidPawnMoves(xPos, yPos, pieceColor){

        //ydirection - white pawns move up, black move down
        let ydirection = 0;

        if(pieceColor === "black"){
            ydirection = -1;
        } else {
            ydirection = 1;
        }

        const moves = [];

        let yCoord = ydirection + yPos;

        if(!this.isCollision(xPos, yCoord)){
            storeCoordinates(xPos, yCoord, moves);

            if(!this.getPiece(xPos, yPos).hasMoved) {
                if(!this.isCollision(xPos, yCoord + ydirection)){
                    storeCoordinates(xPos, yCoord + ydirection, moves);
                }
            }

        } 

        if(this.isCollision(xPos + 1, yCoord)){
            if(this.getPiece(xPos + 1, yCoord).color !== pieceColor) {
                storeCoordinates(xPos + 1, yCoord, moves);
            }
        }

        if(this.isCollision(xPos - 1, yCoord)){
            if(this.getPiece(xPos - 1, yCoord).color !== pieceColor) {
                storeCoordinates(xPos - 1, yCoord, moves);
            }
        }

        return moves;
    }

    //----- methods for adding and removing valid and selected classes -----//
    setValid(xPos, yPos) {
        $("div[xpos=" + xPos + "][ypos=" + yPos + "]").addClass("valid");
    }

    setSelected(xPos, yPos){
        $("div[xpos=" + xPos + "][ypos=" + yPos + "]").addClass("selected");
    }

    removeValid(){
        $(".valid").removeClass("valid");
    }

    removeSelected(){
        $(".selected").removeClass("selected");
    }

    movePiece(event) {

        console.log("MOVING PIECE");
    
        //get selected/source coordinates, piece, and element
        const sourceCoordinates = this.getSelectedCoordinates();
        const sourcePiece = this.getPiece(sourceCoordinates.xPos, sourceCoordinates.yPos);
        const sourceElement = this.getSelectedElement();
    
        //get target coordinates, piece, and element
        const targetCoordinates = {
            xPos: Number(event.currentTarget.getAttribute("xpos")),
            yPos: Number(event.currentTarget.getAttribute("ypos"))
        }
        const targetPiece = this.getPiece(targetCoordinates.xPos, targetCoordinates.yPos);
        const targetElement = event.currentTarget;
    
        if(targetPiece !== undefined){      
            targetElement.innerHTML = "";
            targetPiece.setPosition(-1,-1);
        } 
    
        //swap source and target HTML
        const targetHTML = targetElement.innerHTML;
        targetElement.innerHTML = sourceElement.innerHTML;
        sourceElement.innerHTML = targetHTML;
    
        //update moved piece's position
        sourcePiece.setPosition(targetCoordinates.xPos, targetCoordinates.yPos);
        sourcePiece.setMoved(true);

        this.movedLast = sourcePiece.color;
    
    }

    selectPiece(event){

        console.log("SELECTING PIECE");
    
        const xPos = Number(event.currentTarget.getAttribute("xpos"));
        const yPos = Number(event.currentTarget.getAttribute("ypos"));
    
        const piece = this.getPiece(xPos, yPos);
    
        if(piece === undefined){
            //no piece to select, do nothing
            return;
        } else if (piece.color === this.movedLast){
            //do nothing, not this color's turn
            return;
        } else {
            //set selected states
            this.setSelectedCoordinates(xPos, yPos);
            this.pieceSelected = true;
            this.setSelectedElement(event.currentTarget);
        }
        
        //determine selected piece's valid moves and add classes
        const validMoves = this.getValidMoves(xPos, yPos, piece.type, piece.color);
        validMoves.forEach((move)=>{
            this.setValid(move.xPos, move.yPos);
        });
    
        this.setSelected(xPos, yPos);
    
    }


}


export{Controller, boardSetup, storeCoordinates};
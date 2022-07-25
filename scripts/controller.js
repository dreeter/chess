

//defines an initial board setup, rows[0] = backrow, rows[1] = frontrow
const boardSetup = {
    rows: [
        ["rook", "knight", "bishop", "king", "queen", "bishop", "knight", "rook"],
        ["pawn", "pawn", "pawn", "pawn", "pawn", "pawn", "pawn", "pawn"]
    ]   
}

//stores coordinate object into an array
function storeCoordinate(xPos, yPos, coordinates){
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
        this.toggleMove();
        this.initializeCoverage();
    }

    initializeCoverage(){
        this.pieces.forEach((piece)=>{
            piece.setCoverage(this.getValidMoves(piece.xPos, piece.yPos, piece.type, piece.color));
        });
    }

    toggleMove(){

        let moveColor = ""

        if(this.movedLast === "black"){
            moveColor = "white";
        } else {
            moveColor = "black"
        }

        $("#turn-display").html(moveColor);

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

    //stores a coordinate if it's a valid position to move toward
    handleCoordinateStore(xPos, yPos, pieceColor, moves){
        let store = false;
        let checkNext = true;

        if(this.isCollision(xPos, yPos)){

            if(this.getPiece(xPos, yPos).color !== pieceColor){
                store = true;
            }
            //we'll not store any more positions
            checkNext = false;

        } else {
            store = true;
        }

        if(store){
            storeCoordinate(xPos, yPos, moves);
        }

        return checkNext;

    }

    //valid cross coordinates (vertical and horizontal movements, queen, king, rook)
    getCrossCoordinates(xPos, yPos, pieceColor){

        const validMoves = [];

        //store valid vertical moves
        for(let j = yPos + 1; j < 8; j++){

            if(!this.handleCoordinateStore(xPos, j, pieceColor, validMoves)){
                break;
            }
        }
        for(let j = yPos - 1; j > -1; j--){

            if(!this.handleCoordinateStore(xPos, j, pieceColor, validMoves)){
                break;
            }
        }

        //store valid horizontal moves
        for(let i = xPos + 1; i < 8; i++){

            if(!this.handleCoordinateStore(i, yPos, pieceColor, validMoves)){
                break;
            }
        }      
        for(let i = xPos - 1; i > -1; i--){
         
            if(!this.handleCoordinateStore(i, yPos, pieceColor, validMoves)){
                break;
            }

        }

        return validMoves;

    }

    //valid diagonal coordinates (queen, king, bishop)
    getDiagonalCoordinates(xPos, yPos, pieceColor){

        const validMoves = [];


        for(let i = xPos + 1, j = yPos + 1; i < 8, j < 8; i++, j++){

            if(!this.handleCoordinateStore(i, j, pieceColor, validMoves)){
                break;
            }

        }

        for(let i = xPos - 1, j = yPos - 1; i > -1, j > -1; i--, j--){

            if(!this.handleCoordinateStore(i, j, pieceColor, validMoves)){
                break;
            }

        }

        for(let i = xPos + 1, j = yPos - 1; i < 8, j > -1; i++, j--){

            if(!this.handleCoordinateStore(i, j, pieceColor, validMoves)){
                break;
            }

        }

        for(let i = xPos - 1, j = yPos + 1; i > -1, j < 8; i--, j++){

            if(!this.handleCoordinateStore(i, j, pieceColor, validMoves)){
                break;
            }

        }

        return validMoves;
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

        //Valid directional moves - aggregate of rook and bishop moves
        let validMoves = this.getCrossCoordinates(xPos, yPos, pieceColor).concat(this.getDiagonalCoordinates(xPos, yPos, pieceColor));

        //filter bishop and rook moves - king can only move 1 space
        validMoves = validMoves.filter((coordinate)=>{
            if(Math.abs(coordinate.xPos - xPos) <= 1 && Math.abs(coordinate.yPos - yPos) <= 1){
                return true;
            }
         });

        //filter out moves that would put the king in an attack by the opposing color - this is not allowed
        const opposingPieces = this.pieces.filter((piece)=>{
            return piece.color !== pieceColor;
        });

        //determine all areas covered by opponent
        let coverages = [];
        for(let i = 0; i < opposingPieces.length; i++){

            let coverage = opposingPieces[i].getCoverage();

            for(let j = 0; j < coverage.length; j++){
                coverages.push(coverage[j]);
            }

        }

        //filter out each incompatible move
        validMoves = validMoves.filter((coordinate)=>{
            let found = coverages.find((coord)=>{
                return coord.xPos === coordinate.xPos && coord.yPos === coordinate.yPos;
            });

            return(!found);

        });

         return validMoves;
    }

    getValidQueenMoves(xPos, yPos, pieceColor){
        return this.getCrossCoordinates(xPos, yPos, pieceColor).concat(this.getDiagonalCoordinates(xPos, yPos, pieceColor));
    }

    getValidKnightMoves(xPos, yPos, pieceColor){

        const validMoves = [];

        this.handleCoordinateStore(xPos + 1, yPos + 2, pieceColor, validMoves);
        this.handleCoordinateStore(xPos - 1, yPos - 2, pieceColor, validMoves);
        this.handleCoordinateStore(xPos + 1, yPos - 2, pieceColor, validMoves);
        this.handleCoordinateStore(xPos - 1, yPos + 2, pieceColor, validMoves);
        this.handleCoordinateStore(xPos + 2, yPos + 1, pieceColor, validMoves);
        this.handleCoordinateStore(xPos - 2, yPos - 1, pieceColor, validMoves);
        this.handleCoordinateStore(xPos + 2, yPos - 1, pieceColor, validMoves);
        this.handleCoordinateStore(xPos - 2, yPos + 1, pieceColor, validMoves);

        return validMoves;
    }

    getValidPawnMoves(xPos, yPos, pieceColor){

        //ydirection - white pawns move up, black move down
        let ydirection = 0;

        if(pieceColor === "white"){
            ydirection = -1;
        } else {
            ydirection = 1;
        }

        const moves = [];

        let yCoord = ydirection + yPos;

        if(!this.isCollision(xPos, yCoord)){
            storeCoordinate(xPos, yCoord, moves);

            if(!this.getPiece(xPos, yPos).hasMoved) {
                if(!this.isCollision(xPos, yCoord + ydirection)){
                    storeCoordinate(xPos, yCoord + ydirection, moves);
                }
            }

        } 

        if(this.isCollision(xPos + 1, yCoord)){
            if(this.getPiece(xPos + 1, yCoord).color !== pieceColor) {
                storeCoordinate(xPos + 1, yCoord, moves);
            }
        }

        if(this.isCollision(xPos - 1, yCoord)){
            if(this.getPiece(xPos - 1, yCoord).color !== pieceColor) {
                storeCoordinate(xPos - 1, yCoord, moves);
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

    handleClick(event) {

        //this refers to the controller object and not the DOM element since the object was bound to this method

        if(this.pieceSelected === false){

            this.selectPiece(event);

            return;

        } else if(event.currentTarget.classList.contains("valid")) {

            this.movePiece(event);

        } 

        //either a piece was moved or and invalid target was selected, so we'll reset the selection
        this.resetTargets();
    }

    movePiece(event) {
    
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
        sourcePiece.setCoverage(this.getValidMoves(sourcePiece.xPos, sourcePiece.yPos, sourcePiece.type, sourcePiece.color));

        this.movedLast = sourcePiece.color;

        this.toggleMove();
    
    }

    selectPiece(event){
    
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


export{Controller, boardSetup, storeCoordinate as storeCoordinates};
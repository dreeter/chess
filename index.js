
//class defines chess piece objects
class ChessPiece {
    constructor(type, color, xPos, yPos, image) {
        this.type = type;
        this.color = color;
        this.xPos = xPos;
        this.yPos = yPos;
        this.image = images[image];
        this.hasMoved = false;
        console.log("Piece created." + this.color + this.type + " at (" + this.xPos + " , " + this.yPos + ")");
    }

    getXPosition(){
        return this.xPos;
    }

    getYPosition(){
        return this.yPos;
    }

    setPosition(xPos, yPos){
        this.xPos = xPos;
        this.yPos = yPos;
    }

    print(){
        console.log("I am a " + this.color + "-" + this.type + " at " + this.xPos + this.yPos);
    }

    setMoved(){
        this.hasMoved = !this.hasMoved;
    }
}

//stores coordinate object into an array
function storeCoordinates(xPos, yPos, coordinates){
    coordinates.push(
        {xPos: xPos, yPos: yPos}
    );
}

// //creates a coordinate space for all positions on the board
// function createCoordinateSpace(coordinates){

//     for(let i = 0; i < 8; i++){
//         for(let j = 0; j < 8; j++){
//             storeCoordinates(j, i, coordinates);
//         }
//     }

// }

//definition of images for ChessPieces
const images = {
    whitequeen: "/images/white-queen.png",
    whiteking: "/images/white-king.png",
    whitebishop: "/images/white-bishop.png",
    whiteknight: "/images/white-knight.png",
    whiterook: "/images/white-rook.png",
    whitepawn: "/images/white-pawn.png",
    blackqueen: "/images/black-queen.png",
    blackking: "/images/black-king.png",
    blackbishop: "/images/black-bishop.png",
    blackknight: "/images/black-knight.png",
    blackrook: "/images/black-rook.png",
    blackpawn: "/images/black-pawn.png"
};

//defines what an initial board setup, rows[0] = backrow, rows[1] = frontrow
const boardSetup = {
    rows: [
        ["rook", "knight", "bishop", "king", "queen", "bishop", "knight", "rook"],
        ["pawn", "pawn", "pawn", "pawn", "pawn", "pawn", "pawn", "pawn"]
    ]   
}

//creates and returns an array of chess pieces
//chess pieces keep track of their state
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
///////////////////////////////////////////////////////////////////////////

//class defines a controller that handles events from the view and maps the model to the view
//initialized with a view and a model
class Controller {

    constructor(pieces, rows){
        this.pieces = pieces;
        this.rows = rows;
        this.selectedCoordinates = {xPos: -1, yPos: -1};
        this.pieceSelected = false;
        this.selectedElement = undefined;
    }

    resetTargets(){
        controller.setSelectedCoordinates(-1, -1);
        controller.pieceSelected = false;
        controller.removeSelected();
        controller.removeValid();
        controller.setSelectedElement(undefined);
    }

    getSelectedCoordinates(){
        return this.selectedCoordinates;
    }

    setSelectedCoordinates(xPos, yPos){
        this.selectedCoordinates.xPos = xPos;
        this.selectedCoordinates.yPos = yPos;
    }

    getPieceSelected(){
        return this.pieceSelected;
    }

    setPieceSelected(value){
        this.pieceSelected = value;
    }

    getSelectedElement() {
        return this.selectedElement;
    }

    setSelectedElement(element) {
        this.selectedElement = element;
    }

    //returns ChessPiece object at coordinate - undefined if no object exists
    getPiece(xPos, yPos) {

        return pieces.find((piece)=>{              
            return (piece.xPos === xPos && piece.yPos === yPos);
        });
        
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

    isCollision(xPos, yPos){
        console.log("Checking for collision at " + xPos + yPos);
        return this.getPiece(xPos, yPos) !== undefined;
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

        console.log("getValidPawnMoves() called with xPosyPos: " + xPos + yPos + pieceColor);

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

    //returns valid coordinate positions for a given piece
    getValidMoves(xPos, yPos, pieceType, pieceColor){


        console.log("getValidMoves() called with xPosyPos: " + xPos + yPos);

        let validCoordinates = [];

        switch(pieceType){
            case "rook":
                validCoordinates = controller.getCrossCoordinates(xPos, yPos, pieceColor);
                break;
            case "knight":
                validCoordinates = controller.getValidKnightMoves(xPos, yPos, pieceColor);
                break;
            case "bishop":
                validCoordinates = controller.getDiagonalCoordinates(xPos, yPos, pieceColor);
                break;
            case "queen":
                validCoordinates = controller.getCrossCoordinates(xPos, yPos, pieceColor).concat(controller.getDiagonalCoordinates(xPos, yPos, pieceColor));
                break;
            case "king":
                validCoordinates = controller.getCrossCoordinates(xPos, yPos, pieceColor).concat(controller.getDiagonalCoordinates(xPos, yPos, pieceColor));

                validCoordinates = validCoordinates.filter((coordinate)=>{
                   if(Math.abs(coordinate.xPos - xPos) <= 1 && Math.abs(coordinate.yPos - yPos) <= 1){
                       return true;
                   }
                });

                break;
            case "pawn":
                validCoordinates = controller.getValidPawnMoves(xPos, yPos, pieceColor);
                break;
            default:
                console.log("Error");
        }

        return validCoordinates;

    }

    //adds a valid class to divs that may be moved to
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

    //initializes the board
    setBoard() {

        //set the src for each image at the correct coordinate
        pieces.forEach((piece)=>{
            rows[piece.yPos].children[piece.xPos].firstElementChild.setAttribute("src", piece.image);
        });
    }

    //initializes necessary attributes and listeners
    initialize() {

        $(".col").click(function(event) {

            console.log("EVENT FIRED: " + event.type)

            if(controller.pieceSelected === false){

                console.log("SELECTING PIECE");

                const xPos = Number(event.currentTarget.getAttribute("xpos"));
                const yPos = Number(event.currentTarget.getAttribute("ypos"));


                console.log(xPos + "," + yPos);
                //console.log(controller.getSelectedCoordinates().xPos + "," + controller.getSelectedCoordinates().yPos);

                //verify a piece exists on the space selected, otherwise do nothing

                const piece = controller.getPiece(xPos, yPos);

                if(piece === undefined){
                    //do nothing
                    console.log("NO SELECTION");
                    return;
                } else {
                    //select the piece
                    controller.setSelectedCoordinates(xPos, yPos);
                    controller.pieceSelected = true;
                    controller.setSelectedElement(event.currentTarget);
                }
                
                //determine selected piece's valid moves
                let validMoves = controller.getValidMoves(xPos, yPos, piece.type, piece.color);

                //render valid class and selected class
                validMoves.forEach((move)=>{
                    controller.setValid(move.xPos, move.yPos);
                });

                controller.setSelected(xPos, yPos);


            } else if(event.currentTarget.classList.contains("valid")) {

                console.log("MOVING PIECE OR CAPTURING");

                //get selected coordinates, piece, and element
                const sourceCoordinates = controller.getSelectedCoordinates();
                const sourcePiece = controller.getPiece(sourceCoordinates.xPos, sourceCoordinates.yPos);
                const sourceElement = controller.getSelectedElement();

                sourcePiece.print();

                //get target coordinates
                const targetCoordinates = {
                    xPos: Number(event.currentTarget.getAttribute("xpos")),
                    yPos: Number(event.currentTarget.getAttribute("ypos"))
                }
                const targetPiece = controller.getPiece(targetCoordinates.xPos, targetCoordinates.yPos);
                const targetElement = event.currentTarget;

                if(targetPiece !== undefined){

                    console.log("Piece Captured");
                    
                    targetElement.innerHTML = "";
                    targetPiece.setPosition(-1,-1);
                } 

                const targetHTML = targetElement.innerHTML;
                targetElement.innerHTML = sourceElement.innerHTML;
                sourceElement.innerHTML = targetHTML;

                //update selected pieces position
                sourcePiece.setPosition(targetCoordinates.xPos, targetCoordinates.yPos);
                sourcePiece.setMoved();

                sourcePiece.print();

                controller.resetTargets();

            } else {
                
                console.log("INVALID SPACE SELECTED, REVERTING SELECTION");

                controller.resetTargets();
            }

        });

    }

}

//***  Game Begins  ***//


//Model
let pieces = createPieces();

//View
const rows = window.document.getElementsByClassName("row");

//Controller
const controller = new Controller(pieces, rows);

controller.setBoard();
controller.initialize();


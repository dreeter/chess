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

//class defines chess piece objects
class ChessPiece {
    constructor(type, color, xPos, yPos, image) {
        this.type = type;
        this.color = color;
        this.xPos = xPos;
        this.yPos = yPos;
        this.image = images[image];
        this.hasMoved = false;
        console.log("Piece created:" + this.color + this.type + " at (" + this.xPos + " , " + this.yPos + ")");
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

    setMoved(value){
        this.hasMoved = value;
    }
}


export {ChessPiece, images};
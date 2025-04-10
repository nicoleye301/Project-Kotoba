import Http from "@/utils/http";

export class Tictactoe {
    board: string = "---------";

    public toString() : string {
        return JSON.stringify(this)
    }

    public static fromString(params: String) : Tictactoe {
        let parsed = JSON.parse(params.toString());
        let result: Tictactoe = new Tictactoe;

        // Copy from Parsed into Result, and return
        if (parsed instanceof Tictactoe)
        {
            result.board = parsed.board;
        }
        else
        {
            result.board = "---------"
        }
        while (result.board.length < 9)
        {
            result.board += "/"
        }
        return result;
    }

    public isMoveValid(symbol:string, index:number) : boolean {

        // Evaluate move validity. Format assumes indexes 0-8 as a 3x3 grid
        if (this.board.charAt(index) == "O" || this.board.charAt(index) == "X")
        {
            return false;
        }
        return true;
    }

    // Return X or O based on amount of X's and O's
    public currentPlayerTurn() : string {
        let boardArr : Array<string> = Array.from(this.board); // Split board into characters
        let xes : Array<string>;
        let oes : Array<string>;

        xes = boardArr.filter((word) => word.toUpperCase() === "X");
        oes = boardArr.filter((word) => word.toUpperCase() === "O");

        if (xes.length > oes.length)
        {
            return "X";
        }
        return "O";
    }

    // Return an empty array if no wins yet; used to display crosses through the board
    public winLines() : Array<string> {
        let boardArr : Array<string> = Array.from(this.board); // Split board into characters
        while (boardArr.length < 9) {
            boardArr.push("/");
        }

        let winArr : Array<string> = [];
        if (boardArr[0] == boardArr[1] && boardArr[1] == boardArr[2] && boardArr[1] != "/") {
            winArr.push("r0");
        }
        if (boardArr[3] == boardArr[4] && boardArr[4] == boardArr[5] && boardArr[4] != "/") {
            winArr.push("r1");
        }
        if (boardArr[6] == boardArr[7] && boardArr[7] == boardArr[8] && boardArr[7] != "/") {
            winArr.push("r2");
        }

        if (boardArr[0] == boardArr[3] && boardArr[3] == boardArr[6] && boardArr[0] != "/") {
            winArr.push("c0");
        }
        if (boardArr[1] == boardArr[4] && boardArr[4] == boardArr[7] && boardArr[1] != "/") {
            winArr.push("c1");
        }
        if (boardArr[2] == boardArr[5] && boardArr[5] == boardArr[8] && boardArr[2] != "/") {
            winArr.push("c2");
        }

        if (boardArr[0] == boardArr[4] && boardArr[4] == boardArr[8] && boardArr[4] != "/") {
            winArr.push("dUL");
        }
        if (boardArr[2] == boardArr[4] && boardArr[4] == boardArr[6] && boardArr[4] != "/") {
            winArr.push("dUR");
        }

        return winArr;
    }

    public static symbolAtIndex(params: Tictactoe, index:number=0) : string {

        return (params.board+"").charAt( index );
    }

    public setSymbolAtIndex(symbol:string, index:number=0) : void {
        symbol += "-"; // Add default character in case string is empty
        this.board = this.board.substring(0,index) + symbol.charAt(0) + this.board.substring(index+1);
    }

}

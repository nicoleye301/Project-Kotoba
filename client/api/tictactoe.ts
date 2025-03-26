import Http from "@/utils/http";

export class Tictactoe {
    board: string = "/////////";

    public toString(params: Tictactoe) : String {
        return JSON.stringify(params)
    }

    public static fromString(params: String) : Tictactoe {
        let parsed = JSON.parse(params.toString());
        let result: Tictactoe = new Tictactoe;

        // Copy from Parsed into Result, and return
    }

    public isMoveValid(params: Tictactoe|String, move:String) {
        if (params instanceof String)
        {
            params = Tictactoe.fromString(params)
        }

        // Evaluate move validity. Format assumes indexes 0-8 as a 3x3 grid
    }

    // Return X or O based on amount of X's and O's
    public currentPlayerTurn(){

    }

    // Return an empty array if no wins yet; used to display crosses through the board
    public winLines():Array {

    }
}


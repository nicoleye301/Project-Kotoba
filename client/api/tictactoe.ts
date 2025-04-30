export class Tictactoe {
    board: string = "         ";
    gamer1: number | null = null;
    gamer2: number | null = null;
    lastPlayer: number | null = null;
    winner: number | null = null;

    constructor(player: number | null) {
        this.gamer1 = player
    }


    public toString() : string {
        return JSON.stringify(this)
    }

    public static fromString(game: string) : Tictactoe {
        let result: Tictactoe = new Tictactoe(null);

        if (game) {
            const parsedGame = JSON.parse(game)
            result.board = parsedGame.board;
            result.gamer1 = parsedGame.gamer1;
            result.gamer2 = parsedGame.gamer2;
            result.lastPlayer = parsedGame.lastPlayer;
        }
        while (result.board.length < 9)
        {
            result.board += " "
        }
        return result;
    }

    public move(position: number, player: number | null): boolean{
        if (player===this.lastPlayer){
            return false
        }
        if(!this.gamer2 && player!==this.gamer1){   // fill the second player
            this.gamer2 = player
        }
        const symbol = player===this.gamer2?"x":"o"
        this.setSymbolAtIndex(symbol, position)
        this.lastPlayer = player

        return true
    }

    public isWin(){
        let winner = ''
        if (this.board[0] == this.board[1] && this.board[1] == this.board[2] && this.board[1] != " ") {
            winner = this.board[0]
        }
        if (this.board[3] == this.board[4] && this.board[4] == this.board[5] && this.board[4] != " ") {
            winner = this.board[3]
        }
        if (this.board[6] == this.board[7] && this.board[7] == this.board[8] && this.board[7] != " ") {
            winner = this.board[6]
        }

        if (this.board[0] == this.board[3] && this.board[3] == this.board[6] && this.board[0] != " ") {
            winner = this.board[0]
        }
        if (this.board[1] == this.board[4] && this.board[4] == this.board[7] && this.board[1] != " ") {
            winner = this.board[1]
        }
        if (this.board[2] == this.board[5] && this.board[5] == this.board[8] && this.board[2] != " ") {
            winner = this.board[2]
        }

        if (this.board[0] == this.board[4] && this.board[4] == this.board[8] && this.board[4] != " ") {
            winner = this.board[0]
        }
        if (this.board[2] == this.board[4] && this.board[4] == this.board[6] && this.board[4] != " ") {
            winner = this.board[2]
        }

        if (winner==='x'){
            this.winner = this.gamer2
        }
        else if(winner==='o'){
            this.winner = this.gamer1
        }
    }


    public setSymbolAtIndex(symbol:string, index:number=0) : void {
        symbol += " "; // Add default character in case string is empty
        this.board = this.board.substring(0,index) + symbol.charAt(0) + this.board.substring(index+1);
    }

}

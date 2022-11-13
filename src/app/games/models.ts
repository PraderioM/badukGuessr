export class Move {
  private sgfLetters: string[] = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's']
  constructor(public color: string,
              public row: number, public column: number,
              public entrance?: number,
              public capture?: number) {
  }

  convertToSGF() {
    return ';' + this.color + '[' + this.sgfEncodePosition(this.row) + this.sgfEncodePosition(this.column) + ']';
  }

  private sgfEncodePosition(pos: number) {
    return this.sgfLetters[pos];
  }
}

export class Game {
  public lastMove = 0;
  constructor(public blackPlayerName: string,
              public whitePlayerName: string,
              public blackPlayerRank: string,
              public whitePlayerRank: string,
              public date: Date,
              public result: string,
              public komi: string,
              public rules: string,
              public moves: Move[]) {
    for (const move of moves) {
      if (move.entrance !== undefined && move.entrance > this.lastMove) {
        this.lastMove = move.entrance;
      }
    }
  }

  getCurrentMoves(currentMove: number) {
    const outMoves: Move[] = [];
    for (const move of this.moves) {
      if (move.entrance !== undefined && move.entrance < currentMove && (move.capture === undefined || move.capture >= currentMove)) {
        outMoves.push(move);
      }
    }
    return outMoves;
  }

  getMove(moveNumber: number) {
    for (const move of this.moves) {
      if (move.entrance !== undefined && move.entrance === moveNumber) {
        return move;
      }
    }
    return null;
  }

  convertToSGF () {
    // Add metadata and rules.
    let outText = "(;PB["+this.blackPlayerName+"]BR["+this.blackPlayerRank+"]PW["+this.whitePlayerName+"]WR["+this.whitePlayerRank+"]";
    outText = outText + "DT[" + this.date.toString() + "]RE[" + this.result + "]US[badukGuessr]";
    outText = outText + "KM[" + this.komi + "]RU[" + this.rules + "]"

    for (let i = 0; i < this.lastMove; i++) {
      let move = this.getMove(i);
      if (move != null) {
        outText = outText + move.convertToSGF();
      }
    }
    return outText + ")";
  }

  getCaptures(color: string, currentMove: number) {
    let nCaptures = 0;
    for (const move of this.moves) {
      if (move.capture !== undefined && move.capture < currentMove && move.color !== color) {
        nCaptures += 1;
      }
    }
    return nCaptures;
  }
}

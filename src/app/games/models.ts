export class Move {
  constructor(public color: string,
              public row: number, public column: number,
              public entrance?: number,
              public capture?: number) {
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
}

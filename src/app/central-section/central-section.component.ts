import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {startingMoves, showScoreFrequency, maxGuesses, getEarnedPoints} from './utils';
import {Game, Move} from '../games/models';

@Component({
  selector: 'app-central-section',
  templateUrl: './central-section.component.html',
  styleUrls: ['./central-section.component.css']
})
export class CentralSectionComponent implements OnInit, OnChanges {
  @Output() showScore = new EventEmitter<number[]>();
  @Input() gameRun: number;
  @Input() game: Game;
  @Input() gamePaused: boolean;

  scoreHistory: number[] = [];
  score = 0;
  moveNumber = 0;
  maxMoveNumber = 0;
  gameEnded = false;
  nextMoveDelay = 500;
  guesses: Move[] = [];
  correctGuess = -1;

  constructor() { }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.gameRun === undefined || changes.gameRun.firstChange) {
      return;
    }

    const currentGameRun: number = changes.gameRun.currentValue;
    const previousGameRun: number = changes.gameRun.previousValue;

    // If thief game has started we need to initialize it by playing the first moves.
    if (previousGameRun != null && currentGameRun > previousGameRun) {
      this.restartGameMeta();
      this.playFirstMoves();
    }
  }

  restartGameMeta() {
    this.scoreHistory = [];
    this.score = 0;
    this.moveNumber = 0;
    this.maxMoveNumber = 0;
    this.gameEnded = false;
  }

  restartGuesses() {
    this.guesses = [];
    this.correctGuess = -1;
  }

  playFirstMoves() {
    this.goToNextMove();
    if (this.moveNumber < startingMoves) {
      setTimeout(this.playFirstMoves.bind(this), this.nextMoveDelay);
    }
  }

  changeGameMove(moveChange: number) {
    if (this.gamePaused) {
      return;
    }

    this.moveNumber += moveChange;
    this.moveNumber = Math.max(this.moveNumber, 0);
    this.moveNumber = Math.min(this.moveNumber, this.game.lastMove + 1);
    this.maxMoveNumber = Math.max(this.moveNumber, this.maxMoveNumber);
    this.restartGuesses();

    // If the game is over we show progress and end game.
    if (this.moveNumber === this.game.lastMove + 1) {
      if (!this.gameEnded) {
        this.scoreHistory.push(this.score);
        this.showScore.emit(this.scoreHistory);
      }
      this.gameEnded = true;
      return;
    }

    // We periodically show score progress.
    if (this.maxMoveNumber === this.moveNumber && this.moveNumber >= showScoreFrequency && this.moveNumber % showScoreFrequency === 0) {
      this.scoreHistory.push(this.score);
      this.showScore.emit(this.scoreHistory);
    }
  }

  addGuess(guess: Move) {
    // If the game is over we do nothing else.
    if (this.gameEnded || this.gamePaused) {
      return;
    }

    this.guesses.push(guess);
  }

  removeGuess(guess: Move) {
    if (this.gameEnded || this.gamePaused) {
      return;
    }

    // Find index of guess that matches the input guess and remove it from the guesses.
    for (let i = 0; i < this.guesses.length; i++) {
      if (this.guesses[i].row === guess.row && this.guesses[i].column === guess.column) {
        this.guesses.splice(i, 1);
        return;
      }
    }
  }

  processGuesses() {
    // If the game is over we do nothing else.
    if (this.gameEnded || this.gamePaused) {
      return;
    }

    // Get the correct guess if any.
    this.correctGuess = maxGuesses; // If no correct guesses this marks it.
    const nextMove = this.game.getMove(this.moveNumber);

    for (let i = 0; i < this.guesses.length; i++) {
      if (this.guesses[i].row === nextMove.row && this.guesses[i].column === nextMove.column) {
        this.correctGuess = i;
      }
    }

    // Update score.
    this.score += getEarnedPoints(this.correctGuess, this.guesses.length);

    // Go to next after a small delay.
    setTimeout(this.goToNextMove.bind(this), this.nextMoveDelay);
  }

  getCurrentMoves() {
    return this.game.getCurrentMoves(this.moveNumber);
  }

  goToNextMove() {
    return this.changeGameMove(1);
  }
}

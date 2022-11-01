import {Component, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {startingMoves, showScoreFrequency, maxGuesses, getEarnedPoints} from './utils';
import {Game, Move} from '../games/models';
import {getDailyGame} from '../games/game.collection';

@Component({
  selector: 'app-central-section',
  templateUrl: './central-section.component.html',
  styleUrls: ['./central-section.component.css']
})
export class CentralSectionComponent implements OnInit, OnChanges {
  @Output() showScore = new EventEmitter<number[]>();
  @Output() reviewConcluded = new EventEmitter<void>();
  @Output() closePopups = new EventEmitter<void>();
  @Input() gameRun: number = 0;
  @Input() game: Game = getDailyGame();
  @Input() gamePaused: boolean = false;

  scoreHistory: number[] = [];
  score = 0;
  moveNumber = 0;
  maxMoveNumber = 0;
  gameEnded = false;
  nextMoveDelay = 500;
  guesses: Move[] = [];
  correctGuess = -1;
  guessSubmitted = false;

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    const key = event.key;
    if (key === 'ArrowLeft') {
      this.changeGameMove(-1);
    } else if (key === 'ArrowRight') {
      this.changeGameMove(1);
    } else if (key === 'Enter') {
      event.preventDefault();
      this.processGuesses();
      if (this.gamePaused) {
        this.closePopups.emit();
      }
    }
  }

  constructor() { }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['gameRun'] === undefined || changes['gameRun'].firstChange) {
      return;
    }

    const currentGameRun: number = changes['gameRun'].currentValue;
    const previousGameRun: number = changes['gameRun'].previousValue;

    // If thief game has started we need to initialize it by playing the first moves.
    if (previousGameRun != undefined && currentGameRun > previousGameRun) {
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
    this.guessSubmitted = false;
  }

  playFirstMoves() {
    this.goToNextMove();
    if (this.moveNumber < startingMoves) {
      setTimeout(this.playFirstMoves.bind(this), this.nextMoveDelay);
    }
  }

  changeGameMove(moveChange: number) {
    // In the case of having some guesses already submitted this action is equivalent to the processGuesses action.
    if (moveChange === 1 && this.guesses.length > 0) {
      this.processGuesses(false);
    }

    if (this.gamePaused) {
      return;
    }

    // Check if user was reviewing previous moves.
    const wasReviewing = this.moveNumber < this.maxMoveNumber;

    // If we are moving forward fast we do not want to move past the last move we saw unless we are already there.
    if (moveChange > 1 && this.moveNumber < this.maxMoveNumber) {
      this.moveNumber = Math.min(this.moveNumber + moveChange, this.maxMoveNumber);
    } else { // Otherwise we update the move number normally.
      this.moveNumber += moveChange;
    }

    // Sanity check to make sure move number is not out of bounds.
    this.moveNumber = Math.max(this.moveNumber, 0);
    this.moveNumber = Math.min(this.moveNumber, this.game.lastMove + 1);

    // Update last checkpoint.
    this.maxMoveNumber = Math.max(this.moveNumber, this.maxMoveNumber);

    // If last checkpoint was reached after a review we trigger an event to show a popup with this information.
    if (wasReviewing && this.moveNumber === this.maxMoveNumber) {
      this.reviewConcluded.emit();
    }

    // Guesses are reset every time move changes.
    this.restartGuesses();

    // If the game is over we show progress and end game.
    if (this.moveNumber === this.game.lastMove + 1) {
      if (!this.gameEnded) {
        // Fill in score in case it was skipped due to fast forwarding.
        this.fillScoreHistory();
        if (this.moveNumber !== showScoreFrequency * (this.scoreHistory.length + 1)) {
          this.scoreHistory.push(this.score);
        }
        this.showScore.emit(this.scoreHistory);
      }
      this.gameEnded = true;
      return;
    }

    // We periodically show score progress.
    if (this.maxMoveNumber === this.moveNumber && this.moveNumber >= showScoreFrequency * (this.scoreHistory.length + 1)) {
      this.fillScoreHistory();
      this.showScore.emit(this.scoreHistory);
    }
  }

  fillScoreHistory() {
    while (this.moveNumber >= showScoreFrequency * (this.scoreHistory.length + 1)) {
      this.scoreHistory.push(this.score);
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

  processGuesses(changeMove: boolean = true) {
    // If the game is over we do nothing else.
    if (this.gameEnded || this.gamePaused) {
      return;
    }

    // If we are going back to review the game we are not allowing guesses to be submitted.
    if (this.maxMoveNumber > this.moveNumber) {
      return;
    }

    // If there are no guesses we do nothing.
    if (this.guesses.length === 0) {
      return;
    }

    // check that guess hasn't already been submitted and if not we signal that we have just done it.
    if (this.guessSubmitted) {
      return;
    } else {
      this.guessSubmitted = true;
    }

    // Get the correct guess if any.
    this.correctGuess = maxGuesses; // If no correct guesses this marks it.
    const nextMove = this.game.getMove(this.moveNumber);

    // If no next move we finish here.
    if (nextMove == null) {
      return;
    }

    for (let i = 0; i < this.guesses.length; i++) {
      if (this.guesses[i].row === nextMove.row && this.guesses[i].column === nextMove.column) {
        this.correctGuess = i;
      }
    }

    // Update score.
    this.score += getEarnedPoints(this.correctGuess, this.guesses.length);

    // Go to next after a small delay.
    if (changeMove) {
      setTimeout(this.goToNextMove.bind(this), this.nextMoveDelay);
    }
  }

  getCurrentMoves() {
    return this.game.getCurrentMoves(this.moveNumber);
  }

  goToNextMove() {
    return this.changeGameMove(1);
  }

  isReviewing() {
    return this.moveNumber < this.maxMoveNumber || this.moveNumber >= this.game.lastMove + 1;
  }
}

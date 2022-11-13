import {Component, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {showScoreFrequency, maxGuesses, getEarnedPoints, startingMoves} from './utils';
import {Game, Move} from '../games/models';
import {getDailyGame} from '../games/game.collection';
import {latestMoveName, latestScoreName, scoreHistoryName} from '../cookies.names';
import {CookieService} from 'ngx-cookie-service';

@Component({
  selector: 'app-central-section',
  templateUrl: './central-section.component.html',
  styleUrls: ['./central-section.component.css']
})
export class CentralSectionComponent implements OnInit, OnChanges {
  @Output() showScore = new EventEmitter<number[]>();
  @Output() reviewConcluded = new EventEmitter<void>();
  @Output() closePopups = new EventEmitter<void>();
  @Output() autoPlayedMove = new EventEmitter<number>();
  @Output() changeMove = new EventEmitter<number>();
  @Input() gameRun: number = 0;
  @Input() guessSquareSize: number = 1;
  @Input() autoPlay: boolean = false;
  @Input() game: Game = getDailyGame();
  @Input() gamePaused: boolean = false;

  scoreHistory: number[] = [];
  score = 0;
  moveNumber = 0;
  maxMoveNumber = 0;
  gameEnded = false;
  nextMoveDelay = 500;
  guesses: Move[] = [];
  correctGuessRow = -1;
  correctGuessCol = -1;
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

  constructor(private cookieService: CookieService) {
    let expiry = new Date();
    expiry.setDate(expiry.getDate()+1);

    // If there is some score metadata we get it.
    if (this.cookieService.check(latestMoveName)) {
      const moveNumber = parseInt(this.cookieService.get(latestMoveName));
      // We only load the game if at least one move was played.
      if (moveNumber > startingMoves) {
        this.moveNumber = moveNumber;
        this.maxMoveNumber = moveNumber;

        // Set/get score.
        if (this.cookieService.check(latestScoreName)) {
          this.score = parseInt(this.cookieService.get(latestScoreName));
        } else {
          this.cookieService.set(latestScoreName, this.score.toString(), expiry);
        }

        // Set/get score history.
        if (this.cookieService.check(scoreHistoryName)) {
          this.scoreHistory = JSON.parse(this.cookieService.get(scoreHistoryName));
        } else {
          this.cookieService.set(scoreHistoryName, JSON.stringify(this.scoreHistory), expiry);
        }

        // // Set/get game ended
        // if (this.cookieService.check(gameEndedName)) {
        //   this.gameEnded = JSON.parse(this.cookieService.get(gameEndedName));
        // } else {
        //   this.cookieService.set(gameEndedName, JSON.stringify(this.gameEnded), expiry);
        // }
      } else {
        this.cookieService.set(latestMoveName, this.maxMoveNumber.toString(), expiry);
        this.cookieService.set(latestScoreName, this.score.toString(), expiry);
        this.cookieService.set(scoreHistoryName, JSON.stringify(this.scoreHistory), expiry);
        // this.cookieService.set(gameEndedName, JSON.stringify(this.gameEnded), expiry);
      }
    }
  }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges) {
    // Logic for resetting guesses on guess square size change.
    if (changes['guessSquareSize'] !== undefined && !changes['guessSquareSize'].firstChange) {
      const currentGuessSquareSize: number = changes['guessSquareSize'].currentValue;
      const previousGuessSquareSize: number = changes['guessSquareSize'].previousValue;

      // If thief game has started we need to initialize it by playing the first moves.
      if (previousGuessSquareSize != undefined && currentGuessSquareSize !== previousGuessSquareSize) {
        this.restartGuesses();
      }
    }

    // Logic for starting and stopping replay.
    if (changes['autoPlay'] !== undefined && !changes['autoPlay'].firstChange) {

      const currentAutoPlay: number = changes['autoPlay'].currentValue;
      const previousAutoPlay: number = changes['autoPlay'].previousValue;

      // If game has started we need to initialize it by playing the first moves.
      if (previousAutoPlay != undefined && currentAutoPlay && !previousAutoPlay) {
        this.restartGameMeta();
        this.autoPlayNextMove();
      }
    }
  }

  restartGameMeta() {
    let expiry = new Date();
    expiry.setDate(expiry.getDate()+1);

    this.scoreHistory = [];
    this.score = 0;
    this.moveNumber = 0;
    this.maxMoveNumber = 0;
    this.gameEnded = false;
    this.cookieService.set(scoreHistoryName, '[]', expiry);
    this.cookieService.set(latestScoreName, '0', expiry);
    this.cookieService.set(latestMoveName, '0', expiry);
    // this.cookieService.set(gameEndedName, 'false', expiry);
  }

  restartGuesses() {
    this.guesses = [];
    this.correctGuessRow = -1;
    this.correctGuessCol = -1;
    this.guessSubmitted = false;
  }

  autoPlayNextMove() {
    if (!this.autoPlay) {
      return;
    }
    this.goToNextMove();
    this.autoPlayedMove.emit(this.moveNumber);
    setTimeout(this.autoPlayNextMove.bind(this), this.nextMoveDelay);
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

    // Notify parent of change.
    this.changeMove.emit(this.moveNumber);

    // Update last checkpoint.
    this.updateMaxMoveNumber(Math.max(this.moveNumber, this.maxMoveNumber));

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
        this.onShowScore();
      }
      this.gameEnded = true;
      return;
    }

    // We periodically show score progress.
    if (this.maxMoveNumber === this.moveNumber && this.moveNumber >= showScoreFrequency * (this.scoreHistory.length + 1)) {
      this.fillScoreHistory();
      this.onShowScore();
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
    const nextMove = this.game.getMove(this.moveNumber);

    // If no next move we finish here.
    if (nextMove == null) {
      return;
    }

    // Set the row and column of what would be the correct guess.
    this.correctGuessRow = nextMove.row; // If there are no correct guesses this illegal positions mark it.
    this.correctGuessCol = nextMove.column;

    // Update score.
    const splitFactor = this.guessSquareSize * this.guessSquareSize;
    this.updateScore(this.score + getEarnedPoints(this.getCorrectGuessIndex(), this.guesses.length, splitFactor));

    // Go to next after a small delay.
    if (changeMove) {
      setTimeout(this.goToNextMove.bind(this), this.nextMoveDelay);
    }
  }

  getCorrectGuessIndex() {
    // If Guesses are yet to be processed we return -1.
    if (this.correctGuessRow === -1 && this.correctGuessCol === -1) {
      return -1;
    }

    // Check guesses in descending order and return the first one to match.
    const lowHalf = Math.floor(this.guessSquareSize / 2);
    const bigHalf = Math.ceil(this.guessSquareSize / 2);
    for (let i = 0; i < this.guesses.length; i++) {
      if (this.guesses[i].row - lowHalf <= this.correctGuessRow && this.correctGuessRow < this.guesses[i].row + bigHalf) {
        if (this.guesses[i].column - lowHalf <= this.correctGuessCol && this.correctGuessCol < this.guesses[i].column + bigHalf) {
          return  i;
        }
      }
    }

    // If none of the guesses is correct we return the maximum index.
    return maxGuesses;
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

  private updateMaxMoveNumber(newNumber: number) {
    let expiry = new Date();
    expiry.setDate(expiry.getDate()+1);

    this.maxMoveNumber = newNumber;
    this.cookieService.set(latestMoveName, this.maxMoveNumber.toString(), expiry);
  }

  private onShowScore() {
    let expiry = new Date();
    expiry.setDate(expiry.getDate()+1);

    this.cookieService.set(scoreHistoryName, JSON.stringify(this.scoreHistory), expiry);
    this.showScore.emit(this.scoreHistory);
  }

  private updateScore(newScore: number) {
    let expiry = new Date();
    expiry.setDate(expiry.getDate()+1);

    this.score = newScore;
    this.cookieService.set(latestScoreName, this.score.toString(), expiry);
  }
}

import {Component, HostListener} from '@angular/core';
import {Game, Move} from './games/models';
import {getDailyGame, getDailyGameIndex} from './games/game.collection';
import {CookieService} from 'ngx-cookie-service';
import {gameIndexName, gameRunName, hintsRequestedName, latestScoreName, scoreHistoryName} from './cookies.names';
import {
  boardSize,
  maxGuessSquareSize,
  maxHintSquareSize,
  pointsPerSingleGuess,
  showScoreFrequency,
  startingMoves,
} from './central-section/utils';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'baduk-guesser';
  infoVisible = false;
  welcomeVisible = true;
  introductionVisible = false;
  reviewConcludedVisible = false;
  scoreVisible = false;
  confirmationVisible = false;
  scoreHistory: number[] = [];
  currentScore: number = 0;
  showScoreFrequency = showScoreFrequency;
  gameRun = 0;
  game: Game = getDailyGame();
  gameIndex: number = getDailyGameIndex();
  loadMoves = false;
  moveNumber = 0;

  maxGuessSquareSize: number = maxGuessSquareSize;
  guessSquareSize: number = 1;

  maxHintSquareSize: number = maxHintSquareSize;
  hintSquareSize: number = maxGuessSquareSize;
  hintStart: Move = new Move('B', boardSize, boardSize);
  totalHintsRequested: number = 0;

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    const key = event.key;
    if (key === 'ArrowUp') {
      this.changeGuessSquareSize(1);
    } else if (key === 'ArrowDown') {
      this.changeGuessSquareSize(-1);
    }
  }

  constructor(private cookieService: CookieService) {
    // If there are no cookies or if daily game has changed since last time cookies where saved we reset cookies.
    if (!this.cookieService.check(gameIndexName) || getDailyGameIndex() !== parseInt(this.cookieService.get(gameIndexName))) {
      this.resetCookies()
    }
    // If there are cookies and if we reached this point it means that cookies correspond to today's game. we reload them.
    else {
      this.loadCookies();
      this.moveNumber = this.getMaxMoveNumber();
      if (this.moveNumber === startingMoves) {
        this.moveNumber = 0;
      }
      // If something has been played during the current game run we don't replay the first 4 moves. Otherwise, we do.
      if (this.moveNumber > startingMoves) {
        this.hideWelcomeView();
      }
      // If the maximum move number is equal to the last move of the game then we show the score.
      if (this.moveNumber === this.game.lastMove + 1) {
        this.showScoreView();
      }
    }
  }

  resetCookies() {
    const expiry = this.getCookieExpiryDate();
    this.cookieService.set(gameIndexName, getDailyGameIndex().toString(), expiry);
    this.cookieService.set(gameRunName, this.gameRun.toString(), expiry);
    this.cookieService.set(scoreHistoryName, JSON.stringify(this.scoreHistory), expiry);
    this.cookieService.set(latestScoreName, this.currentScore.toString(), expiry);
    this.cookieService.set(hintsRequestedName, this.totalHintsRequested.toString(), expiry);
  }

  resetHints() {
    this.hintStart = new Move('B', boardSize, boardSize);
  }

  showInfoView() {
    this.infoVisible = true;
  }

  hideInfoView() {
    this.infoVisible = false;
  }

  showReviewConcludedView() {
    this.reviewConcludedVisible = true;
  }

  hideReviewConcludedView() {
    this.reviewConcludedVisible = false;
  }

  startGame() {
    this.updateGameRun();
    this.loadMoves = true;
  }

  // Welcome popup functions.
  closeWelcomeAndStartGame() {
    this.hideWelcomeView();
    this.startGame();
  }

  closeWelcomeAndShowIntroduction() {
    this.hideWelcomeView();
    this.showIntroductionView();
  }

  hideWelcomeView() {
    this.welcomeVisible = false;
  }

  // Introduction popup functions.
  closeIntroductionAndStartGame() {
    this.hideIntroductionView();
    this.startGame();
  }

  showIntroductionView() {
    this.introductionVisible = true;
  }

  hideIntroductionView() {
    this.introductionVisible = false;
  }

  // Confirmation popup functions.
  showConfirmationView() {
    this.confirmationVisible = true;
  }

  hideConfirmationView() {
    this.confirmationVisible = false;
  }

  // Score popup functions.
  showScoreView() {
    this.scoreVisible = true;
  }

  hideScoreView() {
    if (!this.confirmationVisible) {
      this.scoreVisible = false;
    }
  }

  updateScore(score: number) {
    this.currentScore = score;
    this.cookieService.set(latestScoreName, this.currentScore.toString());
  }

  closeScoreTabAndRestart() {
    this.hideConfirmationView();
    this.updateGameRun();
    this.hideScoreView();
    this.loadMoves = true;
  }

  updateGameRun() {
    this.gameRun += 1;
    this.cookieService.set(gameRunName, this.gameRun.toString(), this.getCookieExpiryDate());
    this.initGameMeta();
  }


  initGameMeta() {
    this.updateScoreScoreHistory([]);
    this.updateScore(0);
    this.updateTotalHintsRequested(0);
    this.updateMoveNumber(0);
  }

  isGamePaused() {
    let isPaused = this.welcomeVisible || this.introductionVisible || this.infoVisible;
    isPaused = isPaused || this.reviewConcludedVisible || this.scoreVisible;
    return isPaused;
  }

  processPopupClosing() {
    if (this.welcomeVisible) {
      this.closeWelcomeAndStartGame();
    } else if (this.introductionVisible) {
      this.closeIntroductionAndStartGame();
    } else if (this.infoVisible) {
      this.hideInfoView();
    } else if (this.reviewConcludedVisible) {
      this.hideReviewConcludedView();
    } else if (this.scoreVisible) {
      this.hideScoreView();
    }
  }

  // Load cookies.
  private loadCookies() {
    // Load game index.
    if (this.cookieService.check(gameIndexName)) {
      this.gameIndex = parseInt(this.cookieService.get(gameIndexName));
    } else {
      this.gameIndex = getDailyGameIndex();
      this.cookieService.set(gameIndexName, this.gameIndex.toString());
    }

    // Load game run.
    if (this.cookieService.check(gameRunName)) {
      this.gameRun = parseInt(this.cookieService.get(gameRunName));
    } else {
      this.gameRun = 0;
      this.cookieService.set(gameRunName, this.gameRun.toString());
    }

    // Load number of hints requested.
    if (this.cookieService.check(hintsRequestedName)) {
      this.totalHintsRequested = parseInt(this.cookieService.get(hintsRequestedName));
    } else {
      this.totalHintsRequested = 0;
      this.cookieService.set(hintsRequestedName, this.totalHintsRequested.toString());
    }

    // Load current score might have info regarding requested hints.
    if (this.cookieService.check(latestScoreName)) {
      this.currentScore = parseInt(this.cookieService.get(latestScoreName));
    } else {
      this.currentScore = 0;
      this.cookieService.set(latestScoreName, this.currentScore.toString());
    }

    // Load full score history.
    if (this.cookieService.check(scoreHistoryName)) {
      this.scoreHistory = JSON.parse(this.cookieService.get(scoreHistoryName));
    } else {
      this.scoreHistory = [];
      this.cookieService.set(scoreHistoryName, JSON.stringify(this.scoreHistory));
    }
  }

  updateMoveLoading(moveNumber: number) {
    this.loadMoves =  moveNumber < startingMoves;
  }

  updateTotalHintsRequested(totalHintsRequested: number){
    this.totalHintsRequested = totalHintsRequested;
    this.cookieService.set(hintsRequestedName, this.totalHintsRequested.toString());
  }

  updateMoveNumber(moveNumber: number) {
    if (this.moveNumber != moveNumber) {
      this.resetHints();
    }
    const wasReviewing = this.moveNumber < this.getMaxMoveNumber() && !this.loadMoves;
    this.moveNumber =  moveNumber;

    // If move number has exceeded the max move number then we store the current score as the score at last move.
    while (this.moveNumber > this.getMaxMoveNumber()) {
      this.addScoreToHistory(this.currentScore);

      // Show score when needed.
      const maxMoveNumber = this.getMaxMoveNumber();
      if (maxMoveNumber % this.showScoreFrequency === 0 || maxMoveNumber === this.game.lastMove + 1) {
        this.showScoreView();
      }
    }

    // If review was being performed and update ended it then we show it in a popup.
    if (wasReviewing && this.moveNumber === this.getMaxMoveNumber() && this.moveNumber >= startingMoves) {
      this.showReviewConcludedView();
    }
  }

  updateScoreScoreHistory(scoreHistory: number[]) {
    this.scoreHistory = scoreHistory;
    this.cookieService.set(scoreHistoryName, JSON.stringify(this.scoreHistory), this.getCookieExpiryDate());
  }

  addScoreToHistory(score: number) {
    this.scoreHistory.push(score);
    this.cookieService.set(scoreHistoryName, JSON.stringify(this.scoreHistory), this.getCookieExpiryDate());
  }

  getReduceButtonClass(val: number, minVal: number) {
    return {
      'clickable_text': val> minVal,
      'phantom_text': val === minVal
    };
  }

  getIncreaseButtonClass(val: number, maxVal: number) {
    return {
      'clickable_text': val < maxVal,
      'phantom_text': val === maxVal
    };
  }

  changeGuessSquareSize(sizeChange: number) {
    this.guessSquareSize = this.getBoundedChange(this.guessSquareSize, sizeChange, 1, maxGuessSquareSize);
  }

  changeHintSquareSize(sizeChange: number) {
    this.hintSquareSize = this.getBoundedChange(this.hintSquareSize, sizeChange, 2, maxHintSquareSize);
  }

  getBoundedChange(val: number, change: number, min: number, max: number) {
    return Math.max(min, Math.min(val + change, max));
  }

  getHintCost() {
    return Math.ceil(pointsPerSingleGuess / (this.hintSquareSize * this.hintSquareSize));
  }

  giveHint() {
    // If hint was already given then there is no hint for us to give.
    if (this.hintGiven()) {
      return;
    }

    // If there is no next move we do nothing.
    const nextMove = this.game.getMove(this.moveNumber);
    if (nextMove === null) {
      return;
    }

    // Pay the price of requesting a hint.
    this.updateTotalHintsRequested(this.totalHintsRequested += 1);
    this.updateScore(this.currentScore - this.getHintCost());

    // Select randomly a hint amongst all the possible ones.
    const rowStart = Math.max(0, nextMove.row - this.hintSquareSize);
    const colStart = Math.max(0, nextMove.column - this.hintSquareSize);

    const row = Math.floor(Math.random()*(this.hintSquareSize + 1)) + rowStart;
    const col = Math.floor(Math.random()*(this.hintSquareSize + 1)) + colStart;
    const color = this.moveNumber % 2 === 0? 'B' : 'W';

    this.hintStart = new Move(color, row, col);
  }

  hintGiven() {
    if (this.hintStart.column !== boardSize && this.hintStart.row !== boardSize) {
      return true;
    } else if (this.scoreHistory.length === 0){
      return this.currentScore < 0;
    } else {
      return this.currentScore < this.scoreHistory[this.scoreHistory.length - 1];
    }
  }

  getMaxMoveNumber() {
    return startingMoves + this.scoreHistory.length;
  }

  getCookieExpiryDate() {
    let expiry = new Date();
    expiry.setDate(expiry.getDate()+1);
    return expiry;
  }
}

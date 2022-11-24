import {Component, HostListener} from '@angular/core';
import {Game, Move, dummyGame, getGameFromJSON} from './games/models';
import {getDailyGameIndex, getGameLinkByIndex} from './games/game.collection';
import {CookieService} from 'ngx-cookie-service';
import {
  gameIndexName,
  gameRunName,
  guessHistoryName,
  hintsRequestedName,
  latestScoreName, maxCorrectPercentName, maxScorePerMoveName, maxStreakName,
  scoreHistoryName,
  showScoreFrequencyName
} from './cookies.names';
import {
  boardSize, maxGuesses,
  maxGuessSquareSize,
  maxHintSquareSize,
  maxShowScoreFrequency,
  minShowScoreFrequency,
  pointsPerSingleGuess,
  showScoreFrequency,
  startingMoves,
} from './central-section/utils';
import {HttpClient} from '@angular/common/http';

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
  guessHistory: number[] = [];
  currentScore: number = 0;
  minShowScoreFrequency = minShowScoreFrequency;
  maxShowScoreFrequency = maxShowScoreFrequency;
  showScoreFrequency = showScoreFrequency;
  gameRun = 0;
  gameIndex: number = getDailyGameIndex();
  game: Game = dummyGame;
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

  constructor(private cookieService: CookieService, private httpClient: HttpClient) {
    this.getDailyGame();

    // load metadata.
    this.loadMetaCookies();

    // If there are no cookies or if daily game has changed since last time cookies where saved we reset cookies.
    if (!this.cookieService.check(gameIndexName) || this.gameIndex !== parseInt(this.cookieService.get(gameIndexName))) {
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

  getDailyGame() {
    this.httpClient.get(getGameLinkByIndex(this.gameIndex), {responseType: 'text'}).subscribe(data => this.game = getGameFromJSON(data))
  }

  resetCookies() {
    const expiry = this.getCookieShortExpiryDate();
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
    this.cookieService.set(latestScoreName, this.currentScore.toString(), this.getCookieShortExpiryDate());
  }

  updateShowScoreFrequency(frequency: number) {
    this.showScoreFrequency = frequency;
    this.cookieService.set(showScoreFrequencyName, this.showScoreFrequency.toString(), this.getCookieShortExpiryDate());
  }

  closeScoreTabAndRestart() {
    this.hideConfirmationView();
    this.updateGameRun();
    this.hideScoreView();
    this.loadMoves = true;
  }

  updateGameRun() {
    this.gameRun += 1;
    this.cookieService.set(gameRunName, this.gameRun.toString(), this.getCookieShortExpiryDate());
    this.initGameMeta();
  }


  initGameMeta() {
    this.updateGuessHistory([]);
    this.updateScoreHistory([]);
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

  // Load game dependent cookies.
  private loadCookies() {
    // Load game run.
    if (this.cookieService.check(gameRunName)) {
      this.gameRun = parseInt(this.cookieService.get(gameRunName));
    } else {
      this.gameRun = 0;
      this.cookieService.set(gameRunName, this.gameRun.toString(), this.getCookieShortExpiryDate());
    }

    // Load number of hints requested.
    if (this.cookieService.check(hintsRequestedName)) {
      this.totalHintsRequested = parseInt(this.cookieService.get(hintsRequestedName));
    } else {
      this.totalHintsRequested = 0;
      this.cookieService.set(hintsRequestedName, this.totalHintsRequested.toString(), this.getCookieShortExpiryDate());
    }

    // Load current score might have info regarding requested hints.
    if (this.cookieService.check(latestScoreName)) {
      this.currentScore = parseInt(this.cookieService.get(latestScoreName));
    } else {
      this.currentScore = 0;
      this.cookieService.set(latestScoreName, this.currentScore.toString(), this.getCookieShortExpiryDate());
    }

    // Load full score history.
    if (this.cookieService.check(scoreHistoryName)) {
      this.scoreHistory = JSON.parse(this.cookieService.get(scoreHistoryName));
    } else {
      this.scoreHistory = [];
      this.cookieService.set(scoreHistoryName, JSON.stringify(this.scoreHistory), this.getCookieShortExpiryDate());
    }

    // Load history of correct guesses.
    if (this.cookieService.check(guessHistoryName)) {
      this.guessHistory = JSON.parse(this.cookieService.get(guessHistoryName));
    } else {
      this.guessHistory = [];
      this.cookieService.set(guessHistoryName, JSON.stringify(this.guessHistory), this.getCookieShortExpiryDate());
    }
  }

  loadMetaCookies() {
    // Load showScore frequency.
    if (this.cookieService.check(showScoreFrequencyName)) {
      this.showScoreFrequency = parseInt(this.cookieService.get(showScoreFrequencyName));
    } else {
      this.showScoreFrequency = showScoreFrequency;
      this.cookieService.set(showScoreFrequencyName, this.showScoreFrequency.toString(), this.getCookieShortExpiryDate());
    }
  }

  updateMoveLoading(moveNumber: number) {
    this.loadMoves =  moveNumber < startingMoves;
  }

  updateTotalHintsRequested(totalHintsRequested: number){
    this.totalHintsRequested = totalHintsRequested;
    this.cookieService.set(hintsRequestedName, this.totalHintsRequested.toString(), this.getCookieShortExpiryDate());
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
      // If guess history has fewer elements than score history it means that some guesses have been skipped.
      // We need to record this in the history.
      if (this.guessHistory.length < this.scoreHistory.length) {
        this.addGuessToHistory(-1);
      }

      // Show score when needed.
      const maxMoveNumber = this.getMaxMoveNumber();
      const gameEnded = maxMoveNumber === this.game.lastMove + 1;
      if (maxMoveNumber % this.showScoreFrequency === 0 || gameEnded) {
        this.showScoreView();
        if (gameEnded) {
          this.updateMaxScorePerMove();
          this.updateMaxCorrectPercent();
        }
      }
    }

    // If the current move is the last move then we update the max streak.
    const maxMoveNumber = this.getMaxMoveNumber();
    if (this.moveNumber === maxMoveNumber) {
      this.updateMaxStreak();
    }

    // If review was being performed and update ended it then we show it in a popup.
    if (wasReviewing && this.moveNumber === maxMoveNumber && this.moveNumber >= startingMoves) {
      this.showReviewConcludedView();
    }
  }

  updateMaxScorePerMove() {
    const maxScore = this.getMaxScorePerMove();
    const averageScore = this.getAverageScore();
    let newScore;
    if (maxScore === undefined) {
      newScore = averageScore;
    } else {
      newScore = Math.max(maxScore, averageScore);
    }
    this.cookieService.set(maxScorePerMoveName, newScore.toString(), this.getCookieLongExpiryDate());
  }

  getMaxScorePerMove() {
    if (this.cookieService.check(maxScorePerMoveName)) {
      return parseFloat(this.cookieService.get(maxScorePerMoveName));
    } else {
      return undefined;
    }
  }

  getMaxScorePerMoveText() {
    const maxScore = this.getMaxScorePerMove();
    if (maxScore === undefined) {
      return '---';
    } else {
      return maxScore.toFixed(1).toString();
    }
  }

  updateMaxCorrectPercent() {
    const maxPercent = this.getMaxCorrectPercent();
    const currentPercent = this.getPercentCorrect();
    let newPercent;
    if (maxPercent === undefined) {
      newPercent = currentPercent;
    } else {
      newPercent = Math.max(currentPercent, maxPercent);
    }
    this.cookieService.set(maxCorrectPercentName, newPercent.toString(), this.getCookieLongExpiryDate());
  }

  getMaxCorrectPercent() {
    if (this.cookieService.check(maxCorrectPercentName)) {
      return parseFloat(this.cookieService.get(maxCorrectPercentName));
    } else {
      return undefined;
    }
  }

  getMaxCorrectPercentText() {
    const maxPercent = this.getMaxCorrectPercent();
    if (maxPercent === undefined) {
      return '---';
    } else {
      return Math.round(maxPercent).toString();
    }
  }

  updateMaxStreak() {
    const currentStreak = this.getGuessStreak(this.guessHistory.length-1);
    this.cookieService.set(maxStreakName, Math.max(currentStreak, this.getMaxStreak()).toString(), this.getCookieLongExpiryDate());
  }

  getMaxStreak() {
    if (this.cookieService.check(maxStreakName)) {
      return parseInt(this.cookieService.get(maxStreakName));
    } else {
      return this.getLongestStreak();
    }
  }

  updateScoreHistory(scoreHistory: number[]) {
    this.scoreHistory = scoreHistory;
    this.cookieService.set(scoreHistoryName, JSON.stringify(this.scoreHistory), this.getCookieShortExpiryDate());
  }

  updateGuessHistory(guessHistory: number[]) {
    this.guessHistory = guessHistory;
    this.cookieService.set(guessHistoryName, JSON.stringify(this.guessHistory), this.getCookieShortExpiryDate());
  }

  addScoreToHistory(score: number) {
    this.updateScoreHistory(this.scoreHistory.concat([score]));
  }

  addGuessToHistory(guess: number) {
    this.updateGuessHistory(this.guessHistory.concat([guess]));
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

  changeShowScoreFrequency(frequencyChange: number) {
    this.updateShowScoreFrequency(
      this.getBoundedChange(this.showScoreFrequency, frequencyChange, minShowScoreFrequency, maxShowScoreFrequency)
    );
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

  getCookieShortExpiryDate() {
    let expiry = new Date();
    expiry.setDate(expiry.getDate()+2);
    return expiry;
  }

  getCookieLongExpiryDate() {
    return new Date('2500-12-30');
  }

  addGuess(guessNumber: number) {
    if (guessNumber === -1) {
      return;
    } else {
      this.updateGuessHistory(this.guessHistory.concat([guessNumber]));
    }
  }

  getLongestStreak() {
    let maxStreak = 0;
    let streak: number;
    let i = this.guessHistory.length - 1;
    while (i >= 0) {
       streak = this.getGuessStreak(i);
       i = i - streak - 1;
       maxStreak = Math.max(streak, maxStreak);
    }
    return maxStreak;
  }

  getGuessStreak(streakEnd: number) {
    let i = streakEnd
    while (i >= 0 && this.guessHistory[i] >= 0 && this.guessHistory[i] < maxGuesses) {
      i -= 1;
    }
    return streakEnd - i;
  }

  getPercentCorrect() {
    return 100 * this.getGuessAccuracy();
  }

  getGuessAccuracy() {
    const n = this.getNMadeGuesses();
    if (n === 0) {
      return 0;
    }
    return this.getNCorrectGuesses() / n;
  }

  getAverageScore() {
    const n = this.getNMadeGuesses();
    if (n === 0) {
      return 0;
    }
    return this.currentScore / n;
  }

  getNCorrectGuesses() {
    let n = 0;
    for (let guess of this.guessHistory) {
      if (0 <= guess && guess < maxGuesses) {
        n += 1;
      }
    }
    return n;
  }

  getCumulativeCorrectGuesses() {
    let correctGuessSum: number[] = [];
    let guessValue: number = 0;
    let n = 0;
    for (let guess of this.guessHistory) {
      guessValue = (0 <= guess && guess < maxGuesses)? 1: 0;
      if (correctGuessSum.length === 0) {
        correctGuessSum.push(guessValue)
      } else {
        correctGuessSum.push(correctGuessSum[n-1]+guessValue);
      }
      n += 1;
    }

    return correctGuessSum;
  }

  getNMadeGuesses() {
    let madeGuessSum: number = 0;
    for (let guess of this.guessHistory) {
      madeGuessSum += -1 !== guess? 1: 0;
    }

    return madeGuessSum;
  }
}

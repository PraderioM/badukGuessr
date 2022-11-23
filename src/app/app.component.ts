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
    // const str = '{"B": "Byun Sangil", "W": "Gu Zihao", "BR": "9p", "WR": "9p", "DT": "2022-10-31", "RE": "B+R", "KM": "6.5", "RU": "Japanese", "moves": [{"color": "B", "row": 3, "column": 16, "entrance": 0, "capture": ""}, {"color": "W", "row": 15, "column": 15, "entrance": 1, "capture": ""}, {"color": "B", "row": 3, "column": 2, "entrance": 2, "capture": ""}, {"color": "W", "row": 15, "column": 3, "entrance": 3, "capture": ""}, {"color": "B", "row": 3, "column": 5, "entrance": 4, "capture": ""}, {"color": "W", "row": 2, "column": 14, "entrance": 5, "capture": ""}, {"color": "B", "row": 5, "column": 15, "entrance": 6, "capture": 175}, {"color": "W", "row": 16, "column": 5, "entrance": 7, "capture": ""}, {"color": "B", "row": 16, "column": 16, "entrance": 8, "capture": ""}, {"color": "W", "row": 16, "column": 15, "entrance": 9, "capture": ""}, {"color": "B", "row": 15, "column": 16, "entrance": 10, "capture": ""}, {"color": "W", "row": 13, "column": 16, "entrance": 11, "capture": ""}, {"color": "B", "row": 14, "column": 16, "entrance": 12, "capture": ""}, {"color": "W", "row": 14, "column": 15, "entrance": 13, "capture": ""}, {"color": "B", "row": 13, "column": 17, "entrance": 14, "capture": 163}, {"color": "W", "row": 6, "column": 2, "entrance": 15, "capture": ""}, {"color": "B", "row": 12, "column": 16, "entrance": 16, "capture": ""}, {"color": "W", "row": 13, "column": 15, "entrance": 17, "capture": ""}, {"color": "B", "row": 17, "column": 16, "entrance": 18, "capture": ""}, {"color": "W", "row": 3, "column": 3, "entrance": 19, "capture": ""}, {"color": "B", "row": 2, "column": 3, "entrance": 20, "capture": ""}, {"color": "W", "row": 2, "column": 2, "entrance": 21, "capture": ""}, {"color": "B", "row": 2, "column": 1, "entrance": 22, "capture": ""}, {"color": "W", "row": 1, "column": 2, "entrance": 23, "capture": ""}, {"color": "B", "row": 1, "column": 3, "entrance": 24, "capture": ""}, {"color": "W", "row": 4, "column": 2, "entrance": 25, "capture": ""}, {"color": "B", "row": 3, "column": 1, "entrance": 26, "capture": ""}, {"color": "W", "row": 2, "column": 4, "entrance": 27, "capture": ""}, {"color": "B", "row": 1, "column": 4, "entrance": 28, "capture": ""}, {"color": "W", "row": 4, "column": 3, "entrance": 29, "capture": ""}, {"color": "B", "row": 1, "column": 1, "entrance": 30, "capture": ""}, {"color": "W", "row": 10, "column": 3, "entrance": 31, "capture": ""}, {"color": "B", "row": 12, "column": 15, "entrance": 32, "capture": ""}, {"color": "W", "row": 15, "column": 11, "entrance": 33, "capture": ""}, {"color": "B", "row": 12, "column": 13, "entrance": 34, "capture": ""}, {"color": "W", "row": 2, "column": 11, "entrance": 35, "capture": ""}, {"color": "B", "row": 16, "column": 9, "entrance": 36, "capture": ""}, {"color": "W", "row": 16, "column": 7, "entrance": 37, "capture": ""}, {"color": "B", "row": 15, "column": 12, "entrance": 38, "capture": ""}, {"color": "W", "row": 16, "column": 12, "entrance": 39, "capture": ""}, {"color": "B", "row": 16, "column": 13, "entrance": 40, "capture": ""}, {"color": "W", "row": 17, "column": 11, "entrance": 41, "capture": ""}, {"color": "B", "row": 14, "column": 11, "entrance": 42, "capture": ""}, {"color": "W", "row": 14, "column": 10, "entrance": 43, "capture": ""}, {"color": "B", "row": 15, "column": 10, "entrance": 44, "capture": ""}, {"color": "W", "row": 16, "column": 11, "entrance": 45, "capture": ""}, {"color": "B", "row": 15, "column": 13, "entrance": 46, "capture": ""}, {"color": "W", "row": 17, "column": 13, "entrance": 47, "capture": ""}, {"color": "B", "row": 13, "column": 11, "entrance": 48, "capture": ""}, {"color": "W", "row": 17, "column": 15, "entrance": 49, "capture": ""}, {"color": "B", "row": 15, "column": 6, "entrance": 50, "capture": ""}, {"color": "W", "row": 14, "column": 9, "entrance": 51, "capture": ""}, {"color": "B", "row": 16, "column": 6, "entrance": 52, "capture": ""}, {"color": "W", "row": 17, "column": 6, "entrance": 53, "capture": ""}, {"color": "B", "row": 15, "column": 7, "entrance": 54, "capture": ""}, {"color": "W", "row": 17, "column": 7, "entrance": 55, "capture": ""}, {"color": "B", "row": 14, "column": 8, "entrance": 56, "capture": ""}, {"color": "W", "row": 12, "column": 10, "entrance": 57, "capture": ""}, {"color": "B", "row": 15, "column": 9, "entrance": 58, "capture": ""}, {"color": "W", "row": 12, "column": 9, "entrance": 59, "capture": ""}, {"color": "B", "row": 12, "column": 7, "entrance": 60, "capture": ""}, {"color": "W", "row": 15, "column": 5, "entrance": 61, "capture": ""}, {"color": "B", "row": 14, "column": 5, "entrance": 62, "capture": ""}, {"color": "W", "row": 14, "column": 4, "entrance": 63, "capture": ""}, {"color": "B", "row": 13, "column": 5, "entrance": 64, "capture": ""}, {"color": "W", "row": 12, "column": 3, "entrance": 65, "capture": ""}, {"color": "B", "row": 17, "column": 4, "entrance": 66, "capture": ""}, {"color": "W", "row": 17, "column": 5, "entrance": 67, "capture": ""}, {"color": "B", "row": 10, "column": 7, "entrance": 68, "capture": ""}, {"color": "W", "row": 9, "column": 9, "entrance": 69, "capture": ""}, {"color": "B", "row": 16, "column": 2, "entrance": 70, "capture": ""}, {"color": "W", "row": 14, "column": 1, "entrance": 71, "capture": ""}, {"color": "B", "row": 16, "column": 3, "entrance": 72, "capture": ""}, {"color": "W", "row": 11, "column": 8, "entrance": 73, "capture": ""}, {"color": "B", "row": 11, "column": 7, "entrance": 74, "capture": ""}, {"color": "W", "row": 8, "column": 8, "entrance": 75, "capture": ""}, {"color": "B", "row": 8, "column": 7, "entrance": 76, "capture": ""}, {"color": "W", "row": 7, "column": 7, "entrance": 77, "capture": ""}, {"color": "B", "row": 8, "column": 6, "entrance": 78, "capture": ""}, {"color": "W", "row": 16, "column": 4, "entrance": 79, "capture": ""}, {"color": "B", "row": 7, "column": 3, "entrance": 80, "capture": ""}, {"color": "W", "row": 6, "column": 9, "entrance": 81, "capture": ""}, {"color": "B", "row": 8, "column": 10, "entrance": 82, "capture": ""}, {"color": "W", "row": 7, "column": 6, "entrance": 83, "capture": ""}, {"color": "B", "row": 7, "column": 8, "entrance": 84, "capture": ""}, {"color": "W", "row": 7, "column": 9, "entrance": 85, "capture": ""}, {"color": "B", "row": 8, "column": 9, "entrance": 86, "capture": ""}, {"color": "W", "row": 9, "column": 8, "entrance": 87, "capture": ""}, {"color": "B", "row": 6, "column": 8, "entrance": 88, "capture": ""}, {"color": "W", "row": 9, "column": 7, "entrance": 89, "capture": ""}, {"color": "B", "row": 9, "column": 6, "entrance": 90, "capture": ""}, {"color": "W", "row": 10, "column": 6, "entrance": 91, "capture": 94}, {"color": "B", "row": 10, "column": 5, "entrance": 92, "capture": ""}, {"color": "W", "row": 9, "column": 5, "entrance": 93, "capture": ""}, {"color": "B", "row": 11, "column": 6, "entrance": 94, "capture": ""}, {"color": "W", "row": 8, "column": 5, "entrance": 95, "capture": ""}, {"color": "B", "row": 10, "column": 6, "entrance": 96, "capture": ""}, {"color": "W", "row": 5, "column": 8, "entrance": 97, "capture": ""}, {"color": "B", "row": 6, "column": 7, "entrance": 98, "capture": ""}, {"color": "W", "row": 7, "column": 5, "entrance": 99, "capture": ""}, {"color": "B", "row": 5, "column": 7, "entrance": 100, "capture": ""}, {"color": "W", "row": 10, "column": 11, "entrance": 101, "capture": ""}, {"color": "B", "row": 10, "column": 4, "entrance": 102, "capture": ""}, {"color": "W", "row": 9, "column": 3, "entrance": 103, "capture": ""}, {"color": "B", "row": 9, "column": 4, "entrance": 104, "capture": ""}, {"color": "W", "row": 8, "column": 11, "entrance": 105, "capture": ""}, {"color": "B", "row": 7, "column": 10, "entrance": 106, "capture": ""}, {"color": "W", "row": 5, "column": 9, "entrance": 107, "capture": ""}, {"color": "B", "row": 4, "column": 7, "entrance": 108, "capture": ""}, {"color": "W", "row": 8, "column": 3, "entrance": 109, "capture": ""}, {"color": "B", "row": 8, "column": 4, "entrance": 110, "capture": ""}, {"color": "W", "row": 7, "column": 4, "entrance": 111, "capture": ""}, {"color": "B", "row": 11, "column": 3, "entrance": 112, "capture": ""}, {"color": "W", "row": 7, "column": 2, "entrance": 113, "capture": ""}, {"color": "B", "row": 7, "column": 11, "entrance": 114, "capture": ""}, {"color": "W", "row": 8, "column": 12, "entrance": 115, "capture": ""}, {"color": "B", "row": 9, "column": 10, "entrance": 116, "capture": ""}, {"color": "W", "row": 10, "column": 10, "entrance": 117, "capture": ""}, {"color": "B", "row": 7, "column": 12, "entrance": 118, "capture": ""}, {"color": "W", "row": 7, "column": 13, "entrance": 119, "capture": ""}, {"color": "B", "row": 6, "column": 13, "entrance": 120, "capture": 167}, {"color": "W", "row": 8, "column": 13, "entrance": 121, "capture": ""}, {"color": "B", "row": 12, "column": 8, "entrance": 122, "capture": ""}, {"color": "W", "row": 10, "column": 8, "entrance": 123, "capture": ""}, {"color": "B", "row": 11, "column": 2, "entrance": 124, "capture": ""}, {"color": "W", "row": 12, "column": 4, "entrance": 125, "capture": ""}, {"color": "B", "row": 11, "column": 4, "entrance": 126, "capture": ""}, {"color": "W", "row": 10, "column": 1, "entrance": 127, "capture": ""}, {"color": "B", "row": 11, "column": 9, "entrance": 128, "capture": 139}, {"color": "W", "row": 10, "column": 9, "entrance": 129, "capture": ""}, {"color": "B", "row": 9, "column": 11, "entrance": 130, "capture": ""}, {"color": "W", "row": 10, "column": 12, "entrance": 131, "capture": ""}, {"color": "B", "row": 9, "column": 12, "entrance": 132, "capture": ""}, {"color": "W", "row": 11, "column": 13, "entrance": 133, "capture": ""}, {"color": "B", "row": 10, "column": 13, "entrance": 134, "capture": ""}, {"color": "W", "row": 11, "column": 14, "entrance": 135, "capture": ""}, {"color": "B", "row": 11, "column": 12, "entrance": 136, "capture": ""}, {"color": "W", "row": 12, "column": 14, "entrance": 137, "capture": ""}, {"color": "B", "row": 11, "column": 11, "entrance": 138, "capture": ""}, {"color": "W", "row": 11, "column": 10, "entrance": 139, "capture": ""}, {"color": "B", "row": 12, "column": 11, "entrance": 140, "capture": ""}, {"color": "W", "row": 9, "column": 13, "entrance": 141, "capture": ""}, {"color": "B", "row": 10, "column": 14, "entrance": 142, "capture": ""}, {"color": "W", "row": 6, "column": 12, "entrance": 143, "capture": ""}, {"color": "B", "row": 6, "column": 11, "entrance": 144, "capture": ""}, {"color": "W", "row": 5, "column": 12, "entrance": 145, "capture": ""}, {"color": "B", "row": 5, "column": 11, "entrance": 146, "capture": ""}, {"color": "W", "row": 4, "column": 11, "entrance": 147, "capture": ""}, {"color": "B", "row": 4, "column": 12, "entrance": 148, "capture": ""}, {"color": "W", "row": 5, "column": 13, "entrance": 149, "capture": ""}, {"color": "B", "row": 4, "column": 10, "entrance": 150, "capture": ""}, {"color": "W", "row": 3, "column": 11, "entrance": 151, "capture": ""}, {"color": "B", "row": 5, "column": 10, "entrance": 152, "capture": ""}, {"color": "W", "row": 10, "column": 15, "entrance": 153, "capture": ""}, {"color": "B", "row": 9, "column": 14, "entrance": 154, "capture": ""}, {"color": "W", "row": 12, "column": 17, "entrance": 155, "capture": ""}, {"color": "B", "row": 9, "column": 15, "entrance": 156, "capture": ""}, {"color": "W", "row": 9, "column": 16, "entrance": 157, "capture": ""}, {"color": "B", "row": 8, "column": 15, "entrance": 158, "capture": ""}, {"color": "W", "row": 14, "column": 17, "entrance": 159, "capture": ""}, {"color": "B", "row": 11, "column": 17, "entrance": 160, "capture": ""}, {"color": "W", "row": 8, "column": 16, "entrance": 161, "capture": ""}, {"color": "B", "row": 7, "column": 15, "entrance": 162, "capture": ""}, {"color": "W", "row": 13, "column": 18, "entrance": 163, "capture": ""}, {"color": "B", "row": 10, "column": 16, "entrance": 164, "capture": ""}, {"color": "W", "row": 11, "column": 15, "entrance": 165, "capture": ""}, {"color": "B", "row": 9, "column": 17, "entrance": 166, "capture": ""}, {"color": "W", "row": 6, "column": 14, "entrance": 167, "capture": ""}, {"color": "B", "row": 4, "column": 13, "entrance": 168, "capture": ""}, {"color": "W", "row": 6, "column": 15, "entrance": 169, "capture": ""}, {"color": "B", "row": 7, "column": 16, "entrance": 170, "capture": ""}, {"color": "W", "row": 5, "column": 14, "entrance": 171, "capture": ""}, {"color": "B", "row": 4, "column": 14, "entrance": 172, "capture": ""}, {"color": "W", "row": 4, "column": 15, "entrance": 173, "capture": ""}, {"color": "B", "row": 3, "column": 15, "entrance": 174, "capture": ""}, {"color": "W", "row": 5, "column": 16, "entrance": 175, "capture": ""}, {"color": "B", "row": 3, "column": 14, "entrance": 176, "capture": ""}, {"color": "W", "row": 4, "column": 17, "entrance": 177, "capture": ""}, {"color": "B", "row": 3, "column": 17, "entrance": 178, "capture": ""}, {"color": "W", "row": 2, "column": 15, "entrance": 179, "capture": ""}, {"color": "B", "row": 4, "column": 16, "entrance": 180, "capture": ""}, {"color": "W", "row": 5, "column": 17, "entrance": 181, "capture": ""}, {"color": "B", "row": 1, "column": 16, "entrance": 182, "capture": ""}, {"color": "W", "row": 2, "column": 16, "entrance": 183, "capture": ""}, {"color": "B", "row": 2, "column": 17, "entrance": 184, "capture": ""}, {"color": "W", "row": 1, "column": 15, "entrance": 185, "capture": ""}, {"color": "B", "row": 1, "column": 17, "entrance": 186, "capture": ""}, {"color": "W", "row": 6, "column": 16, "entrance": 187, "capture": ""}, {"color": "B", "row": 2, "column": 13, "entrance": 188, "capture": ""}, {"color": "W", "row": 1, "column": 13, "entrance": 189, "capture": ""}, {"color": "B", "row": 0, "column": 15, "entrance": 190, "capture": ""}, {"color": "W", "row": 1, "column": 14, "entrance": 191, "capture": ""}, {"color": "B", "row": 7, "column": 17, "entrance": 192, "capture": ""}, {"color": "W", "row": 3, "column": 18, "entrance": 193, "capture": ""}, {"color": "B", "row": 2, "column": 18, "entrance": 194, "capture": ""}, {"color": "W", "row": 4, "column": 18, "entrance": 195, "capture": ""}, {"color": "B", "row": 7, "column": 14, "entrance": 196, "capture": ""}, {"color": "W", "row": 3, "column": 12, "entrance": 197, "capture": ""}, {"color": "B", "row": 6, "column": 17, "entrance": 198, "capture": ""}, {"color": "W", "row": 3, "column": 13, "entrance": 199, "capture": ""}, {"color": "B", "row": 6, "column": 18, "entrance": 200, "capture": ""}, {"color": "W", "row": 0, "column": 14, "entrance": 201, "capture": ""}, {"color": "B", "row": 5, "column": 18, "entrance": 202, "capture": ""}]}';
    // this.game = getGameFromJSON(str);
    this.httpClient.get(getGameLinkByIndex(this.gameIndex), {responseType: 'text'}).subscribe(data => this.game = getGameFromJSON(data))
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
    this.cookieService.set(latestScoreName, this.currentScore.toString(), this.getCookieExpiryDate());
  }

  updateShowScoreFrequency(frequency: number) {
    this.showScoreFrequency = frequency;
    this.cookieService.set(showScoreFrequencyName, this.showScoreFrequency.toString(), this.getCookieExpiryDate());
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
      this.cookieService.set(gameRunName, this.gameRun.toString(), this.getCookieExpiryDate());
    }

    // Load number of hints requested.
    if (this.cookieService.check(hintsRequestedName)) {
      this.totalHintsRequested = parseInt(this.cookieService.get(hintsRequestedName));
    } else {
      this.totalHintsRequested = 0;
      this.cookieService.set(hintsRequestedName, this.totalHintsRequested.toString(), this.getCookieExpiryDate());
    }

    // Load current score might have info regarding requested hints.
    if (this.cookieService.check(latestScoreName)) {
      this.currentScore = parseInt(this.cookieService.get(latestScoreName));
    } else {
      this.currentScore = 0;
      this.cookieService.set(latestScoreName, this.currentScore.toString(), this.getCookieExpiryDate());
    }

    // Load full score history.
    if (this.cookieService.check(scoreHistoryName)) {
      this.scoreHistory = JSON.parse(this.cookieService.get(scoreHistoryName));
    } else {
      this.scoreHistory = [];
      this.cookieService.set(scoreHistoryName, JSON.stringify(this.scoreHistory), this.getCookieExpiryDate());
    }

    // Load history of correct guesses.
    if (this.cookieService.check(guessHistoryName)) {
      this.guessHistory = JSON.parse(this.cookieService.get(guessHistoryName));
    } else {
      this.guessHistory = [];
      this.cookieService.set(guessHistoryName, JSON.stringify(this.guessHistory), this.getCookieExpiryDate());
    }
  }

  loadMetaCookies() {
    // Load showScore frequency.
    if (this.cookieService.check(showScoreFrequencyName)) {
      this.showScoreFrequency = parseInt(this.cookieService.get(showScoreFrequencyName));
    } else {
      this.showScoreFrequency = showScoreFrequency;
      this.cookieService.set(showScoreFrequencyName, this.showScoreFrequency.toString(), this.getCookieExpiryDate());
    }
  }

  updateMoveLoading(moveNumber: number) {
    this.loadMoves =  moveNumber < startingMoves;
  }

  updateTotalHintsRequested(totalHintsRequested: number){
    this.totalHintsRequested = totalHintsRequested;
    this.cookieService.set(hintsRequestedName, this.totalHintsRequested.toString(), this.getCookieExpiryDate());
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
    this.cookieService.set(maxScorePerMoveName, Math.max(this.getAverageScore(), this.getMaxScorePerMove()).toString());
  }

  getMaxScorePerMove() {
    if (this.cookieService.check(maxScorePerMoveName)) {
      return parseFloat(this.cookieService.get(maxScorePerMoveName));
    } else {
      return this.getAverageScore();
    }
  }

  updateMaxCorrectPercent() {
    this.cookieService.set(maxCorrectPercentName, Math.max(this.getPercentCorrect(), this.getMaxCorrectPercent()).toString());
  }

  getMaxCorrectPercent() {
    if (this.cookieService.check(maxCorrectPercentName)) {
      return parseFloat(this.cookieService.get(maxCorrectPercentName));
    } else {
      return this.getPercentCorrect();
    }
  }

  updateMaxStreak() {
    const currentStreak = this.getGuessStreak(this.guessHistory.length-1);
    this.cookieService.set(maxStreakName, Math.max(currentStreak, this.getMaxStreak()).toString());
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
    this.cookieService.set(scoreHistoryName, JSON.stringify(this.scoreHistory), this.getCookieExpiryDate());
  }

  updateGuessHistory(guessHistory: number[]) {
    this.guessHistory = guessHistory;
    this.cookieService.set(guessHistoryName, JSON.stringify(this.guessHistory), this.getCookieExpiryDate());
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

  getCookieExpiryDate() {
    let expiry = new Date();
    expiry.setDate(expiry.getDate()+2);
    return expiry;
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

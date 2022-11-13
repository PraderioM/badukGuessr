import {Component} from '@angular/core';
import {Game} from './games/models';
import {getDailyGame, getDailyGameIndex} from './games/game.collection';
import {CookieService} from 'ngx-cookie-service';
import {gameIndexName, gameRunName, latestMoveName, latestScoreName, scoreHistoryName} from './cookies.names';
import {startingMoves} from './central-section/utils';

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
  gameRun = 0;
  game: Game = getDailyGame();
  gameIndex: number = getDailyGameIndex();
  loadMoves = false;
  moveNumber = 0;

  constructor(private cookieService: CookieService) {
    // If there are no cookies or if daily game has changed since last time cookies where saved we reset cookies.
    if (!this.cookieService.check(gameIndexName) || getDailyGameIndex() !== parseInt(this.cookieService.get(gameIndexName))) {
      this.resetCookies()
    }
    // If there are cookies and if we reached this point it means that cookies correspond to today's game. we reload it.
    else if (this.cookieService.check(gameIndexName)) {
      this.loadCookies();
      // We load cookies only if a move was played before.
      if (this.cookieService.check(latestMoveName)) {
        if (parseInt(this.cookieService.get(latestMoveName)) > startingMoves) {
          this.hideWelcomeView();
        }
      }
    }
  }

  resetCookies() {
    let expiry = new Date();
    expiry.setDate(expiry.getDate()+1);
    this.cookieService.set(gameIndexName, getDailyGameIndex().toString(), expiry);
    this.cookieService.set(gameRunName, '0', expiry);
    this.cookieService.set(scoreHistoryName, '[]', expiry);
    this.cookieService.set(latestScoreName, '0', expiry);
    this.cookieService.set(latestMoveName, '0', expiry);
    // this.cookieService.set(gameEndedName, 'false');
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

  updateAndShowScore(scoreHistory: number[]) {
    this.scoreHistory = scoreHistory;
    this.showScoreView();
  }

  closeScoreTabAndRestart() {
    this.hideConfirmationView();
    this.updateGameRun();
    this.hideScoreView();
    this.loadMoves = true;
  }

  updateGameRun() {
    this.gameRun += 1;
    let expiry = new Date();
    expiry.setDate(expiry.getDate()+1);
    this.cookieService.set(gameRunName, this.gameRun.toString(), expiry);
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

  // Load
  private loadCookies() {
    this.gameRun = parseInt(this.cookieService.get(gameRunName));
  }

  updateMoveLoading(moveNumber: number) {
    this.loadMoves =  moveNumber < startingMoves;
  }

  updateMoveNumber(moveNumber: number) {
    this.moveNumber =  moveNumber;
  }
}

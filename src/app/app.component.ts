import { Component } from '@angular/core';
import {Game} from './games/models';
import {getDailyGame} from './games/game.collection';

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
  scoreHistory: number[] = [];
  gameRun = 0;
  game: Game = getDailyGame();

  showInfoView() {
    console.log('Showing info view');
    this.infoVisible = true;
  }

  hideInfoView() {
    console.log('hiding info view');
    this.infoVisible = false;
  }

  showReviewConcludedView() {
    this.reviewConcludedVisible = true;
  }

  hideReviewConcludedView() {
    this.reviewConcludedVisible = false;
  }

  startGame() {
    this.gameRun = 1;
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

  // Score popup functions.
  showScoreView() {
    this.scoreVisible = true;
  }

  hideScoreView() {
    this.scoreVisible = false;
  }

  updateAndShowScore(scoreHistory: number[]) {
    this.scoreHistory = scoreHistory;
    this.showScoreView();
  }

  closeScoreTabAndRestart() {
    this.gameRun += 1;
    this.hideScoreView();
  }

  isGamePaused() {
    return this.welcomeVisible || this.introductionVisible || this.infoVisible || this.reviewConcludedVisible || this.scoreVisible;
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
}

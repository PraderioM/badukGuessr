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
  scoreVisible = false;
  scoreHistory: number[] = [];
  gameRun = 0;
  game: Game = getDailyGame();

  showInfoView() {
    this.infoVisible = true;
  }

  hideInfoView() {
    this.infoVisible = false;
  }

  startGame() {
    this.gameRun = 1;
  }

  // Welcome tab functions.
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

  // Introduction tab functions.
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

  // Score tab functions.
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

  endGame(scoreHistory: number[]) {
    this.updateAndShowScore(scoreHistory);
  }

  closeScoreTabAndRestart() {
    this.gameRun += 1;
    this.hideScoreView();
  }

  isGamePaused() {
    return this.infoVisible || this.welcomeVisible || this.introductionVisible || this.scoreVisible;
  }
}

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
  showInfo = false;
  showWelcome = true;
  showIntroduction = false;
  showScore = false;
  gameEnded = false;
  scoreHistory: number[] = [];
  gameRun = 0;
  game: Game = getDailyGame();

  showInfoView() {
    this.showInfo = true;
  }

  hideInfoView() {
    this.showInfo = false;
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
    this.showWelcome = false;
  }

  // Introduction tab functions.
  closeIntroductionAndStartGame() {
    this.hideIntroductionView();
    this.startGame();
  }

  showIntroductionView() {
    this.showIntroduction = true;
  }

  hideIntroductionView() {
    this.showIntroduction = false;
  }

  // Score tab functions.
  showScoreView() {
    this.showScore = true;
  }

  hideScoreView() {
    this.showScore = false;
  }

  updateAndShowScore(scoreHistory: number[]) {
    this.scoreHistory = scoreHistory;
    this.showScoreView();
  }

  endGame(scoreHistory: number[]) {
    this.gameEnded = true;
    this.updateAndShowScore(scoreHistory);
  }

  closeScoreTabAndContinue() {
    if (this.gameEnded) {
      this.gameEnded = false;
      this.gameRun += 1;
    }
    this.hideScoreView();
  }
}

import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {showScoreFrequency, startingMoves} from '../central-section/utils';
import {getDailyGame, getDailyGameIndex} from '../games/game.collection';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {faCopy} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-score',
  templateUrl: './score.component.html',
  styleUrls: ['./score.component.css', '../app.component.css']
})
export class ScoreComponent implements OnInit {
  @Output() closeTab = new EventEmitter<void>();
  @Output() restartGame = new EventEmitter<void>();

  @Input() lastMove: number = 361;
  @Input() totalHintsRequested: number = 0;
  @Input() showScoreFrequency = showScoreFrequency;
  @Input() currentScore: number = 0;
  @Input() scoreHistory: number[] = [];
  @Input() game = getDailyGame();
  @Input() gameIndex = getDailyGameIndex();
  @Input() attempt: number = 1;

  sgfFileUrl?: SafeUrl;
  startingMoves = startingMoves;
  isCopied: boolean = false;
  faCopy = faCopy;

  constructor(private sanitizer: DomSanitizer) {  }

  ngOnInit() {

    const blob = new Blob([this.game.convertToSGF()], {type: 'application/octet-stream'});

    this.sgfFileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
  }

  hasGameEnded() {
    return this.scoreHistory.length + startingMoves >= this.lastMove + 1;
  }

  getCloseText() {
    return this.hasGameEnded() ? 'CLOSE' : 'CONTINUE';
  }

  getScoreText(score: number, i: number) {
    const nMoves = i + 1 + startingMoves;

    // Show different message for final score.
    let outText: string;
    if (nMoves >= this.lastMove + 1) {
      outText = 'FINAL SCORE: ' + score.toString();
    } else {
      outText = 'MOVE ' + nMoves.toString() + ': ' + score.toString();
    }

    if (i >= this.showScoreFrequency) {
      let lastScore = 0;
      if (nMoves < this.lastMove + 1) {
        lastScore = this.scoreHistory[i - this.showScoreFrequency];
      } else if (this.scoreHistory.length + startingMoves > this.showScoreFrequency) {
        let lastScoreIndex = Math.floor((this.scoreHistory.length + startingMoves) / this.showScoreFrequency);
        lastScoreIndex = lastScoreIndex * this.showScoreFrequency - startingMoves;
        lastScore = this.scoreHistory[lastScoreIndex];
      }

      const scoreDiff = score - lastScore;


      if (scoreDiff >= 0) {
        outText = outText + " (+";
      }
      outText = outText + scoreDiff.toString() + ")";
    }

    return outText;
  }

  getCompleteScoreText() {
    const badukGuessrNumber = this.gameIndex + 1;
    let outText = 'BadukGuessr #' + badukGuessrNumber + '\n';
    outText = outText + this.game.blackPlayerName + " " + this.game.blackPlayerRank + " (black)\nvs.\n";
    outText = outText + this.game.whitePlayerName + " " + this.game.whitePlayerRank + " (white)\n";
    outText = outText + 'Attempt #' + this.attempt + '\n';
    outText = outText + 'Hints used: ' + this.totalHintsRequested + '\n\n';
    const n = this.scoreHistory.length;
    let score: number;

    for (let i = showScoreFrequency - startingMoves - 1; i < n - 1; i+=showScoreFrequency) {
      score = this.scoreHistory[i];
      outText = outText + this.getScoreText(score, i) + '\n';
    }

    score = this.scoreHistory[n-1];
    outText = outText + this.getScoreText(score, n-1) + '\n';

    return outText + this.getAverageScoreText();
  }

  getAverageScoreText() {
    return 'Points per move: ' + this.getAverageScore().toFixed(1);
  }

  getAverageScore() {
    if (this.scoreHistory.length === 0){
      return 0;
    }

    return this.currentScore / this.scoreHistory.length;
  }

  onCopy() {
    this.isCopied = true;
    setTimeout(this.resetCopy.bind(this), 1500);
  }

  resetCopy() {
    this.isCopied = false;
  }
}

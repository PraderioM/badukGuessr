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
  @Input() scoreHistory: number[] = [];
  @Input() game = getDailyGame();
  @Input() gameIndex = getDailyGameIndex();
  @Input() attempt: number = 1;

  sgfFileUrl?: SafeUrl;
  isCopied: boolean = false;
  faCopy = faCopy;

  constructor(private sanitizer: DomSanitizer) {  }

  ngOnInit() {

    const blob = new Blob([this.game.convertToSGF()], {type: 'application/octet-stream'});

    this.sgfFileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
  }

  hasGameEnded() {
    return showScoreFrequency * this.scoreHistory.length >= this.lastMove + 1;
  }

  getCloseText() {
    return this.hasGameEnded() ? 'CLOSE' : 'CONTINUE';
  }

  getScoreText(score: number, i: number) {
    const nMoves = (i + 1) * showScoreFrequency;

    // Show different message for final score.
    let outText: string;
    if (nMoves >= this.lastMove + 1) {
      outText = 'FINAL SCORE: ' + score.toString();
    } else {
      outText = 'MOVE ' + nMoves.toString() + ': ' + score.toString();
    }

    if (i>0) {
      let scoreDiff = score - this.scoreHistory[i - 1];
      outText = outText + " (+" + scoreDiff.toString() + ")";
    }

    return outText;
  }

  getCompleteScoreText() {
    const badukGuessrNumber = this.gameIndex + 1;
    let outText = 'BadukGuessr #' + badukGuessrNumber + '\n';
    outText = outText + this.game.blackPlayerName + " " + this.game.blackPlayerRank + " (black)\nvs.\n";
    outText = outText + this.game.whitePlayerName + " " + this.game.whitePlayerRank + " (white)\n";
    outText = outText + 'Attempt #' + this.attempt + '\n\n';
    const n = this.scoreHistory.length;
    let score: number;

    for (let i = 0; i < n ; i++) {
      score = this.scoreHistory[i];
      outText = outText + this.getScoreText(score, i) + '\n';
    }

    return outText + this.getAverageScoreText();
  }

  getAverageScoreText() {
    return 'Points per move: ' + this.getAverageScore().toFixed(1);
  }

  getAverageScore() {
    if (this.scoreHistory.length === 0) {
      return 0;
    }

    let movesMade = Math.min(this.scoreHistory.length * showScoreFrequency, this.lastMove + 1);
    movesMade = Math.max(movesMade - startingMoves, 1)
    return this.scoreHistory[this.scoreHistory.length-1] / movesMade;
  }

  onCopy() {
    this.isCopied = true;
    setTimeout(this.resetCopy.bind(this), 1500);
  }

  resetCopy() {
    this.isCopied = false;
  }
}

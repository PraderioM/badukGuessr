import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {showScoreFrequency} from '../central-section/utils';
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
    if (nMoves >= this.lastMove) {
      return 'FINAL SCORE: ' + score.toString();
    } else {
      let outText = 'MOVE ' + nMoves.toString() + ': ' + score.toString();
      if (i>0) {
        let scoreDiff = score - this.scoreHistory[i - 1];
        outText = outText + " (+" + scoreDiff.toString() + ")";
      }
      return outText;
    }
  }

  getCompleteScoreText() {
    let outText = 'baduk Guessr #' + getDailyGameIndex() + 1 + '\n';
    outText = outText + this.game.blackPlayerName + this.game.blackPlayerRank + "(black)\nvs.\n";
    outText = outText + this.game.whitePlayerName + this.game.whitePlayerRank + "(white)\n\n";
    const n = this.scoreHistory.length;
    let score: number;

    for (let i = 0; i < n; i++) {
      score = this.scoreHistory[i];
      outText = outText + this.getScoreText(score, i) + '\n';
    }

    return outText + "\nhttps://praderiom.github.io/badukGuessr/";
  }

  onCopy() {
    this.isCopied = true;
    console.log('resetting time');
    setTimeout(this.resetCopy.bind(this), 1500);
  }

  resetCopy() {
    console.log('resetting completed');
    this.isCopied = false;
  }
}

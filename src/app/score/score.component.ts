import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {showScoreFrequency} from '../central-section/utils';
import {getDailyGame} from '../games/game.collection';
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
      return 'MOVE ' + nMoves.toString() + ': ' + score.toString();
    }
  }

  getCompleteScoreText() {
    let outText = '';
    const n = this.scoreHistory.length;
    let score: number;

    for (let i = 0; i < n - 1; i++) {
      score = this.scoreHistory[i];
      outText = outText + this.getScoreText(score, i) + '\n';
    }

    score = this.scoreHistory[n - 1];
    return outText + this.getScoreText(score, n - 1);
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

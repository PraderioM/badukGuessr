import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {showScoreFrequency} from '../central-section/utils';

@Component({
  selector: 'app-score',
  templateUrl: './score.component.html',
  styleUrls: ['./score.component.css']
})
export class ScoreComponent implements OnInit {
  @Output() closeTab = new EventEmitter<void>();
  @Output() restartGame = new EventEmitter<void>();
  @Input() lastMove: number;
  @Input() scoreHistory: number[];

  constructor() { }

  ngOnInit() {
  }

  hasGameEnded() {
    return showScoreFrequency * this.scoreHistory.length >= this.lastMove + 1;
  }

  getCloseText() {
    return this.hasGameEnded() ? 'RESTART' : 'CONTINUE';
  }

  processContinueClick() {
    if (this.hasGameEnded()) {
      this.restartGame.emit();
    } else {
      this.closeTab.emit();
    }
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
}

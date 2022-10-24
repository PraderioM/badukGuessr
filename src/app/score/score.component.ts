import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {showScoreFrequency} from '../central-section/utils';

@Component({
  selector: 'app-score',
  templateUrl: './score.component.html',
  styleUrls: ['./score.component.css']
})
export class ScoreComponent implements OnInit {
  @Output() closeTab = new EventEmitter<void>();
  @Input() lastMove: number;
  @Input() scoreHistory: number[];

  constructor() { }

  ngOnInit() {
  }

  getCloseText() {
    const gameEnded = showScoreFrequency * this.scoreHistory.length >= this.lastMove;
    return gameEnded ? 'RESTART' : 'CONTINUE';
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

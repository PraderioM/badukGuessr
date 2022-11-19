import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import { startingMoves } from '../utils';

@Component({
  selector: 'app-move-info',
  templateUrl: './move-info.component.html',
  styleUrls: ['./move-info.component.css']
})
export class MoveInfoComponent implements OnInit, OnChanges {
  @Output() showScore = new EventEmitter<void>();
  @Input() moveNumber: number = 0;
  @Input() lastMove: number = 0;
  @Input() score: number = 0;
  @Input() streak: number = 0;
  @Input() gameStarted: boolean = false;
  @Input() isReviewing: boolean = false;
  @Input() isGameEnd: boolean = false;
  @Input() gameResult: string = 'jigo';

  minSilverStreak = 5;
  minGoldenStreak = 10;
  showTotalScore = true;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    // Logic for resetting guesses on guess square size change.
    if (changes['score'] !== undefined && !changes['score'].firstChange) {
      const currentScore: number = changes['score'].currentValue;
      const previousScore: number = changes['score'].previousValue;

      // If thief game has started we need to initialize it by playing the first moves.
      if (previousScore != undefined && previousScore !== currentScore) {
        this.activateScoreAnimation();
      }
    }
  }

  isBlackTurn() {
    return this.moveNumber % 2 === 0;
  }

  showLoading() {
    return this.moveNumber < startingMoves && this.gameStarted && !this.isReviewing;
  }

  showMove() {
    return !this.showLoading() && this.gameStarted && !this.isGameEnd;
  }

  getStreakClass() {
    return {
      streak: true,
      bronze_streak: this.streak < this.minSilverStreak,
      silver_streak: this.streak >= this.minSilverStreak && this.streak < this.minGoldenStreak,
      gold_streak: this.streak >= this.minGoldenStreak
    };
  }

  activateScoreAnimation() {
    this.showTotalScore = false;
    setTimeout(this.resetShowTotalScore.bind(this), 2);
  }

  resetShowTotalScore() {
    this.showTotalScore = true;
  }
}

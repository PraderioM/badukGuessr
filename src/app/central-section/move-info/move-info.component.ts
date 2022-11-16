import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { startingMoves } from '../utils';

@Component({
  selector: 'app-move-info',
  templateUrl: './move-info.component.html',
  styleUrls: ['./move-info.component.css']
})
export class MoveInfoComponent implements OnInit {
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

  constructor() { }

  ngOnInit() {
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
      golden_streak: this.streak >= this.minGoldenStreak
    };
  }
}

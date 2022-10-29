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
  @Input() score: number = 0;
  @Input() gameStarted: boolean = false;
  @Input() isReviewing: boolean = false;
  @Input() isGameEnd: boolean = false;
  @Input() gameResult: string = 'jigo';

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
}

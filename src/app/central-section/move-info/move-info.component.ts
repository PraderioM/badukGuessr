import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { startingMoves } from '../utils';

@Component({
  selector: 'app-move-info',
  templateUrl: './move-info.component.html',
  styleUrls: ['./move-info.component.css']
})
export class MoveInfoComponent implements OnInit {
  @Output() showScore = new EventEmitter<void>();
  @Input() moveNumber: number;
  @Input() score: number;
  @Input() gameStarted: boolean;
  @Input() isReviewing: boolean;

  constructor() { }

  ngOnInit() {
  }

  isBlackTurn() {
    return this.moveNumber % 2 === 0;
  }

  showLoading() {
    return this.moveNumber < startingMoves && this.gameStarted && !this.isReviewing;
  }
}

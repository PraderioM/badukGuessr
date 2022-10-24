import {Component, Input, OnInit} from '@angular/core';
import { startingMoves } from '../utils';

@Component({
  selector: 'app-move-info',
  templateUrl: './move-info.component.html',
  styleUrls: ['./move-info.component.css']
})
export class MoveInfoComponent implements OnInit {
  @Input() moveNumber: number;
  @Input() score: number;
  @Input() gameStarted: boolean;
  startingMoves = startingMoves;

  constructor() { }

  ngOnInit() {
  }

  getPlayingColor() {
    return this.isBlackTurn() ? 'Black' : 'White';
  }

  isBlackTurn() {
    return this.moveNumber % 2 === 0;
  }

  getStoneColorStyle() {
    let gradient: string;
    if (this.isBlackTurn()) {
      gradient = 'radial-gradient(#cccccc, #4d4d4d, #000000, #000000)';
    } else {
      gradient = 'radial-gradient(white, #e6e6e6, #cecece, #d2d2d2)';
    }
    return {'background-image': gradient};
  }
}

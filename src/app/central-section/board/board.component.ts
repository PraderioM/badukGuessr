import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {faCheck, faXmark} from '@fortawesome/free-solid-svg-icons';
import {Move} from '../../games/models';
import {boardSize, guessNames, maxGuesses, startingMoves} from '../utils';
import {DeviceDetectorService} from 'ngx-device-detector';


@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {
  @Output() addGuess = new EventEmitter<Move>();
  @Output() removeGuess = new EventEmitter<Move>();
  @Input() moveNumber: number = 0;
  @Input() stonesInBoard: Move[] = [];
  @Input() guesses: Move[] = [];
  @Input() correctGuess: number = -1;

  hoveringColumn?: number = undefined;
  hoveringRow?: number = undefined;
  positions: number[][] = [];
  faCheck = faCheck;
  faX = faXmark;
  deviceService = new DeviceDetectorService(undefined);

  constructor() {
  }

  ngOnInit() {
    for (let i = 0; i < boardSize; i++) {
      for (let j = 0; j < boardSize; j++) {
        this.positions.push([i, j]);
      }
    }
  }

  setHoveringCell(row: number, column: number) {
    // We are not inserting hovering cell in mobile devices.
    if (this.deviceService.isMobile() || this.deviceService.isTablet()) {
      return;
    }

    this.hoveringRow = row;
    this.hoveringColumn = column;

  }

  removeHoveringCell(row: number, column: number) {
    // If the current hovering cell is still the one the mouse is leaving we remove it.
    if (this.hoveringRow === row && this.hoveringColumn === column) {
      this.hoveringRow = undefined;
      this.hoveringColumn = undefined;
    }
  }

  processGuess(row: number, column: number) {
    // Don't accept obviously invalid guesses.
    for (const stone of this.stonesInBoard) {
      if (stone.row === row && stone.column === column) {
        return;
      }
    }

    // If move is valid we need to either add it or remove it.
    const move = new Move('B', row, column);

    // If guess is clicked we remove it.
    for (const guess of this.guesses) {
      if (guess.row === row && guess.column === column) {
        this.removeGuess.emit(move);
        return;
      }
    }

    // If maximum number of guesses is already in play we do nothing.
    if (this.guesses.length === maxGuesses) {
      return;
    }

    // Otherwise we add the specified guess.
    this.addGuess.emit(new Move('B', row, column));
  }

  getHoveringStoneClass() {
    return {
      hover_stone: true,
      black_stone: this.moveNumber % 2 === 0,
      white_stone: this.moveNumber % 2 === 1
    };
  }

  showHoveringStone() {
    // Don't show before game start.
    if (this.moveNumber < startingMoves) {
      return false;
    }

    // Don't show hovering stone if there is no hovering.
    if (this.hoveringRow === undefined || this.hoveringColumn === undefined) {
      return false;
    }

    // Don't show hovering stones if another stone is in there.
    for (const stone of this.stonesInBoard) {
      if (stone.row === this.hoveringRow && stone.column === this.hoveringColumn) {
        return false;
      }
    }

    // Don't show hovering stone if it's on top of a guess.
    for (const guess of this.guesses) {
      if (guess.row === this.hoveringRow && guess.column === this.hoveringColumn) {
        return false;
      }
    }

    // Show in all other cases.
    return true;
  }

  getStoneClass(color: string) {
    return {
      stone: true,
      white_stone: color === 'W',
      black_stone: color === 'B'
    };
  }

  getGuessLetter(i: number) {
    return guessNames[i];
  }

  getLastStoneDotColor() {
    return this.moveNumber % 2 === 0 ? 'rgb(0,0,0,1)' : 'rgb(255,255,255,1)';
  }

  getPos(dim?: number) {
    if (dim === undefined) {
      return 0;
    } else {
      return (dim + 1) * 5
    }
  }

  isHovering(guess: Move) {
    // If the guess coincides with the hovering stone then the letter must be an X.
    return guess.row === this.hoveringRow && guess.column === this.hoveringColumn
  }

  guessUnresolved() {
    return this.correctGuess === -1;
  }

  isCorrectGuess(i: number) {
    return this.correctGuess === i;
  }
}

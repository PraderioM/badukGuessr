import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {faCheck, faXmark} from '@fortawesome/free-solid-svg-icons';
import {Move} from '../../games/models';
import {boardSize, guessNames, maxGuesses, maxHintSquareSize, startingMoves} from '../utils';
import {DeviceDetectorService} from 'ngx-device-detector';


@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css', '../central-section.component.css']
})
export class BoardComponent implements OnInit {
  @Output() addGuess = new EventEmitter<Move>();
  @Output() removeGuess = new EventEmitter<Move>();

  @Input() moveNumber: number = 0;
  @Input() hintStart: Move = new Move('B', boardSize, boardSize);
  @Input() hintSize: number = maxHintSquareSize;
  @Input() stonesInBoard: Move[] = [];
  @Input() guesses: Move[] = [];
  @Input() guessSquareSize: number = 1;
  @Input() correctGuessRow: number = -1;
  @Input() correctGuessCol: number = -1;
  @Input() isReviewing: boolean = false;

  hoveringColumn: number = boardSize + this.guessSquareSize;
  hoveringRow: number = boardSize + this.guessSquareSize;
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

  resetHoveringStone() {
    this.hoveringRow = boardSize + this.guessSquareSize;
    this.hoveringColumn = boardSize + this.guessSquareSize;
  }

  removeHoveringCell(row: number, column: number) {
    // If the current hovering cell is still the one the mouse is leaving we remove it.
    if (this.hoveringRow === row && this.hoveringColumn === column) {
      this.resetHoveringStone();
    }
  }

  getHoveringRows() {
    return this.getCenteredArithmeticProgression(this.hoveringRow, 1, this.guessSquareSize);
  }

  getHoveringCols() {
    return this.getCenteredArithmeticProgression(this.hoveringColumn, 1, this.guessSquareSize);
  }

  getHintRows() {
    return this.getArithmeticProgression(this.hintStart.row, 1, this.hintStart.row + this.hintSize);
  }

  getHintCols() {
    return this.getArithmeticProgression(this.hintStart.column, 1, this.hintStart.column + this.hintSize);
  }

  processGuess(row: number, column: number) {
    // Let's start by setting hovering cell to undefined since we don't want it to override what we are about to set in this cell.
    this.resetHoveringStone();

    // Don't accept obviously invalid guesses.
    let allGuessesPlayed = true;
    let guessPlayed = false;
    const lowHalf = Math.floor(this.guessSquareSize / 2);
    const bigHalf = Math.ceil(this.guessSquareSize / 2);
    for (let i = row - lowHalf; i < row + bigHalf; i++){
      for (let j = column - lowHalf; j < column + bigHalf; j++){
        guessPlayed = false;
        for (const stone of this.stonesInBoard) {
          if (stone.row === i && stone.column === j) {
            guessPlayed = true;
            break;
          }
        }
        allGuessesPlayed = allGuessesPlayed && guessPlayed;
      }
    }
    if (allGuessesPlayed) {
      return;
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

  showHint(row: number, col: number) {
    // Don't show hints that are on the outside of the board.
    return row < boardSize && col < boardSize;
  }

  showHoveringStone(row: number, col: number) {
    // Don't show before game start.
    if (this.moveNumber < startingMoves) {
      return false;
    }

    // Don't show hovering stones during review.
    if (this.isReviewing) {
      return false;
    }

    // Don't show hovering stone if there is no hovering.
    if (row >= boardSize || col >= boardSize) {
      return false;
    }

    // Don't show hovering stones if another stone is in there.
    for (const stone of this.stonesInBoard) {
      if (stone.row === row && stone.column === col) {
        return false;
      }
    }

    // Don't show hovering stone if it's on top of a guess.
    const lowHalf = Math.floor(this.guessSquareSize / 2);
    const bigHalf = Math.ceil(this.guessSquareSize / 2);
    for (const guess of this.guesses) {
      if (guess.row - lowHalf <= row && row < guess.row + bigHalf) {
        if (guess.column - lowHalf <= col && col < guess.column + bigHalf) {
          return false;
        }
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
    // If hovering center matches one of the guesses we return true otherwise we return false.
    return guess.row === this.hoveringRow && this.hoveringColumn === guess.column;
  }

  guessUnresolved() {
    return this.correctGuessRow === -1 && this.correctGuessCol === -1;
  }

  isCorrectGuess(guess: Move) {
    return this.correctGuessRow === guess.row && this.correctGuessCol === guess.column;
  }

  getSubGuesses(guessIndex: number) {
    // Get all guesses in the specified diameter that don't already belong to other guesses.
    const prevGuesses: Move[] = [];
    for (let i = 0; i < guessIndex; i++) {
      prevGuesses.push(this.guesses[i]);
    }


    const subGuesses: Move[] = [];
    const guess = this.guesses[guessIndex];
    let inPrevGuesses = false;
    const lowHalf = Math.floor(this.guessSquareSize / 2);
    const bigHalf = Math.ceil(this.guessSquareSize / 2);
    // Iterate over all guesses in the guess area.
    for (let i = guess.row - lowHalf; i < guess.row + bigHalf; i++) {
      for (let j = guess.column - lowHalf; j < guess.column + bigHalf; j++) {
        // Check that such guess does not belong to previous guesses.
        inPrevGuesses = false;
        for (let prevGuess of prevGuesses) {
          if (prevGuess.row - lowHalf <= i && i <prevGuess.row + bigHalf) {
            if (prevGuess.column - lowHalf <= j && j < prevGuess.column + bigHalf) {
              inPrevGuesses = true;
              break
            }
          }
        }

        // If guess does not belong ot any of the previous guesses we need to check if it corresponds to some stone in the board.
        if (!inPrevGuesses) {
          let alreadyPlayed = false;
          for (const stone of this.stonesInBoard) {
            if (stone.row === i && stone.column === j) {
              alreadyPlayed = true;
              break;
            }
          }
          if (!alreadyPlayed) {
            subGuesses.push(new Move(guess.color, i, j));
          }
        }
      }
    }

    return subGuesses;
  }

  getGuessOnBoardStyle() {
    return {
      intersection: true,
      letter_on_board: true,
      black_letter: this.moveNumber % 2 === 0,
      white_letter: this.moveNumber % 2 === 1
    };
  }

  getCenteredArithmeticProgression(start: number, step:number, length: number) {
    const lowHalf = Math.floor(length / 2);
    const bigHalf = Math.ceil(length / 2);
    return this.getArithmeticProgression(start - lowHalf, step, start + bigHalf);
  }
  getArithmeticProgression(start: number, step: number, limit: number) {
    const progression: number[] = [];
    for (let i = start; i < limit; i+=step) {
      progression.push(i);
    }
    return progression;
  }

  inBoard(guess: Move) {
    for (const stone of this.stonesInBoard) {
      if (stone.row === guess.row && stone.column === guess.column) {
        return true;
      }
    }
    return false;
  }
}

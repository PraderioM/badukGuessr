import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {getAllGuessPoints, getEarnedPoints, guessNames, maxGuesses} from '../utils';
import {Move} from '../../games/models';
import {faCaretLeft, faCaretRight, faCheck, faXmark} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-guess-bar',
  templateUrl: './guess-bar.component.html',
  styleUrls: ['./guess-bar.component.css', '../central-section.component.css', '../../app.component.css']
})
export class GuessBarComponent implements OnInit {
  @Output() resolveGuess = new EventEmitter<void>();
  @Output() navigateGame = new EventEmitter<number>();
  @Input() guesses: Move[] = [];
  @Input() guessSquareArea: number = 1;
  @Input() correctGuess = -1;
  @Input() isReviewing = false;

  guessColors = ['rgb(130, 194, 149)', 'rgb(146, 208, 149)', 'rgb(168, 217, 170)', 'rgb(190, 227, 191)'];
  allWrongGuessColor = 'rgb(255, 137, 158)';
  wrongGuessColor = 'rgb(204, 204, 204)';
  guessNames = guessNames;
  guessMargin = 1.5;
  allGuessPoints: number[] = [];
  faCaretRight = faCaretRight;
  faCaretLeft = faCaretLeft;
  faCheck = faCheck;
  faX = faXmark;

  constructor() { }

  ngOnInit() {
  }

  getGuessWidth(i: number) {
    const n = this.guesses.length;
    const relWidth: number = 2 * (n - i + 1) / (n * (n + 3));

    return (100 - (n + 1) * this.guessMargin) * relWidth;
  }

  getGuessBackgroundColor(i: number) {
    if (this.correctGuess === -1) {
      return this.guessColors[i];
    } else if (this.areAllGuessesWrong()) {
      return this.allWrongGuessColor;
    } else {
      return this.correctGuess === i ? this.guessColors[i] : this.wrongGuessColor;
    }
  }

  isCorrectGuess(i: number) {
    return this.correctGuess === i;
  }

  getEarnedPointsText() {
    // Get points earned due to guess.
    const points = getEarnedPoints(this.correctGuess, this.guesses.length, this.guessSquareArea);

    // If no points are earned we show nothing.
    if (points === 0) {
      return '';
    }

    // Otherwise we show a '+' sign together with the amount of points earned.
    return '+' + points.toString();
  }

  getGuessPoints() {
    if (this.guesses.length === 0) {
      this.allGuessPoints = [];
    } else {
      this.allGuessPoints = getAllGuessPoints(this.guesses.length, this.guessSquareArea);
    }
    return this.allGuessPoints;
  }

  isGuessUnresolved() {
    return this.correctGuess === -1;
  }

  areAllGuessesWrong() {
    return this.correctGuess === maxGuesses;
  }
}

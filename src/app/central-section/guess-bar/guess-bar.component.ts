import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {getEarnedPoints, getGuessPoints, guessNames, maxGuesses} from '../utils';
import {Move} from '../../games/models';

@Component({
  selector: 'app-guess-bar',
  templateUrl: './guess-bar.component.html',
  styleUrls: ['./guess-bar.component.css']
})
export class GuessBarComponent implements OnInit {
  @Output() resolveGuess = new EventEmitter<void>();
  @Output() navigateGame = new EventEmitter<number>();
  @Input() guesses: Move[];
  @Input() correctGuess;
  @Input() isReviewing;
  guessColors = ['rgb(130, 194, 149)', 'rgb(146, 208, 149)', 'rgb(168, 217, 170)', 'rgb(190, 227, 191)'];
  allWrongGuessColor = 'rgb(255, 137, 158)';
  wrongGuessColor = 'rgb(204, 204, 204)';
  guessNames = guessNames;
  guessMargin = 2.5;

  constructor() { }

  ngOnInit() {
  }

  getGuessWidth(i: number) {
    const n = this.guesses.length;
    const points = getGuessPoints(i, n);
    let totalPoints = 0;
    for (let j = 0; j < n; j++) {
      totalPoints += getGuessPoints(j, n);
    }

    return (100 - (n + 1) * this.guessMargin) * points / totalPoints;
  }

  getGuessBackgroundColor(i: number) {
    if (this.correctGuess === -1) {
      return this.guessColors[i];
    } else if (this.correctGuess === maxGuesses) {
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
    const points = getEarnedPoints(this.correctGuess, this.guesses.length);

    // If no points are earned we show nothing.
    if (points === 0) {
      return '';
    }

    // Otherwise we show a '+' sign together with the amount of points earned.
    return '+' + points.toString();
  }

  getGuessPoints(guessNumber: number) {
    return getGuessPoints(guessNumber, this.guesses.length);
  }
}

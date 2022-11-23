import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {showScoreFrequency, startingMoves} from '../central-section/utils';
import { getDailyGameIndex} from '../games/game.collection';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {faCopy} from '@fortawesome/free-solid-svg-icons';
import {dummyGame} from '../games/models';

@Component({
  selector: 'app-score',
  templateUrl: './score.component.html',
  styleUrls: ['./score.component.css', '../app.component.css']
})
export class ScoreComponent implements OnInit {
  @Output() closeTab = new EventEmitter<void>();
  @Output() restartGame = new EventEmitter<void>();

  @Input() lastMove: number = 361;
  @Input() averageScore: number = 0;
  @Input() percentCorrect: number = 0;
  @Input() totalHintsRequested: number = 0;
  @Input() longestStreak: number = 0;
  @Input() showScoreFrequency = showScoreFrequency;
  @Input() currentScore: number = 0;
  @Input() scoreHistory: number[] = [];
  @Input() guessHistory: number[] = [];
  @Input() madeGuesses: number = 0;
  @Input() game = dummyGame;
  @Input() gameIndex = getDailyGameIndex();
  @Input() attempt: number = 1;

  sgfFileUrl?: SafeUrl;
  isCopied: boolean = false;
  faCopy = faCopy;

  constructor(private sanitizer: DomSanitizer) {  }

  ngOnInit() {

    const blob = new Blob([this.game.convertToSGF()], {type: 'application/octet-stream'});

    this.sgfFileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
  }

  hasGameEnded() {
    return this.scoreHistory.length + startingMoves >= this.lastMove + 1;
  }

  getCloseText() {
    return this.hasGameEnded() ? 'CLOSE' : 'CONTINUE';
  }

  getCompleteScoreText() {
    const badukGuessrNumber = this.gameIndex + 1;
    let outText = 'BadukGuessr #' + badukGuessrNumber + '\n';
    outText = outText + this.game.blackPlayerName + " " + this.game.blackPlayerRank + " (black)\nvs.\n";
    outText = outText + this.game.whitePlayerName + " " + this.game.whitePlayerRank + " (white)\n";
    outText = outText + 'Attempt #' + this.attempt + '\n';
    const n = this.scoreHistory.length;

    // If there is nothing else to show we return now.
    if (n === 0) {
      return outText;
    }

    outText = outText + 'Hints used: ' + this.totalHintsRequested + '\n';
    outText = outText + 'Longest streak: ' + this.longestStreak + '\n\n';

    // Get all the data.
    const headerData = {'move': 'Move', 'score': 'Score', 'guesses': 'Correct'};

    const dataList = [headerData].concat(this.getShowData());
    const padding = 4;

    const moveLength = this.getMaxDataSize(dataList, 'move') + padding;
    const scoreLength = this.getMaxDataSize(dataList, 'score') + padding;

    for (let data of dataList) {
      outText = outText + this.getPaddedText(data['move'], moveLength);
      outText = outText + this.getPaddedText(data['score'], scoreLength);
      outText = outText + data['guesses'] + '\n';
    }

    outText = outText + '\n' + this.getAverageScoreText() + '\n';
    return outText + this.getCorrectPercentageText();
  }

  getMaxDataSize(dataList: {[key:string]: string}[], key: string) {
    let maxDataSize = 0;
    for (let data of dataList) {
      maxDataSize = Math.max(maxDataSize, data[key].length);
    }
    return maxDataSize;
  }

  getPaddedText(text: string, outLength: number) {
    let outText = text;
    const n = outText.length;
    const scalingFactor = 1.1;
    for (let i = 0; i < (outLength - n)*scalingFactor; i++) {
      outText = outText + ' ';
    }
    return outText;
  }

  getAverageScoreText() {
    return 'Points per move: ' + this.averageScore.toFixed(1);
  }

  onCopy() {
    this.isCopied = true;
    setTimeout(this.resetCopy.bind(this), 1500);
  }

  resetCopy() {
    this.isCopied = false;
  }

  getIncrementText(previous: number, current: number, showIncrement: boolean = true) {
    let outText = current.toString();
    if (showIncrement) {
      outText = outText + ' (';
      const increment = current - previous;
      const sign = increment>=0? '+' : '-';
      outText = outText + sign + increment.toString() + ')';
    }
    return outText;
  }

  getShowData() {
    if (this.scoreHistory.length === 0) {
      return [];
    }

    const dataList = [];
    let lastGuesses = 0;
    let lastScore = 0;
    let move = 0;
    const lastIndex = this.scoreHistory.length - 1
    for (let i = 0; i < lastIndex; i++) {
      move = i + 1 + startingMoves;
      if (move % showScoreFrequency === 0) {
        dataList.push(
          {
            'move': move.toString(),
            'score': this.getIncrementText(lastScore, this.scoreHistory[i], move > showScoreFrequency),
            'guesses': this.getIncrementText(lastGuesses, this.guessHistory[i], move > showScoreFrequency)
        });
        lastScore = this.scoreHistory[i];
        lastGuesses = this.guessHistory[i];
      }
    }

    // Add last move info.
    const nMoves = lastIndex + startingMoves + 1
    const isGameEnd = nMoves >= this.lastMove;
    const isFirstShow= nMoves <= showScoreFrequency;
    const moveText = isGameEnd? 'GAME END' : nMoves.toString();

    dataList.push(
      {
        'move': moveText,
        'score': this.getIncrementText(lastScore, this.scoreHistory[lastIndex], !isGameEnd && !isFirstShow),
        'guesses': this.getIncrementText(lastGuesses, this.guessHistory[lastIndex], !isGameEnd && !isFirstShow)
      });

    return dataList;
  }

  getCorrectPercentageText() {
    return 'Correct percentage: ' + Math.round(this.percentCorrect).toString() + '%';
  }
}

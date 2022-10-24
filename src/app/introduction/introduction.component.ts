import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {showScoreFrequency} from '../central-section/utils';

@Component({
  selector: 'app-introduction',
  templateUrl: './introduction.component.html',
  styleUrls: ['./introduction.component.css']
})
export class IntroductionComponent implements OnInit {
  @Output() startGame = new EventEmitter<void>();
  showScoreFrequency = showScoreFrequency;

  constructor() { }

  ngOnInit() {
  }

}

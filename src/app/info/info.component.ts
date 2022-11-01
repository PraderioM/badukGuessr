import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { faAt } from '@fortawesome/free-solid-svg-icons';
import {showScoreFrequency} from '../central-section/utils';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css', '../../styles.css']
})
export class InfoComponent implements OnInit {
  @Output() closeInfo = new EventEmitter<void>();
  @Input() blackPlayerRank: string = '9p';
  @Input() whitePlayerRank: string = '9p';
  @Input() blackPlayerName: string = 'B';
  @Input() whitePlayerName: string = 'W';
  @Input() gameDate: string = 'unknown';

  faAt = faAt;

  showScoreFrequency = showScoreFrequency;

  constructor() { }

  ngOnInit() {
  }
}

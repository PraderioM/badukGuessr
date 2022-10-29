import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent implements OnInit {
  @Output() closeInfo = new EventEmitter<void>();
  @Input() blackPlayerRank: string = '9p';
  @Input() whitePlayerRank: string = '9p';
  @Input() blackPlayerName: string = 'B';
  @Input() whitePlayerName: string = 'W';
  @Input() gameDate: string = 'unknown';

  constructor() { }

  ngOnInit() {
  }
}

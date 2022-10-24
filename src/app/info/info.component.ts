import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent implements OnInit {
  @Output() closeInfo = new EventEmitter<void>();
  @Input() blackPlayerRank: string;
  @Input() whitePlayerRank: string;
  @Input() blackPlayerName: string;
  @Input() whitePlayerName: string;
  @Input() gameDate: string;

  constructor() { }

  ngOnInit() {
  }
}

import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {
  @Output() startGame = new EventEmitter<void>();
  @Output() showIntroduction = new EventEmitter<void>();
  @Input() blackPlayerRank: string = '9p';
  @Input() whitePlayerRank: string = '9p';
  @Input() blackPlayerName: string = 'B';
  @Input() whitePlayerName: string = 'W';
  @Input() gameDate: string = 'unknown';

  constructor() { }

  ngOnInit() {
  }

}

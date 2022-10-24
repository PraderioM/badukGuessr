import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {
  @Output() startGame = new EventEmitter<void>();
  @Output() showIntroduction = new EventEmitter<void>();
  @Input() blackPlayerRank: string;
  @Input() whitePlayerRank: string;
  @Input() blackPlayerName: string;
  @Input() whitePlayerName: string;
  @Input() gameDate: string;

  constructor() { }

  ngOnInit() {
  }

}

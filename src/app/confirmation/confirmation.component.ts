import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css', '../app.component.css']
})
export class ConfirmationComponent implements OnInit {
  @Output() cancel = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {
  }

}

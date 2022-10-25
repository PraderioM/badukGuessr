import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-review-concluded',
  templateUrl: './review-concluded.component.html',
  styleUrls: ['./review-concluded.component.css']
})
export class ReviewConcludedComponent implements OnInit {
  @Output() closeTab = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {
  }

}

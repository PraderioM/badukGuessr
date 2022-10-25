import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewConcludedComponent } from './review-concluded.component';

describe('ReviewConcludedComponent', () => {
  let component: ReviewConcludedComponent;
  let fixture: ComponentFixture<ReviewConcludedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewConcludedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewConcludedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

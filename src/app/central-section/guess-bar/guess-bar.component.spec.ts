import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuessBarComponent } from './guess-bar.component';

describe('GuessBarComponent', () => {
  let component: GuessBarComponent;
  let fixture: ComponentFixture<GuessBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuessBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuessBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

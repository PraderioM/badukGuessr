import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MoveInfoComponent } from './move-info.component';

describe('MoveInfoComponent', () => {
  let component: MoveInfoComponent;
  let fixture: ComponentFixture<MoveInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MoveInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoveInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeSheetComponent } from './time-sheet.component';

describe('TimeSheetComponent', () => {
  let component: TimeSheetComponent;
  let fixture: ComponentFixture<TimeSheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimeSheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

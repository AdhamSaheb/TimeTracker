import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTimelogComponent } from './add-timelog.component';

describe('AddTimelogComponent', () => {
  let component: AddTimelogComponent;
  let fixture: ComponentFixture<AddTimelogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTimelogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTimelogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

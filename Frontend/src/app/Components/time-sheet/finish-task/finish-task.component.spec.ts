import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinishTaskComponent } from './finish-task.component';

describe('FinishTaskComponent', () => {
  let component: FinishTaskComponent;
  let fixture: ComponentFixture<FinishTaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinishTaskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinishTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

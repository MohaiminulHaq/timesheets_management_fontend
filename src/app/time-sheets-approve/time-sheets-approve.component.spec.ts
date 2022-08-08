import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeSheetsApproveComponent } from './time-sheets-approve.component';

describe('HomePageComponent', () => {
  let component: TimeSheetsApproveComponent;
  let fixture: ComponentFixture<TimeSheetsApproveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimeSheetsApproveComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimeSheetsApproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

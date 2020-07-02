/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LogTapComponent } from './log-tap.component';

describe('LogTapComponent', () => {
  let component: LogTapComponent;
  let fixture: ComponentFixture<LogTapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogTapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogTapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

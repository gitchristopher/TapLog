/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { StolComponent } from './stol.component';

describe('StolComponent', () => {
  let component: StolComponent;
  let fixture: ComponentFixture<StolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

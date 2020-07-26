/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SmenaComponent } from './smena.component';

describe('SmenaComponent', () => {
  let component: SmenaComponent;
  let fixture: ComponentFixture<SmenaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmenaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmenaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { UchetComponent } from './uchet.component';

describe('UchetComponent', () => {
  let component: UchetComponent;
  let fixture: ComponentFixture<UchetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UchetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UchetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

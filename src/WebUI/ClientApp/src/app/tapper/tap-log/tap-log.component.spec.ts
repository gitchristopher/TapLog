/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TapLogComponent } from './tap-log.component';

describe('TapLogComponent', () => {
  let component: TapLogComponent;
  let fixture: ComponentFixture<TapLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TapLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TapLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

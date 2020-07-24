/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ZaprosComponent } from './zapros.component';

describe('ZaprosComponent', () => {
  let component: ZaprosComponent;
  let fixture: ComponentFixture<ZaprosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZaprosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZaprosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

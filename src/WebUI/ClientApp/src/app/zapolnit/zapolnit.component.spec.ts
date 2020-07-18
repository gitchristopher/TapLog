/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ZapolnitComponent } from './zapolnit.component';

describe('ZapolnitComponent', () => {
  let component: ZapolnitComponent;
  let fixture: ComponentFixture<ZapolnitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZapolnitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZapolnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

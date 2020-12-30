/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ZapisSobytiyComponent } from './zapis-sobytiy.component';

describe('ZapisSobytiyComponent', () => {
  let component: ZapisSobytiyComponent;
  let fixture: ComponentFixture<ZapisSobytiyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZapisSobytiyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZapisSobytiyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

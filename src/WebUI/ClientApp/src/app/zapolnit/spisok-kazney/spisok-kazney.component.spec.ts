/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SpisokKazneyComponent } from './spisok-kazney.component';

describe('SpisokKazneyComponent', () => {
  let component: SpisokKazneyComponent;
  let fixture: ComponentFixture<SpisokKazneyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpisokKazneyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpisokKazneyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

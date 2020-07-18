/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SpisokFazComponent } from './spisok-faz.component';

describe('SpisokFazComponent', () => {
  let component: SpisokFazComponent;
  let fixture: ComponentFixture<SpisokFazComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpisokFazComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpisokFazComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TapListComponent } from './tap-list.component';

describe('TapListComponent', () => {
  let component: TapListComponent;
  let fixture: ComponentFixture<TapListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TapListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TapListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

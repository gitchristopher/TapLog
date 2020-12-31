/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ListTestComponent } from './list-test.component';

describe('ListTestComponent', () => {
  let component: ListTestComponent;
  let fixture: ComponentFixture<ListTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

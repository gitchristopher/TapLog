/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { QuerierComponent } from './querier.component';

describe('QuerierComponent', () => {
  let component: QuerierComponent;
  let fixture: ComponentFixture<QuerierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuerierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuerierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

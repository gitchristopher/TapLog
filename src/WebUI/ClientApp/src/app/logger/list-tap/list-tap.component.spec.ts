/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ListTapComponent } from './list-tap.component';

describe('ListTapComponent', () => {
  let component: ListTapComponent;
  let fixture: ComponentFixture<ListTapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListTapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

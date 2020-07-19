import { Component, OnInit, TemplateRef, Input, Output, EventEmitter } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { TestsClient, CreateTestCommand, ICreateTestCommand, TestDto, UpdateTestCommand } from '../../taplog-api';
import { style, animate, transition, trigger} from '@angular/animations';
import { AppState, TestsState } from '../../app.state';
import { Store } from '@ngrx/store';
import { selectTestsList } from './spisok-testov.reducers';
import { Observable } from 'rxjs';
import { selectSelectedStageId } from '../spisok-faz/spisok-faz.reducers';
import { CREATE_TEST_REQUEST, DELETE_TEST_REQUEST, UPDATE_TEST_REQUEST, DESELECT_TEST } from './spisok-testov.actions';

@Component({
  selector: 'app-spisok-testov',
  templateUrl: './spisok-testov.component.html',
  styleUrls: ['./spisok-testov.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [ style({opacity: 0 }), animate('300ms 300ms cubic-bezier(.17,.67,.88,.1)', style({opacity: 1 })) ]),
      transition(':leave', [ animate('300ms cubic-bezier(.17,.67,.88,.1)', style({opacity: 0 })) ])
    ])
  ]
})

export class SpisokTestovComponent implements OnInit {

  @Input() testsState: TestsState;
  @Output() select: EventEmitter<number> = new EventEmitter<number>();
  list$: Observable<TestDto[]>;
  selectedStageId: number;

  addTestModalRef: BsModalRef;
  addTestEditor: any = {};
  updateTestModalRef: BsModalRef;
  updateTestEditor: any = {};

  isChecked = false;
  isDisabled = false;
  debug = false;

  constructor(private modalService: BsModalService, private testsClient: TestsClient, private store: Store<AppState>) { }

  ngOnInit() {
    this.list$ = this.store.select(selectTestsList);
    this.store.select(selectSelectedStageId).subscribe((stageId => this.selectedStageId = Number(stageId)));
  }

  selectTest(e: number) {
    this.select.emit(e);
  }

  //#region UI functions

  makeListEditable(e: Event) {
    this.isChecked = !this.isChecked;
  }

  showAddTestModal(template: TemplateRef<any>): void {
    this.addTestModalRef = this.modalService.show(template);
    setTimeout(() => document.getElementById('title').focus(), 250);
  }

  hideAddTestModal(): void {
    this.addTestModalRef.hide();
    this.addTestEditor = {};
  }

  showUpdateTestModal(template: TemplateRef<any>, name: string): void {
    this.updateTestEditor.title = name;
    this.updateTestModalRef = this.modalService.show(template);
    setTimeout(() => document.getElementById('updateTitle').focus(), 250);
  }

  hideUpdateTestModal(): void {
    this.updateTestModalRef.hide();
    this.updateTestEditor = {};
  }
  //#endregion UI functions

  createTest() {
    const text: string = this.addTestEditor.title as string;
    if (text.trim().length > 0) {
      const iTest: ICreateTestCommand = {jiraTestNumber: text.trim(), stageId: Number(this.selectedStageId)};
      const test = CreateTestCommand.fromJS(iTest);
      this.store.dispatch(CREATE_TEST_REQUEST({test: test}));
    }
    this.hideAddTestModal();
  }

  deleteTest(id: number) {
    if (confirm('All taps will be lost! Are you sure to delete the test? ' + id)) {
      if (this.testsState.list.find(x => x.id === id)) {
        this.store.dispatch(DELETE_TEST_REQUEST({testId: id}));
        this.store.dispatch(DESELECT_TEST());
      }
    }
  }

  updateTestName() {
    const text: string = this.updateTestEditor.title as string;
    const testId = Number(this.testsState.selectedId);
    const newTitle = text.trim();
    if (newTitle.length > 0) {
      const updatedTest = new UpdateTestCommand({id: testId, jiraTestNumber: newTitle});
      this.store.dispatch(UPDATE_TEST_REQUEST({stageId: Number(this.selectedStageId), testId: testId, testUpdate: updatedTest}));
      this.store.dispatch(DESELECT_TEST());
    }
    this.hideUpdateTestModal();
  }
}

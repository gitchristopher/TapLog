import { Component, OnInit, TemplateRef } from '@angular/core';
import { style, animate, transition, trigger } from '@angular/animations';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { TestsClient, CreateTestCommand, ICreateTestCommand, TestDto, UpdateTestCommand, StageDto } from '../../taplog-api';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.state';
import { selectSelectedStageId } from '../spisok-faz/spisok-faz.selectors';
import { selectSelectedTestId, selectTestsList, selectTestsLoading } from './spisok-testov.reducers';
import { CREATE_TEST_REQUEST, DELETE_TEST_REQUEST, UPDATE_TEST_REQUEST, DESELECT_TEST, SELECT_TEST, LOAD_TESTS_REQUEST } from './spisok-testov.actions';

@Component({
  selector: 'app-spisok-testov',
  templateUrl: './spisok-testov.component.html',
  styleUrls: ['./spisok-testov.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [style({ opacity: 0 }), animate('300ms 300ms cubic-bezier(.17,.67,.88,.1)', style({ opacity: 1 }))]),
      transition(':leave', [animate('300ms cubic-bezier(.17,.67,.88,.1)', style({ opacity: 0 }))])
    ])
  ]
})

export class SpisokTestovComponent implements OnInit {

  tests$: Observable<TestDto[]>;
  loading$: Observable<boolean>;

  selectedStageId: number;
  selectedTestId: number;

  addTestModalRef: BsModalRef;
  addTestEditor: any = {};
  updateTestModalRef: BsModalRef;
  updateTestEditor: any = {};

  isChecked = false;
  isDisabled = false;
  debug = false;

  constructor(private modalService: BsModalService, private testsClient: TestsClient, private store: Store<AppState>) {
    this.tests$ = this.store.select(selectTestsList);
    this.loading$ = this.store.select(selectTestsLoading);
  }

  ngOnInit() {
    this.store.select(selectSelectedStageId).subscribe((stageId => {
      if (stageId !== undefined) {
        this.selectedStageId = stageId;
        this.store.dispatch(LOAD_TESTS_REQUEST({ stageId }));
      }
    }));
    this.store.select(selectSelectedTestId).subscribe((testId => this.selectedTestId = testId));
  }

  makeListEditable(e: Event) {
    this.isChecked = !this.isChecked;
  }

  selectTest(e: TestDto) {
    this.store.dispatch(SELECT_TEST({ testId: e.id }));
  }

  createTest() {
    const stageId = this.selectedStageId;
    const jiraTestNumber: string = (this.addTestEditor.title as string).trim();
    if (jiraTestNumber.length > 0) {
      // TODO: why 2 lines for creation instead of new CreateTestCommand()?
      const iTest: ICreateTestCommand = { jiraTestNumber, stageId };
      const test = CreateTestCommand.fromJS(iTest);
      this.store.dispatch(CREATE_TEST_REQUEST({ test: test }));
    }
    this.hideAddTestModal();
  }

  deleteTest(id: number) {
    if (confirm('All taps will be lost! Are you sure to delete the test? ' + id)) {
      this.store.dispatch(DELETE_TEST_REQUEST({ testId: id, stageId: this.selectedStageId }));
      this.store.dispatch(DESELECT_TEST());
    }
  }

  updateTestName() {
    const stageId = this.selectedStageId;
    const testId = this.selectedTestId;
    const jiraTestNumber = (this.updateTestEditor.title as string).trim();
    if (jiraTestNumber.length > 0) {
      const testUpdate = new UpdateTestCommand({ id: testId, jiraTestNumber });
      this.store.dispatch(UPDATE_TEST_REQUEST({ stageId, testId, testUpdate }));
      this.store.dispatch(DESELECT_TEST());
    }
    this.hideUpdateTestModal();
  }

  //#region MODAL FUNCTIONS
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
  //#endregion MODAL FUNCTIONS
}

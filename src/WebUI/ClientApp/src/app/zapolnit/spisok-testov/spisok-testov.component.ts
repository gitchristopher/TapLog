import { Component, OnInit, TemplateRef } from '@angular/core';
import { style, animate, transition, trigger } from '@angular/animations';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { TestsClient, CreateTestCommand, ICreateTestCommand, TestDto, UpdateTestCommand, StageDto } from '../../taplog-api';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.state';
import { selectSelectedStageId } from '../spisok-faz/spisok-faz.selectors';
import { selectSelectedTestId, selectTestsList, selectTestsLoading } from './spisok-testov.selectors';
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

  tests$: Observable<TestDto[]>;  // For list in HTML
  loading$: Observable<boolean>;  // For HTML

  selectedStageId: number;        // For crud and state management
  selectedTestId: number;         // For crud and state management

  addTestModalRef: BsModalRef;    // For Modals in HTML
  addTestEditor: any = {};        // For crud and modals in HTML
  updateTestModalRef: BsModalRef; // For Modals in HTML
  updateTestEditor: any = {};     // For crud and modals in HTML

  isChecked = false;              // Crud toggle in HTML
  isDisabled = true;              // Crud toggle
  debug = false;

  constructor(private modalService: BsModalService, private testsClient: TestsClient, private store: Store<AppState>) {
    this.tests$ = this.store.select(selectTestsList);
    this.loading$ = this.store.select(selectTestsLoading);
  }

  ngOnInit() {
    this.store.select(selectSelectedTestId).subscribe((testId => this.selectedTestId = testId));
    this.store.select(selectSelectedStageId).subscribe((stageId => {
      if (stageId !== undefined) {
        // gives access to crud functions since a valid stageId has been provided
        this.isDisabled = false;
        this.selectedStageId = stageId;
        this.store.dispatch(LOAD_TESTS_REQUEST({ stageId }));
      }
    }));
  }

  /**
   * For displaying buttons hidden with the toggle.
   */
  makeListEditable(e: Event) {
    this.isChecked = !this.isChecked;
  }

  /**
   * Updates the state with the newly selected TEST.
   */
  selectTest(e: TestDto) {
    if (e.id !== this.selectedTestId) {
      this.store.dispatch(SELECT_TEST({ testId: e.id }));
    }
  }

  /**
   * Allows for the creation of a TEST.
   * Values based on Form input and currently selected STAGE in state.
   */
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

  /**
   * Allows for the deletion of a TEST.
   */
  deleteTest(id: number) {
    if (confirm('All taps will be lost! Are you sure to delete the test? ' + id)) {
      this.store.dispatch(DELETE_TEST_REQUEST({ testId: id, stageId: this.selectedStageId }));
      this.store.dispatch(DESELECT_TEST());
    }
  }

  /**
   * Allows for the update of a TEST's name, its only editable property.
   * Values based on Form input and currently selected STAGE & TEST in state.
   */
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

  /**
   * Shows the add TEST modal.
   */
  showAddTestModal(template: TemplateRef<any>): void {
    this.addTestModalRef = this.modalService.show(template);
    setTimeout(() => document.getElementById('title').focus(), 250);
  }

  /**
   * Hides the add TEST modal.
   */
  hideAddTestModal(): void {
    this.addTestModalRef.hide();
    this.addTestEditor = {};
  }

  /**
   * Shows the update TEST modal.
   */
  showUpdateTestModal(template: TemplateRef<any>, name: string): void {
    this.updateTestEditor.title = name;
    this.updateTestModalRef = this.modalService.show(template);
    setTimeout(() => document.getElementById('updateTitle').focus(), 250);
  }

  /**
   * Hides the update TEST modal.
   */
  hideUpdateTestModal(): void {
    this.updateTestModalRef.hide();
    this.updateTestEditor = {};
  }
  //#endregion MODAL FUNCTIONS
}

import { Component, OnInit } from '@angular/core';
import { style, animate, transition, trigger } from '@angular/animations';
import { TestDto, TestsClient, CreateTestExecutionCommand, TestExecutionsClient, TestExecutionDto } from 'src/app/taplog-api';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { selectSelectedTest } from '../spisok-testov/spisok-testov.selectors';
import { selectExecutionsForSelectedTest, selectSelectedExecutionId, selectStageTest } from './spisok-kazney.selectors';
import { CREATE_EXECUTION_REQUEST, DESELECT_EXECUTION, DELETE_EXECUTION_REQUEST, SELECT_EXECUTION, LOAD_EXECUTIONS_REQUEST, CLEAR_EXECUTIONS } from './spisok-kazney.actions';

@Component({
  selector: 'app-spisok-kazney',
  templateUrl: './spisok-kazney.component.html',
  styleUrls: ['./spisok-kazney.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [style({ opacity: 0 }), animate('300ms 400ms ease-in-out', style({ opacity: 1 }))])
    ])
  ]
})

export class SpisokKazneyComponent implements OnInit {

  lists$: Observable<TestExecutionDto[]>; // For list in HTML

  selectedTest: TestDto;        // For title in HTML
  selectedExecutionId: number;  // For deleting in HTML

  selectedStageId: number;      // For creating new TestExecution & management of state
  selectedTestId: number;       // For creating new TestExecution & management of state

  isChecked = false;            // Crud toggle
  isDisabled = true;            // Crud toggle
  debug = false;

  constructor(private testsClient: TestsClient, private executionsClient: TestExecutionsClient, private store: Store<AppState>) {
    this.lists$ = store.select(selectExecutionsForSelectedTest);
  }

  ngOnInit() {
    this.store.select(selectSelectedTest).subscribe((test => this.selectedTest = test));
    this.store.select(selectSelectedExecutionId).subscribe((executionId => this.selectedExecutionId = executionId));
    this.store.select(selectStageTest).subscribe((({ testId, stageId }) => {
      this.manageExecutionList(testId, stageId);
    }));
  }

  /**
   * The execution list needs to be populated only when there is a valid testId/stageId selected.
   * If one of these values is invalid then the list needs to be cleared.
   */
  private manageExecutionList(testId: number, stageId: number) {

    // Only send requests when input is valid (input are integers).
    // Block access to crud functions when invalid.
    if (Number.isInteger(testId) && Number.isInteger(stageId)) {

      // User has selected a new stage so remove the executions as they are no longer valid.
      // Execution list needs to be refreshed as it is based on stageID & testID
      if (stageId != this.selectedStageId && Number.isInteger(this.selectedStageId)) {
          this.store.dispatch(CLEAR_EXECUTIONS());
      }

      // Get the execution list for the newly selected test when the user is clicking between tests within the same stage.
      if (testId != this.selectedTestId) {
        this.store.dispatch(LOAD_EXECUTIONS_REQUEST({stageId: stageId, testId: testId}));
        if (this.selectedExecutionId) {
          this.store.dispatch(DESELECT_EXECUTION());
        }
      }

      // This enables the toggle, the toggle allows for creation and deletion of executions.
      // These functions require both the TestId & StageId, therefor its only enabled when both are ints (valid).
      this.isDisabled = false;
    } else {
      // Toggle funcations disabled as TestId || StageId for creations/deletion is not available.
      this.isChecked = false;
      this.isDisabled = true;
    }

    this.selectedTestId = testId;
    this.selectedStageId = stageId;
  }

  /**
   * Updates the state with the newly selected EXECUTION.
   */
  selectExecution(e: TestExecutionDto) {
    this.store.dispatch(SELECT_EXECUTION({ executionId: e.id }));
  }

  /**
   * For displaying buttons hidden with the toggle.
   */
  makeListEditable(e: Event) {
    this.isChecked = !this.isChecked;
  }

  /**
   * Allows for the creation of an EXECUTION.
   * Values based on currently selected STAGE & TEST in state.
   */
  createExecution() {
    const execution = new CreateTestExecutionCommand({ stageId: this.selectedStageId, testId: this.selectedTestId });
    this.store.dispatch(CREATE_EXECUTION_REQUEST({ execution: execution }));
  }

  /**
   * Allows for the deletion of an EXECUTION.
   */
  deleteExecution(id: number) {
    if (confirm('All taps will be lost! Are you sure to delete the execution? ' + id)) {
      this.store.dispatch(DELETE_EXECUTION_REQUEST({ executionId: id }));
      this.store.dispatch(DESELECT_EXECUTION());
    }
  }
}

import { Component, ViewChild, OnInit } from '@angular/core';
import { StagesClient, CreateTestCommand, ICreateTestCommand, TestDto,
         StageDto, ITestExecutionDto2, TestsClient, TapDto2, TestExecutionDto2 } from '../taplog-api';
import { Store, select, createSelector, createFeatureSelector } from '@ngrx/store';
import { AppState, StagesState, TestsState, ExecutionsState } from '../app.state';
import { LOAD_STAGES_FAIL, LOAD_STAGES_REQUEST, LOAD_STAGES_SUCCESS, SELECT_STAGE } from './spisok-faz/spisok-faz.actions';
import { Observable } from 'rxjs';
import { LOAD_TESTS_REQUEST, SELECT_TEST } from './spisok-testov/spisok-testov.actions';
import { LOAD_EXECUTIONS_REQUEST, SELECT_EXECUTION } from './spisok-kazney/spisok-kazney.actions';
import { selectSelectedStageId } from './spisok-faz/spisok-faz.reducers';
import { selectSelectedTestId } from './spisok-testov/spisok-testov.reducers';
import { selectSelectedExecutionId } from './spisok-kazney/spisok-kazney.reducers';

@Component({
  selector: 'app-zapolnit',
  templateUrl: './zapolnit.component.html',
  styleUrls: ['./zapolnit.component.css']
})
export class ZapolnitComponent implements OnInit {
  stages$: Observable<StagesState>;
  tests$: Observable<TestsState>;
  executions$: Observable<ExecutionsState>;
  selectedStage$: Observable<string | number>;
  selectedTest$: Observable<string | number>;
  selectedExecution$: Observable<string | number>;
  selectedStageId: number;

  // stageList: StageDto[];
  // selectedStage: StageDto;
  testList: TestDto[];
  selectedTest: TestDto;
  tapsList: TapDto2[];
  selectedExecution: TestExecutionDto2;

  constructor(private stagesClient: StagesClient, private testsClient: TestsClient, private store: Store<AppState>) {
    this.stages$ = this.store.pipe(select(state => state.stages));
    this.tests$ = this.store.pipe(select(state => state.tests));
    this.executions$ = this.store.pipe(select(state => state.executions));
  }

  ngOnInit(): void {
    this.store.dispatch(LOAD_STAGES_REQUEST());
    this.selectedStage$ = this.store.select(selectSelectedStageId);
    this.selectedTest$ = this.store.select(selectSelectedTestId);
    this.selectedExecution$ = this.store.select(selectSelectedExecutionId);
    this.store.select(selectSelectedStageId).subscribe((stageId => this.selectedStageId = Number(stageId)));
  }

  selectStage(idFromStageList: number): void {
    this.store.dispatch(SELECT_STAGE({stageId: idFromStageList}));
    this.store.dispatch(LOAD_TESTS_REQUEST({stageId: idFromStageList}));
  }

  selectTest(testId: number): void {
    this.store.dispatch(SELECT_TEST({testId: testId}));
    this.store.dispatch(LOAD_EXECUTIONS_REQUEST({testId: testId, stageId: this.selectedStageId}));
  }

  selectExecution(executionId: number): void {
    this.store.dispatch(SELECT_EXECUTION({executionId}));
    // this.store.dispatch(LOAD_TAPS_REQUEST({executionId: executionId}));
  }
}

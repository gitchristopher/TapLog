import { Component, OnInit, Input, OnChanges, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { StageDto, TestDto, ITestExecutionDto2, TestsClient,
          TestExecutionDto2, CreateTestExecutionCommand, TestExecutionsClient, TestExecutionDto, TapDto2 } from 'src/app/taplog-api';
import { faPlus, faEllipsisH, faPlusSquare, faSmile, faDizzy, faMinusSquare } from '@fortawesome/free-solid-svg-icons';
import {style, state, animate, transition, trigger} from '@angular/animations';
import { Store } from '@ngrx/store';
import { AppState, ExecutionsState } from 'src/app/app.state';
import { selectTestsList, selectSelectedTestId, selectSelectedTest } from '../spisok-testov/spisok-testov.reducers';
import { selectSelectedStageId } from '../spisok-faz/spisok-faz.reducers';
import { Observable } from 'rxjs';
import { selectExecutionsList, selectSelectedExecutionId } from './spisok-kazney.reducers';
import { CREATE_EXECUTION_REQUEST, DESELECT_EXECUTION, DELETE_EXECUTION_REQUEST } from './spisok-kazney.actions';

@Component({
  selector: 'app-spisok-kazney',
  templateUrl: './spisok-kazney.component.html',
  styleUrls: ['./spisok-kazney.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [ style({opacity: 0 }), animate('300ms 400ms ease-in-out', style({opacity: 1 })) ])
    ])
  ]
})

export class SpisokKazneyComponent implements OnInit {

  @Input() executionsState: ExecutionsState;
  @Output() select: EventEmitter<number> = new EventEmitter<number>();
  lists$: Observable<TestExecutionDto[]>;
  selectedExecutionId: number;
  selectedStageId: number;
  selectedTestId: number;
  selectedTest: TestDto;

  isChecked = false;
  isDisabled = false;

  constructor(private testsClient: TestsClient, private executionsClient: TestExecutionsClient, private store: Store<AppState>) { }

  ngOnInit() {
    this.lists$ = this.store.select(selectExecutionsList);
    this.store.select(selectSelectedExecutionId).subscribe((executionId => this.selectedExecutionId = Number(executionId)));
    this.store.select(selectSelectedStageId).subscribe((stageId => this.selectedStageId = Number(stageId)));
    this.store.select(selectSelectedTestId).subscribe((testId => this.selectedTestId = Number(testId)));
    this.store.select(selectSelectedTest).subscribe((test => this.selectedTest = test));
  }

  selectExecution(e: number) {
    this.select.emit(e);
  }

  makeListEditable(e: Event) {
    this.isChecked = !this.isChecked;
  }

  createExecution() {
    const execution = new CreateTestExecutionCommand({stageId: this.selectedStageId, testId: this.selectedTestId});
    this.store.dispatch(CREATE_EXECUTION_REQUEST({execution: execution}));
  }

  deleteExecution(id: number) {
    if (confirm('All taps will be lost! Are you sure to delete the execution? ' + id)) {
      this.store.dispatch(DELETE_EXECUTION_REQUEST({executionId: id}));
      this.store.dispatch(DESELECT_EXECUTION());
    }
  }
}

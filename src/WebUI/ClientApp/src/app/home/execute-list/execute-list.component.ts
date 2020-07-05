import { Component, OnInit, Input, OnChanges, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { StageDto, TestDto, ITestExecutionDto2, TestsClient,
          TestExecutionDto2, CreateTestExecutionCommand, TestExecutionsClient, TestExecutionDto, TapDto2 } from 'src/app/taplog-api';
import { faPlus, faEllipsisH, faPlusSquare, faSmile, faDizzy } from '@fortawesome/free-solid-svg-icons';
import {style, state, animate, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-execute-list',
  templateUrl: './execute-list.component.html',
  styleUrls: ['./execute-list.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [ style({opacity: 0 }), animate('300ms 400ms ease-in-out', style({opacity: 1 })) ]),
      // transition(':leave', [ animate('300ms ease-in-out', style({opacity: 0 })) ])
    ])
  ]
})
export class ExecuteListComponent implements OnInit, OnChanges {

  testExecutions: ITestExecutionDto2[] = [];
  testDeatil: TestDto;
  selectedExecution: TestExecutionDto2;
  // icon
  faPlusSquare = faPlusSquare;

  @Input() selectedStage: StageDto;
  @Input() selectedTest: TestDto;
  // tslint:disable-next-line: no-output-on-prefix
  @Output() onSelect: EventEmitter<TestExecutionDto2> = new EventEmitter<TestExecutionDto2>();
  select(execution: TestExecutionDto2) {
    this.selectedExecution = execution;
    this.onSelect.emit(execution);
    // this.selectedTest = this.testList.find(t => t.id === e);
    console.log('selected exe-list taps for exe id: ' + execution.id);
  }

  constructor(private testsClient: TestsClient, private executionsClient: TestExecutionsClient) { }

  ngOnInit() {
    this.getExecutions(this.selectedTest);
    console.log('on init in execute list' + this.selectedTest);
  }

  ngOnChanges(changes: SimpleChanges) {
    // if (this.selectedTest !== null) {
      for (const propName in changes) {
        if (changes.hasOwnProperty(propName)) {
          switch (propName) {
            case 'selectedTest': {
              this.getExecutions(this.selectedTest);
              console.log('case selectedTest');
            }
            break;
            case 'selectedStage': {
              this.testExecutions = null;
              this.testDeatil = null;
              this.selectedExecution = null;
              console.log('case selectedStage');
            break;
            }
          }
        }
      }
      console.log('on change in the execute list' + this.selectedTest?.jiraTestNumber);
    // }
  }

  // selectExecution(execution: TestExecutionDto2): void {
  //   this.selectedExecution = execution;
  //   console.log(execution.taps);
  // }

  getExecutions(test: TestDto): void {
    if (test !== null && test !== undefined) {
      this.testExecutions = [];
      this.testsClient.getDetailedTest(test.id).subscribe(
        result => {
            this.testDeatil = result;
            const selectedStageTestExecutions = result.stageTests.filter(x => x.stageId === this.selectedStage.id);
            selectedStageTestExecutions.forEach(element => {
              element.testExecutions.forEach(execution => {
                this.testExecutions.push(execution);
              });
            });
        },
        error => console.error(error)
      );
    }
  }

  createExecution() {
    const execution = new CreateTestExecutionCommand({stageId: this.selectedStage.id, testId: this.selectedTest.id});
    console.log('creating execution' + execution.toJSON);

    this.executionsClient.create(execution).subscribe(result => {
      const newExecution = new TestExecutionDto2({id: result});
      this.select(newExecution);
      this.testExecutions.push(newExecution);
    },
    error => {
      console.log('errors while creating execution' + error);
    });
  }
}

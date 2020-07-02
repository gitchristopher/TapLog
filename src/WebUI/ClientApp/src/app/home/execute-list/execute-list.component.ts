import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { StageDto, TestDto, ITestExecutionDto2, TestsClient, TestExecutionDto2 } from 'src/app/taplog-api';

@Component({
  selector: 'app-execute-list',
  templateUrl: './execute-list.component.html',
  styleUrls: ['./execute-list.component.css']
})
export class ExecuteListComponent implements OnInit, OnChanges {

  testExecutions: ITestExecutionDto2[] = [];
  testDeatil: TestDto;
  selectedExecution: TestExecutionDto2;
  @Input() selectedStage: StageDto;
  @Input() selectedTest: TestDto;

  constructor(private testsClient: TestsClient) { }

  ngOnInit() {
    this.getExecutions(this.selectedTest);
    console.log('on init' + this.selectedTest);
  }
  ngOnChanges() {
    this.getExecutions(this.selectedTest);
    console.log('on change' + this.selectedTest);
  }

  getExecutions(test: TestDto): void {

    if (test !== undefined) {
      this.testExecutions = [];
      this.testsClient.getDetailedTest(test?.id).subscribe(
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

  selectExecution(execution: TestExecutionDto2): void {
    this.selectedExecution = execution;
    console.log(execution.taps);
  }
}

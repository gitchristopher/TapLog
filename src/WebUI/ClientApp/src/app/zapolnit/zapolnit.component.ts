import { Component, ViewChild, OnInit } from '@angular/core';
import { StagesClient, CreateTestCommand, ICreateTestCommand, TestDto,
         StageDto, ITestExecutionDto2, TestsClient, TapDto2, TestExecutionDto2 } from '../taplog-api';

@Component({
  selector: 'app-zapolnit',
  templateUrl: './zapolnit.component.html',
  styleUrls: ['./zapolnit.component.css']
})
export class ZapolnitComponent implements OnInit {

  stageList: StageDto[];
  selectedStage: StageDto;
  testList: TestDto[];
  selectedTest: TestDto;
  tapsList: TapDto2[];
  selectedExecution: TestExecutionDto2;

  constructor(private stagesClient: StagesClient, private testsClient: TestsClient) {
    stagesClient.getAll().subscribe(
      result => {
          if (result.length) {
            this.stageList = result;
            const currentStage = this.stageList.find(s => s.isCurrent === true);
            if (this.selectedStage === undefined) {
              this.selectStage(currentStage.id);
            }
          }
      },
      error => console.error(error)
    );
  }

  ngOnInit(): void {
    // throw new Error('Method not implemented.');
  }

  // Id passed by the <app-stage-list> components event emitter "@Output() onSelect"
  selectStage(idFromStageList: number): void {
    this.selectedExecution = null;
    // this.selectedTest = null;
    this.selectedStage = this.stageList.find(s => s.id === Number(idFromStageList));
    this.testsClient.getAll(idFromStageList).subscribe(
      result => {
          this.testList = result;
      },
      error => console.error(error)
    );
  }

  // Id passed by the <app-test-list> components event emitter "@Output() onSelect"
  selectTest(idFromTestList: number): void {
    this.selectedExecution = null;
    this.selectedTest = this.testList.find(t => t.id === Number(idFromTestList));
  }


  selectExecution(execution: TestExecutionDto2): void {
    this.selectedExecution = execution;
  }

}

import { Component, OnInit } from '@angular/core';
import { StagesClient, TestDto, StageDto, TestsClient, TapDto2, TestExecutionDto2 } from '../taplog-api';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-tapper',
  templateUrl: './tapper.component.html',
  styleUrls: ['./tapper.component.css']
})
export class TapperComponent implements OnInit {

  stageList: StageDto[];
  selectedStage: StageDto;
  testList: TestDto[];
  selectedTest: TestDto;
  tapsList: TapDto2[];
  selectedExecution: TestExecutionDto2;

  constructor(private stagesClient: StagesClient, private testsClient: TestsClient, private snackBar: MatSnackBar) {
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
      error => {
        this.snackBar.open(error.title, null, {duration: 3000});
      }
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
    this.testsClient.getTestsForStage(idFromStageList).subscribe(
      result => {
          this.testList = result;
      },
      error => {
        this.snackBar.open(error.title, null, {duration: 3000});
      }
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

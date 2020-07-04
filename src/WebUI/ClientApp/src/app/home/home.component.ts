import { Component, ViewChild, OnInit } from '@angular/core';
import { TestListComponent } from './test-list/test-list.component';
import { StagesClient, CreateTestCommand, ICreateTestCommand, TestDto,
         StageDto, ITestExecutionDto2, TestsClient, TapDto2, TestExecutionDto2 } from '../taplog-api';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  stageList: StageDto[];
  selectedStage: StageDto;

  testList: TestDto[];
  selectedTest: TestDto;

  tapsList: TapDto2[];
  selectedExecution: TestExecutionDto2;
  // @ViewChild(TestListComponent) testlist: TestListComponent;
  // refresh() {
  //   this.testlist.generateData();
  // }

  constructor(private stagesClient: StagesClient, private testsClient: TestsClient) {
    stagesClient.getAll().subscribe(
      result => {
          if (result.length) {
            this.stageList = result.sort(function(a, b) {return (Number(a.isCurrent) - Number(b.isCurrent)); }).reverse();
            console.log(this.stageList);
            if (this.selectedStage === undefined) {
              this.selectStage(this.stageList[0].id);
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
    this.selectedTest = null;
    this.selectedStage = this.stageList.find(s => s.id === Number(idFromStageList));
    console.log('home comp - select stage () ' + this.selectedStage);
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
    console.log('home comp - select test () ' + this.selectedTest);
    // this.testsClient.getAll(stage.id).subscribe(
    //   result => {
    //       this.testList = result;
    //   },
    //   error => console.error(error)
    // );
  }


  selectExecution(execution: TestExecutionDto2): void {
    this.selectedExecution = execution;
    console.log('home comp - select execution () ' + this.selectedExecution.id);
    // this.testsClient.getAll(stage.id).subscribe(
    //   result => {
    //       this.testList = result;
    //   },
    //   error => console.error(error)
    // );
  }
}

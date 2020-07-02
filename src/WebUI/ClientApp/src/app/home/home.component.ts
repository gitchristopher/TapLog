import { Component, ViewChild, OnInit } from '@angular/core';
import { TestListComponent } from './test-list/test-list.component';
import { StagesClient, CreateTestCommand, ICreateTestCommand, TestDto, StageDto, ITestExecutionDto2, TestsClient } from '../taplog-api';

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
              this.selectedStage = this.stageList[0];
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
    this.selectedStage = this.stageList.find(s => s.id === Number(idFromStageList));
    console.log(this.selectedStage);
    this.testsClient.getAll(idFromStageList).subscribe(
      result => {
          this.testList = result;
      },
      error => console.error(error)
    );
  }

  // Id passed by the <app-test-list> components event emitter "@Output() onSelect"
  selectTest(idFromTestList: number): void {
    this.selectedTest = this.testList.find(t => t.id === Number(idFromTestList));
    console.log(this.selectedTest);
    // this.testsClient.getAll(stage.id).subscribe(
    //   result => {
    //       this.testList = result;
    //   },
    //   error => console.error(error)
    // );
  }

}

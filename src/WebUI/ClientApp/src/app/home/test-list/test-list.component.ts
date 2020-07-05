import { Component, OnInit, TemplateRef, Input, Output, EventEmitter } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { TestsClient, CreateTestCommand, ICreateTestCommand, TestDto, StageDto, ITestExecutionDto2 } from '../../taplog-api';
import { faPlus, faPlusSquare, faEllipsisH, faSmile, faDizzy } from '@fortawesome/free-solid-svg-icons';
import {style, state, animate, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-test-list',
  templateUrl: './test-list.component.html',
  styleUrls: ['./test-list.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [ style({opacity: 0 }), animate('300ms 300ms cubic-bezier(.17,.67,.88,.1)', style({opacity: 1 })) ]),
      transition(':leave', [ animate('300ms cubic-bezier(.17,.67,.88,.1)', style({opacity: 0 })) ])
    ])
  ]
})
export class TestListComponent implements OnInit {
  @Input() testList: TestDto[];

  // misc
  debug = true;
  // list
  // testList: TestDto[];
  selectedTest: TestDto;
  selectedStage: StageDto;
  testExecutions: ITestExecutionDto2[] = [];
  testDeatils: TestDto;
  // modal
  addTestModalRef: BsModalRef;
  addTestEditor: any = {};
  // icon
  faPlus = faPlus;
  faPlusSquare = faPlusSquare;


  // tslint:disable-next-line: no-output-on-prefix
  @Output() onSelect: EventEmitter<number> = new EventEmitter<number>();
  select(e: number) {
    this.onSelect.emit(e);
    this.selectedTest = this.testList.find(t => t.id === e);
    console.log('selected test-list test with id: ' + e);
  }


  constructor(private modalService: BsModalService, private testsClient: TestsClient) { }

  ngOnInit() {
  }

  generateData() {
    console.log('generate date from test-list');
  }

  // selectTest(test: TestDto): void {
  //   this.selectedTest = test;
  //   this.testExecutions = [];

  //   this.testsClient.getDetailedTest(test.id).subscribe(
  //     result => {
  //         this.testDeatils = result;
  //         const selectedStageTestExecutions = result.stageTests.filter(x => x.stageId === this.selectedStage.id);
  //         selectedStageTestExecutions.forEach(element => {
  //           element.testExecutions.forEach(execution => {
  //             this.testExecutions.push(execution);
  //           });
  //         });
  //     },
  //     error => console.error(error)
  //   );
  // }

  // Shows the test modal
  showAddTestModal(template: TemplateRef<any>): void {
    this.addTestModalRef = this.modalService.show(template);
    setTimeout(() => document.getElementById('title').focus(), 250);
  }

  // Hides the modal on cancel
  addTestCancelled(): void {
    this.addTestModalRef.hide();
    this.addTestEditor = {};
  }

  // Persists the new test data from the modal back to the API
  persistTest(): void {
    const test: ICreateTestCommand = {jiraTestNumber: this.addTestEditor.title, stageId: this.selectedStage.id};

    this.testsClient.create(CreateTestCommand.fromJS(test)).subscribe(
        result => {
          const newTest = new TestDto({id: result, jiraTestNumber: test.jiraTestNumber});
            this.testList.push(newTest);
            this.testList.sort((a, b) => (a.jiraTestNumber > b.jiraTestNumber) ? 1 : -1);
            this.addTestModalRef.hide();
            this.addTestEditor = {};
        },
        error => {
            const errors = JSON.parse(error.response);
            console.log('error while uploading test');

            if (errors && errors.Title) {
                this.addTestEditor.error = errors.Title[0];
            }

            setTimeout(() => document.getElementById('title').focus(), 250);
        }
    );
  }



}

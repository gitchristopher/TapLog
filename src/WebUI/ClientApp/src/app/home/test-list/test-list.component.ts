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
  @Input() selectedStage: StageDto;

  debug = true;
  selectedTest: TestDto;
  testExecutions: ITestExecutionDto2[] = [];
  testDeatils: TestDto;
  faPlus = faPlus;
  faPlusSquare = faPlusSquare;
  // modal
  addTestModalRef: BsModalRef;
  addTestEditor: any = {};


  // tslint:disable-next-line: no-output-on-prefix
  @Output() onSelect: EventEmitter<number> = new EventEmitter<number>();
  select(e: number) {
    this.onSelect.emit(e);
    this.selectedTest = this.testList.find(t => t.id === e);
  }


  constructor(private modalService: BsModalService, private testsClient: TestsClient) { }

  ngOnInit() {
  }

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
            console.error('error while uploading test');

            if (errors && errors.Title) {
                this.addTestEditor.error = errors.Title[0];
            }

            setTimeout(() => document.getElementById('title').focus(), 250);
        }
    );
  }
}

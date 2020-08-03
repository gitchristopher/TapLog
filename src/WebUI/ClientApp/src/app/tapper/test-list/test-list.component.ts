import { Component, OnInit, TemplateRef, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { TestsClient, CreateTestCommand, ICreateTestCommand,
          TestDto, StageDto, ITestExecutionDto2, UpdateTestCommand } from '../../taplog-api';
import { faPlus, faPlusSquare, faMinusSquare } from '@fortawesome/free-solid-svg-icons';
import {style, animate, transition, trigger} from '@angular/animations';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IModal } from 'src/_interfaces/modal';

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
export class TestListComponent implements OnInit, OnChanges {
  @Input() testList: TestDto[];
  @Input() selectedStage: StageDto;

  isChecked = false;
  isDisabled = this.selectedStage ? false : true;

  debug = false;
  selectedTest: TestDto;
  testExecutions: ITestExecutionDto2[] = [];
  testDeatils: TestDto;
  faPlus = faPlus;
  faPlusSquare = faPlusSquare;
  faMinusSquare = faMinusSquare;
  // modal
  addTestModalRef: BsModalRef;
  addTestEditor: any = {};
  updateTestModalRef: BsModalRef;
  updateTestEditor: any = {};
  modalEditor: IModal = {title: 'Editor', button: 'Submit', errors: [] };


  // tslint:disable-next-line: no-output-on-prefix
  @Output() onSelect: EventEmitter<number> = new EventEmitter<number>();
  select(e: number) {
    this.onSelect.emit(e);
    this.selectedTest = this.testList.find(t => t.id === e);
  }


  constructor(private modalService: BsModalService, private testsClient: TestsClient, private snackBar: MatSnackBar) { }

  ngOnChanges(changes: SimpleChanges): void {
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        switch (propName) {
          case 'selectedStage': {
            this.isChecked = false;
            if (this.selectedStage == null) {
              this.isDisabled = true;
            } else {
              this.isDisabled = false;
            }
          } break;
          case 'testList': {
            this.selectedTest = null;
          }
        }
      }
    }
  }

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
    this.modalEditor.errors = [];
  }
  // Shows the test modal
  showUpdateTestModal(template: TemplateRef<any>, name: string): void {
    this.updateTestEditor.title = name;
    this.updateTestModalRef = this.modalService.show(template);
    setTimeout(() => document.getElementById('updateTitle').focus(), 250);
  }

  // Hides the modal on cancel
  updateTestCancelled(): void {
    this.updateTestModalRef.hide();
    this.updateTestEditor = {};
    this.modalEditor.errors = [];
  }

  // Persists the new test data from the modal back to the API
  persistTest(): void {
    const test: ICreateTestCommand = {jiraTestNumber: this.addTestEditor.title, stageId: this.selectedStage.id};

    this.testsClient.create(CreateTestCommand.fromJS(test)).subscribe(
        result => {
          if (result < 0) {
            this.addTestEditor.error = 'Stage does not exist or Test already exists for this stage.';
          } else {
            const newTest = new TestDto({id: result, jiraTestNumber: test.jiraTestNumber});
            this.testList.push(newTest);
            this.testList.sort((a, b) => (a.jiraTestNumber > b.jiraTestNumber) ? 1 : -1);
            this.addTestModalRef.hide();
            this.addTestEditor = {};
            this.modalEditor.errors = [];
          }
        },
        error => {
          this.addErrorFromApi(error);
        }
    );
  }

  deleteTest(id: number) {
    if (confirm('All taps will be lost! Are you sure to delete the test?' + id)) {
      const index = this.testList.findIndex(x => x.id === id);
      this.testList.splice(index, 1);
      this.select(null);
      const stageId = this.selectedStage.id;
      this.testsClient.delete(id, stageId).subscribe(response => {
        // TODO: What to do with NoContent response?
        this.snackBar.open('Deleted successfully', null, {duration: 3000});
      }, error => {
        this.snackBar.open(error.title, null, {duration: 3000});
      });
    }
  }

  makeListEditable(e: Event) {
    this.isChecked = !this.isChecked;
  }

  updateTestName() {
    const testId = this.selectedTest.id;
    const newTitle = this.updateTestEditor.title;
    this.testsClient.update(testId, new UpdateTestCommand({id: testId, jiraTestNumber: newTitle})).subscribe( result => {
      this.selectedTest = null;
      this.testList.find(t => t.id === testId).jiraTestNumber = newTitle;
      // TODO: what to do with NoContent response
      this.updateTestModalRef.hide();
      this.updateTestEditor = {};
      this.modalEditor.errors = [];
      this.snackBar.open(`Updated successfully: ${newTitle}`, null, {duration: 3000});
    }, error => {
      this.addErrorFromApi(error);
    });
  }

  addErrorFromApi(error: any) {
    this.modalEditor.errors = [];
    const response = JSON.parse(error['response']);
    if (error.title != null || error.title !== undefined) {
      this.snackBar.open(error.title, null, {duration: 3000});
    } else {
      const errorTitle = response['title'];
      this.snackBar.open(errorTitle, null, {duration: 3000});
    }
    const errorArray = Object.values(response['errors']);
    errorArray.forEach(element => {
    this.modalEditor.errors.push(element[0]);
    });
  }
}

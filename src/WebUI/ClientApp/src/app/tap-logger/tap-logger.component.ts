import { Component, OnInit, TemplateRef } from '@angular/core';
import * as taplog from '../taplog-api';
import { faPlus, faEllipsisH, faPlusSquare, faSmile, faDizzy } from '@fortawesome/free-solid-svg-icons';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';


@Component({
  selector: 'app-tap-logger',
  templateUrl: './tap-logger.component.html',
  styleUrls: ['./tap-logger.component.css']
})
export class TapLoggerComponent implements OnInit {

  debug = true;

  addTapForm: FormGroup;

  deviceList: taplog.DeviceDto[];
  cardList: taplog.CardDto[];
  isCreditType = true;
  stageList: taplog.StageDto[];
  selectedStage: taplog.StageDto;

  testList: taplog.TestDto[];
  selectedTest: taplog.TestDto;
  testDeatils: taplog.TestDto;
  testExecutions: taplog.ITestExecutionDto2[] = [];
  selectedExecution: taplog.TestExecutionDto2;

  submitted = false;
  tap = new taplog.CreateTapCommand({result: taplog.Result.Successful});

  resultEnum: taplog.Result[] = [taplog.Result.Successful, taplog.Result.Unsuccessful, taplog.Result.None, taplog.Result.Other];
  expectedResult: number;

  // ismeridian = true;
  showSec = true;
  mytime: Date = new Date();

  // Icons
  faPlus = faPlus;
  faPlusSquare = faPlusSquare;
  faEllipsisH = faEllipsisH;
  faSmile = faSmile;
  faDizzy = faDizzy;

  // Modals
  newTestModalRef: BsModalRef;
  newTestEditor: any = {};

  constructor(private devicesClient: taplog.DevicesClient,
              private cardsClient: taplog.CardsClient,
              private stagesClient: taplog.StagesClient,
              private testsClient: taplog.TestsClient,
              private modalService: BsModalService) {
    stagesClient.getAll().subscribe(
      result => {
          if (result.length) {
            this.stageList = result.sort(function(a, b) {return (Number(a.isCurrent) - Number(b.isCurrent)); }).reverse();
            // this.selectedStage = this.stageList[0];
            this.selectStage(this.stageList[0]);
          }
      },
      error => console.error(error)
    );
    this.getAllDevices();
    this.getAllCards();
   }

  ngOnInit() {
    this.addTapForm = new FormGroup({
      cardType: new FormControl(),
      card: new FormControl(),
      device: new FormControl(),
      result: new FormControl(),
      expectedResult: new FormControl(),
      time: new FormControl(),
      date: new FormControl(),
      fare: new FormControl(),
      balanceBefore: new FormControl(),
      balanceAfter: new FormControl(),
      notes: new FormControl(),
    });
  }

  getAllDevices(): void {
    this.devicesClient.getAll().subscribe( result => { this.deviceList = result; console.log(result);
    }, error => console.error(error));
  }
  getAllCards(): void {
    this.cardsClient.getAll().subscribe( result => { this.cardList = result; console.log(result);
    }, error => console.error(error));
  }

  selectStage(stage: taplog.StageDto): void {
    this.selectedStage = stage;

    this.testsClient.getAll(stage.id).subscribe(
      result => {
          this.testList = result;
          // if (this.testList.length) {
          //   this.selectedTest = this.testList[0];
          // }
      },
      error => console.error(error)
    );
  }

  selectTest(test: taplog.TestDto): void {
    this.selectedTest = test;
    this.testExecutions = [];

    this.testsClient.getDetailedTest(test.id).subscribe(
      result => {
          this.testDeatils = result;
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

  selectExecution(execution: taplog.TestExecutionDto2): void {
    this.selectedExecution = execution;
  }

  // modals
  showNewTestModal(template: TemplateRef<any>): void {
    this.newTestModalRef = this.modalService.show(template);
    setTimeout(() => document.getElementById('title').focus(), 250);
  }
  newTestCancelled(): void {
    this.newTestModalRef.hide();
    this.newTestEditor = {};
  }
  addTest(): void {
    const test: taplog.ICreateTestCommand = {jiraTestNumber: this.newTestEditor.title, stageId: this.selectedStage.id};

    this.testsClient.create(taplog.CreateTestCommand.fromJS(test)).subscribe(
        result => {
          const newTest = new taplog.TestDto({id: result, jiraTestNumber: test.jiraTestNumber});
            this.testList.push(newTest);
            // this.selectedList = list;
            this.newTestModalRef.hide();
            this.newTestEditor = {};
        },
        error => {
            const errors = JSON.parse(error.response);
            console.log('errored the fuck out');

            if (errors && errors.Title) {
                this.newTestEditor.error = errors.Title[0];
            }

            setTimeout(() => document.getElementById('title').focus(), 250);
        }
    );
  }

  createTap() {
    console.log(this.addTapForm.value);
    // let tap = new ICreateTapCommand(18, 'Dr IQ', this.powers[0], 'Chuck Overstreet');
  }



  onSubmit() { this.submitted = true; }

  // newHero() {
  //   this.model = new Hero(42, '', '');
  // }
}

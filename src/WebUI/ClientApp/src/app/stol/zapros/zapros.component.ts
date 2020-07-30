import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {FormGroup, FormControl} from '@angular/forms';
import { TestsClient, TestDto, TapsClient, StageDto, StagesClient } from 'src/app/taplog-api';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface TapQuery {
  stageId: number;
  testId: number;
  startDate: string;
  endDate: string;
}

@Component({
  selector: 'app-zapros',
  templateUrl: './zapros.component.html',
  styleUrls: ['./zapros.component.css']
})
export class ZaprosComponent implements OnInit {
  testList: TestDto[];
  stageList: StageDto[];
  queryForm: FormGroup;

  @Output() submitForm: EventEmitter<TapQuery> = new EventEmitter<TapQuery>();

  constructor(private testsClient: TestsClient, private tapsClient: TapsClient,
    private stageClient: StagesClient, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.queryForm = new FormGroup({
      stageList: new FormControl(),
      testList: new FormControl(),
      startDate: new FormControl({value: null, disabled: true}),
      endDate: new FormControl({value: null, disabled: true}),
    });

    this.getLists();
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
    });
  }

  getLists(): void {
    this.testsClient.getAll().subscribe(
      result => {
          this.testList = result.sort((a, b) => a.jiraTestNumber.localeCompare(b.jiraTestNumber));
      },
      error => this.openSnackBar(error.title, null)
    );
    this.stageClient.getAll().subscribe(
      result => {
          this.stageList = result.sort((a, b) => a.name.localeCompare(b.name));
          if (result.length > 0) {
            const currentStage = result.find(s => s.isCurrent === true);
            this.queryForm.get('stageList').setValue(currentStage.id);
          }
      },
      error => this.openSnackBar(error.title, null)
    );
  }

  submit() {
    let startDate = '';
    this.queryForm.get('startDate').enable();
    if (this.queryForm.value.startDate != null) {
      startDate = new Date(this.queryForm.value.startDate).toISOString();
    }
    this.queryForm.get('startDate').disable();

    this.queryForm.get('endDate').enable();
    let endDate = '';
    if (this.queryForm.value.endDate != null) {
      endDate = new Date(this.queryForm.value.endDate).toISOString();
    }
    this.queryForm.get('endDate').disable();

    let test = null;
    if (this.queryForm.value.testList != null) {
      test = Number(this.queryForm.value.testList);
    }

    let stage = null;
    if (this.queryForm.value.stageList != null) {
      stage = Number(this.queryForm.value.stageList);
    }

    const data: TapQuery = { stageId: stage, testId: test, startDate: startDate, endDate: endDate };
    this.submitForm.emit(data);
  }
}

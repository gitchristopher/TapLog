import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {FormGroup, FormControl} from '@angular/forms';
import { TestsClient, TestDto, TapsClient, StageDto, StagesClient } from 'src/app/taplog-api';

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

  constructor(private testsClient: TestsClient, private tapsClient: TapsClient, private stageClient: StagesClient) { }

  ngOnInit() {
    this.queryForm = new FormGroup({
      stageList: new FormControl(),
      testList: new FormControl(),
      startDate: new FormControl(),
      endDate: new FormControl(),
    });

    this.getLists();
  }

  getLists(): void {
    this.testsClient.getAll().subscribe(
      result => {
          this.testList = result.sort((a, b) => a.jiraTestNumber.localeCompare(b.jiraTestNumber));
      },
      error => console.error(error)
    );
    this.stageClient.getAll().subscribe(
      result => {
          this.stageList = result.sort((a, b) => a.name.localeCompare(b.name));
          if (result.length > 0) {
            const currentStage = result.find(s => s.isCurrent === true);
            this.queryForm.get('stageList').setValue(currentStage.id);
          }
      },
      error => console.error(error)
    );
  }

  submit() {
    let startDate = '';
    if (this.queryForm.value.startDate != null) {
      startDate = new Date(this.queryForm.value.startDate).toISOString();
    }

    let endDate = '';
    if (this.queryForm.value.endDate != null) {
      endDate = new Date(this.queryForm.value.endDate).toISOString();
    }

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

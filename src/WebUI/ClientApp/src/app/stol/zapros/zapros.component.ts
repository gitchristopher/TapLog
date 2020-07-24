import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {FormGroup, FormControl} from '@angular/forms';
import { TestsClient, TestDto, TapsClient } from 'src/app/taplog-api';

export interface TapQuery {
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
  queryForm: FormGroup;

  @Output() submitForm: EventEmitter<TapQuery> = new EventEmitter<TapQuery>();

  constructor(private testsClient: TestsClient, private tapsClient: TapsClient) { }

  ngOnInit() {
    this.queryForm = new FormGroup({
      testList: new FormControl(),
      startDate: new FormControl(),
      endDate: new FormControl(),
    });

    this.getTestList();
  }

  getTestList(): void {
    this.testsClient.getCurrentTests().subscribe(
      result => {
          this.testList = result;
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

    const data: TapQuery = { testId: test, startDate: startDate, endDate: endDate };
    this.submitForm.emit(data);
  }
}

import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { TestsClient, CreateTestCommand, ICreateTestCommand, TestDto, StageDto, ITestExecutionDto2 } from '../../taplog-api';

@Component({
  selector: 'app-stage-list',
  templateUrl: './stage-list.component.html',
  styleUrls: ['./stage-list.component.css']
})
export class StageListComponent implements OnInit {

  selectedStage: StageDto;
  @Input() stageList: StageDto[];

  // tslint:disable-next-line: no-output-on-prefix
  @Output() onRefresh: EventEmitter<null> = new EventEmitter<null>();
  // tslint:disable-next-line: no-output-on-prefix
  @Output() onSelect: EventEmitter<number> = new EventEmitter<number>();

  refresh(e) {
    this.onRefresh.emit(e);
    console.log('refreshed stage-list ' + e);
  }
  select(e: number) {
    this.onSelect.emit(e);
    console.log('selected stage-list stage with id: ' + e);
  }


  constructor() { }

  ngOnInit() {
  }

}

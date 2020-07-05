import { Component, OnInit, EventEmitter, Output, Input, OnChanges } from '@angular/core';
import { TestsClient, CreateTestCommand, ICreateTestCommand, TestDto, StageDto, ITestExecutionDto2 } from '../../taplog-api';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {style, state, animate, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-stage-list',
  templateUrl: './stage-list.component.html',
  styleUrls: ['./stage-list.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [ style({opacity: 0 }), animate('300ms 300ms ease-in', style({opacity: 1 })) ]),
      transition(':leave', [ animate('300ms ease-out', style({opacity: 0 })) ])
    ])
  ]
})
export class StageListComponent implements OnInit, OnChanges {
  stageForm: FormGroup;

  // tslint:disable-next-line: no-output-on-prefix
  @Output() onSelect: EventEmitter<number> = new EventEmitter<number>();
  @Input() stageList: StageDto[];

  // @Output() onRefresh: EventEmitter<null> = new EventEmitter<null>();
  // refresh(e) {
  //   this.onRefresh.emit(e);
  // }

  constructor(fb: FormBuilder) {
    this.stageForm = fb.group({
      stageSelect: new FormControl()
    });
   }

  ngOnChanges() {
    if (this.stageList?.length > 0) {
      const currentStage = this.stageList.find(s => s.isCurrent === true);
      this.stageForm.get('stageSelect').setValue(currentStage);
    }
  }

  ngOnInit() {
  }

  select(e: StageDto) {
    this.onSelect.emit(e.id);
  }
}

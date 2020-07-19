import { Component, OnInit, EventEmitter, Output, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TestsClient, CreateTestCommand, ICreateTestCommand, TestDto, StageDto, ITestExecutionDto2 } from '../../taplog-api';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { style, state, animate, transition, trigger } from '@angular/animations';
import { AppState, StagesState } from '../../app.state';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';

@Component({
  selector: 'app-spisok-faz',
  templateUrl: './spisok-faz.component.html',
  styleUrls: ['./spisok-faz.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [style({ opacity: 0 }), animate('300ms 300ms ease-in', style({ opacity: 1 }))]),
      transition(':leave', [animate('300ms ease-out', style({ opacity: 0 }))])
    ])
  ]
})

export class SpisokFazComponent implements OnInit, OnChanges {

  @Input() stagesState: StagesState;
  @Output() select: EventEmitter<number> = new EventEmitter<number>();
  stageForm: FormGroup;

  constructor(fb: FormBuilder) {
    this.stageForm = fb.group({
      stageSelect: new FormControl()
    });
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    let currentStage: StageDto;
    if (this.stagesState.selectedId) {
      currentStage = this.stagesState.list.find(x => x.id === this.stagesState.selectedId);
    } else {
      currentStage = this.stagesState.list.find(x => x.isCurrent === true);
    }
    this.stageForm.get('stageSelect').setValue(currentStage);
  }

  selectStage(e: StageDto) {
    this.select.emit(e.id);
  }
}

import { Component, OnInit } from '@angular/core';
import { style, animate, transition, trigger } from '@angular/animations';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { StageDto } from '../../taplog-api';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.state';
import { selectSelectedStage, selectStagesList } from './list-stage.selectors';
import { LOAD_STAGES_REQUEST, SELECT_STAGE } from './list-stage.actions';

@Component({
  selector: 'app-list-stage',
  templateUrl: './list-stage.component.html',
  styleUrls: ['./list-stage.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [style({ opacity: 0 }), animate('300ms 300ms ease-in', style({ opacity: 1 }))]),
      transition(':leave', [animate('300ms ease-out', style({ opacity: 0 }))])
    ])
  ]
})

export class ListStageComponent implements OnInit {

  stages$: Observable<StageDto[]>;
  selectedStage$: Observable<StageDto>;
  form: FormGroup;

  constructor(private fb: FormBuilder, private store: Store<AppState>) {
    this.stages$ = store.select(selectStagesList);
    this.selectedStage$ = store.select(selectSelectedStage);
    this.store.dispatch(LOAD_STAGES_REQUEST());
  }

  ngOnInit() {
    this.form = this.fb.group({ stageSelect: new FormControl() });
    this.selectedStage$.subscribe( stage => {
      this.form.get('stageSelect').setValue(stage);
    })
  }

  selectStage(e: StageDto) {
    this.store.dispatch(SELECT_STAGE({stageId: e.id}));
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { style, animate, transition, trigger } from '@angular/animations';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { StageDto } from '../../taplog-api';
import { AppState } from '../../app.state';
import { LOAD_STAGES_REQUEST, SELECT_STAGE } from './spisok-faz.actions';
import { selectSelectedStage, selectStagesList } from './spisok-faz.selectors';

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

export class SpisokFazComponent implements OnInit {

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

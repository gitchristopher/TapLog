import { Component, OnInit, Input, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { TestExecutionDto2, TapDto2, TapsClient, DeviceDto, CardDto, CreateTapCommand, UpdateTapCommand, TestExecutionDto } from 'src/app/taplog-api';
import { style, state, animate, transition, trigger } from '@angular/animations';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { RequireMatch as RequireMatch } from '../../../_validators/requireMatch';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { selectExecutionsList, selectSelectedExecution, selectSelectedExecutionTapCount } from '../spisok-kazney/spisok-kazney.reducers';
import { DELETE_TAP_REQUEST } from '../spisok-kazney/spisok-kazney.actions';

@Component({
  selector: 'app-spisok-sobytiy',
  templateUrl: './spisok-sobytiy.component.html',
  styleUrls: ['./spisok-sobytiy.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [ style({opacity: 0 }), animate('1000ms ease-in-out', style({opacity: 1 })) ])
    ]),
    trigger('fadeOutIn', [
      transition(':enter', [ style({opacity: 0 }), animate('500ms 500ms ease-in-out', style({opacity: 1 })) ]),
      transition(':leave', [ animate('500ms ease-out', style({opacity: 0 })) ])
    ])
  ]
})
export class SpisokSobytiyComponent implements OnInit, OnChanges {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  selectedExecution$: Observable<TestExecutionDto>;
  selectedExecutionz: TestExecutionDto;
  selectedExecutionTapCount$: Observable<number>;
  isChecked = false;
  isDisabled = false;

  @Input() selectedExecution: TestExecutionDto2;

  isEditing: number;
  // isDecending = true;
  updateTapForm: FormGroup;
  fb: FormBuilder;
  deviceList: DeviceDto[];
  cardList: CardDto[];
  filteredOptions: Observable<CardDto[]>;

  constructor(private tapsClient: TapsClient, private store: Store<AppState>) {
    this.isChecked = false;
    this.isEditing = null;
  }

  ngOnChanges(changes: SimpleChanges): void {
    // for (const propName in changes) {
    //   if (changes.hasOwnProperty(propName)) {
    //     switch (propName) {
    //       case 'selectedExecution': {
    //         this.isChecked = false;
    //         if (this.selectedExecution == null) {
    //           this.isDisabled = true;
    //         } else {
    //           this.isDisabled = false;
    //           this.cancelEdit();
    //           // this.selectedExecution = this.sort(this.selectedExecution);
    //         }
    //       }
    //     }
    //   }
    // }
  }

  ngOnInit() {
    this.selectedExecution$ = this.store.select(selectSelectedExecution);
    this.selectedExecutionTapCount$ = this.store.select(selectSelectedExecutionTapCount);
    this.store.select(selectSelectedExecution).subscribe((execution => this.selectedExecutionz = execution));

    this.updateTapForm = new FormGroup({
      cardType: new FormControl(),
      card: new FormControl('', [Validators.required, RequireMatch]),
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

  deleteTap(id: number) {
    if (confirm('Are you sure to delete the tap? ' + id)) {
      this.store.dispatch(DELETE_TAP_REQUEST({execution: this.selectedExecutionz, tapId: id}));
    }
  }

  editTap(id: number) {
    this.isEditing = id;
    if (this.cardList == null || this.deviceList == null) {
      this.getFormInformationFromApi();
    } else {
      this.loadDataIntoForm();
    }
  }

  loadDataIntoForm() {
    const id = this.isEditing;
    const tap = this.selectedExecution.taps.find(x => Number(x.id) === Number(id));
    // HACK: There has to be a better way
    const tempDate = new Date(tap.timeOf);
    tempDate.setHours(13);

    const card = this.cardList.find(c => Number(c.id) === Number(tap.cardId));
    this.updateTapForm.get('card').setValue(card);
    this.updateTapForm.get('result').setValue(tap.result.toString());
    this.updateTapForm.get('expectedResult').setValue(tap.wasResultExpected.toString());
    this.updateTapForm.patchValue({
      notes: tap.notes,
      balanceAfter: tap.balanceAfter,
      balanceBefore: tap.balanceBefore,
      fare: tap.fare,
      time: tap.timeOf,
      date: tempDate,
      device: tap.deviceId
    });
  }

  getFormInformationFromApi() {
    this.tapsClient.getTapForm().subscribe( result => {
      this.cardList = new Array<CardDto>();
      result.cards.forEach( card => {
        if (card.alias == null) {
          card.alias = 'Go Card';
        }
        card.alias = card.alias.concat(' - ', card.number);
        this.cardList.push(card);
      });
      this.deviceList = result.devices;

      this.filteredOptions = this.updateTapForm.get('card').valueChanges.pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.alias),
        map(alias => alias ? this._filter(alias) : this.cardList.slice())
      );

      this.loadDataIntoForm();
    }, error => {
      console.error('error loading tap form VM ' + error);
    });
  }

  toggleChanged(e: Event) {
    this.isChecked = !this.isChecked;
    this.isChecked ? this.accordion.openAll() : this.accordion.closeAll();
    if (this.isChecked === false) {
      this.cancelEdit();
    }
  }

  cancelEdit() {
    this.isEditing = null;
  }

  updateTap(data: any) {
    const tap = new UpdateTapCommand(data);
    this.tapsClient.update(Number(this.isEditing), tap).subscribe(
        result => {
          // TODO: what to do with NoContent response
          const newTap = new TapDto2(data);
          newTap.timeOf = this.formatTimeAndDate(this.updateTapForm.value.time, this.updateTapForm.value.date);
          const card = this.cardList.find(x => Number(x.id) === Number(newTap.cardId));
          newTap.cardAlias = card?.alias ? card.alias : 'Go Card';
          newTap.cardNumber = card.number;
          newTap.cardSupplierName = card.supplierName;
          const device = this.deviceList.find(x => x.id === newTap.deviceId);
          newTap.deviceName = device.name;
          newTap.deviceCode = device.code;
          const index = this.selectedExecution.taps.findIndex(x => x.id === Number(newTap.id));
          this.selectedExecution.taps.splice(index, 1, newTap);
        },
        error => {
            console.error('error when updating tap');
            console.error(error);
        }
    );
    this.isEditing = null;
  }

  onSubmit() {
    const card = this.cardList.find(c => c.id === Number(this.updateTapForm.value.card.id));
    const device = this.deviceList.find(d => d.id === Number(this.updateTapForm.value.device));
    const time = this.formatTimeAndDate(this.updateTapForm.value.time, this.updateTapForm.value.date).toISOString();
    const data = {
      testExecutionId: this.selectedExecution.id,
      balanceAfter: Number(this.updateTapForm.value.balanceAfter),
      balanceBefore: Number(this.updateTapForm.value.balanceBefore),
      cardId: Number(this.updateTapForm.value.card.id),
      caseNumber: '?',
      deviceId: Number(this.updateTapForm.value.device),
      fare: Number(this.updateTapForm.value.fare),
      id: Number(this.isEditing),
      notes: this.updateTapForm.value.notes,
      result: Number(this.updateTapForm.value.result),
      tester: 'Current User',
      timeOf: time,
      wasResultExpected: Number(this.updateTapForm.value.expectedResult),
    };
    this.updateTap(data);
  }
  formatTimeAndDate = (timeFromForm: Date, dateFromForm: Date): Date => {
    const time = new Date();
    time.setTime(timeFromForm.getTime());
    time.setDate(dateFromForm.getDate());
    return time;
  }

  displayFn(card: CardDto): string {
    return card && card.alias ? card.alias : '';
  }

  private _filter(alias: string): CardDto[] {
    const filterValue = alias.toLowerCase();

    return this.cardList.filter(card => card.alias.toLowerCase().indexOf(filterValue) >= 0);
  }
}

import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { TestExecutionDto2, DeviceDto, CardDto, TapsClient, AddTapVM, CreateTapCommand, TapDto2, TapDto } from 'src/app/taplog-api';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-log-tap',
  templateUrl: './log-tap.component.html',
  styleUrls: ['./log-tap.component.css']
})
export class LogTapComponent implements OnInit, OnChanges {

  debug = true;
  addTapForm: FormGroup;
  fb: FormBuilder;
  deviceList: DeviceDto[];
  cardList: CardDto[];
  filteredOptions: Observable<CardDto[]>;
  submitted = false;
  mytime: Date = new Date(Date.now() + 86400);
  selectedCardType: number;

  @Input() selectedExecution: TestExecutionDto2;
  // tslint:disable-next-line: no-output-on-prefix
  @Output() onSave: EventEmitter<TapDto2> = new EventEmitter<TapDto2>();
  savedTap(e: TestExecutionDto2) {
    this.onSave.emit(e);
  }

  constructor(private tapsClient: TapsClient) { }

  ngOnChanges(changes: SimpleChanges) {
    if (this.addTapForm !== undefined) {
      for (const propName in changes) {
        if (changes.hasOwnProperty(propName)) {
          switch (propName) {
            case 'selectedExecution': {
              console.log('on changes selectedExecution');
              this.updateTapForm();
            }
          }
        }
      }
    }
  }

  ngOnInit() {
    console.log('ngOnInit LogTapComponent');

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

      this.filteredOptions = this.addTapForm.get('card').valueChanges.pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.alias),
        map(alias => alias ? this._filter(alias) : this.cardList.slice())
      );
    }, error => {
      console.error('error loading tap form VM ' + error);
    });
  }

  addTap(data: any): void {
    const tap = new CreateTapCommand(data);
    if (this.selectedExecution == null) {
      this.selectedExecution.taps = new Array<TapDto2>();
    }
    this.tapsClient.create(tap).subscribe(
        result => {
          const newTap = new TapDto2(data);
          newTap.id = result;
          this.selectedExecution.taps.push(newTap);
          this.submitted = true;
          this.updateTapForm();
          this.savedTap(this.selectedExecution);
        },
        error => {
            console.error('error when uploading tap');
            console.error(error);
        }
    );
  }

  updateTapForm() {
    const newDateAndTime: Date = new Date(Date.now() + 86400);
    if (this.selectedExecution?.taps?.length > 0) {
      const currentTap = this.selectedExecution.taps[this.selectedExecution.taps.length - 1];
      // const dateAndTime = currentTap.timeOf;
      // newDateAndTime = new Date(dateAndTime.getTime() + 15 + 86400);
      const card = this.cardList.find(c => Number(c.id) === Number(currentTap.cardId));
      this.addTapForm.get('card').setValue(card);
    }

    this.addTapForm.patchValue({
      notes: null,
      balanceAfter: null,
      balanceBefore: null,
      fare: null,
      expectedResult: 0,
      result: null,
      time: newDateAndTime,
      date: newDateAndTime,
      device: null
    });
  }

  onSubmit() {
    const card = this.cardList.find(c => c.id === Number(this.addTapForm.value.card.id));
    const device = this.deviceList.find(d => d.id === Number(this.addTapForm.value.device));
    const time = this.formatTimeAndDate(this.addTapForm.value.time, this.addTapForm.value.date);
    this.mytime = this.addTapForm.value.time;
    const data = {
      cardType: this.addTapForm.value.cardType,
      balanceAfter: Number(this.addTapForm.value.balanceAfter),
      balanceBefore: Number(this.addTapForm.value.balanceBefore),
      cardAlias: card.alias,
      cardId: Number(this.addTapForm.value.card.id),
      cardNumber: card.number,
      cardSupplierName: card.supplierName,
      caseNumber: '?',
      deviceCode: device.code,
      deviceId: Number(this.addTapForm.value.device),
      deviceName: device.name,
      fare: Number(this.addTapForm.value.fare),
      id: 0,
      notes: this.addTapForm.value.notes,
      result: Number(this.addTapForm.value.result),
      testerId: 'Current User',
      timeOf: time,
      wasResultExpected: Number(this.addTapForm.value.expectedResult),
      testExecutionId: this.selectedExecution.id,
    };
    this.addTap(data);
  }
  formatTimeAndDate = (timeFromForm: Date, dateFromForm: Date): Date => {
    const time = new Date();
    time.setUTCDate(dateFromForm.getUTCDate());
    time.setUTCHours(timeFromForm.getUTCHours());
    time.setUTCMinutes(timeFromForm.getUTCMinutes());
    time.setUTCSeconds(timeFromForm.getUTCSeconds());
    return time;
  }

  selectCardType(num: number) {
    console.log('probably dont need this');
    // this.selectedCardType = num;
    // switch (num) {
    //   case 0:
    //     this.addTapForm.patchValue({
    //       card: this.cardList.filter(ct => Number(ct.supplierId) !== Number(4)),
    //     });
    //     break;
    //   case 1:
    //     this.addTapForm.patchValue({
    //       card: this.cardList.filter(ct => Number(ct.supplierId) === Number(4)),
    //     })
    //     break;
    //   default:
    //     console.error('Something when wrong in log-tap cardtype section');
    //     break;
    // }
  }

  displayFn(card: CardDto): string {
    return card && card.alias ? card.alias : '';
  }

  private _filter(alias: string): CardDto[] {
    const filterValue = alias.toLowerCase();

    return this.cardList.filter(card => card.alias.toLowerCase().indexOf(filterValue) >= 0);
  }
}

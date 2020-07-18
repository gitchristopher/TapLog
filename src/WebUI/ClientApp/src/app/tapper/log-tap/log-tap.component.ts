import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { TestExecutionDto2, DeviceDto, CardDto, TapsClient, AddTapVM, CreateTapCommand, TapDto2, TapDto } from 'src/app/taplog-api';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { RequireMatch as RequireMatch } from '../../../_validators/requireMatch';

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
  // mytime: Date = new Date(); // Date.now() + 86400
  selectedCardType: number;

  @Input() selectedExecution: TestExecutionDto2;
  // tslint:disable-next-line: no-output-on-prefix
  @Output() onSave: EventEmitter<TapDto2> = new EventEmitter<TapDto2>();
  savedTap(e: TestExecutionDto2) {
    this.onSave.emit(e);
  }

  constructor(private tapsClient: TapsClient) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.addTapForm !== undefined) {
      for (const propName in changes) {
        if (changes.hasOwnProperty(propName)) {
          switch (propName) {
            case 'selectedExecution': {
              this.updateTapForm();
            }
          }
        }
      }
    }
  }

  ngOnInit() {
    this.addTapForm = new FormGroup({
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

    this.tapsClient.getTapForm().subscribe( result => {
      this.deviceList = result.devices;
      this.cardList = new Array<CardDto>();

      result.cards.forEach( card => {
        if (card.alias == null) {
          card.alias = 'Go Card';
        }
        card.alias = card.alias.concat(' - ', card.number);
        this.cardList.push(card);
      });

      // this.filteredOptions = this.addTapForm.get('card').valueChanges.pipe(
      //   startWith(''),
      //   map(value => typeof value === 'string' ? value : value.alias),
      //   map(alias => alias ? this._filter(alias) : this.cardList.slice())
      // );
    }, error => {
      console.error('error loading tap form VM ' + error);
    });
    this.addTapForm.disable();
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
          newTap.timeOf = this.formatTimeAndDate(this.addTapForm.value.time, this.addTapForm.value.date);
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

  // Resets the form with expected values, if possible, to make entering data quicker / easier
  // Previously used card is set, along with a slight increment in time, result and expected result assumed successful.
  updateTapForm() {
    // HACK: There has to be a better way
    // Date picker is time is set to 11pm. The date shown will be the previous day if time is under 10am.
    let newTime: Date = new Date();
    let newDate = new Date(newTime);
    newDate.setHours(23, 0, 0);

    this.filteredOptions = this.addTapForm.get('card').valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.alias),
      map(alias => alias ? this._filter(alias) : this.cardList?.slice())
    );

    this.addTapForm.get('result').setValue('0');
    this.addTapForm.get('expectedResult').setValue('0');

    if (this.selectedExecution?.taps?.length > 0) {
      const lastTap = this.selectedExecution.taps[this.selectedExecution.taps.length - 1];
      const card = this.cardList.find(c => Number(c.id) === Number(lastTap.cardId));
      this.addTapForm.get('card').setValue(card);
      this.addTapForm.get('notes').setValue(lastTap.notes);

      const time = lastTap.timeOf.toISOString();
      newDate = new Date(Date.parse(time));
      newDate.setHours(23, 0, 0);
      newTime = new Date(Date.parse(time));
      newTime.setTime(newTime.getTime() + 15000);
    }

    this.addTapForm.patchValue({
      balanceAfter: null,
      balanceBefore: null,
      fare: null,
      time: newTime,
      date: newDate,
      device: null,
      notes: null
    });
    
    if (this.selectedExecution) {
      this.addTapForm.enable();
    }
  }

  onSubmit() {
    // HACK: Fix later
    if (this.selectedExecution) {
      const card = this.cardList.find(c => c.id === Number(this.addTapForm.value.card.id));
      const device = this.deviceList.find(d => d.id === Number(this.addTapForm.value.device));
      const time = this.formatTimeAndDate(this.addTapForm.value.time, this.addTapForm.value.date).toISOString();
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
  }
  formatTimeAndDate = (timeFromForm: Date, dateFromForm: Date): Date => {
    const time = new Date();
    time.setTime(timeFromForm.getTime());
    time.setDate(dateFromForm.getDate());
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

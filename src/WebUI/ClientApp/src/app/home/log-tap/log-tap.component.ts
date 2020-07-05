import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { TestExecutionDto2, DeviceDto, CardDto, TapsClient, AddTapVM, CreateTapCommand, TapDto2 } from 'src/app/taplog-api';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';

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
  submitted = false;
  mytime: Date = new Date();
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
              this.updateTapForm();
            }
          }
        }
      }
    }
  }

  ngOnInit() {
    this.tapsClient.getTapForm().subscribe( result => {
      this.cardList = result.cards;
      this.deviceList = result.devices;
    }, error => {
      console.error('error loading tap form VM ' + error);
    });

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

    this.updateTapForm();

  }

  addTap(data: any): void {
    const tap = new CreateTapCommand(data);
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
    let newDateAndTime: Date = new Date(Date.now());
    if (this.selectedExecution?.taps?.length > 0) {
      const currentTap = this.selectedExecution.taps[this.selectedExecution.taps.length - 1]
      const dateAndTime = currentTap.timeOf;
      newDateAndTime = new Date(dateAndTime.getTime() + 0.25 * 60000);
      const c = this.cardList.find(ca => Number(ca.id) === Number(currentTap.cardId));

      this.addTapForm.patchValue({
        card: this.cardList.find(car => Number(car.id) === Number(currentTap.cardId)).id,
      });
    }

    this.addTapForm.patchValue({
      notes: null,
      balanceAfter: null,
      balanceBefore: null,
      fare: null,
      expectedResult: 0,
      result: 0,
      time: newDateAndTime,
      date: newDateAndTime,
      device: null
    });
  }
  onSubmit() {
    const card = this.cardList.find(c => c.id === Number(this.addTapForm.value.card));
    const device = this.deviceList.find(d => d.id === Number(this.addTapForm.value.device));
    const time = this.formatTimeAndDate(this.addTapForm.value.time, this.addTapForm.value.date);
    this.mytime = this.addTapForm.value.time;
    const data = {
      cardType: this.addTapForm.value.cardType,
      balanceAfter: Number(this.addTapForm.value.balanceAfter),
      balanceBefore: Number(this.addTapForm.value.balanceBefore),
      cardAlias: card.alias,
      cardId: Number(this.addTapForm.value.card),
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
    this.selectedCardType = num;
    switch (num) {
      case 0:
        this.addTapForm.patchValue({
          card: this.cardList.filter(ct => Number(ct.supplierId) !== Number(4)),
        });
        break;
      case 1:
        this.addTapForm.patchValue({
          card: this.cardList.filter(ct => Number(ct.supplierId) === Number(4)),
        })
        break;
      default:
        console.error('Something when wrong in log-tap cardtype section');
        break;
    }
  }
}

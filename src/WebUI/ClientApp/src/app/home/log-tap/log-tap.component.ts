import { Component, OnInit, Input } from '@angular/core';
import { TestExecutionDto2, DeviceDto, CardDto } from 'src/app/taplog-api';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';

@Component({
  selector: 'app-log-tap',
  templateUrl: './log-tap.component.html',
  styleUrls: ['./log-tap.component.css']
})
export class LogTapComponent implements OnInit {

  debug = true;
  addTapForm: FormGroup;
  fb: FormBuilder;
  deviceList: DeviceDto[];
  cardList: CardDto[];

  @Input() selectedExecution: TestExecutionDto2;
  constructor() { }

  ngOnInit() {
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
  }

  getAllDevices(): void {
    // this.devicesClient.getAll().subscribe( result => { this.deviceList = result;
    // }, error => console.error(error));
  }
  getAllCards(): void {
    // this.cardsClient.getAll().subscribe( result => { this.cardList = result;
    // }, error => console.error(error));
  }


  addTap(data: any): void {
    // const tap = new taplog.CreateTapCommand(data);
    // console.log('uploading');
    // console.log(tap);
    // this.tapsClient.create(tap).subscribe(
    //     result => {
    //       const newTap = new taplog.TapDto2(data);
    //       newTap.id = result;
    //       this.selectedExecution.taps.push(newTap);
    //       this.submitted = true;
    //       this.updateTap();
    //     },
    //     error => {
    //         console.log('error when uploading tap');
    //         console.log(error);
    //     }
    // );
  }

  updateTap() {
    // const dateAndTime = this.addTapForm.value.time;
    // console.log(dateAndTime.toISOString());
    // const newDateAndTime = new Date(dateAndTime.getTime() + 0.5 * 60000);
    // console.log(newDateAndTime.toISOString());
    // this.mytime = new Date(this.mytime.getTime() + 0.25 * 60000);
    // this.addTapForm.patchValue({
    //   notes: null,
    //   balanceAfter: null,
    //   balanceBefore: null,
    //   fare: null,
    //   expectedResult: 0,
    //   result: 0,
    //   time: newDateAndTime,
    //   device: 1
    // });
  }
  onSubmit() {
    console.log(this.addTapForm.value);

    // const card = this.cardList.find(c => c.id === Number(this.addTapForm.value.card));
    // const device = this.deviceList.find(d => d.id === Number(this.addTapForm.value.device));
    // const time = this.formatTimeAndDate(this.addTapForm.value.time, this.addTapForm.value.date);
    // this.mytime = this.addTapForm.value.time;
    // const data = {
    //   cardType: this.addTapForm.value.cardType,
    //   balanceAfter: Number(this.addTapForm.value.balanceAfter),
    //   balanceBefore: Number(this.addTapForm.value.balanceBefore),
    //   cardAlias: card.alias,
    //   cardId: Number(this.addTapForm.value.card),
    //   cardNumber: card.number,
    //   cardSupplierName: card.supplierName,
    //   caseNumber: '?',
    //   deviceCode: device.code,
    //   deviceId: Number(this.addTapForm.value.device),
    //   deviceName: device.name,
    //   fare: Number(this.addTapForm.value.fare),
    //   id: 0,
    //   notes: this.addTapForm.value.notes,
    //   result: Number(this.addTapForm.value.result),
    //   testerId: 'Current User',
    //   timeOf: time,
    //   wasResultExpected: Number(this.addTapForm.value.expectedResult),
    //   testExecutionId: this.selectedExecution.id,
    // };
    // this.addTap(data);
  }
  formatTimeAndDate = (timeFromForm: Date, dateFromForm: Date): Date => {
    const time = new Date();
    time.setUTCDate(dateFromForm.getUTCDate());
    time.setUTCHours(timeFromForm.getUTCHours());
    time.setUTCMinutes(timeFromForm.getUTCMinutes());
    time.setUTCSeconds(timeFromForm.getUTCSeconds());
    return time;
  }

}

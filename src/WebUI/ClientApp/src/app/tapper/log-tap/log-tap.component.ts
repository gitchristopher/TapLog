import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { TestExecutionDto2, DeviceDto, CardDto, TapsClient, CreateTapCommand, 
  TapDto2, ProductDto, PassDto, CardsClient, UpdateCardCommand } from 'src/app/taplog-api';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { RequireMatch as RequireMatch } from '../../../_validators/requireMatch';
import { AuthorizeService } from 'src/api-authorization/authorize.service';
import { MatSnackBar } from '@angular/material/snack-bar';

interface ICardSelectItem {
  display: string;
  card: CardDto;
}

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
  cardList: ICardSelectItem[];
  passList: PassDto[];
  productList: ProductDto[];
  filteredOptions: Observable<ICardSelectItem[]>;
  submitted = false;
  // mytime: Date = new Date(); // Date.now() + 86400
  selectedCardType: number;
  userName$: Observable<string>;

  @Input() selectedExecution: TestExecutionDto2;
  // tslint:disable-next-line: no-output-on-prefix
  @Output() onSave: EventEmitter<TapDto2> = new EventEmitter<TapDto2>();
  savedTap(e: TestExecutionDto2) {
    this.onSave.emit(e);
  }

  constructor(private tapsClient: TapsClient, private cardsClient: CardsClient,
    private authorizeService: AuthorizeService, private snackBar: MatSnackBar) {
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
    this.userName$ = this.authorizeService.getUser().pipe(map(u => u && u.name));
    this.addTapForm = new FormGroup({
      cardType: new FormControl(),
      card: new FormControl('', [Validators.required, RequireMatch]),
      action: new FormControl(),
      device: new FormControl(),
      result: new FormControl(),
      expectedResult: new FormControl(),
      time: new FormControl(),
      date: new FormControl(),
      fare: new FormControl(),
      balanceBefore: new FormControl(),
      balanceAfter: new FormControl(),
      notes: new FormControl(),
      passes: new FormControl(),
      products: new FormControl(),
    });

    this.tapsClient.getTapForm().subscribe( result => {
      this.deviceList = result.devices;
      this.cardList = new Array<ICardSelectItem>();
      this.passList = result.passes;
      this.productList = result.products;

      result.cards.forEach( card => {
        const cardItem = {} as ICardSelectItem;
        cardItem.card = card;
        if (card.alias == null) {
          cardItem.display = 'Go Card' + ' - ' + card.number;
        } else {
          cardItem.display = card.alias.concat(' - ', card.number);

        }
        this.cardList.push(cardItem);
      });

      // this.filteredOptions = this.addTapForm.get('card').valueChanges.pipe(
      //   startWith(''),
      //   map(value => typeof value === 'string' ? value : value.alias),
      //   map(alias => alias ? this._filter(alias) : this.cardList.slice())
      // );
    }, error => {
      this.snackBar.open(error.title, null, {duration: 3000});
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
          newTap.pass = this.passList.find(x => x.id === tap.passId)?.name;
          newTap.product = this.productList.find(x => x.id === tap.productId)?.name;
          this.selectedExecution.taps.push(newTap);
          this.submitted = true;
          this.updateTapForm();
          this.savedTap(this.selectedExecution);
        },
        error => {
          this.snackBar.open(error.title, null, {duration: 3000});
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
    this.addTapForm.get('action').setValue('0');

    if (this.selectedExecution?.taps?.length > 0) {
      const lastTap = this.selectedExecution.taps[this.selectedExecution.taps.length - 1];
      const cardItem = this.cardList.find(c => Number(c.card.id) === Number(lastTap.cardId));
      this.addTapForm.get('card').setValue(cardItem);
      this.addTapForm.get('passes').setValue(cardItem.card.passId);
      this.addTapForm.get('products').setValue(cardItem.card.productId);
      this.addTapForm.get('notes').setValue(lastTap.notes);
      this.selectedCardType = cardItem.card.supplierId;

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
      const cardItem = this.cardList.find(c => c.card.id === Number(this.addTapForm.value.card.card.id));
      const device = this.deviceList.find(d => d.id === Number(this.addTapForm.value.device));
      const time = this.formatTimeAndDate(this.addTapForm.value.time, this.addTapForm.value.date).toISOString();
      const data = {
        cardType: this.addTapForm.value.cardType,
        balanceAfter: Number(this.addTapForm.value.balanceAfter),
        balanceBefore: Number(this.addTapForm.value.balanceBefore),
        cardAlias: cardItem.card.alias,
        cardId: cardItem.card.id,
        cardNumber: cardItem.card.number,
        cardSupplierName: cardItem.card.supplierName,
        caseNumber: '?',
        deviceCode: device.code,
        deviceId: Number(this.addTapForm.value.device),
        deviceName: device.name,
        fare: Number(this.addTapForm.value.fare),
        id: 0,
        notes: this.addTapForm.value.notes,
        result: Number(this.addTapForm.value.result),
        tester: 'Refresh to see tester',
        timeOf: time,
        wasResultExpected: Number(this.addTapForm.value.expectedResult),
        testExecutionId: this.selectedExecution.id,
        action: Number(this.addTapForm.value.action),
        productId: this.addTapForm.value.products,
        passId: this.addTapForm.value.passes,
      };
      if (cardItem.card.passId !== data.passId || cardItem.card.productId !== data.productId) {
        if (confirm('Would you like to update the card\'s pass and product?')) {
          const newCard = cardItem.card;
          newCard.passId = data.passId;
          newCard.productId = data.productId;
          this.cardsClient.update(newCard.id, new UpdateCardCommand(newCard)).subscribe(result => {
            // Nothing to return on an update
          }, error => {
            this.snackBar.open(error.title, null, {duration: 3000});
          });
          this.cardList.find(c => Number(c.card.id) === Number(newCard.id)).card.productId = newCard.productId;
          this.cardList.find(c => Number(c.card.id) === Number(newCard.id)).card.passId = newCard.passId;
        }
      }
      this.addTap(data);
    }
  }
  formatTimeAndDate = (timeFromForm: Date, dateFromForm: Date): Date => {
    const time = new Date();
    time.setTime(timeFromForm.getTime());
    time.setDate(dateFromForm.getDate());
    return time;
  }

  // selectCardType(num: number) {
  //   // console.log('Fix this crap, chaging cardlist to ICardSelect broke condtional passProd select render');
  //   switch (num) {
  //     case 0:
  //       this.selectedCardType = 0;
  //       break;
  //     case 4:
  //       this.selectedCardType = 1;
  //       break;
  //     default:
  //       console.error('Something when wrong in log-tap cardtype section');
  //       break;
  //   }
  // }

  selectCard(e: ICardSelectItem) {
    const card = CardDto.fromJS(e.card);
    this.selectedCardType = card.supplierId;
    this.addTapForm.get('passes').setValue(card.passId);
    this.addTapForm.get('products').setValue(card.productId);
  }

  displayFn(card: ICardSelectItem): string {
    return card && card.display ? card.display : '';
  }

  private _filter(alias: string): ICardSelectItem[] {
    const filterValue = alias.toLowerCase();

    return this.cardList.filter(cardItem => cardItem.display.toLowerCase().indexOf(filterValue) >= 0);
  }
}

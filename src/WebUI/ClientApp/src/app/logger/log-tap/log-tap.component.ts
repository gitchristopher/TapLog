import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CardDto, CardsClient, CreateTapCommand, DeviceDto, PassDto, ProductDto, TapDto, TapsClient, UpdateCardCommand } from 'src/app/taplog-api';
import { AuthorizeService } from 'src/api-authorization/authorize.service';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { map, startWith } from 'rxjs/operators';
import { AppState, TapsState } from 'src/app/app.state';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TapAction } from 'src/app/TapLog-api';
import { RequireMatch } from 'src/_validators/requireMatch';
import { selectSelectedExecutionId } from '../list-execution/list-execustion.selectors';
import { selectTapFormData, selectTaps, selectTapsList } from '../list-tap/list-tap.selectors';
import { CREATE_TAP_REQUEST, LOAD_TAP_FORM_DATA_REQUEST } from '../list-tap/list-tap.actions';

interface IFormErrors {
  errors: string[];
  title: string;
}

@Component({
  selector: 'app-log-tap',
  templateUrl: './log-tap.component.html',
  styleUrls: ['./log-tap.component.css']
})
export class LogTapComponent implements OnInit {
  actions = Object.keys(TapAction).map(key => TapAction[key]).filter(k => !(parseInt(k) >= 0));
  taps: TapDto[];                                         // Used to populate form data
  selectedExecutionId: number;                            // Used to populate command data & HTML error display
  tapForm: FormGroup;                                     // To capture updated tap values

  deviceList: DeviceDto[];                                // For list in HTML
  productList: ProductDto[];                              // For list in HTML
  passList: PassDto[];                                    // For list in HTML
  cardList: CardDto[];                                    // For list in HTML
  filteredOptions: Observable<CardDto[]>;                 // For list in HTML
  selectedCardType: number;                               // For display in HTML
  formErrors: IFormErrors = { errors: [], title: '' };    // To display API errors in form

  debug = false;
  userName$: Observable<string>;
  user: string;

  constructor(private tapsClient: TapsClient, private cardsClient: CardsClient,
    private authorizeService: AuthorizeService, private snackBar: MatSnackBar,
    private store: Store<AppState>) { }

  ngOnInit() {
    this.store.dispatch(LOAD_TAP_FORM_DATA_REQUEST());
    this.userName$ = this.authorizeService.getUser().pipe(map(u => u && u.name)).pipe(map(u => this.user = u));
    this.tapForm = new FormGroup({
      cardType: new FormControl(),
      card: new FormControl('', [Validators.required, RequireMatch]),
      action: new FormControl(),
      device: new FormControl(),
      result: new FormControl(),
      expectedResult: new FormControl(),
      time: new FormControl('', [Validators.required]),
      date: new FormControl('', [Validators.required]),
      fare: new FormControl(),
      balanceBefore: new FormControl(),
      balanceAfter: new FormControl(),
      notes: new FormControl(),
      passes: new FormControl(),
      products: new FormControl(),
    });
    this.tapForm.disable();

    this.store.select(selectTaps).subscribe((tapsState => {
      this.handleApiErrors(tapsState?.error); // TODO: Handle errors properly
    }));

    this.store.select(selectTapFormData).subscribe((formVM => {
      this.cardList = formVM.cards;
      this.deviceList = formVM.devices;
      this.passList = formVM.passes;
      this.productList = formVM.products;
    }));

    this.store.select(selectTapsList).subscribe(tapsStateList => {
      this.taps = tapsStateList;
      // Reset tap form for next entry.
      this.resetTapForm();
      if (tapsStateList?.length) {
        // Update tap form when new list is recieved so last tap in list can populate the tap logger.
        this.updateTapForm();
      }
    });

    this.store.select(selectSelectedExecutionId).subscribe(selectedExecutionId => {
      this.selectedExecutionId = selectedExecutionId;
      if (Number.isInteger(selectedExecutionId)) {
        this.tapForm.enable();
      } else {
        this.resetTapForm();
        this.tapForm.disable();
      }
      this.selectedCardType = null;
    });
  }

  /**
   * Adds the errors sent from the API to the Form Errors to be displayed.
   */
  private handleApiErrors(error: any) {
    // TODO: handle errors properly
    if (error !== null) {
      if (this.formErrors.errors.length == 0) {
        const flatErrors = [].concat(...Object.values(error));
        this.formErrors.errors = flatErrors;
        this.formErrors.title = 'A validation error has occured.';
        this.snackBar.open(this.formErrors.title, null, { duration: 5000 });
      }
    } else {
      this.formErrors = { errors: [], title: '' };
    }
  }

  /**
   * Update the form with expected values to make entering data quicker / easier.
   * Previously used card is set, along with a slight increment in time, result and expected result assumed successful.
   */
  updateTapForm() {
    // Set the card and card's Pass/Product
    const lastTap = this.taps[this.taps.length - 1];
    const card = this.cardList.find(c => c.id === lastTap.cardId);
    this.tapForm.get('card').setValue(card);
    this.setPassAndProduct(card);

    //Set seperate time and date for components
    let newTime = new Date(Date.parse(lastTap.timeOf));
    newTime.setTime(newTime.getTime() + 15000);
    let newDate = new Date(Date.parse(lastTap.timeOf));
    // HACK: There has to be a better way
    newDate.setHours(23, 0, 0);
    this.tapForm.get('time').setValue(newTime);
    this.tapForm.get('date').setValue(newDate);
  }

  /**
   * Resets the form to default values.
   */
  resetTapForm() {
    // HACK: There has to be a better way
    // Date picker is time is set to 11pm. The date shown will be the previous day if time is under 10am.
    let newTime: Date = new Date();
    let newDate = new Date(newTime);
    newDate.setHours(23, 0, 0);

    // Enables the auto complete
    this.filteredOptions = this.tapForm.get('card').valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.alias),
      map(alias => alias ? this._filter(alias) : this.cardList?.slice())
    );

    this.tapForm.patchValue({
      card: '',
      balanceAfter: null,
      balanceBefore: null,
      fare: null,
      time: newTime,
      date: newDate,
      device: null,
      notes: null,
      result: '0',
      action: null,
      expectedResult: '0'
    });
  }

  /**
   * Sends the form data to the API to persist the Tap.
   */
  onSubmit() {
    const cmdData = this.formatCommandData();
    const result = this.updatePassAndProduct(cmdData);
    const tap = new CreateTapCommand(cmdData);
    this.store.dispatch(CREATE_TAP_REQUEST({ tap }));
    this.formErrors = { errors: [], title: '' };
  }

  /**
   * Create a data object for the purpose of populating an CreateTapCommand object.
   * Ensures the values from the form are of the correct type, and all fields exist and populated.
   */
  private formatCommandData() {
    const time = this.formatTimeAndDate(this.tapForm.value.time as Date, this.tapForm.value.date as Date).toISOString();
    const passId = Number(this.tapForm.value.passes) == 0 ? null : Number(this.tapForm.value.passes);
    const productId = Number(this.tapForm.value.products) == 0 ? null : Number(this.tapForm.value.products);
    return {
      testExecutionId: this.selectedExecutionId,
      cardId: Number(this.tapForm.value.card.id),
      deviceId: Number(this.tapForm.value.device),
      tester: this.user ?? 'Current User', // TODO: remove from DTO, user is set by API
      caseNumber: null,
      result: Number(this.tapForm.value.result),
      wasResultExpected: Number(this.tapForm.value.expectedResult),
      timeOf: time,
      fare: Number(this.tapForm.value.fare),
      balanceBefore: Number(this.tapForm.value.balanceAfter),
      balanceAfter: Number(this.tapForm.value.balanceBefore),
      notes: this.tapForm.value.notes,
      action: Number(this.tapForm.value.action),
      passId: passId,
      productId: productId,
    };
  }

  /**
   * Combines the Date & Time from the form into one value.
   */
  formatTimeAndDate = (timeFromForm: Date, dateFromForm: Date): Date => {
    const time = new Date();
    time.setTime(timeFromForm.getTime());
    time.setDate(dateFromForm.getDate());
    return time;
  }

  /**
   * Sends and update request to the API when the pass / product has been changed from the cards current values.
   */
  updatePassAndProduct(data: any): boolean {
    const newCard = { ...this.cardList.find(c => c.id == this.tapForm.get('card').value.id) };
    if (newCard.passId !== data.passId || newCard.productId !== data.productId) {
      if (confirm('Would you like to update the card\'s pass and product?')) {
        newCard.passId = data.passId;
        newCard.productId = data.productId;
        newCard.passId = -1;
        newCard.productId = -1;
        // Passes and products only exist on GC cards
        // GC cards do not have an alias
        newCard.alias = '';
        this.cardsClient.update(newCard.id, new UpdateCardCommand(newCard)).subscribe(result => {
          // Get new dropdown list data as card details have changed.
          this.store.dispatch(LOAD_TAP_FORM_DATA_REQUEST());
        }, error => {
          this.handleApiErrors(error);
        });
      };
    }
    return false
  }

  /**
   * Clears the notes form field
   */
  clearNotes() {
    this.tapForm.get('notes').setValue('');
    this.formErrors.errors = [];
  }

  /**
   * Updates the Pass & Product form fields based on which card is selected.
   */
  setPassAndProduct(card: CardDto) {
    this.selectedCardType = card.supplierId;
    this.tapForm.get('passes').setValue(card.passId);
    this.tapForm.get('products').setValue(card.productId);
  }

  /**
   * Used by auto complete to determin what to display as the option label.
   */
  displayFn(card: CardDto): string {
    return card && card.alias ? card.alias : '';
  }

  /**
   * Used by auto complete to filter the card list.
   */
  private _filter(alias: string): CardDto[] {
    const filterValue = alias.toLowerCase();

    return this.cardList.filter(card => card.alias.toLowerCase().indexOf(filterValue) >= 0);
  }

  /**
   * Displays API errors.
   */
  // addErrorFromApi(error: any) {
  //   this.formErrors.errors = [];
  //   const response = JSON.parse(error['response']);
  //   this.formErrors.title = response['title'];
  //   const errorArray = Object.values(response['errors']);
  //   errorArray.forEach(element => {
  //     this.formErrors.errors.push(element[0]);
  //   });
  // }
}

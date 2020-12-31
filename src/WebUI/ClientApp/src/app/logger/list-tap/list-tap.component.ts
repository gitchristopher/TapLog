import { Component, OnInit, ViewChild } from '@angular/core';
import { style, animate, transition, trigger } from '@angular/animations';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TapsClient, DeviceDto, CardDto, UpdateTapCommand, ProductDto, PassDto, TapDto, TestExecutionDto } from 'src/app/taplog-api';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState, TapsState } from 'src/app/app.state';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatAccordion } from '@angular/material/expansion';
import { ActionsEnum } from 'src/_enums/tap-action.enum';
import { RequireMatch as RequireMatch } from '../../../_validators/requireMatch';
import { selectTaps, selectTapsListForSelectedExecution } from './list-tap.selectors';
import { selectSelectedExecution, selectSelectedExecutionId } from '../list-execution/list-execustion.selectors';
import { CLEAR_TAPS, CLEAR_TAP_ERRORS, DELETE_TAP_REQUEST, DESELECT_TAP, EDIT_TAP, LOAD_EXECUTION_TAPS_REQUEST, UPDATE_TAP_REQUEST } from './list-tap.actions';

interface IFormErrors {
  errors: string[];
  title: string;
}

@Component({
  selector: 'app-list-tap',
  templateUrl: './list-tap.component.html',
  styleUrls: ['./list-tap.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [style({ opacity: 0 }), animate('1000ms ease-in-out', style({ opacity: 1 }))]),
    ]),
    trigger('fadeOutIn', [
      transition(':enter', [style({ opacity: 0 }), animate('500ms 500ms ease-in-out', style({ opacity: 1 }))]),
      transition(':leave', [animate('500ms ease-out', style({ opacity: 0 }))])
    ])
  ]
})

export class ListTapComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;     // For list in HTML
  selectedExecutionTaps$: Observable<TapDto[]>;         // For list in HTML
  selectedExecutionId: number;                          // For loading the correct taps
  selectedExecution: TestExecutionDto;                  // Used to populate update form data command
  taps: TapDto[];                                       // Used to populate update form data command
  actions = Object.keys(ActionsEnum).map(key => ActionsEnum[key]).filter(k => !(parseInt(k) >= 0));
  isChecked = false;                                    // For toggeling the accordian
  isDisabled = false;                                   // For disabling the accordian toggle
  isEditing: number;                                    // For determining which tap is being edited
  selectedTapId: number;                                // For determining which tap is being viewed (keep accordian open on load)
  updateTapForm: FormGroup;                             // To capture updated tap values
  deviceList: DeviceDto[];                              // For list in HTML
  productList: ProductDto[];                            // For list in HTML
  passList: PassDto[];                                  // For list in HTML
  cardList: CardDto[];                                  // For list in HTML
  filteredOptions: Observable<CardDto[]>;               // For list in HTML
  formErrors: IFormErrors = { errors: [], title: '' };    // To display API errors in form

  constructor(
    private tapsClient: TapsClient,
    private snackBar: MatSnackBar,
    private store: Store<AppState>) { }

  ngOnInit() {
    this.selectedExecutionTaps$ = this.store.select(selectTapsListForSelectedExecution);
    this.store.select(selectSelectedExecution).subscribe((execution => this.selectedExecution = execution));
    this.store.select(selectTaps).subscribe((tapsState => {
      this.taps = tapsState.list;
      this.isEditing = tapsState.editingId;
      this.selectedTapId = tapsState.selectedId;
      this.handleApiErrors(tapsState.error);
    }));

    this.store.select(selectSelectedExecutionId).subscribe((executionId => {
      this.isChecked = this.selectedExecutionId == executionId;
      this.selectedExecutionId = executionId;

      if (Number.isInteger(executionId)) {
        // Get a new list of taps when the selected execution changes
        this.store.dispatch(LOAD_EXECUTION_TAPS_REQUEST({ executionId }));
      } else {
        // Close the list since there isnt a selected execution (no tap list)
        if (this.taps.length) {
          this.store.dispatch(CLEAR_TAPS());
        }
        this.isChecked = false;
      }
    }));

    this.initialiseForm();
  }

  /**
   * Adds the errors from state to the Form Errors to be displayed.
   */
  private handleApiErrors(error: any) {
    // TODO: handle errors properly
    if (error !== null) {
      if (this.formErrors.errors.length == 0) {
        const flatErrors = [].concat(...Object.values(error));
        this.formErrors.errors = flatErrors;
        this.formErrors.title = 'A validaton error has occured. list tap';
        this.snackBar.open(this.formErrors.title, null, { duration: 5000 });
      }
    } else {
      this.formErrors = { errors: [], title: '' };
    }
  }

  /**
   * Initialise the update tap form.
   */
  private initialiseForm() {
    this.updateTapForm = new FormGroup({
      cardType: new FormControl(),
      card: new FormControl('', [Validators.required, RequireMatch]),
      device: new FormControl(),
      result: new FormControl(),
      action: new FormControl(),
      expectedResult: new FormControl(),
      time: new FormControl('', [Validators.required]),
      date: new FormControl('', [Validators.required]),
      fare: new FormControl(),
      balanceBefore: new FormControl(),
      balanceAfter: new FormControl(),
      notes: new FormControl(),
      product: new FormControl(),
      pass: new FormControl(),
    });
  }

  /**
   * Allows for the deletion of a TAP.
   */
  deleteTap(tap: TapDto) {
    if (confirm(`Are you sure to delete tap: ${tap.id}?`)) {
      this.store.dispatch(DELETE_TAP_REQUEST({ executionId: tap.testExecutionId, tapId: tap.id }));
    }
  }

  /**
   * Sets the component into edit mode.
   */
  editTap(tap: TapDto) {
    this.store.dispatch(EDIT_TAP({ tapId: tap.id }));
    if (this.cardList == null || this.deviceList == null) {
      this.getFormInformationFromApi();
    } else {
      this.loadDataIntoForm();
    }
  }

  /**
   * Sets the form values.
   */
  loadDataIntoForm() {
    const tapToEditId = this.isEditing;
    const tapToEdit = this.taps.find(x => x.id === tapToEditId);
    const card = this.cardList.find(c => c.id === tapToEdit.cardId);
    const tempTime = new Date(tapToEdit.timeOf);
    const tempDate = new Date(tapToEdit.timeOf);
    // HACK: There has to be a better way
    tempDate.setHours(23, 0, 0);

    this.updateTapForm.get('card').setValue(card);
    this.updateTapForm.get('result').setValue(tapToEdit.result.toString());
    this.updateTapForm.get('action').setValue(tapToEdit.action.toString());
    this.updateTapForm.get('expectedResult').setValue(tapToEdit.wasResultExpected.toString());
    this.updateTapForm.patchValue({
      notes: tapToEdit.notes,
      balanceAfter: tapToEdit.balanceAfter,
      balanceBefore: tapToEdit.balanceBefore,
      fare: tapToEdit.fare,
      time: tempTime,
      date: tempDate,
      device: tapToEdit.deviceId,
      product: this.productList.find(x => x.name === tapToEdit.product)?.id,
      pass: this.passList.find(x => x.name === tapToEdit.pass)?.id,
    });
  }

  /**
   * Retrieves the card and device lists from the API to populate the select fields
   */
  getFormInformationFromApi() {
    this.tapsClient.getTapForm().subscribe(result => {
      this.passList = result.passes;
      this.deviceList = result.devices;
      this.productList = result.products;
      this.cardList = new Array<CardDto>();
      result.cards.forEach(card => {
        // GC dont have an alias but for display purposes
        // it would make sence to have a generic alias
        if (card.alias == null) {
          card.alias = 'Go Card';
        }
        card.alias = card.alias.concat(' - ', card.number);
        this.cardList.push(card);
      });

      // Enables the auto complete
      this.filteredOptions = this.updateTapForm.get('card').valueChanges.pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.alias),
        map(alias => alias ? this._filter(alias) : this.cardList.slice())
      );

      this.loadDataIntoForm();
    }, error => {
      this.snackBar.open(error.title, null, { duration: 3000 });
    });
  }

  /**
   * Toggles all accordians open and closed.
   * Exits edit mode when closing.
   */
  toggleChanged(e: Event) {
    this.isChecked = !this.isChecked;
    this.isChecked ? this.accordion.openAll() : this.accordion.closeAll();
  }

  /**
   * Exits edit mode.
   */
  closeEdit(tap: TapDto) {
    if (this.selectedTapId == tap.id || this.isEditing == tap.id) {
      if(this.isEditing == tap.id){
        this.loadDataIntoForm();
      }
      this.store.dispatch(DESELECT_TAP());
    }
  }

  /**
   * Sends the form data to the API as an Update Request.
   */
  onSubmit() {
    const cmdData = this.formatCommandData();
    const tap = new UpdateTapCommand(cmdData);
    this.store.dispatch(UPDATE_TAP_REQUEST({ tap }))
  }

  /**
   * Create a data object for the purpose of populating an UpdateTapCommand object.
   * Ensures the values from the form are of the correct type, and all fields exist and populated.
   */
  private formatCommandData() {
    const time = this.formatTimeAndDate(this.updateTapForm.value.time as Date, this.updateTapForm.value.date as Date).toISOString();
    return {
      testExecutionId: this.selectedExecution.id,
      balanceAfter: Number(this.updateTapForm.value.balanceAfter),
      balanceBefore: Number(this.updateTapForm.value.balanceBefore),
      cardId: Number(this.updateTapForm.value.card.id),
      caseNumber: null,
      deviceId: Number(this.updateTapForm.value.device),
      fare: Number(this.updateTapForm.value.fare),
      id: Number(this.isEditing),
      notes: this.updateTapForm.value.notes,
      result: Number(this.updateTapForm.value.result),
      action: Number(this.updateTapForm.value.action),
      tester: 'Current User',
      timeOf: time,
      wasResultExpected: Number(this.updateTapForm.value.expectedResult),
      productId: Number(this.updateTapForm.value.product),
      passId: Number(this.updateTapForm.value.pass),
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

  /**
   * HACK: Fix how dates are done, if this is used the function is continuously called.
   */
  // toDate(x) {
  //   return Date.parse(x);
  // }
}

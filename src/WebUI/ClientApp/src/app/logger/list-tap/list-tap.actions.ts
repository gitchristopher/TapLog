import { createAction, props } from '@ngrx/store';
import { TapDto, UpdateTapCommand, AddTapVM, CreateTapCommand } from 'src/app/taplog-api';

export const LOAD_EXECUTION_TAPS_REQUEST = createAction('[Taps] Load Execution Taps Request', props<{ executionId: number }>());
export const LOAD_EXECUTION_TAPS_FAIL = createAction('[Taps] Load Execution Taps Fail', props<{ error: any }>());
export const LOAD_EXECUTION_TAPS_SUCCESS = createAction('[Taps] Load Execution Taps Success', props<{ taps: TapDto[] }>());

export const LOAD_TAP_FORM_DATA_REQUEST = createAction('[Taps] Load Tap Form Data Request');
export const LOAD_TAP_FORM_DATA_FAIL = createAction('[Taps] Load Tap Form Data Fail', props<{ error: any }>());
export const LOAD_TAP_FORM_DATA_SUCCESS = createAction('[Taps] Load Tap Form Data Success', props<{formData: AddTapVM}>());

export const SELECT_TAP = createAction('[Taps] Select Tap', props<{ tapId: number }>());
export const EDIT_TAP = createAction('[Taps] Select Tap', props<{ tapId: number }>());
export const DESELECT_TAP = createAction('[Taps] Deselect Tap');
export const CLEAR_TAPS = createAction('[Taps] Clear Taps');
export const CLEAR_TAP_ERRORS = createAction('[Taps] Clear Tap Errors');

export const CREATE_TAP_REQUEST = createAction('[Taps] Create Tap Request', props<{ tap: CreateTapCommand }>());
export const CREATE_TAP_FAIL = createAction('[Taps] Create Tap Fail', props<{ error: any }>());

export const DELETE_TAP_REQUEST = createAction('[Taps] Delete Tap Request', props<{ tapId: number, executionId: number }>());
export const DELETE_TAP_FAIL = createAction('[Taps] Delete Tap Fail', props<{ error: any }>());
export const DELETE_TAP_SUCCESS = createAction('[Taps] Delete Tap Success', props<{ tapId: number, executionId: number }>());

export const UPDATE_TAP_REQUEST = createAction('[Taps] Update Tap Request', props<{ tap: UpdateTapCommand }>());
export const UPDATE_TAP_FAIL = createAction('[Taps] Update Tap Fail', props<{ error: any }>());

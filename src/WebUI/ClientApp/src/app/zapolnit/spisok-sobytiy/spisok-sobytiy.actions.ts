import { createAction, props } from '@ngrx/store';
import { TapDto, CreateTestExecutionCommand, UpdateTapCommand, AddTapVM, CreateTapCommand } from 'src/app/taplog-api';

export const LOAD_EXECUTION_TAPS_REQUEST = createAction('[Zapolnit-sobytiy] Load Execution Taps Request', props<{ executionId: number }>());
export const LOAD_EXECUTION_TAPS_FAIL = createAction('[Zapolnit-sobytiy] Load Execution Taps Fail', props<{ error: any }>());
export const LOAD_EXECUTION_TAPS_SUCCESS = createAction('[Zapolnit-sobytiy] Load Execution Taps Success', props<{ taps: TapDto[] }>());

export const LOAD_TAP_FORM_DATA_REQUEST = createAction('[Zapolnit-sobytiy] Load Tap Form Data Request');
export const LOAD_TAP_FORM_DATA_FAIL = createAction('[Zapolnit-sobytiy] Load Tap Form Data Fail', props<{ error: any }>());
export const LOAD_TAP_FORM_DATA_SUCCESS = createAction('[Zapolnit-sobytiy] Load Tap Form Data Success', props<{formData: AddTapVM}>());

export const SELECT_TAP = createAction('[Zapolnit-sobytiy] Select Tap', props<{ tapId: number }>());
export const EDIT_TAP = createAction('[Zapolnit-sobytiy] Select Tap', props<{ tapId: number }>());
export const DESELECT_TAP = createAction('[Zapolnit-sobytiy] Deselect Tap');
export const CLEAR_TAPS = createAction('[Zapolnit-sobytiy] Clear Taps');

export const CREATE_TAP_REQUEST = createAction('[Zapolnit-sobytiy] Create Tap Request', props<{ tap: CreateTapCommand }>());
export const CREATE_TAP_FAIL = createAction('[Zapolnit-sobytiy] Create Tap Fail', props<{ error: any }>());

export const DELETE_TAP_REQUEST = createAction('[Zapolnit-sobytiy] Delete Tap Request', props<{ tapId: number, executionId: number }>());
export const DELETE_TAP_FAIL = createAction('[Zapolnit-sobytiy] Delete Tap Fail', props<{ error: any }>());
export const DELETE_TAP_SUCCESS = createAction('[Zapolnit-sobytiy] Delete Tap Success', props<{ tapId: number, executionId: number }>());

export const UPDATE_TAP_REQUEST = createAction('[Zapolnit-sobytiy] Update Tap Request', props<{ tap: UpdateTapCommand }>());
export const UPDATE_TAP_FAIL = createAction('[Zapolnit-sobytiy] Update Tap Fail', props<{ error: any }>());

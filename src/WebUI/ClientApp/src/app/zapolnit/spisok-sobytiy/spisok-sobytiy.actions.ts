import { createAction, props } from '@ngrx/store';
import { TapDto, CreateTestExecutionCommand, UpdateTestExecutionCommand } from 'src/app/taplog-api';

// export const LOAD_TAPS_REQUEST = createAction('[Zapolnit-sobytiy] Load Taps Request', props<{executionId: number}>());
// export const LOAD_TAPS_FAIL = createAction('[Zapolnit-sobytiy] Load Taps Fail', props<{error: any}>());
// export const LOAD_TAPS_SUCCESS = createAction('[Zapolnit-sobytiy] Load Taps Success', props<{taps: TapDto[]}>());

// export const SELECT_TAP = createAction('[Zapolnit-sobytiy] Select Execution', props<{executionId: number}>());
// export const DESELECT_TAP = createAction('[Zapolnit-sobytiy] Deselect Execution');

export const CREATE_TAP_REQUEST = createAction('[Zapolnit-sobytiy] Create Execution Request',
    props<{execution: CreateTestExecutionCommand}>());
export const CREATE_TAP_FAIL = createAction('[Zapolnit-sobytiy] Create Execution Fail',
    props<{error: any}>());

// export const DELETE_TAP_REQUEST = createAction('[Zapolnit-sobytiy] Delete Tap Request', props<{tapId: number}>());
// export const DELETE_TAP_FAIL = createAction('[Zapolnit-sobytiy] Delete Tap Fail', props<{error: any}>());
// export const DELETE_TAP_SUCCESS = createAction('[Zapolnit-sobytiy] Delete Tap Success', props<{tapId: number}>());

// export const UPDATE_EXECUTION_REQUEST = createAction('[Zapolnit-sobytiy] Update Execution Request', props<{executionId: number, executionUpdate: UpdateTestExecutionCommand}>());
// export const UPDATE_EXECUTION_FAIL = createAction('[Zapolnit-sobytiy] Update Execution Fail', props<{error: any}>());

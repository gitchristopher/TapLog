import { createAction, props } from '@ngrx/store';
import { TestDto, CreateTestCommand, UpdateTestCommand } from 'src/app/taplog-api';

export const LOAD_TESTS_REQUEST = createAction('[Zapolnit] Load Tests Request', props<{stageId: number}>());
export const LOAD_TESTS_FAIL = createAction('[Zapolnit] Load Tests Fail', props<{error: any}>());
export const LOAD_TESTS_SUCCESS = createAction('[Zapolnit] Load Tests Success', props<{tests: TestDto[]}>());
export const SELECT_TEST = createAction('[Zapolnit] Select Test', props<{testId: number}>());
export const DESELECT_TEST = createAction('[Zapolnit] Deselect Test');

export const CREATE_TEST_REQUEST = createAction('[Zapolnit] Create Test Request', props<{test: CreateTestCommand}>());
export const CREATE_TEST_FAIL = createAction('[Zapolnit] Create Test Fail', props<{error: any}>());
// export const CREATE_TEST_SUCCESS = createAction('[Zapolnit] Create Test Success', props<{testId: number}>());

export const DELETE_TEST_REQUEST = createAction('[Zapolnit] Delete Test Request', props<{testId: number}>()); // TODO: Find better way to dela with deleting items and nocontent return
export const DELETE_TEST_FAIL = createAction('[Zapolnit] Delete Test Fail', props<{error: any}>());
export const DELETE_TEST_SUCCESS = createAction('[Zapolnit] Delete Test Success', props<{testId: number}>());

export const UPDATE_TEST_REQUEST = createAction('[Zapolnit] Update Test Request', props<{stageId: number, testId: number, testUpdate: UpdateTestCommand}>());
export const UPDATE_TEST_FAIL = createAction('[Zapolnit] Update Test Fail', props<{error: any}>());
// export const UPDATE_TEST_SUCCESS = createAction('[Zapolnit] Update Test Success', props<{testId: number}>());

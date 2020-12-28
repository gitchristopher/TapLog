import { createAction, props } from '@ngrx/store';
import { TestDto, CreateTestCommand, UpdateTestCommand } from 'src/app/taplog-api';

export const LOAD_TESTS_REQUEST = createAction('[Zapolnit-testov] Load Tests Request', props<{stageId: number}>());
export const LOAD_TESTS_FAIL = createAction('[Zapolnit-testov] Load Tests Fail', props<{error: any}>());
export const LOAD_TESTS_SUCCESS = createAction('[Zapolnit-testov] Load Tests Success', props<{tests: TestDto[]}>());
export const SELECT_TEST = createAction('[Zapolnit-testov] Select Test', props<{testId: number}>());
export const DESELECT_TEST = createAction('[Zapolnit-testov] Deselect Test');

export const CREATE_TEST_REQUEST = createAction('[Zapolnit-testov] Create Test Request', props<{test: CreateTestCommand}>());
export const CREATE_TEST_FAIL = createAction('[Zapolnit-testov] Create Test Fail', props<{error: any}>());
// export const CREATE_TEST_SUCCESS = createAction('[Zapolnit-testov] Create Test Success', props<{testId: number}>());

export const DELETE_TEST_REQUEST = createAction('[Zapolnit-testov] Delete Test Request', props<{testId: number, stageId: number}>()); // TODO: Find better way to dela with deleting items and nocontent return
export const DELETE_TEST_FAIL = createAction('[Zapolnit-testov] Delete Test Fail', props<{error: any}>());
export const DELETE_TEST_SUCCESS = createAction('[Zapolnit-testov] Delete Test Success', props<{testId: number}>());

export const UPDATE_TEST_REQUEST = createAction('[Zapolnit-testov] Update Test Request', props<{stageId: number, testId: number, testUpdate: UpdateTestCommand}>());
export const UPDATE_TEST_FAIL = createAction('[Zapolnit-testov] Update Test Fail', props<{error: any}>());
// export const UPDATE_TEST_SUCCESS = createAction('[Zapolnit-testov] Update Test Success', props<{testId: number}>());

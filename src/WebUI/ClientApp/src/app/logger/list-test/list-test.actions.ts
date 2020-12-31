import { createAction, props } from '@ngrx/store';
import { TestDto, CreateTestCommand, UpdateTestCommand } from 'src/app/taplog-api';

export const LOAD_TESTS_REQUEST = createAction('[Tests] Load Tests Request', props<{stageId: number}>());
export const LOAD_TESTS_FAIL = createAction('[Tests] Load Tests Fail', props<{error: any}>());
export const LOAD_TESTS_SUCCESS = createAction('[Tests] Load Tests Success', props<{tests: TestDto[]}>());
export const SELECT_TEST = createAction('[Tests] Select Test', props<{testId: number}>());
export const DESELECT_TEST = createAction('[Tests] Deselect Test');

export const CREATE_TEST_REQUEST = createAction('[Tests] Create Test Request', props<{test: CreateTestCommand}>());
export const CREATE_TEST_FAIL = createAction('[Tests] Create Test Fail', props<{error: any}>());

export const DELETE_TEST_REQUEST = createAction('[Tests] Delete Test Request', props<{testId: number, stageId: number}>()); // TODO: Find better way to dela with deleting items and nocontent return
export const DELETE_TEST_FAIL = createAction('[Tests] Delete Test Fail', props<{error: any}>());
export const DELETE_TEST_SUCCESS = createAction('[Tests] Delete Test Success', props<{testId: number}>());

export const UPDATE_TEST_REQUEST = createAction('[Tests] Update Test Request', props<{stageId: number, testId: number, testUpdate: UpdateTestCommand}>());
export const UPDATE_TEST_FAIL = createAction('[Tests] Update Test Fail', props<{error: any}>());
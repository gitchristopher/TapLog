import { createAction, props } from '@ngrx/store';
import { TestExecutionDto, CreateTestExecutionCommand, UpdateTestExecutionCommand } from 'src/app/taplog-api';

// tslint:disable-next-line: max-line-length
export const LOAD_EXECUTIONS_REQUEST = createAction('[Zapolnit-kazney] Load Executions Request',
    props<{stageId: number, testId: number}>());
export const LOAD_EXECUTIONS_FAIL = createAction('[Zapolnit-kazney] Load Executions Fail',
    props<{error: any}>());
export const LOAD_EXECUTIONS_SUCCESS = createAction('[Zapolnit-kazney] Load Executions Success',
    props<{executions: TestExecutionDto[]}>());
export const SELECT_EXECUTION = createAction('[Zapolnit-kazney] Select Execution',
    props<{executionId: number}>());
export const DESELECT_EXECUTION = createAction('[Zapolnit-kazney] Deselect Execution');

export const CREATE_EXECUTION_REQUEST = createAction('[Zapolnit-kazney] Create Execution Request',
    props<{execution: CreateTestExecutionCommand}>());
export const CREATE_EXECUTION_FAIL = createAction('[Zapolnit-kazney] Create Execution Fail',
    props<{error: any}>());

export const DELETE_EXECUTION_REQUEST = createAction('[Zapolnit-kazney] Delete Execution Request',
    props<{executionId: number}>());
export const DELETE_EXECUTION_FAIL = createAction('[Zapolnit-kazney] Delete Execution Fail',
    props<{error: any}>());
export const DELETE_EXECUTION_SUCCESS = createAction('[Zapolnit-kazney] Delete Execution Success',
    props<{executionId: number}>());

// export const UPDATE_EXECUTION_REQUEST = createAction('[Zapolnit-kazney] Update Execution Request', props<{executionId: number, executionUpdate: UpdateTestExecutionCommand}>());
// export const UPDATE_EXECUTION_FAIL = createAction('[Zapolnit-kazney] Update Execution Fail', props<{error: any}>());

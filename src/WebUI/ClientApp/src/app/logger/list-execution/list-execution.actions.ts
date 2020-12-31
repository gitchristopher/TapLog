import { createAction, props } from '@ngrx/store';
import { TestExecutionDto, CreateTestExecutionCommand } from 'src/app/taplog-api';

export const LOAD_EXECUTIONS_REQUEST = createAction('[Executions] Load Executions Request', props<{ stageId: number, testId: number }>());
export const LOAD_EXECUTIONS_FAIL = createAction('[Executions] Load Executions Fail', props<{ error: any }>());
export const LOAD_EXECUTIONS_SUCCESS = createAction('[Executions] Load Executions Success', props<{ executions: TestExecutionDto[] }>());

export const SELECT_EXECUTION = createAction('[Executions] Select Execution', props<{ executionId: number }>());
export const DESELECT_EXECUTION = createAction('[Executions] Deselect Execution');
export const CLEAR_EXECUTIONS = createAction('[Executions] Clear Executions');

export const CREATE_EXECUTION_REQUEST = createAction('[Executions] Create Execution Request', props<{ execution: CreateTestExecutionCommand }>());
export const CREATE_EXECUTION_FAIL = createAction('[Executions] Create Execution Fail', props<{ error: any }>());

export const DELETE_EXECUTION_REQUEST = createAction('[Executions] Delete Execution Request', props<{ executionId: number }>());
export const DELETE_EXECUTION_FAIL = createAction('[Executions] Delete Execution Fail', props<{ error: any }>());
export const DELETE_EXECUTION_SUCCESS = createAction('[Executions] Delete Execution Success', props<{ executionId: number }>());
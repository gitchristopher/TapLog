import { createReducer, on, State, Action } from '@ngrx/store';
import { LOAD_EXECUTIONS_FAIL, LOAD_EXECUTIONS_REQUEST, LOAD_EXECUTIONS_SUCCESS, SELECT_EXECUTION, DESELECT_EXECUTION, CREATE_EXECUTION_REQUEST, CREATE_EXECUTION_FAIL, DELETE_EXECUTION_REQUEST, DELETE_EXECUTION_SUCCESS, DELETE_EXECUTION_FAIL } from './spisok-kazney.actions';
import { ExecutionsState, AppState } from 'src/app/app.state';
import { TestExecutionDto } from 'src/app/taplog-api';

const initialState: ExecutionsState = {
    list: [],
    loading: false,
    loaded: false,
};

export const kazneyReducer = createReducer<ExecutionsState>(
    initialState,
    on(LOAD_EXECUTIONS_REQUEST, state => ({ ...state, loading: true, loaded: false })),
    on(LOAD_EXECUTIONS_SUCCESS, (state, {executions}) => ({ ...state, list: executions, loading: false, loaded: true })),
    on(LOAD_EXECUTIONS_FAIL, state => ({ ...state, loading: false, loaded: false })),
    on(SELECT_EXECUTION, (state, {executionId}) => ({ ...state, selectedId: executionId })),
    on(DESELECT_EXECUTION, state => ({ ...state, selectedId: null })),

    on(CREATE_EXECUTION_REQUEST, state => ({...state, loading: true, loaded: false })),
    on(CREATE_EXECUTION_FAIL, (state, {error}) => ({ ...state, loading: false, loaded: false, error: error })),
    on(DELETE_EXECUTION_REQUEST, (state, {executionId}) => ({...state, loading: true, loaded: false })),
    on(DELETE_EXECUTION_SUCCESS, (state, {executionId}) => ({ ...state, list: state.list.filter(e => e.id != executionId ), loading: false, loaded: true })),
    on(DELETE_EXECUTION_FAIL, (state, {error}) => ({ ...state, loading: false, loaded: false, error: error })),
);

import { createSelector } from '@ngrx/store';

export const selectExecutionsState = (state: AppState) => state.executions;

export const selectExecutionsList = createSelector(
    selectExecutionsState,
    (state: ExecutionsState) => state.list
);

export const selectSelectedExecutionId = createSelector(
    selectExecutionsState,
    (state: ExecutionsState) => state.selectedId
);
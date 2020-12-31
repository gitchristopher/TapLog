import { LOAD_EXECUTIONS_FAIL, LOAD_EXECUTIONS_REQUEST, LOAD_EXECUTIONS_SUCCESS, SELECT_EXECUTION, DESELECT_EXECUTION, CREATE_EXECUTION_REQUEST, CREATE_EXECUTION_FAIL, DELETE_EXECUTION_REQUEST, DELETE_EXECUTION_SUCCESS, DELETE_EXECUTION_FAIL, CLEAR_EXECUTIONS } from './list-execution.actions';
import { ExecutionsState } from 'src/app/app.state';
import { createReducer, on } from '@ngrx/store';

const initialState: ExecutionsState = {
    list: [],
    loading: false,
};

export const ExecutionReducer = createReducer<ExecutionsState>(
    initialState,
    on(LOAD_EXECUTIONS_REQUEST, state => ({ ...state, loading: true, selectedId: null, error: null })),
    on(LOAD_EXECUTIONS_SUCCESS, (state, { executions }) => ({ ...state, list: executions, loading: false })),
    on(LOAD_EXECUTIONS_FAIL, state => ({ ...state, loading: false })),
    on(SELECT_EXECUTION, (state, { executionId }) => ({ ...state, selectedId: executionId })),
    on(DESELECT_EXECUTION, state => ({ ...state, selectedId: null, loading: null, error: null })),
    on(CLEAR_EXECUTIONS, state => ({ ...state, selectedId: null, list: [], loading: false, error: null })),
    on(CREATE_EXECUTION_REQUEST, state => ({ ...state, loading: true })),
    on(CREATE_EXECUTION_FAIL, (state, { error }) => ({ ...state, loading: false, loaded: false, error: error })),
    on(DELETE_EXECUTION_REQUEST, (state, { executionId }) => ({ ...state, loading: true })),
    on(DELETE_EXECUTION_SUCCESS, (state, { executionId }) => ({ ...state, list: state.list.filter(e => e.id != executionId), loading: false })),
    on(DELETE_EXECUTION_FAIL, (state, { error }) => ({ ...state, loading: false, loaded: false, error: error })),
);
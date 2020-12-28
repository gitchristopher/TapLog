import { LOAD_TESTS_FAIL, LOAD_TESTS_REQUEST, LOAD_TESTS_SUCCESS, SELECT_TEST, CREATE_TEST_REQUEST, CREATE_TEST_FAIL, DELETE_TEST_REQUEST, DELETE_TEST_SUCCESS, DELETE_TEST_FAIL, UPDATE_TEST_REQUEST, UPDATE_TEST_FAIL, DESELECT_TEST } from './spisok-testov.actions';
import { TestsState } from 'src/app/app.state';
import { createReducer, on } from '@ngrx/store';

const initialState: TestsState = {
    list: [],
    loading: false,
};

export const testovReducer = createReducer<TestsState>(
    initialState,
    on(LOAD_TESTS_REQUEST, state => ({ ...state, loading: true })),
    on(LOAD_TESTS_SUCCESS, (state, {tests}) => ({ ...state, list: tests, loading: false, selectedId: null, error: null })),
    on(LOAD_TESTS_FAIL, (state, {error}) => ({ ...state, list: null, loading: false, selectedId: null, error: error  })),
    on(SELECT_TEST, (state, {testId}) => ({ ...state, selectedId: testId })),
    on(DESELECT_TEST, state => ({ ...state, selectedId: null })),
    on(CREATE_TEST_REQUEST, state => ({...state, loading: true })),
    on(CREATE_TEST_FAIL, (state, {error}) => ({ ...state, loading: false, error: error })),
    on(DELETE_TEST_REQUEST, (state, {testId}) => ({...state, loading: true })),
    on(DELETE_TEST_SUCCESS, (state, {testId}) => ({ ...state, list: state.list.filter(t => t.id != testId ), loading: false })),
    on(DELETE_TEST_FAIL, (state, {error}) => ({ ...state, loading: false, error: error })),
    on(UPDATE_TEST_REQUEST, state => ({...state, loading: true })),
    on(UPDATE_TEST_FAIL, (state, {error}) => ({ ...state, loading: false, error: error })),
    // on(CREATE_TEST_SUCCESS, (state, {testId}) => ({...state}));
);
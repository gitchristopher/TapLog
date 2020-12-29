import { DELETE_TAP_FAIL, DELETE_TAP_REQUEST, DELETE_TAP_SUCCESS, DESELECT_TAP, EDIT_TAP, LOAD_EXECUTION_TAPS_FAIL, LOAD_EXECUTION_TAPS_REQUEST, LOAD_EXECUTION_TAPS_SUCCESS, SELECT_TAP, UPDATE_TAP_FAIL, UPDATE_TAP_REQUEST } from './spisok-sobytiy.actions';
import { TapsState } from 'src/app/app.state';
import { createReducer, on } from '@ngrx/store';

const initialState: TapsState = {
    list: [],
    loading: false,
    selectedId: null,
    error: null,
    editingId: null
};

export const sobytiyReducer = createReducer<TapsState>(
    initialState,
    on(LOAD_EXECUTION_TAPS_REQUEST, state => ({ ...state, loading: true, error: null })),
    on(LOAD_EXECUTION_TAPS_FAIL, (state, { error }) => ({ ...state, loading: false, error: error })),
    on(LOAD_EXECUTION_TAPS_SUCCESS, (state, { taps }) => ({ ...state, list: taps, loading: false, editingId: null })),
    on(SELECT_TAP, (state, { tapId }) => ({ ...state, selectedId: tapId })),
    on(EDIT_TAP, (state, { tapId }) => ({ ...state, selectedId: tapId, editingId: tapId })),
    on(DESELECT_TAP, (state) => ({ ...state, selectedId: null, editingId: null })),
    on(UPDATE_TAP_REQUEST, (state, { tap }) => ({ ...state, loading: true, error: null })),
    on(UPDATE_TAP_FAIL, (state, { error }) => ({ ...state, loading: false, error: error })),
    on(DELETE_TAP_REQUEST, (state, { executionId, tapId }) => ({ ...state, loading: true, error: null, selectedId: null })),
    on(DELETE_TAP_FAIL, (state, { error }) => ({ ...state, loading: false, error: error })),
    on(DELETE_TAP_SUCCESS, (state, { executionId, tapId }) => ({ ...state, list: state.list.filter(e => e.id != tapId), loading: false, error: null, selectedId: null })),
);
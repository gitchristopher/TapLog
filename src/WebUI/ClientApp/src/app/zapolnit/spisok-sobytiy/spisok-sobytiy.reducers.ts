import { CLEAR_TAPS, CREATE_TAP_FAIL, CREATE_TAP_REQUEST, DELETE_TAP_FAIL, DELETE_TAP_REQUEST, DELETE_TAP_SUCCESS, DESELECT_TAP, EDIT_TAP, LOAD_EXECUTION_TAPS_FAIL, LOAD_EXECUTION_TAPS_REQUEST, LOAD_EXECUTION_TAPS_SUCCESS, LOAD_TAP_FORM_DATA_FAIL, LOAD_TAP_FORM_DATA_REQUEST, LOAD_TAP_FORM_DATA_SUCCESS, SELECT_TAP, UPDATE_TAP_FAIL, UPDATE_TAP_REQUEST } from './spisok-sobytiy.actions';
import { TapsState } from 'src/app/app.state';
import { createReducer, on } from '@ngrx/store';

const initialState: TapsState = {
    list: [],
    loading: false,
    selectedId: null,
    error: null,
    editingId: null,
    cards: null,
    devices: null,
    passes: null,
    products: null
};

export const sobytiyReducer = createReducer<TapsState>(
    initialState,
    on(LOAD_EXECUTION_TAPS_REQUEST, state => ({ ...state, loading: true, error: null })),
    on(LOAD_EXECUTION_TAPS_FAIL, (state, { error }) => ({ ...state, loading: false, error: error })),
    on(LOAD_EXECUTION_TAPS_SUCCESS, (state, { taps }) => ({ ...state, list: taps, loading: false, editingId: null })),

    on(LOAD_TAP_FORM_DATA_REQUEST, state => ({ ...state, loading: true })),
    on(LOAD_TAP_FORM_DATA_FAIL, (state, { error }) => ({ ...state, loading: false, error: error })),
    on(LOAD_TAP_FORM_DATA_SUCCESS, (state, {formData}) => ({ ...state, loading: false, cards: formData.cards, devices: formData.devices, passes: formData.passes, products: formData.products })),

    on(SELECT_TAP, (state, { tapId }) => ({ ...state, selectedId: tapId })),
    on(EDIT_TAP, (state, { tapId }) => ({ ...state, selectedId: tapId, editingId: tapId })),
    on(DESELECT_TAP, (state) => ({ ...state, selectedId: null, editingId: null })),
    on(CLEAR_TAPS, (state) => ({ ...state, list: [], error: null, selectedId: null, editingId: null })),

    on(CREATE_TAP_REQUEST, (state, { tap }) => ({ ...state, loading: true, error: null })),
    on(CREATE_TAP_FAIL, (state, { error }) => ({ ...state, loading: false, error: error })),

    on(UPDATE_TAP_REQUEST, (state, { tap }) => ({ ...state, loading: true, error: null })),
    on(UPDATE_TAP_FAIL, (state, { error }) => ({ ...state, loading: false, error: error })),

    on(DELETE_TAP_REQUEST, (state, { executionId, tapId }) => ({ ...state, loading: true, error: null, selectedId: null })),
    on(DELETE_TAP_FAIL, (state, { error }) => ({ ...state, loading: false, error: error })),
    on(DELETE_TAP_SUCCESS, (state, { executionId, tapId }) => ({ ...state, list: state.list.filter(e => e.id != tapId), loading: false, error: null, selectedId: null })),
);
import { createReducer, on, State, Action } from '@ngrx/store';
import { LOAD_STAGES_FAIL, LOAD_STAGES_REQUEST, LOAD_STAGES_SUCCESS, SELECT_STAGE } from './spisok-faz.actions';
import { StagesState, AppState } from 'src/app/app.state';
import { StageDto } from 'src/app/taplog-api';
import { createSelector } from '@ngrx/store';

const initialState: StagesState = {
    list: [],
    loading: false,
    loaded: false,
};

export const fazReducer = createReducer<StagesState>(
    initialState,
    on(LOAD_STAGES_REQUEST, state => ({ ...state, loading: true, loaded: false })),
    on(LOAD_STAGES_SUCCESS, (state, {stages}) => ({ ...state, list: stages, loading: false, loaded: true })),
    on(LOAD_STAGES_FAIL, state => ({ ...state, loading: false, loaded: false })),
    on(SELECT_STAGE, (state, {stageId}) => ({ ...state, selectedId: stageId })),
);

export const selectStagesState = (state: AppState) => state.stages;

export const selectSelectedStageId = createSelector(
    selectStagesState,
    (state: StagesState) => state.selectedId
);

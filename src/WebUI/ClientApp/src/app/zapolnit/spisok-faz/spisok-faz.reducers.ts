import { LOAD_STAGES_FAIL, LOAD_STAGES_REQUEST, LOAD_STAGES_SUCCESS, SELECT_STAGE } from './spisok-faz.actions';
import { StagesState } from 'src/app/app.state';
import { createReducer, on } from '@ngrx/store';

const initialState: StagesState = {
    list: [],
    loading: false,
};

export const fazReducer = createReducer<StagesState>(
    initialState,
    on(LOAD_STAGES_REQUEST, state => ({ ...state, loading: true, error: false})),
    on(LOAD_STAGES_SUCCESS, (state, {stages}) => (
        { ...state,
            list: stages,
            loading: false,
            error: false,
            selectedId: stages.find(s => s.isCurrent === true).id
        })),
    on(LOAD_STAGES_FAIL, state => ({ ...state, loading: false, error: true})),
    on(SELECT_STAGE, (state, {stageId}) => ({ ...state, selectedId: stageId })),
);
// import { StageDto } from '../taplog-api';
// import { Action, createReducer, on, createSelector } from '@ngrx/store';
// import * as stagesActions from '../zapolnit/spisok-faz/spisok-faz.actions';

// export interface StageState {
//     data: StageDto[];
//     loaded: boolean;
//     loading: boolean;
// }
// export interface BookState {
//     list: StageDto[];
//     selectedId?: string | number;
//     loaded: boolean;
//     error?: any;
// }

// export const initialState: StageState = {
//     data: [],
//     loaded: false,
//     loading: false
// };


// // export function reducer(state: StageState = initialState, action: fromStages.StagesAction): StageState {
// //     return state;
// //     // return stageReducer(state, action);
// // }

// const stagesReducer = createReducer(
//     initialState,
//     on(stagesActions.LOAD_STAGES, state => ({ ...state, loading: true })),
//     // on(stagesActions.LOAD_STAGES_SUCCESS, state => ({ ...state, loading: true, loaded: false })),
//     on(stagesActions.LOAD_STAGES_SUCCESS, (state, {stages}) => ({ ...state, data: stages, loading: true, loaded: false })),
//     on(stagesActions.LOAD_STAGES_FAIL, state => ({ ...state, loading: false, loaded: false })),
// );

// export function reducer(state: StageState | undefined, action: Action) {
//     return stagesReducer(state, action);
// }

// // export const getStageLoaded = createSelector(getStageState, (state: StageState) => state.loaded);
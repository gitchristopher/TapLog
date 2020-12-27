import { createSelector, createFeatureSelector } from '@ngrx/store';
import { AppState, StagesState } from 'src/app/app.state';

// export const featureKey = 'feature';
export const featureKey = 'stages';

// export interface FeatureState {
//     counter: number;
// }

// export interface AppState {
//     feature: FeatureState;
// }

export const selectStages = createFeatureSelector<AppState, StagesState>(featureKey);

export const selectStagesList = createSelector(
    selectStages,
    (state: StagesState) => state.list
);
export const selectSelectedStageId = createSelector(
    selectStages,
    (state: StagesState) => state.selectedId
);
export const selectSelectedStage = createSelector(
    selectStages,
    (state: StagesState) => state.list.find(s => s.id === state.selectedId)
);

import { AppState, ExecutionsState, TapsState } from 'src/app/app.state';
import { createSelector, createFeatureSelector } from '@ngrx/store';
import { selectExecutions } from '../spisok-kazney/spisok-kazney.selectors';

export const featureKey = 'taps';

export const selectTaps = createFeatureSelector<AppState, TapsState>(featureKey);

export const selectTapsList = createSelector(
    selectTaps,
    (state: TapsState) => state.list
);

export const selectTapsListForSelectedExecution = createSelector(
    selectTaps,
    selectExecutions,
    (tapsState: TapsState, executionsState: ExecutionsState) => {
        if (tapsState && executionsState?.selectedId) {
            const tapsForSelectedExecution = tapsState.list.filter(t => t.testExecutionId === executionsState.selectedId);
            return tapsForSelectedExecution;
        }
    }
);

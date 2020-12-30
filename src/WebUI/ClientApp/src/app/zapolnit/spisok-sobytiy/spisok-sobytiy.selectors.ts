import { AppState, ExecutionsState, TapsState } from 'src/app/app.state';
import { createSelector, createFeatureSelector } from '@ngrx/store';
import { selectExecutions } from '../spisok-kazney/spisok-kazney.selectors';
import { AddTapVM } from 'src/app/taplog-api';

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
        if (tapsState?.list && executionsState?.selectedId) {
            const tapsForSelectedExecution = tapsState.list.filter(t => t.testExecutionId === executionsState.selectedId);
            return tapsForSelectedExecution;
        }
    }
);

export const selectTapFormData = createSelector(
    selectTaps,
    (tapsState: TapsState) => {
        if (tapsState.cards !== null && tapsState.cards !== undefined) {
            return AddTapVM.fromJS(tapsState);
        }
        return new AddTapVM;
    }
);

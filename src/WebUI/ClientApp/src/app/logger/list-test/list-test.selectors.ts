import { AppState, TestsState } from 'src/app/app.state';
import { createSelector } from '@ngrx/store';

export const selectTests = (state: AppState) => state.tests;

export const selectTestsList = createSelector(
    selectTests,
    (state: TestsState) => state.list
);

export const selectTestsLoading = createSelector(
    selectTests,
    (state: TestsState) => state.loading
);

export const selectSelectedTestId = createSelector(
    selectTests,
    (state: TestsState) => state.selectedId
);

export const selectSelectedTest = createSelector(
    selectTests,
    (state: TestsState) => {
        if (state.selectedId && state.list.findIndex(x => x.id === state.selectedId) >= 0) {
            return state.list.find(e => e.id === state.selectedId);
        }
    }
);
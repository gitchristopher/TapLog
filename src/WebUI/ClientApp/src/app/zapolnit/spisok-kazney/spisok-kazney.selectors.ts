import { createSelector, createFeatureSelector } from '@ngrx/store';
import { AppState, ExecutionsState, StagesState, TestsState } from 'src/app/app.state';
import { selectStages } from '../spisok-faz/spisok-faz.selectors';
import { selectTests } from '../spisok-testov/spisok-testov.selectors';

export const featureKey = 'executions';

export const selectExecutions = createFeatureSelector<AppState, ExecutionsState>(featureKey);

export const selectExecutionsList = createSelector(
    selectExecutions,
    (state: ExecutionsState) => state.list
);

export const selectSelectedExecutionId = createSelector(
    selectExecutions,
    (state: ExecutionsState) => state.selectedId
);

export const selectSelectedExecution = createSelector(
    selectExecutions,
    (state: ExecutionsState) => {
        if (state.selectedId && state.list.findIndex(x => x.id === state.selectedId) >= 0) {
            return state.list.find(e => e.id === state.selectedId);
        }
    }
);

export const selectSelectedExecutionTapCount = createSelector(
    selectExecutions,
    (state: ExecutionsState) => {
        if (state.selectedId && state.list.findIndex(x => x.id === state.selectedId) >= 0) {
            return state.list.find(e => e.id === state.selectedId).taps.length;
        }
    }
);

export const selectStageTest = createSelector(
    selectTests, // ensure selectors are in the same order as the paramaters below
    selectStages,
    (testState: TestsState, stageState: StagesState) => {
        if (testState && stageState) {
            return { testId: testState.selectedId, stageId: stageState.selectedId }
        }
    }
)

export const selectExecutionsForSelectedTest = createSelector(
    selectExecutions, // ensure selectors are in the same order as the paramaters below
    selectTests,
    (executionstate: ExecutionsState, testState: TestsState) => {
        if (testState && executionstate.list?.length >= 0) {
            return executionstate.list.filter(e => e.stageTest?.testId === testState.selectedId);
        }
    }
)
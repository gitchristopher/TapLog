import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import * as kazney from './spisok-kazney.actions';
import { TestExecutionsClient, TapsClient } from 'src/app/taplog-api';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { EMPTY, of } from 'rxjs';

@Injectable()
export class KazneyEffects {
    constructor(private actions$: Actions, private executionClient: TestExecutionsClient, private tapsClient: TapsClient) { }

    loadExecutions$ = createEffect(() =>
        this.actions$.pipe(
            ofType(kazney.LOAD_EXECUTIONS_REQUEST),
            mergeMap((action) => {
                return this.executionClient.getAll(action.testId, action.stageId).pipe(
                    map(executions => kazney.LOAD_EXECUTIONS_SUCCESS({executions})),
                    catchError(error => of(kazney.LOAD_EXECUTIONS_FAIL({ error }))));
            })
        )
    );

    createExecution$ = createEffect(() =>
        this.actions$.pipe(
            ofType(kazney.CREATE_EXECUTION_REQUEST),
            mergeMap((action) => {
                return this.executionClient.create(action.execution).pipe(
                    map(executions => kazney.LOAD_EXECUTIONS_REQUEST({stageId: action.execution.stageId, testId: action.execution.testId})),
                    catchError(error => of(kazney.CREATE_EXECUTION_FAIL({ error }))));
            })
        )
    );

    deleteExecution$ = createEffect(() =>
        this.actions$.pipe(
            ofType(kazney.DELETE_EXECUTION_REQUEST),
            mergeMap((action) => {
                return this.executionClient.delete(action.executionId).pipe(
                    map(noContent => kazney.DELETE_EXECUTION_SUCCESS({executionId: action.executionId})),
                    catchError(error => of(kazney.CREATE_EXECUTION_FAIL({ error }))));
            })
        )
    );

    deleteTap$ = createEffect(() =>
        this.actions$.pipe(
            ofType(kazney.DELETE_TAP_REQUEST),
            mergeMap((action) => {
                return this.tapsClient.delete(action.tapId).pipe(
                    map(noContent => kazney.LOAD_EXECUTIONS_REQUEST({stageId: action.execution.stageTest.stageId,testId: action.execution.stageTest.testId})),
                    catchError(error => of(kazney.LOAD_EXECUTIONS_FAIL({ error }))));
            })
        )
    );
}
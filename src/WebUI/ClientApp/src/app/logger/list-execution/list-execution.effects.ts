import * as execution from './list-execution.actions';
import { TestExecutionsClient, TapsClient } from 'src/app/taplog-api';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class ExecutionEffects {
    constructor(private actions$: Actions, private executionClient: TestExecutionsClient, private tapsClient: TapsClient) { }

    loadExecutions$ = createEffect(() =>
        this.actions$.pipe(
            ofType(execution.LOAD_EXECUTIONS_REQUEST),
            mergeMap((action) => {
                return this.executionClient.getAll(action.testId, action.stageId).pipe(
                    map(executions => execution.LOAD_EXECUTIONS_SUCCESS({executions})),
                    catchError(error => of(execution.LOAD_EXECUTIONS_FAIL({ error }))));
            })
        )
    );

    createExecution$ = createEffect(() =>
        this.actions$.pipe(
            ofType(execution.CREATE_EXECUTION_REQUEST),
            mergeMap((action) => {
                return this.executionClient.create(action.execution).pipe(
                    map(executions => execution.LOAD_EXECUTIONS_REQUEST({stageId: action.execution.stageId, testId: action.execution.testId})),
                    catchError(error => of(execution.CREATE_EXECUTION_FAIL({ error }))));
            })
        )
    );

    deleteExecution$ = createEffect(() =>
        this.actions$.pipe(
            ofType(execution.DELETE_EXECUTION_REQUEST),
            mergeMap((action) => {
                return this.executionClient.delete(action.executionId).pipe(
                    map(noContent => execution.DELETE_EXECUTION_SUCCESS({executionId: action.executionId})),
                    catchError(error => of(execution.CREATE_EXECUTION_FAIL({ error }))));
            })
        )
    );
}
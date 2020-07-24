import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import * as testov from './spisok-testov.actions';
import { TestsClient } from 'src/app/taplog-api';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { EMPTY, of } from 'rxjs';

@Injectable()
export class TestovEffects {
    constructor(private actions$: Actions, private testClient: TestsClient) { }

    loadTests$ = createEffect(() =>
        this.actions$.pipe(
            ofType(testov.LOAD_TESTS_REQUEST),
            mergeMap((action) => {
                return this.testClient.getTestsForStage(action.stageId).pipe(
                    map(tests => testov.LOAD_TESTS_SUCCESS({tests})),
                    catchError(error => of(testov.LOAD_TESTS_FAIL({ error }))));
            })
        )
    );

    createTest$ = createEffect(() =>
        this.actions$.pipe(
            ofType(testov.CREATE_TEST_REQUEST),
            mergeMap((action) => {
                return this.testClient.create(action.test).pipe(
                    map(tests => testov.LOAD_TESTS_REQUEST({stageId: action.test.stageId})), // TODO: Find way to update state with no return
                    catchError(error => of(testov.CREATE_TEST_FAIL({ error }))));
            })
        )
    );

    updateTest$ = createEffect(() =>
        this.actions$.pipe(
            ofType(testov.UPDATE_TEST_REQUEST),
            mergeMap((action) => {
                return this.testClient.update(action.testId, action.testUpdate).pipe(
                    map(tests => testov.LOAD_TESTS_REQUEST({stageId: action.stageId})), // TODO: Find way to update state with no return
                    catchError(error => of(testov.UPDATE_TEST_FAIL({ error }))));
            })
        )
    );

    deleteTest$ = createEffect(() =>
        this.actions$.pipe(
            ofType(testov.DELETE_TEST_REQUEST),
            mergeMap((action) => {
                return this.testClient.delete(action.testId).pipe(
                    map(noContent => testov.DELETE_TEST_SUCCESS({testId: action.testId})), // TODO: Find way to update state with no return
                    catchError(error => of(testov.DELETE_TEST_FAIL({ error }))));
            })
        )
    );
}

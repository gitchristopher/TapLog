import * as test from './list-test.actions';
import { TestsClient } from 'src/app/taplog-api';
import { Injectable } from '@angular/core';
import { Actions, createEffect, Effect, ofType } from '@ngrx/effects';
import { mergeMap, map, catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class TestEffects {
    constructor(private actions$: Actions, private testClient: TestsClient) { }

    loadTests$ = createEffect(() =>
        this.actions$.pipe(
            ofType(test.LOAD_TESTS_REQUEST),
            mergeMap((action) => {
                return this.testClient.getTestsForStage(action.stageId).pipe(
                    map(tests => test.LOAD_TESTS_SUCCESS({tests})),
                    catchError(error => of(test.LOAD_TESTS_FAIL({ error }))));
            })
        )
    );

    createTest$ = createEffect(() =>
        this.actions$.pipe(
            ofType(test.CREATE_TEST_REQUEST),
            mergeMap((action) => {
                return this.testClient.create(action.test).pipe(
                    map(tests => test.LOAD_TESTS_REQUEST({stageId: action.test.stageId})),
                    catchError(error => of(test.CREATE_TEST_FAIL({ error }))));
            })
        )
    );

    updateTest$ = createEffect(() =>
        this.actions$.pipe(
            ofType(test.UPDATE_TEST_REQUEST),
            mergeMap((action) => {
                return this.testClient.update(action.testId, action.testUpdate).pipe(
                    map(tests => test.LOAD_TESTS_REQUEST({stageId: action.stageId})),
                    catchError(error => of(test.UPDATE_TEST_FAIL({ error }))));
            })
        )
    );

    deleteTest$ = createEffect(() =>
        this.actions$.pipe(
            ofType(test.DELETE_TEST_REQUEST),
            mergeMap((action) => {
                return this.testClient.delete(action.testId, action.stageId).pipe(
                    map(noContent => test.DELETE_TEST_SUCCESS({testId: action.testId})),
                    catchError(error => of(test.DELETE_TEST_FAIL({ error }))));
            })
        )
    );
}

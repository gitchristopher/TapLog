import * as sobytiy from './spisok-sobytiy.actions';
import { TestExecutionsClient, TapsClient, TapDto } from 'src/app/taplog-api';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class SobytiyEffects {
    constructor(private actions$: Actions, private executionClient: TestExecutionsClient, private tapsClient: TapsClient) { }

    loadExecutionTaps$ = createEffect(() =>
        this.actions$.pipe(
            ofType(sobytiy.LOAD_EXECUTION_TAPS_REQUEST),
            mergeMap((action) => {
                return this.executionClient.get(action.executionId).pipe(
                    map(execution => {
                        // console.log(execution);
                        return (
                            sobytiy.LOAD_EXECUTION_TAPS_SUCCESS({ taps: execution.taps })
                        )
                    }),
                    catchError(error => of(sobytiy.LOAD_EXECUTION_TAPS_FAIL({ error }))));
            })
        )
    );

    createTap$ = createEffect(() =>
        this.actions$.pipe(
            ofType(sobytiy.CREATE_TAP_REQUEST),
            mergeMap((action) => {
                return this.tapsClient.create(action.tap).pipe(
                    map(response => sobytiy.LOAD_EXECUTION_TAPS_REQUEST({ executionId: action.tap.testExecutionId })),
                    catchError(error => of(sobytiy.CREATE_TAP_FAIL({ error }))));
            })
        )
    );

    updateTap$ = createEffect(() =>
        this.actions$.pipe(
            ofType(sobytiy.UPDATE_TAP_REQUEST),
            mergeMap((action) => {
                return this.tapsClient.update(action.tap.id, action.tap).pipe(
                    map(noContent => sobytiy.LOAD_EXECUTION_TAPS_REQUEST({ executionId: action.tap.testExecutionId })),
                    catchError(error => of(sobytiy.UPDATE_TAP_FAIL({ error }))));
            })
        )
    );

    deleteTap$ = createEffect(() =>
        this.actions$.pipe(
            ofType(sobytiy.DELETE_TAP_REQUEST),
            mergeMap((action) => {
                return this.tapsClient.delete(action.tapId).pipe(
                    map(noContent => sobytiy.DELETE_TAP_SUCCESS({ executionId: action.executionId, tapId: action.tapId })),
                    catchError(error => of(sobytiy.DELETE_TAP_FAIL({ error }))));
            })
        )
    );

    loadFormData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(sobytiy.LOAD_TAP_FORM_DATA_REQUEST),
            mergeMap((action) => {
                return this.tapsClient.getTapForm().pipe(
                    map(formData => {
                        // GC dont have an alias but for display purposes
                        // it would make sence to have a generic alias
                        formData.cards.forEach(card => {
                            card.alias = card.alias ?? 'Go Card';
                            card.alias = card.alias.concat(' - ', card.number);
                          });

                        return (sobytiy.LOAD_TAP_FORM_DATA_SUCCESS({ formData }))
                    }),
                    catchError(error => of(sobytiy.LOAD_TAP_FORM_DATA_FAIL({ error }))));
            })
        )
    );
}
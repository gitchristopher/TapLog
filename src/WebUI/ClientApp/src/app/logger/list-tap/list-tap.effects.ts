import * as tap from './list-tap.actions';
import { TestExecutionsClient, TapsClient, TapDto, CreateTapCommand } from 'src/app/taplog-api';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class TapEffects {
    constructor(private actions$: Actions, private executionClient: TestExecutionsClient, private tapsClient: TapsClient) { }

    loadExecutionTaps$ = createEffect(() =>
        this.actions$.pipe(
            ofType(tap.LOAD_EXECUTION_TAPS_REQUEST),
            mergeMap((action) => {
                return this.executionClient.get(action.executionId).pipe(
                    map(execution => {
                        // console.log(execution);
                        return (
                            tap.LOAD_EXECUTION_TAPS_SUCCESS({ taps: execution.taps })
                        )
                    }),
                    catchError(error => of(tap.LOAD_EXECUTION_TAPS_FAIL({ error })))
                );
            })
        )
    );

    createTap$ = createEffect(() =>
        this.actions$.pipe(
            ofType(tap.CREATE_TAP_REQUEST),
            mergeMap((action) => {
                return this.tapsClient.create(action.tap).pipe(
                    map(response => tap.LOAD_EXECUTION_TAPS_REQUEST({ executionId: action.tap.testExecutionId })),
                    catchError(error => {
                        const apiErrors = JSON.parse(error['response']).errors;
                        return (
                            of(tap.CREATE_TAP_FAIL({ error: apiErrors }))
                        )
                    })
                );
            })
        )
    );

    updateTap$ = createEffect(() =>
        this.actions$.pipe(
            ofType(tap.UPDATE_TAP_REQUEST),
            mergeMap((action) => {
                return this.tapsClient.update(action.tap.id, action.tap).pipe(
                    map(noContent => tap.LOAD_EXECUTION_TAPS_REQUEST({ executionId: action.tap.testExecutionId })),
                    catchError(error => {
                        const apiErrors = JSON.parse(error['response']).errors;
                        return (
                            of(tap.UPDATE_TAP_FAIL({ error: apiErrors }))
                        )
                    })
                );
            })
        )
    );

    deleteTap$ = createEffect(() =>
        this.actions$.pipe(
            ofType(tap.DELETE_TAP_REQUEST),
            mergeMap((action) => {
                return this.tapsClient.delete(action.tapId).pipe(
                    map(noContent => tap.DELETE_TAP_SUCCESS({ executionId: action.executionId, tapId: action.tapId })),
                    catchError(error => {
                        const apiErrors = JSON.parse(error)['response']['errors'];
                        console.log(apiErrors);
                        return (
                            of(tap.DELETE_TAP_FAIL({ error: apiErrors }))
                        )
                    })
                );
            })
        )
    );

    loadFormData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(tap.LOAD_TAP_FORM_DATA_REQUEST),
            mergeMap((action) => {
                return this.tapsClient.getTapForm().pipe(
                    map(formData => {
                        // GC dont have an alias but for display purposes
                        // it would make sence to have a generic alias
                        formData.cards.forEach(card => {
                            card.alias = card.alias ?? 'Go Card';
                            card.alias = card.alias.concat(' - ', card.number);
                          });

                        return (tap.LOAD_TAP_FORM_DATA_SUCCESS({ formData }))
                    }),
                    catchError(error => {
                        const apiErrors = JSON.parse(error['response']).errors;
                        return (
                            of(tap.LOAD_TAP_FORM_DATA_FAIL({ error: apiErrors }))
                        )
                    })
                );
            })
        )
    );
}
import * as faz from './spisok-faz.actions';
import { StagesClient } from 'src/app/taplog-api';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class FazEffects {
    constructor(private actions$: Actions, private fazClient: StagesClient) { }

    loadStages$ = createEffect(() =>
        this.actions$.pipe(
            ofType(faz.LOAD_STAGES_REQUEST),
            mergeMap(() => {
                return this.fazClient.getAll().pipe(
                    map(stages => faz.LOAD_STAGES_SUCCESS({stages})),
                    catchError(error => of(faz.LOAD_STAGES_FAIL({ error }))));
            })
        )
    );
}

// catchError(error => of(FeatureActions.actionFailure({ error })))

// catchError(() => EMPTY));


// @Effect()
// effectName$ = this.action$.pipe(
//     ofType(ACTION_TYPE),
//     switchMap(() => {
//         /*return this.myService().pipe(
//             map(data => data),
//             catchError(error => error)
//         );*/
//     })
// );

// --

// import { Injectable } from '@angular/core';
// import { Actions, Effect, ofType } from '@ngrx/effects';

// // import { of } from 'rxjs';
// import { catchError, map, switchMap, mergeMap } from 'rxjs/operators';

// import * as alias from 'actions';
// //import all requried services or any dependencies

// @Injectable()
// export class NameEffects {
//     constructor(private action$: Actions) { }

//     @Effect()
//     effectName$ = this.action$.pipe(
//         ofType(aliasACTION_TYPE),
//         switchMap(() => {
//             /*return this.myService().pipe(
//                 map(data => data),
//                 catchError(error => of(error))
//                 //dispatch action with payload in `map`
//                 //dispatch action with error in `catchError`
//             );*/
//         })
//     );
// }

// --

// EffectsModule.forFeature([effect])

// EffectsModule.forRoot([effect])

// ---

// effectName$ = createEffect(() =>
//     this.actions$.pipe(
//         ofType(action),
//         mergeMap(() => {
//             /*this.myService.pipe(
//                 map(data => data)
//                 catchError(() => EMPTY)
//             */
//         })
//     )
// );

// --

// import { Injectable } from '@angular/core';
// import { Actions, createEffect, ofType } from '@ngrx/effects';
// // import { EMPTY } from 'rxjs';
// // import { map, mergeMap, catchError } from 'rxjs/operators';

// import * as alias from 'actions';
// //import all requried services or any dependencies

// @Injectable()
// export class NameEffects {
//     constructor(private actions$: Actions) { }

//     effectName$ = createEffect(() =>
//         this.actions$.pipe(
//             ofType(aliasaction),
//             mergeMap(() => {
//                 /*this.myService.pipe(
//                     map(data => data)
//                     catchError(() => EMPTY)
//                 */
//             })
//         )
//     );
// }


// --


// effectName$ = createEffect(() => {
//     return this.actions$.pipe(
//             ofType(action),
//             /** An EMPTY observable only emits completion. Replace with your own observable stream */
//             operator(() => EMPTY));
// });

// --

// effectName$ = createEffect(() => {
//     return this.actions$.pipe(
//             ofType(FeatureActions.action),
//             operator(() =>
//                 apiSource.pipe(
//                     map(data => FeatureActions.actionSuccess({ data })),
//                     catchError(error => of(FeatureActions.actionFailure({ error }))))
//                 ),
//     );
// });
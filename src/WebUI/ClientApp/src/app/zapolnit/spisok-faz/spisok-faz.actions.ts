import { createAction, props } from '@ngrx/store';
import { StageDto } from 'src/app/taplog-api';

export const LOAD_STAGES_REQUEST = createAction('[Zapolnit-faz] Load Stages Request');
export const LOAD_STAGES_FAIL = createAction('[Zapolnit-faz] Load Stage Fail', props<{error: any}>());
export const LOAD_STAGES_SUCCESS = createAction('[Zapolnit-faz] Load Stage Success', props<{stages: StageDto[]}>());
export const SELECT_STAGE = createAction('[Zapolnit-faz] Select Stage', props<{stageId: number}>());

import { createAction, props } from '@ngrx/store';
import { StageDto } from 'src/app/taplog-api';

export const LOAD_STAGES_REQUEST = createAction('[Stages] Load Stages Request');
export const LOAD_STAGES_FAIL = createAction('[Stages] Load Stage Fail', props<{error: any}>());
export const LOAD_STAGES_SUCCESS = createAction('[Stages] Load Stage Success', props<{stages: StageDto[]}>());
export const SELECT_STAGE = createAction('[Stages] Select Stage', props<{stageId: number}>());

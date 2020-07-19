import { StageDto, TestDto, TestExecutionDto } from './taplog-api';

export interface AppState {
    stages: StagesState;
    tests: TestsState;
    executions: ExecutionsState;
}

export interface StagesState {
    list: StageDto[];
    selectedId?: string | number;
    loading: boolean;
    loaded: boolean;
    error?: any;
}

export interface TestsState {
    list: TestDto[];
    selectedId?: string | number;
    loading: boolean;
    loaded: boolean;
    error?: any;
}

export interface ExecutionsState {
    list: TestExecutionDto[];
    selectedId?: string | number;
    loading: boolean;
    loaded: boolean;
    error?: any;
}

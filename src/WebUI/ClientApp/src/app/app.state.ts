import { StageDto, TapDto, TestDto, TestExecutionDto } from './taplog-api';

export interface AppState {
    stages: StagesState;
    tests: TestsState;
    executions: ExecutionsState;
    taps: TapsState;
}

export interface StagesState {
    list: StageDto[];
    selectedId?: number;
    loading: boolean;
    error?: any;
}

export interface TestsState {
    list: TestDto[];
    selectedId?: number;
    loading: boolean;
    error?: any;
}

export interface ExecutionsState {
    list: TestExecutionDto[];
    selectedId?: number;
    loading: boolean;
    error?: any;
}

export interface TapsState {
    list: TapDto[];
    selectedId?: number;
    loading: boolean;
    error?: any;
    editingId?: number;
}
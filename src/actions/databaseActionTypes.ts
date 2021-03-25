import DbIndex from '../models/dbIndex';
import DbTable from '../models/dbTable';

export const APPLY_CHANGES = 'APPLY_CHANGES';
export const NEXT_ID = 'NEXT_ID';
export const SET_SEQUENCE = 'SET_SEQUENCE';
export const RESET_DATABASE = 'RESET_DATABASE';
export const UPDATE_INDEX = 'UPDATE_INDEX';

interface SetSequenceAction {
    type: typeof SET_SEQUENCE;
    payload: {
        next: number;
    }
}

interface ResetDbAction {
    type: typeof RESET_DATABASE;
}

interface ApplyChangesAction {
    type: typeof APPLY_CHANGES;
    payload: {
        changes: DbTable;
    }
}

interface UpdateIndexAction {
    type: typeof UPDATE_INDEX;
    payload: {
        index: DbIndex;
    }
}

export type DatabaseActions = SetSequenceAction | ResetDbAction | ApplyChangesAction | UpdateIndexAction;

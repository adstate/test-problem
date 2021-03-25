import DbNode from '../models/dbNode';
import DbTable from '../models/dbTable';

export const MOVE_NODE = 'MOVE_NODE';
export const EDIT_NODE = 'EDIT_NODE';
export const ADD_NODE = 'ADD_NODE';
export const CHANGE_NODE = 'CHANGE_NODE';
export const DELETE_NODE = 'DELETE_NODE';
export const CLEAR_CACHE = 'CLEAR_CACHE';
export const SEQUENCE_NEXT = 'SEQUENCE_NEXT';


interface MoveNodeAction {
    type: typeof MOVE_NODE,
    payload: DbNode
}

interface AddCacheNodeAction {
    type: typeof ADD_NODE;
    payload: {
        id: string,
        node: DbNode
    }
}

interface ChangeNodeAction {
    type: typeof CHANGE_NODE;
    payload: {
        id: string;
        node: DbNode;
    };
}

interface DeleteNodeAction {
    type: typeof DELETE_NODE;
    payload: {
        nodes: DbTable;
    };
}

interface SequenceNextAction {
    type: typeof SEQUENCE_NEXT;
}

interface ClearCacheAction {
    type: typeof CLEAR_CACHE;
}

export type CacheActions = MoveNodeAction | AddCacheNodeAction | ChangeNodeAction | SequenceNextAction | ClearCacheAction | DeleteNodeAction;

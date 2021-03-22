import DbNode from '../models/dbNode';
import CacheNode from '../models/cacheNode';

export const MOVE_NODE = 'MOVE_NODE';
export const EDIT_NODE = 'EDIT_NODE';
export const ADD_NODE = 'ADD_NODE';
export const CHANGE_NODE = 'CHANGE_NODE';
export const DELETE_NODE = 'DELETE_NODE';
export const CLEAR_CACHE = 'CLEAR_CACHE';
export const SEQUENCE_NEXT = 'SEQUENCE_NEXT';


interface MoveNodeAction {
    type: typeof MOVE_NODE,
    payload: CacheNode
}

interface EditNodeAction {
    type: typeof EDIT_NODE,
    payload: {
        id: string;
        value: string;
    }
}

interface AddCacheNodeAction {
    type: typeof ADD_NODE;
    payload: {
        id: string,
        node: CacheNode
    }
}

interface ChangeNodeAction {
    type: typeof CHANGE_NODE;
    payload: {
        id: string;
        node: CacheNode;
    };
}

interface SequenceNextAction {
    type: typeof SEQUENCE_NEXT;
}

interface ClearCacheAction {
    type: typeof CLEAR_CACHE;
}

export type CacheActions = MoveNodeAction | AddCacheNodeAction | ChangeNodeAction | SequenceNextAction | ClearCacheAction;

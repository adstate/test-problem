import {MOVE_NODE, ADD_NODE, CHANGE_NODE, CacheActions, CLEAR_CACHE} from './cacheActionTypes';
import CacheNode from '../models/cacheNode';
import { RootState } from '../reducers';
import NodeState from '../models/nodeState';


export const moveNode = (node: CacheNode): CacheActions => ({
    type: MOVE_NODE,
    payload: node
});

export const addCacheNode = (id: string, node: CacheNode): CacheActions => ({
    type: ADD_NODE,
    payload: {
        id,
        node
    }
});

export const changeNode = (id: string, node: CacheNode): CacheActions => ({
    type: CHANGE_NODE,
    payload: {
        id,
        node
    }
});

export const editNode = (id: string, value: string) => {
    return (dispatch: any, getState: () => RootState) => {
        const cache = getState().cache.table;
        const node = cache[id];

        if (node) {
            const cacheNode = {
                ...node,
                value,
                state: (node.state === NodeState.New) ? NodeState.New : NodeState.Changed
            };
            dispatch(changeNode(id, cacheNode));
        }
    }
};

export const addNode = (parentId: string, value: string) => {
    return (dispatch: any, getState: () => RootState) => {
        const sequence = getState().cache.sequence;
        const nodeId = sequence.prefix + sequence.next;

        const cacheNode = {
            id: nodeId,
            parentId,
            value,
            state: NodeState.New
        };
        
        dispatch(addCacheNode(nodeId, cacheNode));
    }
};

export const deleteNode = (id: string) => {
    return (dispatch: any, getState: () => RootState) => {
        const node = getState().cache.table[id];

        const cacheNode = {
            ...node,
            state: NodeState.Deleted
        };
        
        dispatch(changeNode(id, cacheNode));
    }
};

export const clearCache = () => ({
    type: CLEAR_CACHE
});

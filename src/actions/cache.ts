import {MOVE_NODE, ADD_NODE, CHANGE_NODE, CacheActions, CLEAR_CACHE, DELETE_NODE} from './cacheActionTypes';
import DbNode from '../models/dbNode';
import { RootState } from '../reducers';
import NodeState from '../models/nodeState';
import DbTable from '../models/dbTable';


export const moveNode = (node: DbNode): CacheActions => ({
    type: MOVE_NODE,
    payload: node
});

export const addCacheNode = (id: string, node: DbNode): CacheActions => ({
    type: ADD_NODE,
    payload: {
        id,
        node
    }
});

export const changeNode = (id: string, node: DbNode): CacheActions => ({
    type: CHANGE_NODE,
    payload: {
        id,
        node
    }
});

export const deleteNodes = (nodes: DbTable): CacheActions => ({
    type: DELETE_NODE,
    payload: {
        nodes
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

const getChildren = (nodeId: string, cache: DbTable) => {
    return Object.values(cache).filter((node: DbNode) => node.parentId === nodeId) || [];
};

export const deleteNode = (id: string) => {
    return (dispatch: any, getState: () => RootState) => {
        const cache = getState().cache.table;
        const node = getState().cache.table[id];

        const deletedNodes: DbTable = {};

        if (node.state === NodeState.New) {
            delete cache[id];
        } else {
            deletedNodes[id] = {...node, state: NodeState.Deleted};
        }

        let childs = getChildren(id, cache);

        while (childs.length > 0) {
            const children: DbNode[] = [];
            childs.forEach((node: DbNode) => {
                if (node.state === NodeState.New) {
                   delete cache[node.id];
                } else {
                    deletedNodes[node.id] = {...node, state: NodeState.Deleted};
                }
                
                children.push(...getChildren(node.id, cache));
            });

            childs = children;
        }

        dispatch(deleteNodes(deletedNodes));
    }
};

export const clearCache = () => ({
    type: CLEAR_CACHE
});

import { RootState } from "../reducers";
import {moveNode, clearCache} from './cache';
import NodeState from '../models/nodeState';
import DbTable from '../models/dbTable';
import {DatabaseActions, SET_SEQUENCE, APPLY_CHANGES, RESET_DATABASE, UPDATE_INDEX} from '../actions/databaseActionTypes';
import DbIndex from "../models/dbIndex";
import { createDbParentIndex } from "../utils/dbToTree";

const setSequence = (next: number): DatabaseActions => ({
    type: SET_SEQUENCE,
    payload: {
        next
    }
});

const applyChanges = (changes: DbTable): DatabaseActions => ({
    type: APPLY_CHANGES,
    payload: {
        changes
    }
});

const updateIndex = (index: DbIndex): DatabaseActions => ({
    type: UPDATE_INDEX,
    payload: {
        index
    }
});

export const getNodeForEdit = (nodeId: string) => {
    return (dispatch: any, getState: () => RootState) => {
        const database = getState().database.table;
        const cache = getState().cache.table;
        const node = database[nodeId];

        if (node && !cache[nodeId] && node.state !== NodeState.Deleted) {
            const cacheNode = {
                ...node,
                state: NodeState.Origin
            };

            dispatch(moveNode(cacheNode));
        }
    };
};

export const applyChangesToDb = () => {
    return (dispatch: any, getState: () => RootState) => {
        const cache = getState().cache.table;
        const database = getState().database.table;
        const dbSequence = getState().database.sequence;
        const dbIndex = getState().database.index;
        let id = dbSequence.next;

        const changes: DbTable = {};
        const lookup: {[id: string]: string} = {};

        for (let node of Object.values(cache)) {
            if (node.state === NodeState.New) {
                const nodeId = String(id);
                const parentId = (node.parentId && lookup[node.parentId]) ? lookup[node.parentId] : node.parentId;

                changes[nodeId] = {
                    id: nodeId,
                    parentId: parentId,
                    value: node.value,
                    state: NodeState.Origin
                };

                lookup[node.id] = nodeId;

                id += 1;
            } else if (node.state === NodeState.Changed) {
                changes[node.id] = {
                    ...node,
                    value: node.value,
                    state: NodeState.Origin
                };
            } else if (node.state === NodeState.Deleted) {
                changes[node.id] = {
                    ...node,
                    state: NodeState.Deleted
                };

                let childs = dbIndex[node.id];

                while (childs.length > 0) {
                    const children: string[] = [];

                    childs.forEach((nodeId) => {
                        changes[nodeId] = {
                            ...database[nodeId],
                            state: NodeState.Deleted
                        };

                        children.push(...dbIndex[nodeId]);
                    });
        
                    childs = children;
                }
            }
        }

        if (Object.keys(changes).length > 0) {
            dispatch(applyChanges(changes));

            const newIndex = createDbParentIndex(getState().database.table);
            dispatch(updateIndex(newIndex));
        }

        dispatch(clearCache());

        if (dbSequence.next !== id) {
            dispatch(setSequence(id));
        }
    };
};

export const resetDb = (): DatabaseActions => ({
    type: RESET_DATABASE
});

export const resetDatabase = () => {
    return (dispatch: any) => {
        dispatch(resetDb());
        dispatch(clearCache());
    };
};

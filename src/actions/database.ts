import { RootState } from "../reducers";
import {moveNode, clearCache} from './cache';
import NodeState from '../models/nodeState';
import DbTable from '../models/dbTable';

export const APPLY_CHANGES = 'APPLY_CHANGES';
export const NEXT_ID = 'NEXT_ID';
export const SET_SEQUENCE = 'SET_SEQUENCE';
export const RESET_DATABASE = 'RESET_DATABASE';

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
        changes: DbTable
    }
}

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

export type DatabaseActions = SetSequenceAction | ResetDbAction | ApplyChangesAction;

export const getNodeForEdit = (nodeId: string) => {
    return (dispatch: any, getState: () => RootState) => {
        const database = getState().database.table;
        const node = database[nodeId];

        if (node) {
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
        const dbSequence = getState().database.sequence;
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
                    ...node
                };
            }
        }

        dispatch(applyChanges(changes));
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

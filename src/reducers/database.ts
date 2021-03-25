import DbNode from "../models/dbNode";
import {DatabaseActions, RESET_DATABASE, SET_SEQUENCE, APPLY_CHANGES, UPDATE_INDEX} from '../actions/databaseActionTypes';
import NodeState from "../models/nodeState";
import { createDbParentIndex } from "../utils/dbToTree";
import DbIndex from "../models/dbIndex";

interface DatabaseState {
    table: {
        [id: string]: DbNode;
    },
    index: DbIndex,
    sequence: {
        next: number;
    }
}

const table = {
    '1': {id: '1', parentId: null, value: 'Node1', state: NodeState.Origin},
    '2': {id: '2', parentId: '1', value: 'Node2', state: NodeState.Origin},
    '3': {id: '3', parentId: '1', value: 'Node3', state: NodeState.Origin},
    '4': {id: '4', parentId: '2', value: 'Node4', state: NodeState.Origin},
    '5': {id: '5', parentId: '2', value: 'Node5', state: NodeState.Origin},
    '6': {id: '6', parentId: '3', value: 'Node6', state: NodeState.Origin},
    '7': {id: '7', parentId: '3', value: 'Node7', state: NodeState.Origin},
    '8': {id: '8', parentId: '6', value: 'Node8', state: NodeState.Origin},
};

const initialState: DatabaseState = {
    table,
    index: createDbParentIndex(table),
    sequence: {
        next: 9
    }
};

export default function databaseReducer(state: DatabaseState = initialState, action: DatabaseActions): DatabaseState {
    switch (action.type) {
        case APPLY_CHANGES:
            return {
                ...state,
                table: {
                    ...state.table,
                    ...action.payload.changes
                }
            }

        case UPDATE_INDEX:
            return {
                ...state,
                index: action.payload.index
            }

        case SET_SEQUENCE:
            return {
                ...state,
                sequence: {
                    next: action.payload.next
                }
            }

        case RESET_DATABASE:
            return initialState;

        default:
            return state;
    }
}

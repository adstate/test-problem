import {MOVE_NODE, ADD_NODE, CHANGE_NODE, CLEAR_CACHE, CacheActions} from '../actions/cacheActionTypes';
import CacheNode from '../models/cacheNode';

interface CacheState {
    table: {
        [id: string]: CacheNode;
    },
    sequence: {
        prefix: string;
        next: number;
    }
}

const initialState: CacheState = {
    table: {},
    sequence: {
        prefix: 'node_',
        next: 1
    }
};

export default function(state = initialState, action: CacheActions): CacheState {
    switch (action.type) {
        case MOVE_NODE:
            return {
                ...state,
                table: {
                    ...state.table,
                    [action.payload.id]: action.payload
                }
            }

        case CHANGE_NODE:
            return {
                ...state,
                table: {
                    ...state.table,
                    [action.payload.id]: action.payload.node
                }
            }

        case ADD_NODE:
            return {
                ...state,
                table: {
                    ...state.table,
                    [action.payload.id]: action.payload.node
                },
                sequence: {
                    ...state.sequence,
                    next: state.sequence.next + 1
                }
            }

            case CLEAR_CACHE: {
                return initialState;
            }

        default:
            return state;
    }
}

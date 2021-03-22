import { combineReducers } from 'redux';
import cache from './cache';
import database from './database';

const rootReducer = combineReducers({
    cache,
    database
});

export default rootReducer;
export type RootState = ReturnType<typeof rootReducer>;

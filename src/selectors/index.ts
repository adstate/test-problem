import {createSelector} from 'reselect';
import DbTable from '../models/dbTable';
import { RootState } from '../reducers';
import dbToTree from '../utils/dbToTree';

export const getCache = (state: RootState) => state.cache.table;
export const getDatabase = (state: RootState) => state.database.table;

export const getCacheTree = createSelector(
    getCache,
    (cache: DbTable) => {
        return dbToTree(cache);
    }
);

export const getDatabaseTree = createSelector(
    getDatabase,
    (database: DbTable) => {
        return dbToTree(database)[0];
    }
);

export const getCacheNodeIds = createSelector(
    getCache,
    (cache: DbTable) => {
        return Object.keys(cache);
    }
)


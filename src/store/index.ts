import { applyMiddleware, createStore, Store } from 'redux';
import thunk from 'redux-thunk';
import rootReducer, {RootState} from '../reducers';

const middlewares = [thunk];

const store: Store<RootState> = createStore(rootReducer, {}, applyMiddleware(...middlewares));

export default store;

import { createStore, compose, applyMiddleware } from 'redux';
import thunkMw from 'redux-thunk';

import reducers from './reducers';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
    reducers,
    composeEnhancers(applyMiddleware(thunkMw)),
);

export default store;
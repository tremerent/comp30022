import { createStore, applyMiddleware } from 'redux';
import thunkMw from 'redux-thunk';

import reducers from './reducers';

const store = createStore(
    reducers,
    applyMiddleware(thunkMw)
);

export default store;
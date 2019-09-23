import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router'

import * as auth from './authReducers';
import * as art from './artReducers';

const createRootReducer = (history) => combineReducers({
    router: connectRouter(history),
    ...auth,
    ...art,
});

export default createRootReducer;
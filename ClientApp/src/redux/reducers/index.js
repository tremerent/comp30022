import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router'

import * as auth from './authReducers';
import * as art from './artReducers';
import * as users from './usersReducers';
import * as tute from './tuteReducers';

const createRootReducer = (history) => combineReducers({
    router: connectRouter(history),
    ...auth,
    ...art,
    ...users,
    ...tute,
});

export default createRootReducer;
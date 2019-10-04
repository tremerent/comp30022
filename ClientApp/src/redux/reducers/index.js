import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router'

import * as auth from './authReducers';
import * as art from './artReducers';
import * as users from './usersReducers';

const createRootReducer = (history) => combineReducers({
    router: connectRouter(history),
    ...auth,
    ...art,
    ...users,
});

export default createRootReducer;
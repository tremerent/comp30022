import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router'

import * as auth from './authReducers';

const createRootReducer = (history) => combineReducers({
    router: connectRouter(history),
    ...auth
})

export default createRootReducer;
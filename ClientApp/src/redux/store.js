import { createStore, compose, applyMiddleware } from 'redux';
import thunkMw from 'redux-thunk';
import { routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';

import createRootReducer from './reducers';

// redux devtools
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const history = createBrowserHistory();

export function configureStore() {
    const store = createStore(
        createRootReducer(history),
        composeEnhancers(
            applyMiddleware(
                thunkMw,
                routerMiddleware(history),
            )
        ),
    );

    return store;
}
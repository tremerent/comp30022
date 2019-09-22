import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-select/dist/js/bootstrap-select.js';
import 'jquery/dist/jquery.js';
import 'popper.js/dist/popper.js';
import 'bootstrap/dist/js/bootstrap.js';
import 'bootstrap-select/dist/js/bootstrap-select.js';
import 'font-awesome/css/font-awesome.min.css';

import React from 'react';
import ReactDOM from 'react-dom';
import { ConnectedRouter } from 'connected-react-router';
import { Provider } from 'react-redux'

import { configureStore, history } from './redux/store'

import App from './App';

const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href');
const rootElement = document.getElementById('root');

ReactDOM.render(
    <Provider store={configureStore()}>
        <ConnectedRouter history={history}>
            <App />
        </ConnectedRouter>
    </Provider>,
    rootElement
);
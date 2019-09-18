
import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import AuthorizeRoute from './components/api-authorization/AuthorizeRoute';

import LandingPage from './components/LandingPage';
import ArtefactBrowser from './components/Artefact/ArtefactBrowser';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';

import './App.css'

function Secret() {
    return <p>The secret is that I have no secrets.</p>;
}

export default class App extends Component {
    static displayName = App.name;

    render () {
        return (
            <Layout>
                <Route exact path='/' component={LandingPage} />
                <Route path='/login' render={() => <Login action='login'></Login>} />
                <Route path='/signup' component={Signup} />
                <Route path='/browse' component={ArtefactBrowser} />
                <AuthorizeRoute path='/secret' component={Secret} />
                {/*<Route path='/my-artefacts' component={MyArtefacts} />*/}
                {/*<Route path='/profile' component={UserProfile} />*/}
                {/*<Route path='/family' component={FamilyView} />*/}
            </Layout>
        );
    }
}


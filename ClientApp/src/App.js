
import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { Container } from 'reactstrap';

import MyArtefacts from './components/Artefact/MyArtefacts.js';
import LandingPage from './components/LandingPage.js';
import ArtefactBrowser from './components/Artefact/ArtefactBrowser.js';
import UserProfile from './components/UserProfile.js';

import TestingHome from './components/Testing/TestingHome.js';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';

import './App.css';

export default class App extends Component {
    static displayName = App.name;

    render() {
        return (
<Layout>
    {/*
        LandingPage component needs to fill the entire width of the
        page, so put it outside of the container. Everything else
        goes inside though.
        Help I don't know react.
        -- Sam
    */}
    <Route exact path='/' component={LandingPage} />
    <Container>
        {/*<Route path='/login' render={() => <Login action='login'></Login>} />*/}
        {/*<Route path='/signup' component={Signup} />*/}
        <Route path={ApplicationPaths.ApiAuthorizationPrefix} component={ApiAuthorizationRoutes} />
        <Route path='/browse' component={ArtefactBrowser} />
        <Route path='/tests' component={TestingHome} />
        <Route path='/my-artefacts' component={MyArtefacts} />
        <Route path='/profile' component={UserProfile} />
        {/*<Route path='/family' component={FamilyView} />*/}
    </Container>
</Layout>
        );
    }

    authRoutes({ match }) {
        return (
            <>
                <Route path={`${match.path}/login`} render={() => <Login action='login'></Login>} />
                <Route path={`${match.path}/signup`} component={Signup} />
            </>
        );
    }
}
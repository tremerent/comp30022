import React, { Component } from 'react';
import { Route, Switch } from 'react-router';
import { Container } from 'reactstrap';

import { Layout } from './components/Shared/Layout';
import LandingPage from './components/Shared/LandingPage.js';
import ArtefactBrowser from './components/Artefact/ArtefactBrowser.js';
import UserView from './components/User/UserView.js';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import requireAuth from './components/Auth/requireAuth';
import NotFound from './components/Shared/NotFound';

import ArtefactPage from './components/Artefact/ArtefactPage.js';

import './App.css';

function loginIfUnauthed(Component) {
    return requireAuth(Component, '/auth/login');
}

export default class App extends Component {

    render() {
        const AuthedUser = loginIfUnauthed(UserView);
        return (
            <Layout>
                <Switch>
                    <Route exact path='/'>
                        <LandingPage/>
                    </Route>

                    <Route path='/auth/login'>
                        <Login action='login'/>
                    </Route>

                    <Route path='/auth/signup'>
                        <Container>
                            <Signup/>
                        </Container>
                    </Route>

                    <Route path='/browse'>
                        <Container>
                            <ArtefactBrowser/>
                        </Container>
                    </Route>

                    <Route path='/user'>
                        <Container>
                            <AuthedUser/>
                        </Container>
                    </Route>

                    <Route path='/artefact'>
                        <Container>
                            <ArtefactPage/>
                        </Container>
                    </Route>

                    <Route>
                        <NotFound/>
                    </Route>
                </Switch>
            </Layout>
        );
    }
}

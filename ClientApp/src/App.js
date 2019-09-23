import React, { Component } from 'react';
import { Route, Switch } from 'react-router';
import { Container } from 'reactstrap';

import { Layout } from './components/Layout';
import MyArtefacts from './components/Artefact/MyArtefacts.js';
import LandingPage from './components/LandingPage.js';
import ArtefactBrowser from './components/Artefact/ArtefactBrowser.js';
import UserProfile from './components/UserProfile.js';
import TestingHome from './components/Testing/TestingHome.js';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import requireAuth from './components/Auth/requireAuth';
import NotFound from './components/NotFound';

import './App.css';

function loginIfUnauthed(Component) {
    return requireAuth(Component, '/auth/login');
}

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
                <Switch>
                    <Route exact path='/' component={LandingPage} />
                    <Container>
                        <Switch>
                            <Route path='/auth' component={this.authRoutes} />
                            <Route path='/browse' component={ArtefactBrowser} />

                            <Route path='/profile' component={loginIfUnauthed(UserProfile)} />
                            <Route path='/my-artefacts' component={loginIfUnauthed(MyArtefacts)} />

                            <Route path='/tests' component={TestingHome} />

                            <Route component={NotFound} />
                        </Switch>
                    {/*<Route path='/family' component={FamilyView} />*/}
                    {/*<Route path='/login' render={() => <Login action='login'></Login>} />*/}
                    {/*<Route path='/signup' component={Signup} />*/}
                    </Container>
                </Switch>
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

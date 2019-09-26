import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';


import BrowseArtefact from './BrowseArtefact'
import Profile from './Profile'

import Toolbar from '@material-ui/core/Toolbar';

import {Route,Link,Switch,BrowserRouter as Router} from 'react-router-dom'

//Style for the appbar.
const style ={
    AppBar: {background:'blue'},
}

export default function Header() {

  return (
        <Router>
          <AppBar position="static" style={style.AppBar}>
            <Toolbar>
              {/* Title for the app name */}
              <Typography variant="h6" color="inherit" style={{flex:1}} >
                  Artefactor
              </Typography>
              {/* tab section */}
              <div className="App">
                {/* The section for the react router. This is for navigation between pages. */}
                <Route
                  path="/"
                  render={({ location }) => (
                    <React.Fragment>
                    <Tabs value={location.pathname}>
                        <Tab label="Profile" value="/" component={Link} to="/" />
                        <Tab label="Browse" value="/browse" component={Link} to="/browse" />
                    </Tabs>
                    </React.Fragment>
                  )}
                />
                </div>
                </Toolbar>
                </AppBar>

                <React.Fragment>
                  {/* the switch section to allow switch between tabs */}
                  <Switch>
                    <Route path="/browse" component={BrowseArtefact} />
                    <Route path="/" component={Profile} />
                  </Switch>
                </React.Fragment>
            </Router>
  );
}


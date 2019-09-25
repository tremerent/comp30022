import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { users as usersActions } from '../redux/actions'
import UserProfile from './UserProfile';
import CentreLoading from './CentreLoading';

class UserView extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.getUser(this.props.username);
    }

    render() {


        return (
            this.props.loading
                ? <CentreLoading />
                : <UserProfile user={this.props.user} />
        );
    }
}

function getUsernameFromPath(pathname) {
    const pathToUsernameRe = /\/user\/(.+)/;
    const matches = pathname.match(pathToUsernameRe);

    if (matches !== null) {
        return matches[1];
    }
    else {
        // TODO - show error
        return null
    }
}

function mapStateToProps(state) {
    const username = getUsernameFromPath(state.router.location.pathname);

    // state.users.username may not exist yet
    const user = 
        state.users.users[username] != null
            ? state.users.users[username]
            : {
                loading: true,
            };

    console.log(user.loading);
    return {
        username,
        user: user,
        loading: user.loading,
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ getUser: usersActions.getUser, }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(UserView);
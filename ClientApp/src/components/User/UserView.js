import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { users as usersActions, artefacts as artActions } from '../../redux/actions';
import UserProfile from './UserProfile';
import CentreLoading from '../Shared/CentreLoading';

class UserView extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.getUser(this.props.username);
        this.props.getUserArtefacts(this.props.username, "public");
    }

    render() {
        return (
            this.props.loading
                ? <CentreLoading />
                // unsafe to remove this from the ternary - this.props.loading == false means null checks have been prepared properly
                : <UserProfile
                    user={this.props.user}
                    userArtefacts={this.props.userArtefacts}
                    umArtefactsReg={this.props.userArtefacts.length} />
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

    let userArtefacts = [];
    let userArtsLoading = true;
    // check key exists
    if (state.art.userArts[username] != null) {
        userArtefacts = state.art.userArts[username].artefacts;
        userArtsLoading = state.art.userArts[username].loading;
    }

    return {
        username,
        userArtefacts,
        user: user,
        loading: (user.loading || userArtsLoading.loading),
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getUser: usersActions.getUser,
        getUserArtefacts: artActions.getUserArtefacts,
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(UserView);

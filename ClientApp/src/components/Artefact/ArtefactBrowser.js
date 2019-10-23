import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import FilteredBrowser from 'components/Shared/FilteredBrowser';
import { artefacts as artActions, tute as tuteActions, } from 'redux/actions';

import ArtefactBrowserTute from './ArtefactBrowserTute';

import './ArtefactBrowser.css';

class ArtefactBrowser extends React.Component {

    componentWillUnmount() {
        this.props.browserPageExited();
    }

    render() {
        const showBrowserTute = this.props.firstTimeUser

        return (
            <div className='af-artbrowser'>
                {/* somewhat hacky forced rerender if query in url changes -
                 without this <Link/> wouldn't rerender the FilteredBrowser.
                 This would have been happily avoided by going all in on the
                 redux. Oops - jonah */}
                <FilteredBrowser
                    key={this.props.queryString}
                    filterHeader={
                        showBrowserTute 
                        ? <ArtefactBrowserTute /> 
                        : null
                    }
                />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        queryString: state.router.location.search,
        userLoggedIn: state.auth.isLoggedIn,

        firstTimeUser: 
            state.auth.isLoggedIn 
            ? (state.users.users[state.auth.user.username]
                ? state.users.users[state.auth.user.username].newUser
                : false)  // if user not fetched, assume user is not new
            : !state.tute.browserTute.complete
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        setFilter: artActions.setFilter,
        browserPageExited: tuteActions.browserPageExited,
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps) (ArtefactBrowser);


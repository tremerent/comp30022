import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import FilteredBrowser from 'components/Shared/FilteredBrowser';
import { artefacts as artActions } from 'redux/actions';

import './ArtefactBrowser.css';

class ArtefactBrowser extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let shouldApplyDetectiveAction;
        // check for filter events
        if (this.props.location.state) {
            // user has navigated from landing page with 'detectiveBrowse' action
            shouldApplyDetectiveAction = 
                this.props.location.state.prevPath === '/' && 
                this.props.location.state.action === 'detectiveBrowse';
        }

        return (
            <div className='af-artbrowser'>
                {/* somewhat hacky forced rerender if query in url changes -
                 without this <Link/> wouldn't rerender the FilteredBrowser.
                 This would have been happily avoided by going all in on the 
                 redux. Oops - jonah */}
                <FilteredBrowser 
                    key={this.props.queryString}
                    detectiveActionActive={shouldApplyDetectiveAction}
                />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        queryString: state.router.location.search,
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        setFilter: artActions.setFilter,
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps) (ArtefactBrowser);


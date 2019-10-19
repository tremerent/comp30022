import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import FilteredBrowser from 'components/Shared/FilteredBrowser';
import { setDetectiveFilter } from 'components/Shared/filterUtils';
import { artefacts as artActions } from 'redux/actions';

import './ArtefactBrowser.css';

class ArtefactBrowser extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        // check for filter events
        if (this.props.location.state) {
            if (this.props.location.state.prevPath === '/' && 
                this.props.location.state.action === 'detectiveBrowse')
            {
                setDetectiveFilter(this.props.setFilter, {});
            }
        }
    }

    render() {
        return (
            <div className='af-artbrowser'>
                {/* somewhat hacky forced rerender if query in url changes -
                 without this <Link/> wouldn't rerender the FilteredBrowser.
                 This would have been happily avoided by going all in on the 
                 redux. Oops - jonah */}
                <FilteredBrowser key={this.props.queryString}/>
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


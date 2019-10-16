import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import FilteredBrowser from 'components/Shared/FilteredBrowser';

import './ArtefactBrowser.css';

class ArtefactBrowser extends React.Component {
    constructor(props) {
        super(props);
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

export default connect(mapStateToProps) (ArtefactBrowser);


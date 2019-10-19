import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import CentreLoading from 'components/Shared/CentreLoading';
import ArtefactScroller from 'components/Artefact/ArtefactScroller';
import Filter from 'components/Shared/Filter';
import { artefacts as artActions } from 'redux/actions'

import "./Filter.css";

class FilteredBrowser extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const initFilterDetails = {};

        this.props
            .getFilteredArtefacts(initFilterDetails)
            .then(() => {});
    }

    render() {
        return (
            <div className='af-filtered-browser'>
                <div>
                    <button>
                        Share your knowledge
                    </button>
                    <button>
                        Interest
                    </button>
                </div>
                <Filter
                    filterTitle={<h3> Search </h3>}
                    submitFilter={this.submitFilter}
                />
                {
                    this.props.loading
                    ?
                    <CentreLoading />
                    :
                    <ArtefactScroller
                        key={this.props.filteredArtefacts.length}
                        artefacts={this.props.filteredArtefacts}
                        loading={this.props.loading}
                    />
                }

            </div>
        );

    }

    submitFilter = (filterQuery) => {
        this.props
            .getFilteredArtefacts(
                filterQuery
            );
    }
}

const mapStateToProps = (state) => {
    return {
        filteredArtefacts: state.art.browserArts.browserArtefacts,
        loading: state.art.browserArts.loading
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        getFilteredArtefacts: artActions.getBrowserArtefacts
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps) (FilteredBrowser);

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import CentreLoading from 'components/Shared/CentreLoading';
import ArtefactScroller from 'components/Artefact/ArtefactScroller';
import Filter from 'components/Shared/Filter';
import { artefacts as artActions } from 'redux/actions'

import "./Filter.css";

// url filters supported on as needed basis, since should only be directed
// to from a <Link />.
// TODO: redir to 404 if user manually inputs unsupported query.
// (jonah)
const supportedFilterTypes = [
    "category",
];

function queryStringToObj(queryString) {
    const queryObj = {};

    if (queryString) {
        const queryParams = new URLSearchParams(queryString);

        queryParams.forEach(function(value, key) {
            if (supportedFilterTypes.includes(key)) {

                // if a key is encountered again, then we have a query string
                // of form '?..&key=val1&key=val2' - need to create a list
                if (queryObj[key]) {
                    createQueryListThenAdd();
                }
                else {
                    queryObj[key] = value;
                }


                function createQueryListThenAdd() {
                    if (Array.isArray(queryObj[key])) {
                        queryObj[key].append(value);
                    }
                    else {
                        queryObj[key] = [queryObj[key], value];
                    }
                }
            }
        });
    }

    console.log(queryObj);
    return queryObj;
}

class FilteredBrowser extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props
            .getFilteredArtefacts(this.props.queryFilter 
                ? this.props.queryFilter 
                : {})
            .then(() => {});
    }

    render() {
        return (
            <div className='af-filtered-browser'>
                <Filter 
                    submitFilter={this.submitFilter}
                    queryFilter={this.props.queryFilter}
                />
                <div>
                </div>
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
    const queryFilter = queryStringToObj(state.router.location.search);

    return {
        filteredArtefacts: state.art.browserArts.browserArtefacts,
        loading: state.art.browserArts.loading,
        queryFilter,
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        getFilteredArtefacts: artActions.getBrowserArtefacts
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps) (FilteredBrowser);
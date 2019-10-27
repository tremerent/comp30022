import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import CentreLoading from 'components/Shared/CentreLoading';
import ArtefactScroller from 'components/Artefact/ArtefactScroller';
import Filter from 'components/Shared/Filter';
import { artefacts as artActions } from 'redux/actions';
import {
    getQueryDetails,
    getFilterDetails
} from 'components/Shared/filterUtils';

import "./Filter.css";

// url filters supported on as needed basis, since should only be directed
// to from a '<Link />', otherwise filterDetails maintained in store.
// TODO: redir to 404 if user manually inputs unsupported query.
// (jonah)
const supportedUrlFilterTypes = [
    "category",
];

function queryStringToObj(queryString) {
    const queryObj = {};

    if (queryString) {
        const queryParams = new URLSearchParams(queryString);

        queryParams.forEach(function(value, key) {
            if (supportedUrlFilterTypes.includes(key)) {

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

    return queryObj;
}

class FilteredBrowser extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            detectiveActionActive:
                this.props.detectiveActionActive
                ? this.props.detectiveActionActive
                : false,
            interestingActionActive:
                this.props.interestingActionActive
                ? this.props.interestingActionActive
                : false,
        }
    }

    componentDidMount() {
        const filterDetails = {
            ...this.props.urlQueryFilter,
            ...this.props.filterDetails,
        };

        this.props
            .getFilteredArtefacts(
                getQueryDetails(filterDetails)
            );
    }

    render() {
        const filterDetails = {
            ...this.props.filterDetails,
            ...getFilterDetails(this.props.urlQueryFilter),
        };

        return (
            <div className='af-filtered-browser'>
                {
                    this.props.filterHeader 
                    ?
                    this.props.filterHeader
                    : 
                    null
                }
   
                <Filter
                    filterTitle={<h3> Refine <em>your</em> Search  </h3>}
                    submitFilter={this.submitFilter}
                    filterDetails={filterDetails}
                    onFilterChange={this.onFilterChange}
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

    onFilterChange = (filterDetails) => {
        this.props.setFilter(
            filterDetails,
        );
    }

    submitFilter = (filterDetails) => {
        this.props
            .getFilteredArtefacts(
                getQueryDetails(filterDetails)
            );
    }
}

const mapStateToProps = (state) => {
    const urlQueryFilter = queryStringToObj(state.router.location.search);

    return {
        filteredArtefacts: state.art.browserArts.browserArtefacts,
        loading: state.art.browserArts.loading,
        urlQueryFilter,
        filterDetails: state.art.browserArts.filterDetails,
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        getFilteredArtefacts: artActions.getBrowserArtefacts,
        setFilter: artActions.setFilter,
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps) (FilteredBrowser);

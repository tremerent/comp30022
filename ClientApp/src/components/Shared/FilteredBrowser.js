import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { format, startOfDay } from 'date-fns';

import CentreLoading from 'components/Shared/CentreLoading';
import ArtefactScroller from 'components/Artefact/ArtefactScroller';
import Filter from 'components/Shared/Filter';
import { artefacts as artActions } from 'redux/actions'
import { 
    setDetectiveFilter as setDetFilterImp, 
    setInterestingFilter as setInterFilterImp,
} from './filterUtils';

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

/**
 * 'getFilteredArtefacts' expects an object with key-values that can be converted
 * directly to a query string (denoted 'queryDetails'). The following functions 
 * convert between a 'queryDetails' object and a 'Filter.state.filterDetails' 
 * object.
 */ 

function apiFormatDate(date, defaultText) {
    if (!date) return defaultText;
    return format(date, 'MM.DD.YYYY');
}

// Converts a 'filterDetails' to key/value query parameters, ready for
// 'getFilteredArtefacts'.
function getQueryDetails(filterDetails) {
    const newFilterQueryParams = {};
    // nullify 'filterDetails' params. we don't want in q string
    const removedFilterQueryParams = {};  
    
    // search query - can't search for an empty string
    if (filterDetails.searchQuery && filterDetails.searchQuery.text != "") {

        newFilterQueryParams.q = [];
        removedFilterQueryParams.searchQuery = null;

        if (filterDetails.searchQuery.type) {
            if (filterDetails.searchQuery.type.name == "both") {
                newFilterQueryParams.q.push(`${filterDetails.searchQuery.text}:title`);
                newFilterQueryParams.q.push(`${filterDetails.searchQuery.text}:description`);
            } 
            else if (filterDetails.searchQuery.type.name == "title") {
                newFilterQueryParams.q.push(`${filterDetails.searchQuery.text}:title`);
            }
            else if (filterDetails.searchQuery.type.name == "description") {
                newFilterQueryParams.q.push(`${filterDetails.ssearchQuery.text}:description`);
            }
        }
        else {
            // default to just title 
            newFilterQueryParams.q.push(`${filterDetails.searchQuery.text}:title`);
        }
    }

    // date queries
    if (filterDetails.since) {
        newFilterQueryParams.since = apiFormatDate(filterDetails.since)
    }
    if (filterDetails.until) {
        newFilterQueryParams.until = apiFormatDate(filterDetails.until)
    }

    // sort query
    if (filterDetails.sortQuery != null) {
        newFilterQueryParams.sort = 
            `${filterDetails.sortQuery.name}:${filterDetails.sortQuery.order}`;

        removedFilterQueryParams.sortQuery = null;
    }

    // category queries
    if (filterDetails.catQueryType != null) {
        if (filterDetails.catQueryType.name == "matchAll") {
            newFilterQueryParams.matchAll = "true";
        }
        else if (filterDetails.catQueryType.name == "matchAny") {
            newFilterQueryParams.matchAll = "false";
        }
    }
    if (filterDetails.category && filterDetails.category.length > 0) {
        // query string expects only name of category
        newFilterQueryParams.category = 
            filterDetails.category
                         .map(catOption => catOption.label);
    }

    const queryDetails = {
        ...filterDetails,
        ...newFilterQueryParams,
        ...removedFilterQueryParams
    }

    return queryDetails;
}

// inverse of 'getQueryDetails' - that is, it maps a 'queryDetails' object 
// (formatted for 'submitFilter') to a format for 'this.state.filterDetails'.
function getFilterDetails(queryDetails) {
    const filterDetails = {};

    // CategorySelect expects a select options list
    const cat = queryDetails.category;

    if (queryDetails.category != null) {
    
        let categories;
        if (!Array.isArray(cat)) {
            categories = [queryDetails.category];
        }
        else {
            categories = queryDetails.category;
        }

        filterDetails.category = categories.map(cat => asSelectOpt(cat));

        function asSelectOpt(val) {
            return {
                label: val,
                name: val,
            };
        }
    }

    return filterDetails;
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

        if (this.props.detectiveActionActive) {
            this.applyDetectiveAction();
        }

        this.props
            .getFilteredArtefacts(filterDetails);
    }

    render() {
        const filterDetails = {
            ...this.props.filterDetails,
            ...getFilterDetails(this.props.urlQueryFilter),
        };

        return (
            <div className='af-filtered-browser'>
                <div className='af-filter-header'>
                    {this.props.filterHeader}
                    {/* <div className='af-filter-header-title'>
                        <h2> What are you  looking for? </h2>
                    </div>
                    <div className='af-filtered-browser-actions'>
                        <div className='af-filtered-browser-action'>
                            <button 
                                onClick={this.applyDetectiveAction} 
                                className={'btn ' + 
                                    (this.state.detectiveActionActive
                                    ?
                                    'btn-outline-danger'
                                    :
                                    'btn-primary')
                                }
                            >
                                Help others
                            </button>
                        </div>
                        <div className='af-filtered-browser-action'>
                            <button 
                                onClick={this.applyInterestingAction} 
                                className={'btn ' + 
                                    (this.state.interestingActionActive
                                    ?
                                    'btn-outline-danger'
                                    :
                                    'btn-primary')
                                }
                            >
                                Discover incredible artefacts
                            </button>
                        </div>
                    </div> */}
                </div>
                <Filter 
                    filterTitle={<h3> Refine your <em> Search </em> </h3>}
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

    applyDetectiveAction = () => {
        this.setState({
            ...this.state,
            detectiveActionActive: true,
            interestingActionActive: false,
        });

        this.applyDetectiveFilter();
    }

    applyInterestingAction = () => {
        this.setState({
            ...this.state,
            detectiveActionActive: false,
            interestingActionActive: true,
        });

        this.applyInterestingFilter();
    }

    applyDetectiveFilter = () => {
        setDetFilterImp(this.props.setFilter, this.props.filterDetails);
        this.submitFilter({
            ...this.props.filterDetails, 
        });
    }

    applyInterestingFilter = () => {
        setInterFilterImp(this.props.setFilter, this.props.filterDetails);
        this.submitFilter({
            ...this.props.filterDetails,
        });
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

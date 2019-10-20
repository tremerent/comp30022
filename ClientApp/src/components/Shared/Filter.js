import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { tute as tuteActions } from 'redux/actions';

// date range
import { Calendar } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { format } from 'date-fns';
import CategorySelect from 'components/Category/CategorySelect';

import 'components/Shared/Filter.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faArrowUp, faSortUp, faSortDown, faTimes, } from '@fortawesome/free-solid-svg-icons';
import { Collapse, } from 'reactstrap';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Tooltip, } from 'reactstrap';
import Select from 'react-select';

import { queryTypes, sortOptions, catQueryTypes } from './filterUtils';

function formatDateDisplay(date, defaultText) {
    if (!date) return defaultText;
    return format(date, 'dd/MM/yyyy');
}

/**
 * Browser filter presentation component.
 */
class Filter extends React.Component {

    constructor(props) {
        super(props);

        this.initStateFilterDetails = {
            searchQuery: {
                text: "",
                type: queryTypes[0],
            },
            category: [],
            since: null,
            until: null,
            sortQuery: {
                ...sortOptions[1],
                order: "desc", 
            },
            catQueryType: catQueryTypes[1],
        }
        
        this.state = {
            // prop filter details overrides default
            filterDetails: {
                ...this.initStateFilterDetails,
                ...this.props.filterDetails,
            },
            showUntilCalendar: false,
            showSinceCalendar: false,
            showQuerySearchDrop: false,
            // maintain two for the collapse - 'showFilter' toggled during 
            // transition, 'filterShown' toggled when complete
            showFilter: true,
            filterShown: true,
        };
    }


    render() {
        const filterDetails = {
            ...this.state.filterDetails,
            ...this.props.filterDetails,
        }

        const filterInputs = (
            <div>
                <div class="af-filter-row">
                    <div className="af-filter-row-item">
                        <div className="input-group mr-sm-2">

                            <div className="input-group-prepend">
                                <div className="input-group-text">
                                    <FontAwesomeIcon icon={faSearch} />
                                </div>
                            </div>
                            <input
                                onChange={(e) =>
                                    this.handleFilterChange("searchQuery")({
                                        ...filterDetails.searchQuery,
                                        text: e.target.value
                                    })
                                }
                                value={filterDetails.searchQuery.text}
                                className={`form-control`}
                                placeholder={filterDetails.searchQuery.type.label}
                            />
                        </div>
                    </div>
                    <ButtonDropdown
                        isOpen={this.state.showQuerySearchDrop}
                        toggle={() => this.toggle("showQuerySearchDrop") }
                    >
                        <DropdownToggle caret>
                            {filterDetails.searchQuery.type.label}&nbsp;
                        </DropdownToggle>
                        <DropdownMenu>
                            {
                                queryTypes
                                    .map((queryType, i) => {
                                        // pass array ele. by index so ref
                                        // not duplicated by lambda
                                        if (queryType.name != filterDetails.searchQuery.type.name) {
                                            return (
                                                <DropdownItem
                                                    onClick={() => {
                                                        this.toggle("showQuerySearchDrop");
                                                        this.handleFilterChange("searchQuery")({
                                                            ...filterDetails.searchQuery,
                                                            type: queryTypes[i]
                                                        });
                                                    }}
                                                    toggle={false}  // override default
                                                >
                                                    {queryType.label}
                                                </DropdownItem>
                                            );
                                        }
                                        else {
                                            return null;
                                        }
                                    })
                            }
                        </DropdownMenu>
                    </ButtonDropdown>
                </div>
                {/* category select */}
                <div className="af-filter-row">
                    <div className="af-filter-row-item">
                        <div id={"Tooltip-" + this.props.filterCatsTt.id}>
                            <CategorySelect
                                blurPlaceholder={"Click to choose a category"}
                                focusPlaceholder={"Categories"}
                                creatable={false} 
                                categoryVals={filterDetails.category} 
                                setCategoryVals={this.handleFilterChange("category")} 
                            />
                        </div>
                        <Tooltip         
                                placement="right"
                                isOpen={this.props.filterCatsTt.toolTipOpen}
                                target={"Tooltip-" + this.props.filterCatsTt.id}
                                autohide={false}
                                className="af-tooltip"
                                toggle={this.props.browserTuteRunState}
                            >
                                What are you interested in?
                        </Tooltip>
                    </div>

                    <ButtonDropdown
                                isOpen={this.state.showCatQueryTypeDrop}
                                toggle={() => this.toggle("showCatQueryTypeDrop") }
                        >
                        <DropdownToggle caret>
                            {filterDetails.catQueryType.label}&nbsp;
                        </DropdownToggle>
                        <DropdownMenu>
                            {
                                catQueryTypes
                                    .map((catQueryType, i) => {
                                        // pass array ele. by index so ref
                                        // not duplicated by lambda
                                        if (catQueryType.name != filterDetails.catQueryType.name) {
                                            return (
                                                <DropdownItem
                                                    onClick={() => {
                                                        this.toggle("showCatQueryTypeDrop");
                                                        this.handleFilterChange("catQueryType")(catQueryTypes[i]);
                                                    }}
                                                    toggle={false}
                                                >
                                                    {catQueryType.label}
                                                </DropdownItem>
                                            );
                                        }
                                        else {
                                            return null;
                                        }
                                    })
                            }
                        </DropdownMenu>
                    </ButtonDropdown>
                </div>
                <div className="input-group mr-sm-2 af-filter-bottom-margin">
                    <div className="af-filter-row-flex-item">
                        <Select
                            menuIsOpen={false}
                            value={filterDetails.since
                                ? { label: `After ${formatDateDisplay(filterDetails.since)}`,
                                    value: filterDetails.since}
                                : null}
                            placeholder="After"
                            onFocus={() => {
                                this.paramToggle("showSinceCalendar")(true)
                            }}
                            onBlur={() => this.paramToggle("showSinceCalendar")(false)}
                        />
                    </div>

                    <div className="af-filter-row-flex-item">
                        <Select
                            menuIsOpen={false}
                            value={filterDetails.until
                                    ? { label: `Before ${formatDateDisplay(filterDetails.until)}`,
                                        value: filterDetails.until}
                                    : null
                                  }
                            placeholder="Before"
                            onFocus={() => {
                                if (this.state.showSinceCalendar) {
                                    this.paramToggle("showSinceCalendar")(false);
                                }
                                this.paramToggle("showUntilCalendar")(true);
                            }}
                            onBlur={() => this.paramToggle("showUntilCalendar")(false)}
                        />
                    </div>
                </div>
                {/* date pickers */}
                <div className="af-filter-datepicker-outer">
                    <Collapse
                        isOpen={this.state.showSinceCalendar}
                    >
                        <div className="af-filter-datepicker-inner">
                            <p className="text-dark text-center"> Show artefacts created after: </p>
                            <Calendar
                                    date={filterDetails.since}
                                    onChange={this.handleFilterChange("since")}
                            />
                        </div>

                    </Collapse>
                    <Collapse
                        isOpen={this.state.showUntilCalendar}
                    >
                        <div className="af-filter-datepicker-inner">
                            <p className="text-dark"> Show artefacts created before: </p>
                            <Calendar
                                    date={filterDetails.until}
                                    onChange={this.handleFilterChange("until")}
                            />
                        </div>
                    </Collapse>
                </div>
                {/* sort and submit */}
                <div className="af-filter-row">
                    <div className="af-filter-sort-outer">
                        <div className="af-filter-sort-select">
                            <Select
                                onChange={(value) =>
                                    this.handleFilterChange("sortQuery")
                                    ({...filterDetails.sortQuery,
                                        ...value,
                                        order: "desc"})}  // TODO: sort query order
                                value={filterDetails.sortQuery}
                                options={sortOptions}
                                placeholder="Sort by"
                                menuPlacement="top"
                                isClearable={true}

                                id={"Tooltip-" + this.props.sortArtsTt.id}
                            />

                            <Tooltip         
                                placement="right"
                                isOpen={this.props.sortArtsTt.toolTipOpen}
                                target={"Tooltip-" + this.props.sortArtsTt.id}
                                autohide={false}
                                className="af-tooltip"
                                toggle={this.props.browserTuteRunState}
                            >
                                You can sort the artefacts that appear here
                        </Tooltip>
                        </div>
                        <button
                            onClick={this.toggleSortDir}
                            className="btn af-filter-sort-order-toggle"
                        >
                            {
                                filterDetails.sortQuery.order === "asc"
                                ?
                                    <FontAwesomeIcon icon={
                                        faSortUp
                                    } />
                                :
                                    <FontAwesomeIcon icon={
                                        faSortDown
                                    } />
                            }

                        </button>
                    </div>
                    <div className="af-filter-controls">
                        <button 
                            onClick={this.clearFilter}
                            className="btn btn-outline-secondary af-filter-control"
                        > 
                            <FontAwesomeIcon icon={faTimes} color="#417dba"/>
                            &nbsp; 
                            Clear
                        </button>
                        <button 
                            onClick={this.handleSubmit}
                            className="btn btn-primary "
                        > 
                            <FontAwesomeIcon icon={faSearch} />
                            &nbsp; 
                            Search
                        </button>
                    </div>
                </div>
            </div>
        );

        return (
            <>
                <div className={ "af-filter-header " +
                    (this.state.showFilter
                    ? "af-flex-between"
                    : "af-flex-end")
                }>
                    {   
                        this.state.showFilter
                        ?
                        this.props.filterTitle
                        :
                        null
                    }
                    <button
                        onClick={() => this.toggle("showFilter")}
                        className="btn btn-outline-dark"
                    >
                        {
                            this.state.filterShown
                            ?
                                <>
                                    <FontAwesomeIcon icon={faArrowUp} />
                                    &nbsp;
                                    Hide
                                </>
                            :
                                <>
                                    <FontAwesomeIcon icon={faSearch} />
                                    &nbsp;
                                    Wanting to get specific?
                                </>
                        }
                    </button>
                </div>
                <Collapse
                    isOpen={this.state.showFilter}
                    onExited={() => this.toggleFilterShown(false)}
                    onEntered={() => this.toggleFilterShown(false)}
                >
                    <div>
                        {filterInputs}
                    </div>
                </Collapse>
            </>
        );
    }

    handleSubmit = (filterDetails) => { 
        this.props.submitFilter(filterDetails);
    }

    clearFilter = () => {
        this.setState({
            ...this.state,
            filterDetails: this.initStateFilterDetails,
        }, () => {
            this.props.onFilterChange(this.state.filterDetails);
            this.handleSubmit();
        });
    }

    toggleSortDir = () => {
        let newOrder;
        if (this.state.filterDetails.sortQuery.order == "desc") {
            newOrder = "asc";
        }
        else if (this.state.filterDetails.sortQuery.order == "asc") {
            newOrder = "desc";
        }
        else {
            newOrder = "asc";
        }

        this.handleFilterChange("sortQuery")({
            ...this.state.filterDetails.sortQuery,
            order: newOrder,
        });
    }

    toggle = (property) => {
        const newState = {
            ...this.state,
        };
        newState[property] = !this.state[property];

        this.setState(newState);
    }

    paramToggle = (property) => (param) => {
        const newState = {
            ...this.state,
        };
        newState[property] = param;

        this.setState(newState);
    }

    toggleFilterShown = (toggle) => {
        const newState = toggle
            ? toggle
            : !this.state.filterShown;

        this.setState({
            ...this.state,
            filterShown: newState,
        });
    }

    handleFilterChange = (key) => (value) => {
        this.setState({
            ...this.state,
            filterDetails: {
                ...this.state.filterDetails,
                [key]: value,
            },
        }, () => {
            this.props.onFilterChange(this.state.filterDetails);
        });
    }
}

const mapStateToProps = (state) => {
    return {
        // browser tute
        sortArtsTt: state.tute.browserTute.sortArts,
        filterCatsTt: state.tute.browserTute.filterCats,
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        browserTuteRunState: tuteActions.browserTuteRunState,
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps) (Filter);
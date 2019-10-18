import React from 'react';
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
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import Select from 'react-select';

// text query types
const queryTypes = [
    {
        name: "title",
        label: "Title",
    },
    {
        name: "description",
        label: "Description",
    },
    {
        name: "both",
        label: "Title + Description",
    }
];

const sortOptions = [
    {
        name: "title",
        label: "Title",
    },
    {
        name: "createdAt",
        label: "Upload date",
    },
    {
        name: "imageCount",
        label: "Images"
    }
];

const catQueryTypes = [
    {
        name: "matchAll",
        label: "All",
    },
    {
        name: "matchAny",
        label: "Any",
    },
];

function formatDateDisplay(date, defaultText) {
    if (!date) return defaultText;
    return format(date, 'DD/MM/YYYY');
}

/**
 * Browser filter presentation component.
 */
export default class Filter extends React.Component {
    
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
            // maintain two for the collapse
            showFilter: true,
            filterShown: true,
        };
    }

    render() {
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
                                        ...this.state.filterDetails.searchQuery, 
                                        text: e.target.value 
                                    })
                                } 
                                value={this.state.filterDetails.searchQuery.text}
                                className={`form-control`}
                                placeholder={this.state.filterDetails.searchQuery.type.label}
                            />
                        </div>
                    </div>
                    <ButtonDropdown 
                        isOpen={this.state.showQuerySearchDrop} 
                        toggle={() => this.toggle("showQuerySearchDrop") }
                    >
                        <DropdownToggle caret>
                            {this.state.filterDetails.searchQuery.type.label}&nbsp;
                        </DropdownToggle>
                        <DropdownMenu>
                            {
                                queryTypes
                                    .map((queryType, i) => {
                                        // pass array ele. by index so ref
                                        // not duplicated by lambda
                                        if (queryType.name != this.state.filterDetails.searchQuery.type.name) {
                                            return (
                                                <DropdownItem 
                                                    onClick={() => { 
                                                        this.toggle("showQuerySearchDrop"); 
                                                        this.handleFilterChange("searchQuery")({
                                                            ...this.state.filterDetails.searchQuery,
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
                        <CategorySelect 
                            blurPlaceholder={"Click to choose a category"}
                            focusPlaceholder={"Categories"}
                            creatable={false} 
                            categoryVals={this.state.filterDetails.category} 
                            setCategoryVals={this.handleFilterChange("category")} 
                        />
                    </div>

                    <ButtonDropdown 
                                isOpen={this.state.showCatQueryTypeDrop} 
                                toggle={() => this.toggle("showCatQueryTypeDrop") }
                        >
                        <DropdownToggle caret>
                            {this.state.filterDetails.catQueryType.label}&nbsp;
                        </DropdownToggle>
                        <DropdownMenu>
                            {
                                catQueryTypes
                                    .map((catQueryType, i) => {
                                        // pass array ele. by index so ref
                                        // not duplicated by lambda
                                        if (catQueryType.name != this.state.filterDetails.catQueryType.name) {
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
                            value={this.state.filterDetails.since 
                                ? { label: `After ${formatDateDisplay(this.state.filterDetails.since)}`, 
                                    value: this.state.filterDetails.since} 
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
                            value={this.state.filterDetails.until 
                                    ? { label: `Before ${formatDateDisplay(this.state.filterDetails.until)}`, 
                                        value: this.state.filterDetails.until} 
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
                                    date={this.state.filterDetails.since}
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
                                    date={this.state.filterDetails.until}
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
                                    ({...this.state.filterDetails.sortQuery, 
                                        ...value, 
                                        order: "desc"})}  // TODO: sort query order
                                values={this.state.filterDetails.sortQuery}
                                options={sortOptions}
                                placeholder="Sort by"
                                menuPlacement="top"
                                isClearable={true}
                            />
                        </div>
                        <button 
                            onClick={this.toggleSortDir}
                            className="btn af-filter-sort-order-toggle"
                        > 
                            {
                                this.state.filterDetails.sortQuery.order === "asc"
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
                            className="btn btn-outline-warning af-filter-control"
                        > 
                            <FontAwesomeIcon icon={faTimes} color="#ccae57"/>
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
                <div className="af-filter-header">
                    <button 
                        onClick={() => this.toggle("showFilter")}
                        className="btn btn-outline"
                    >
                        {
                            this.state.filterShown
                            ?
                                <FontAwesomeIcon icon={faArrowUp} />
                            :
                                <FontAwesomeIcon icon={faSearch} />
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

    handleSubmit = () => { 
        this.props.submitFilter(this.state.filterDetails);
    }

    clearFilter = () => {
        this.setState({
            ...this.state,
            filterDetails: this.initStateFilterDetails,
        }, this.handleSubmit);
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
import React from 'react';

import CategorySelect from 'components/Category/CategorySelect';

class FilteredBrowser extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        <div className='af-artbrowser'>
            {/* <div className='af-artbrowser-filter'>
                <CategorySelect />
            </div> */}
            <ArtefactScroller
                key={this.props.myArtefacts.length}
                artefacts={this.props.publicArtefacts}
                loading={this.props.loading}
            />
        </div>
    }
}

class Filter extends React.Component {
    
    constructor(props) {
        super(props);

        
        this.state = {
            title: "",
            categories: []
        };
    }

    render() {
        return (
            <div className='af-artbrowser-filter'>
                <input id="title" onChange={this.handleFormChange} value={this.state.title} />
                <CategorySelect 
                    creatable={true} 
                    categoryVals={this.state.categories} 
                    setCategoryVals={this.handleSelectValsChange("categories")} 
                />
            </div>
        );
    }

    handleFormChange = (e) => {
        this.setState({
            ...this.state,
            [e.target.id]: e.target.value,
        });
    }

    // selectName refers to name of element, so that 'handleFormChange' has
    // the appropriate element name
    handleSelectValsChange = (selectName) => (vals) => {
        this.handleFormChange({
            target: {
                value: vals,
                id: selectName,
            },
        });
    }
}

class FilteredBrowser extends React.Component {

    constructor(props) {
        super(props);

    }

    render() {
        
    }

    onChangeHandler = event => {
        this.setState({
        });
    }

    handleSubmit = (e) => {
    }
}

function mapDispatchToProps()

function mapStateToProps(state) {
}

export default connect(mapStateToProps, null) (ArtefactImageUploadTest);

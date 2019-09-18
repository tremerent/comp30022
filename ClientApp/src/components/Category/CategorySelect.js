import React, { Component } from 'react';
import AsyncCreatableSelect from 'react-select/async-creatable';

import { getCategories, postCategory } from '../../scripts/requests.js';

export default class CategorySelect extends Component {
    /*
     * Select component for categories.
     *
     * Uses react-select 'CreateableSelect' - categories can be added
     * dynamically, and the new category is posted to api.
     *
     * TODO: handle validation of the server response when new category posted
     */

    constructor(props) {
        super(props);

        this.state = {
            categoryOpts: [],
        };

        this.select = <AsyncCreatableSelect
            onChange={this.handleChange}
            //onCreateOption={test}
            values={this.props.categoryVals}

            defaultOptions
            loadOptions={this.getCategoryOptionsThenFilter}

            isMulti
            isSearchable
            closeMenuOnSelect={false}
            placeholder={this.props.placeholder}
        />
    }

    render() {
        return (
            <div>

                {this.select}
            </div>
        );
    }

    handleChange = (newValues, actionMeta) => {
        if (actionMeta.action === 'create-option') {
            this.handleCreateOption(newValues);
        }

        // need to wait for created option to be posted to server
        if (actionMeta.action !== 'create-option') {
            this.props.setCategoryVals(newValues);
        }
    }

    /*
     * Need to post the newly created options to api, then replace the value of
     * those options with the id returned by api
     */
    handleCreateOption = async (newValues) => {
        const [createdVals, other] = bifurcateBy(newValues, (val) => val.__isNew__);

        const newCategoryPromises = createdVals.map(async (val) => {
            // post the new category to api
            return await postCategory({ name: val.label });
        });

        try {
            const newCategories = await Promise.all(newCategoryPromises);
            const newCategoryOpts = newCategories.map(
                (newCat) => ({ label: newCat.name, value: newCat.id, id: newCat.id })
            );

            this.setState({
                ...this.state,
                categoryOpts: [...newCategoryOpts, ...this.state.categoryOpts]
            });

            this.props.setCategoryVals([...newCategoryOpts, ...other]);
        }
        catch (e) {
            console.log(e)
        }

        // Return list of form [[f evaluated to true], [f evaluated to false]]
        function bifurcateBy(arr, f) {
            return arr.reduce(
                (acc, val) => { acc[f(val) ? 0 : 1].push(val); return acc },
                [[], []]
            );
        }
    }

    getCategoryOptionsThenFilter = async (labelFilter) => {
        const catOpts = await this.categoryOptions();
        const filteredCategoryOpts =
            await this.filterOptionsByLabelStr(catOpts, labelFilter)

        return filteredCategoryOpts;
    }

    filterOptionsByLabelStr = async (options, labelFilter) => {
        const filtered = options.filter(opt => {
            if (opt.label) {
                return opt.label.toLowerCase().includes(labelFilter.toLowerCase())
            }
            else {
                return false;
            }
        });

        return filtered;
    }

    // use this instead of this.state.categoryOpts
    categoryOptions = async () => {
        let categoryOpts;

        if (!this.state.categoryOpts.length) {
            categoryOpts = await getCategories();

            this.setState({
                ...this.state,
                categoryOpts,
            })
        }
        else {
            categoryOpts = this.state.categoryOpts;
        }

        return categoryOpts.map(
            ({ id, name }) => ({ value: id, label: name })
        );
    }
}

CategorySelect.defaultProps = {
    categoryVals: [],
    placeholder: "Select your artefact's categories, or create a new one",
    categoryInputName: "categories",
};

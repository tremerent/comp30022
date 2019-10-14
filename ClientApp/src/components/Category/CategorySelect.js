// import React, { Component } from 'react';
// import AsyncCreatableSelect from 'react-select/async-creatable';

// import { getCategories, postCategory } from '../../scripts/requests.js';
// import { categoryOptionsGetter } from '';

// export default class CategorySelect extends Component {
//     /*
//      * Select component for categories.
//      *
//      * Uses react-select 'CreateableSelect' - categories can be added
//      * dynamically, and the new category is posted to api.
//      *
//      * TODO: handle validation of the server response when new category posted
//      */

//     constructor(props) {
//         super(props);

//         this.blurPlaceholder = "Choose your artefact's categories";
//         this.focusPlaceholder = "Type to search for a category or create your own";

//         this.state = {
//             categoryOpts: null,
//             placeholder: this.blurPlaceholder
//         };

//         this.categoryOptionsGetter = 
//             statefulAwaitGetter.bind(this, "categoryOpts", getCategories); 
//     }

//     render() {
//         return (
//             <div>
//                 <AsyncCreatableSelect
//                     onChange={this.handleChange}
//                     value={this.props.categoryVals}

//                     defaultOptions
//                     loadOptions={this.getCategoryOptionsThenFilter}

//                     onFocus={this.setFocusPlaceholder}
//                     onBlur={this.setBlurPlaceholder}

//                     menuPlacement="top"
//                     isMulti
//                     isSearchable
//                     closeMenuOnSelect={false}
//                     placeholder={this.state.placeholder}
//                 />
//             </div>
//         );
//     }

//     setBlurPlaceholder = () => {
//         this.setState({
//             ...this.state,
//             placeholder: this.blurPlaceholder,
//         });
//     }

//     setFocusPlaceholder = () => {
//         this.setState({
//             ...this.state,
//             placeholder: this.focusPlaceholder,
//         });
//     }

//     handleChange = (newValues, actionMeta) => {
//         if (actionMeta.action === 'create-option') {
//             this.handleCreateOption(newValues);
//         }

//         // need to wait for created option to be posted to server
//         if (actionMeta.action !== 'create-option') {
//             this.props.setCategoryVals(newValues);
//         }
//     }

//     /*
//      * Need to post the newly created options to api, then replace the value of
//      * those options with the id returned by api
//      */
//     handleCreateOption = async (newValues) => {
//         const [createdVals, other] = bifurcateBy(newValues, (val) => val.__isNew__);

//         const newCategoryPromises = createdVals.map(async (val) => {
//             // post the new category to api
//             return await postCategory({ name: val.label });
//         });

//         try {
//             const newCategories = await Promise.all(newCategoryPromises);
//             const newCategoryOpts = newCategories.map(
//                 (newCat) => ({ label: newCat.name, value: newCat.id, id: newCat.id })
//             );

//             this.setState({
//                 ...this.state,
//                 categoryOpts: [...newCategoryOpts, ...this.state.categoryOpts]
//             });

//             this.props.setCategoryVals([...newCategoryOpts, ...other]);
//         }
//         catch (e) {
//         }

//         // Return list of form [[f evaluated to true], [f evaluated to false]]
//         function bifurcateBy(arr, f) {
//             return arr.reduce(
//                 (acc, val) => { acc[f(val) ? 0 : 1].push(val); return acc },
//                 [[], []]
//             );
//         }
//     }

//     getCategoryOptionsThenFilter = async (labelFilter) => {
//         // const catOpts = await this.categoryOptions();
//         const catOpts = await categoryOptionsGetter().map(
//             ({ id, name }) => ({ value: id, label: name })
//         );
//         const filteredCategoryOpts =
//             await this.filterOptionsByLabelStr(catOpts, labelFilter)

//         return filteredCategoryOpts;
//     }

//     filterOptionsByLabelStr = async (options, labelFilter) => {
//         const filtered = options.filter(opt => {
//             if (opt.label) {
//                 return opt.label.toLowerCase().includes(labelFilter.toLowerCase())
//             }
//             else {
//                 return false;
//             }
//         });

//         return filtered;
//     }

    
// }

// // return categoryOpts

// // use this instead of this.state.categoryOpts

// CategorySelect.defaultProps = {
//     categoryVals: [],
//     placeholder: "Select your artefact's categories, or create a new one",
//     categoryInputName: "categories",
// };

import React, { Component } from 'react';
import AsyncCreatableSelect from 'react-select/async-creatable';
import AsyncSelect from 'react-select/async';

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

        this.blurPlaceholder = this.props.blurPlaceholder;
        this.focusPlaceholder = this.props.focusPlaceholder;

        this.state = {
            categoryOpts: [],
            placeholder: this.blurPlaceholder
        };
    }

    render() {
        return (
            <>
                {
                    this.props.creatable
                    ?
                    <AsyncCreatableSelect
                        onChange={this.handleChange}
                        value={this.props.categoryVals}

                        defaultOptions
                        loadOptions={this.getCategoryOptionsThenFilter}

                        onFocus={this.setFocusPlaceholder}
                        onBlur={this.setBlurPlaceholder}

                        menuPlacement="top"
                        isMulti
                        isSearchable
                        closeMenuOnSelect={false}
                        placeholder={this.state.placeholder}
                    />
                    :
                    <AsyncSelect
                        onChange={this.handleChange}
                        value={this.props.categoryVals}

                        defaultOptions
                        loadOptions={this.getCategoryOptionsThenFilter}

                        onFocus={this.setFocusPlaceholder}
                        onBlur={this.setBlurPlaceholder}

                        maxMenuHeight={100}
                        isSearchable
                        isMulti
                        closeMenuOnSelect={true}
                        placeholder={this.state.placeholder}
                    />
                }
            </>  
        );
    }

    setBlurPlaceholder = () => {
        this.setState({
            ...this.state,
            placeholder: this.blurPlaceholder,
        });
    }

    setFocusPlaceholder = () => {
        this.setState({
            ...this.state,
            placeholder: this.focusPlaceholder,
        });
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
    creatable: false,
};

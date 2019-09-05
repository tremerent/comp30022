import React, { Component } from 'react';
import CreatableSelect from 'react-select/creatable';
import { postCategory } from '../../scripts/requests.js';

export default class CategorySelect extends Component {
    /*
     * Select component for categories.
     *
     * Uses react-select 'CreateableSelect' - categories can be added
     * dynamically, and the appropriate ajax call is made.
     *
     * TODO: handle validation of the server response
     */

    constructor(props) {
        super(props);

        this.state = {
            categoryOptions: [],
        };
    }

    render() {
        return (
            <div>
                <CreatableSelect
                    name="categories"
                    isMulti
                    closeMenuOnSelect={false}
                    onChange={this.handleChange}
                    options={this.state.categoryOptions}
                    value={this.props.categoryVals}
                    placeholder={this.props.placeholder}
                />
            </div>
        );
    }

    componentDidMount = () => {
        this.categoryOptions()
            .then(categoryOpts => {
                this.setState({
                    ...this.state,
                    categoryOptions: categoryOpts,
                });
            })
    }

    categoryOptions = async () => {
        const resp = await fetch('api/Categories', {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await resp.json();

        return data.map(
            ({ id, name }) => ({ value: id, label: name })
        );
    }

    handleChange = (selectedVals, actionMeta) => {
        //console.log(selectedVals)

        if (actionMeta.action === `create-option`) {
            for (let v of selectedVals) {
                if (v.__isNew__ && !v.created) {
                    postCategory({
                        name: v.label,
                    })
                        .then(res => {
                            v.created = true;
                            v.value = res.id;

                            this.state.categoryOptions.push({
                                label: res.name,
                                value: res.id,
                            });

                            // add newly created category to the options list
                            this.setState({
                                ...this.state,
                                categoryOptions: [...this.state.categoryOptions],
                            });
                        })
                        .catch(e => {
                            // TODO
                            // case 1: invalid category, case 2: server error
                        });
                }
            }
        }

        if (actionMeta.action === `remove-value`) {
            this.props.setCategories({
                target: {
                    value: [...this.props.categoryVals]
                           .filter(v => v.id !== actionMeta.removedValue.id),
                    id: actionMeta.name
                }
            })
        }

        if (selectedVals != null) {
            const t = selectedVals.map(val => ({ id: val.value, ...val }))
            //console.log(t)

            this.props.setCategories({
                target: {
                    // add id for sending to server
                    value: t,
                    id: actionMeta.name,
                },
            });
        }
    }
}




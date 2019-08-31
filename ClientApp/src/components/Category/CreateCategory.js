import React, { Component } from 'react';
import Joi from 'joi';
import { postCategory } from '../../scripts/requests.js';
import { formIsValid, categorySchema } from '../../data/validation.js';

/*
 * 
 */

export default class CreateCategory extends Component {
    static displayName = CreateCategory.name;

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            category: {
                name: "",
                id: "",
                genre: ""
            },
            touched: {
                name: false,
                id: false,
                genre: false,
            },
            errors: {
                name: false,
                id: false,
                genre: false,
            },
            genreSelectOpts: {},
        };
    }

    componentDidMount = () => {

    }

    render() {
        const errs = Joi.validate(
            this.state.category,
            categorySchema,
            { abortEarly: false },  // find keys with errors
        );

        if (errs.length) {

            // grab invalid joi schema keys
            const formFieldErrors =
                errs.filter(e => e.name == 'ValidationError')
                    .map(e => e.context.key);

            for (let field of formFieldErrors) {
                if (this.touched[field]) {
                    this.setState({
                        ...this.state,
                        errors: {
                            ...this.state.errors,
                            field: true,
                        }
                    })
                }
            }
        }

        return (
            <div>
                <div className="card">
                    <div className="card-body">
                        <h4 className="card-title"> Create a category </h4>
                        <hr />
                        <form onSubmit={this.handleSubmit}>

                            <div className="form-group">
                                <label htmlFor="categoryId"> Category Id </label>
                                <input type="text" id="id" value={this.state.category.id} onChange={this.handleFormChange} onBlur={this.handleBlur('id')} className={"form-control " + (this.state.errors.id ? "error" : "")} />
                            </div>

                            <div className="form-group">
                                <label htmlFor="name"> Category </label>
                                <input type="text" id="name" value={this.state.category.name} onChange={this.handleFormChange} onBlur={this.handleBlur('name')} className={"form-control " + (this.state.errors.name ? "error" : "")} />
                            </div>

                            <button disabled={!formIsValid(this.state.category, categorySchema)} type="submit" className="btn btn-primary"> Submit </button>
                        </form>
                    </div>
                </div>

            </div>
        );
    }

    async createCategory() {
        if (formIsValid(this.state.category, categorySchema)) {
            try {
                await postCategory(this.state.category);
            }
            catch (e) {
                // TODO
            }
        }
    }

    // record touched when user navigates away from form -
    // for validation purposes
    handleBlur = (field) => (e) => {
        this.setState({
            ...this.state,
            touched: {
                ...this.touched,
                field: true,
            }
        })
    }

    handleFormChange = (e) => {
        this.setState({
            ...this.state,
            category: {
                ...this.state.category,
                [e.target.id]: e.target.value,
            },
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();

        (async () => {
            const createdCategory = await this.createCategory();
            this.props.addCategory(createdCategory);
        })();

        this.setState({
            ...this.state,
            category: {
                name: "",
                id: "",
                genre: ""
            },
        });
    }
}


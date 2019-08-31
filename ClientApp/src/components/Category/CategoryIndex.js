import React, { Component } from 'react';
import CreateCategory from './CreateCategory.js';
import authService from '../api-authorization/AuthorizeService';

export class CategoryIndex extends Component {
    static displayName = CategoryIndex.name;

    constructor(props) {
        super(props);
        this.state = {
            categories: [],
            loading: true
        };
    }

    componentDidMount() {
        this.populateCategoryData();
    }

    static renderCategorySpace(categories) {
        return (
            <div>
                {categories.map(category => 
                    <div className="category-bubble"> {category.name} </div>
                )}
            </div>
        );
    }

    render() {
        let contents = this.state.loading
                     ? <p><em>Loading...</em></p>
            : CategoryIndex.renderCategorySpace(this.state.categories);

        return (
            <div>
                <h2> Artefact Categories </h2>
                {contents}
                <hr />
                <CreateCategory addCategory={this.addCategory} />
            </div>
        );
    }

    addCategory = (category) => {
        let categories = [...this.state.category];
        categories.push(category);

        this.setState({
            ...this.state,
            categories,
        });
    }

    async populateCategoryData() {

        const token = await authService.getAccessToken();
        const response = await fetch('api/Categories', {
            headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();

        this.setState({ categories: data, loading: false });
    }
}


import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class CategoriesPreview extends Component {
    static displayName = CategoriesPreview.name;

    constructor(props) {
        super(props);
    }

    render() {
        function categoryBadge(category) {
            if (category.name && category.id) {
                return (
                    <Link
                            to={`/browse?category=${category.id}`}
                            key={category.id}
                            className="badge badge-decal-text mx-1"
                    >
                        {category.name}
                    </Link>
                );
            }
            else {
                return (<div> </div>);
            }
        }

        return this.props.categories.map(category => categoryBadge(category));
    }
}


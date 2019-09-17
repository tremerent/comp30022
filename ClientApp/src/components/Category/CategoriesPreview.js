import React, { Component } from 'react';

export default class CategoriesPreview extends Component {
    static displayName = CategoriesPreview.name;

    constructor(props) {
        super(props);
    }

    render() {

        function categoryBadge(category) {
            if (category.name && category.id) {
                return (
                    <div key={category.id} className="badge badge-decal-text mx-1">
                        {category.name}
                    </div>
                );
            }
            else {
                return (<div> </div>);
            }
        }

        return (
            <div> 
                {this.props.categories.map(category => categoryBadge(category))}
            </div>
        ); 
    }

    //this.props.categories.map(

    //    (cj) => {
    //        if (cj) {
    //            return (
    //                <div key={cj.categoryId + cj.artefactId}>
    //                    <div className="badge badge-decal-text">
    //                        cj
    //                                </div>
    //                </div>
    //            );
    //        }
    //        else {
    //            return (
    //                <div> </div>
    //            );
    //        }
    //    }

    //);
}
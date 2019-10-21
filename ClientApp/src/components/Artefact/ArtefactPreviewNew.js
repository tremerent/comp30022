import React, { Component } from 'react';
import { Link, } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';

import { editableTextArea } from 'components/Shared/editableTextArea';
import CategorySelect from 'components/Category/CategorySelect';
import ImageCarousel from  '../Shared/ImageCarousel.js';

export default class ArtefactPreviewNew extends Component {

    constructor(props) {
        super(props);

        this.state = { 
            descToggle: false,
            artefact: this.props.artefact,
        };

        console.log(this.state.artefact);
    }

    render() {
        const a = this.props.artefact;

        const id = `af-artcard-desc-${a.id}`;
        const carouselId = `af-artdoc-carousel-${this.props.artefact.id}`;

        // components
        let title;
        let categories;
        let description;

        let EditableDesc;
        let EditableTitle;

        const propValOrDefaultStr = (props, defaultStr) => {
            return (props.value != null && props.value.length
                        ? props.value
                        : defaultStr);
        }

        if (!this.props.editable) {
            categories = 
                <div className="">
                    {this.categoryJoinsToCategories(a.categoryJoin).map(c =>
                        <Link
                                to={`/browse?category=${c.name}`}
                                key={c.id}
                                className="badge badge-decal-text mx-1"
                        >
                            {c.name}
                        </Link>
                    )}
                </div>;

            description = 
                <div>
                    <p>{this.state.artefact.description}</p>
                </div>;
        }
        else {

            // if category join in api format, need to convert, otherwise
            // it is ready for 'CategorySelect'
            let curArtCatSelectOpts = [];
            const cj = this.state.artefact.categoryJoin;
            // just check first ele. since all will be same
            if (cj.length && 
                cj[0].label && cj[0].value) {  
                curArtCatSelectOpts = cj;
            }
            else {
                const curArtCats = // { id, name }
                    this.categoryJoinsToCategories(cj);
                curArtCatSelectOpts = curArtCats.map(c => 
                    ({ label: c.name, value: c.id })
                );
            }

            categories = <CategorySelect
                creatable={true}
                categoryVals={curArtCatSelectOpts}
                setCategoryVals={this.handleArtValChange("categoryJoin")}
                blurPlaceholder={"Choose your artefact's categories"}
                focusPlaceholder={"Type to search for a category or create your own"}
            />

            const Description = (props) => {
                return <h5>{propValOrDefaultStr(props, "No description")}</h5>;
            }
            EditableDesc = editableTextArea(Description);
            description = <EditableDesc
                value={this.state.artefact.description}
                onValueSubmit={this.handleArtValChange("description")}
            />
    
            const Title = (props) => {
                return (
                    <div className='text-muted'>
                        {propValOrDefaultStr(props, "No description")}
                    </div>
                )
            }
            EditableTitle = editableTextArea(Title);
            title = <EditableTitle
                value={this.state.artefact.title}
                onValueSubmit={this.handleArtValChange("title")}
            />;
        }

        

        return (
            <div className="af-artcard">
                <ImageCarousel
                    id={carouselId}
                    items={a.images}
                    getId={x => x.id}
                    activeId={
                            a.images
                        &&  a.images[0]
                        &&  a.images[0].id
                    }
                />
                <div className="af-artcard-body">
                    {title}
                    <Link
                        to={a.owner && a.owner.username ? `/user/${a.owner.username}` : ``}
                    > {a.owner && a.owner.username ? a.owner.username : ''} </Link>

                    {categories}
                    {description}
         
                    <button onClick={this.handleSubmit}> Submit</button>
                </div>
            </div>
        );
    }

    handleSubmit = () => {
        this.props.updateArtefact(this.state.artefact);
    }

    handleArtValChange = (attrib) => (val) => {
        console.log(val);
        this.setState({
            ...this.state,
            artefact: {
                ...this.state.artefact,
                [attrib]: val,
            },
        });
    }

    updateArtefact = () => {
        this.props.updateArtefact(this.state.artefact);
    }

    categoryJoinsToCategories(categoryJoins) {
        return categoryJoins.map((cj) => {
            if (cj.categoryId && cj.category) {
                return {
                    id: cj.categoryId,
                    name: cj.category.name,
                };
            }
            else {
                return null;
            }
        }).filter(cat => cat !== null);
    }
}
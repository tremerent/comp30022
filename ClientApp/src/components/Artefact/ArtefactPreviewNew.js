import React, { Component } from 'react';
import { Link, } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import { faEye } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
    }

    render() {
        const a = this.state.artefact;

        const id = `af-artcard-desc-${a.id}`;
        const carouselId = `af-artdoc-carousel-${this.props.artefact.id}`;

        // components
        let title = null;
        let categories = null;
        let description = null;
        let vis = null;

        let EditableDesc = null;
        let EditableTitle = null;

        const propValOrDefaultStr = (props, defaultStr) => {
            return (props.value != null && props.value.length
                        ? props.value
                        : defaultStr);
        }

        if (!this.props.editable) {
            title = <h3 className="af-ai-title">{a.title}</h3>;
            
            categories = 
                    <div className="af-ai-categories">
                    {this.categoryJoinsToCategories(a.categoryJoin).map(c =>
                        <Link
                                to={`/browse?category=${c.name}`}
                                key={c.id}
                                className="badge badge-decal-text mx-1 af-ai-badge"
                        >
                            {c.name}
                        </Link>
                    )}
                </div>

            description = 
                <p className='text-muted af-ai-desc'>
                    {a.description}
                </p>;
        }
        else {

            // if category join in api format, need to convert, otherwise
            // it is ready for 'CategorySelect'
            let curArtCatSelectOpts = [];
            const cj = a.categoryJoin;
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
                return (
                    <p className='text-muted af-ai-desc'>
                    {a.description}
                </p>
                );
                
                // <h5>
                //     {propValOrDefaultStr(props, "No description")}
                //     </h5>;
            }
            EditableDesc = editableTextArea(Description);
            description = <EditableDesc
                value={a.description}
                onValueSubmit={this.handleArtValChange("description")}
            />
    
            const Title = (props) => {
                return (
                    <h3 className="af-ai-title">{a.title}</h3>
                )
            }
            EditableTitle = editableTextArea(Title);
            title = <EditableTitle
                value={a.title}
                onValueSubmit={this.handleArtValChange("title")}
            />;

            vis = (
                <div className='af-ai-vis'>
                    <FontAwesomeIcon icon={faEye}/>{' '}
                    {
                        (a.visibility === 'public') ? (
                            'This artefact is visible to everyone.'
                        ) : (a.visibility === 'private') ? (
                            'This artefact is only visible to you.'
                        ) : (
                            '???'
                        )
                    }
                </div>
            );
        }        

        return (
            <div className="af-ai">
                <div className='af-ai-carousel'>
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
                </div>
                <div className="af-ai-info">
                    {title}
                    <Link
                            className='af-ai-owner'
                            to={
                                a.owner && a.owner.username ?
                                    `/user/${a.owner.username}` : ``
                            }
                    >
                        {a.owner && a.owner.username ? a.owner.username : ''}
                    </Link>

                    {categories}
                    {description}
                    {vis}
                </div>
            </div>
        );
    }

    handleSubmit = () => {
        this.props.updateArtefact(this.state.artefact);
    }

    handleArtValChange = (attrib) => (val) => {
        this.setState({
            ...this.state,
            artefact: {
                ...this.state.artefact,
                [attrib]: val,
            },
        }, () => {
            this.handleSubmit();
        });
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
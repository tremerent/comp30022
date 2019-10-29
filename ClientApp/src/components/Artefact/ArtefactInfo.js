import React from 'react';
import { faEye, faEyeSlash, } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';

import CategorySelect from '../Category/CategorySelect.js';
import ImageCarousel from  '../Shared/ImageCarousel.js';
import EditTextArea from '../Shared/EditTextArea.js';

import './ArtefactInfo.css';

export default class ArtefactInfo extends React.Component {

    constructor(props) {
        super(props);

        this.state = { 
            artefact: this.props.artefact,
            confirmingDelete: false,
        };
    }

    delete = () => {
        this.props.deleteArtefact(this.state.artefact);
    }

    update = () => {
        this.props.updateArtefact(this.state.artefact);
    }

    onEdit = attrib => value => {
        this.setState(
            {
                ...this.state,
                artefact: {
                    ...this.state.artefact,
                    [attrib]: value,
                }
            },
            this.update
        );
    }

    render() {
        const a = this.state.artefact;
        const id = `af-artcard-desc-${a.id}`;
        const carouselId = `af-artdoc-carousel-${this.props.artefact.id}`;

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

        return (
            <div className='af-ai'>
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
                <div className='af-ai-info'>
                    <EditTextArea
                        className="af-ai-title"
                        editable={this.props.auth.isOwner}
                        onSubmit={this.onEdit('title')}
                    >
                        {a.title}
                    </EditTextArea>
                    <Link
                            className='af-ai-owner'
                            to={
                                a.owner && a.owner.username ?
                                    `/user/${a.owner.username}` : ``
                            }
                    >
                        {a.owner && a.owner.username ? a.owner.username : ''}
                    </Link>

                    <div className="af-ai-categories">
                    {
                        this.props.auth.isOwner ? (
                            <CategorySelect
                                creatable={true}
                                categoryVals={curArtCatSelectOpts}
                                setCategoryVals={this.onEdit("categoryJoin")}
                                blurPlaceholder={"Choose your artefact's categories"}
                                focusPlaceholder={"Type to search for a category or create your own"}
                            />
                        ) : (
                            this.categoryJoinsToCategories(a.categoryJoin).map(c =>
                                <Link
                                        to={`/browse?category=${c.name}`}
                                        key={c.id}
                                        className="badge badge-decal-text mx-1 af-ai-badge"
                                >
                                    {c.name}
                                </Link>
                            )
                        )
                    }
                    </div>
                    <EditTextArea
                        className='text-muted af-ai-desc'
                        editable={this.props.auth.isOwner}
                        onSubmit={this.onEdit('description')}
                    >
                        {
                            a.description || (this.props.auth.isOwner ?
                                    'Enter a description...'
                                :
                                    `${a.owner.username} has not yet given `
                                    +   'this arefact a description.'
                            )
                        }
                    </EditTextArea>
                    {
                        this.props.auth.isOwner && (
                            <div className='af-ai-row'>
                                <div className='af-ai-vis'>
                                    <span>
                                        {
                                            (a.visibility === 'public') ? (
                                                <FontAwesomeIcon icon={faEye}/>
                                            ) : (a.visibility === 'private') ? (
                                                <FontAwesomeIcon icon={faEyeSlash}/>
                                            ) : (
                                                '???'
                                            )
                                        }
                                        {' '}
                                        {
                                            (a.visibility === 'public') ? (
                                                'This artefact is visible to everyone.'
                                            ) : (a.visibility === 'private') ? (
                                                'This artefact is only visible to you.'
                                            ) : (
                                                '???'
                                            )
                                        }
                                    </span>
                                </div>
                                {
                                    this.state.confirmingDelete
                                    ?
                                    <div>
                                        <button 
                                            onClick={this.toggleConfirmingDelete}
                                            className="btn btn-outline-secondary af-cancel-btn"
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            onClick={this.delete}
                                            className="btn btn-outline-danger"
                                        >
                                            Confirm Delete
                                        </button>
                                    </div>
                                    :
                                    <button 
                                        onClick={this.toggleConfirmingDelete}
                                        className="btn btn-outline-danger"
                                    >
                                        Delete
                                    </button>
                                }
                            </div>
                        )
                    }
                </div>
            </div>
        );
    }

    toggleConfirmingDelete = () => {
        this.setState({
            ...this.state,
            confirmingDelete: !this.state.confirmingDelete,
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


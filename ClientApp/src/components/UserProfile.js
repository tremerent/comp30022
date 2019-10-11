import React from 'react';

import ArtefactScroller from './Artefact/ArtefactScroller.js';

import { changeCurUserInfo } from '../scripts/requests.js';

import './UserProfile.css';

class SubmitTextArea extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            value: this.props.children || '',
            name: this.props.name || 'textarea',
        };

        this.onChange = this.onChange.bind(this);
    }

    onChange(e) {
        this.setState({
            value: e.target.value,
        });
    }

    getValue() {
        return this.state.value;
    }

    submit = () => {
        this.props.onSubmit(this.state.value);
    }

    render() {
        return (
            <>
                {this.props.label && this.props.id &&
                    <label htmlFor={this.props.id}>
                        {this.props.label}
                    </label>}
                {this.props.id ?
                    <textarea
                        name={this.props.name}
                            value={this.state.value}
                            onChange={this.onChange}
                            className="form-control"
                            id={this.props.id}
                        />
                    :
                    <textarea
                            name={this.props.name}
                            value={this.state.value}
                            onChange={this.onChange}
                            className="form-control"
                        />}
                <button class='btn btn-primary' onClick={this.submit}>{
                    this.props.buttonText ?
                        this.props.buttonText
                    :
                        'Submit'
                }</button>
            </>
        );
    }
}


export default class UserProfile extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            bio: props.user.bio
        };

        if (this.state.bio == null || this.state.bio.length === 0)
            this.state.bio =
                `Oh no! ${props.user.username} is yet to provide a bio.`;
    }

    changeBio = (newBio) => {
        console.log(`Set bio to "${newBio}"`);
        this.setState({
            ...this.state,
            bio: newBio
        });
        changeCurUserInfo(this.props.user, { bio: newBio });
    }

    render() {
        return (
            <div className='af-profile-outer'>
                <div className='af-profile-inner-placeholder'></div>
                <div className='af-profile-inner'>
                    <div className='af-profile-card-wrapper'>
                        <div className='af-profile-card'>
                            <div className='af-profile-card-inner'>
                                <img
                                    src={ this.props.user.image_url ?
                                            this.props.user.image_url
                                        :
                                            '/img/profile-placeholder.png'
                                    }
                                    className='af-profile-image'
                                    alt={`${this.props.user.username}'s profile image`}
                                />
                                <div className='af-profile-info'>
                                    <h2 className='af-profile-name'>{this.props.user.username}</h2>
                                    <div className='af-profile-badges'>
                                        <span className="badge badge-decal-text mx-1 af-profile-art-badge">
                                            {(this.props.numArtefactsReg
                                                ? this.props.numArtefactsReg
                                                : 0) + ' Artefacts'}
                                        </span>
                                    </div>
                                    <hr/>
                                                <div className='text-muted text-center'>{this.state.bio}</div>
                                                <SubmitTextArea
                                                    id='af-edit-bio'
                                                    name='edit-bio'
                                                    onSubmit={this.changeBio}
                                                >
                                                    Describe yourself
                                                </SubmitTextArea>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='af-profile-scroller'>
                    <hr/>
                    <h3>{this.props.user.username + "'s Artefacts"}</h3>
                    <hr/>
                    <ArtefactScroller
                        artefacts={this.props.userArtefacts}
                        placeholder={"Oh no! This user hasn't registered any artefacts yet."}
                    />
                </div>
            </div>
        );
    }
}


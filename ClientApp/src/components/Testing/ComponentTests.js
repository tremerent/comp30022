import React, { Component } from 'react';
import ProfileImageUploadTest from './components/ProfileImageUploadTest';
import ArtefactImageUploadTest from './components/ArtefactImageUploadTest';


export default class ComponentTests extends Component {
    constructor(props) {
        super(props);

        this.state = {
        }
    }

    componentDidMount() {

    }

    render() {
        return (
            <div>
                Component tests
                <ProfileImageUploadTest />
                <ArtefactImageUploadTest />
                
            </div>
        );
    }
}

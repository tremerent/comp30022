import React, { Component } from 'react';
import ProfileImageUploadTest from './components/ProfileImageUploadTest';
import ArtefactImageUploadTest from './components/ArtefactImageUploadTest';
import CommentsTest from './components/CommentsTest';


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
            <> 
                <div>
                </div>      
                <CommentsTest />
            </>
        );
    }
}

import React, { Component } from 'react';
import ProfileImageUploadTest from './components/ProfileImageUploadTest';

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
            </div>
        );
    }
}

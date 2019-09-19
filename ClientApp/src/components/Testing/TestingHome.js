import React, { Component } from 'react';

import Scratch from './Scratch.js';
import ComponentTests from './ComponentTests.js';

export default class TestingHome extends Component {
    static displayName = TestingHome.name;

    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }

    render() {
        return (
            <div className="row">
                <div className="col-xs-6">
                    <Scratch />
                </div>
                <div className="col-xs-6">
                    <ComponentTests />
                </div>
            </div>
        );
    }
}

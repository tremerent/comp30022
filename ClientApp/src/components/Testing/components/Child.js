import React, { Component } from 'react';

export default class Child extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }

    render() {
        return (
            <div>
                prop.greatProp: {this.props.greatProp}
            </div>
        );
    }
}

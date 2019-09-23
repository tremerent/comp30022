import React, { Component } from 'react';

export default class Child extends Component {
    render() {
        return (
            <div>
                prop.greatProp: {this.props.greatProp}
            </div>
        );
    }
}

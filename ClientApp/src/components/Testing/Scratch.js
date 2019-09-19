import React, { Component } from 'react';

import Child from './components/Child.js'

export default class TestingHome extends Component {
    constructor(props) {
        super(props);

        this.state = {
            count: 0,
        }
    }

    componentDidMount() {

    }

    render() {
        return (
            <div>
                <button onClick={this.incrementCount} className="btn"> Click me </button>
                <Child greatProp={this.state.count}/>
            </div>
        );
     }
                        
    incrementCount = () => {
        this.setState({
            ...this.state,
            count: this.state.count + 1
        });
    }
}

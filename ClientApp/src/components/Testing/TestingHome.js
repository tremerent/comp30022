import React from 'react';
import ComponentTests from './ComponentTests.js';

export default class TestingHome extends React.Component {
    static displayName = TestingHome.name;

    render() {
        return (
            // <div className="row">
            //     <div className="col-xs-6">
            //         <Scratch />
            //     </div>
            //     <div className="col-xs-6">
            //         <ComponentTests />
            //     </div>
            // </div>
            <ComponentTests />

        );
    }
}

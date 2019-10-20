
import React from 'react';
import FilteredBrowser from 'components/Shared/FilteredBrowser';

import './ArtefactBrowser.css';

export default class ArtefactBrowser extends React.Component {
    render() {
        return (
            <div className='af-artbrowser'>
                <FilteredBrowser />
            </div>
        );
    }
}

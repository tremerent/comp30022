import React from 'react';

import ArtefactDocs from '../Artefact/ArtefactDocs.js';

import SOME_IMAGE from '../../images/filler/artefact-01.jpg';
import SOME_OTHER_IMAGE from '../../images/filler/artefact-02.jpg';

export default function ArtefactDocsTest(props) {
    return (
        <div style={{ margin: 'auto', width: '400px', border: '1px solid grey', height: '100%' }}>
            <ArtefactDocs images={[
                {
                    id: 'ac739743-c04c-4c81-9275-b6f029591e0e',
                    filename: 'some_image.png',
                    url: SOME_IMAGE,
                },
                {
                    id: 'cdd86cfd-c4be-40b2-a6ce-0e81d3963567',
                    filename: 'some_other_image.png',
                    url: SOME_OTHER_IMAGE,
                }
            ]}/>
        </div>
    );
}


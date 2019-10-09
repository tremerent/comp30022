import React from 'react';

import ArtefactDocs from '../Artefact/ArtefactDocs.js';

import SOME_IMAGE from '../../images/filler/artefact-01.jpg';
import SOME_OTHER_IMAGE from '../../images/filler/artefact-02.jpg';

export default function ArtefactDocsTest(props) {
    return (
        <div style={{ margin: 'auto', width: '500px', height: '100%' }}>
            <ArtefactDocs artefact={{
                docs: [
                    {
                        id: 'ac739743-c04c-4c81-9275-b6f029591e0e',
                        title: "some_image.png",
                        url: SOME_IMAGE,
                        type: 'image',
                    },
                    {
                        id: 'cdd86cfd-c4be-40b2-a6ce-0e81d3963567',
                        title: "some_other_image.png",
                        url: SOME_OTHER_IMAGE,
                        type: 'image',
                    },
                    {
                        id: 'a2bc1fca-1baf-445a-85ff-c5650a6c4c4b',
                        title: "Nice Thing.pdf",
                        url: 'orechu://random-thingy',
                        type: 'file',
                    },
                ],
            }}/>
        </div>
    );
}


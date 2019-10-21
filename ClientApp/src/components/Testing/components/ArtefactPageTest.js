import React from 'react';

import ArtefactPage from '../../Artefact/ArtefactPage.js';

export default class ArtefactPageTest extends React.Component {

    render() {
        return (
            <div>
                <ArtefactPage artefact={{
                    id: '70165a32-9550-4b87-83e3-180d4d0d16bd',
                    title: 'Jesus Christ',
                    owner: {
                        username: 'tremerent',
                    },
                    description: `
Jesus Christ of Nazarus. It turns out that actually the second coming of Christ
happened in 1839, and since then Jesus has been living out of the wine cellar of
our ancestral home. Actually it's just a regular basement but there's a leaky
pipe in the ceiling so we just keep a keg under it and let him do his thing. For
the most part he's a model tenant but occasionally he'll comment on our interior
decoration or music taste in a really judgey way.
Lorem ipsum dolor sit amet something lalalala etroteu the quick brown fox jumps
over the lazy dog 1234 I'm just writing this stuff to make the description
really long to test scrolling and overflow and stuff etc etc lalala yes okay
this is probably long enough.
`,
                    categoryJoin: [
                        {
                            categoryId: '7e9b4487-a422-4927-862d-f9eacea5eecd',
                            category: {
                                id: '7e9b4487-a422-4927-862d-f9eacea5eecd',
                                name: 'drug paraphernalia',
                            },
                        },
                        {
                            categoryId: 'e97a5aa3-f125-4843-a6d5-860c34d0909c',
                            category: {
                                id: 'e97a5aa3-f125-4843-a6d5-860c34d0909c',
                                name: 'switchy',
                            },
                        },
                    ],
                    images: [
                        "http://localhost:5000/static/media/artefact-01.5edb12dd.jpg",
                        "http://localhost:5000/static/media/artefact-02.473455d6.jpg",
                    ],
                }} user={{ }} />
            </div>
        );
    }

}



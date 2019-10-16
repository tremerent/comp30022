import React from 'react';

import Discussion from '../../Discussion/Discussion.js';

export default function DiscussionTest(props) {
    return (
        <div>
            <Discussion items={[
                {
                    "id": "3ce482ab-a05a-4f18-9e02-0349033a52d2",
                    "author": "Alice",
                    "body": "Is this artefact blue?",
                    "ts": "1569412282",
                    "type": "question",
                    "replies": [
                        {
                            "id": "0029a4f1-3539-46d1-a199-af6056a59306",
                            "author": "Bob",
                            "body": "yes it looks blue to me",
                            "ts": "1569412421",
                            "type": "comment",
                            "replies": [
                                {
                                    "id": "a3f80ed5-97c1-4a13-95b3-ebd2d163a252",
                                    "author": "maddi492",
                                    "body": "I would second that.",
                                    "ts": "1569412488",
                                    "type": "comment",
                                    "replies": []
                                },
                                {
                                    "id": "be4647ad-d21c-4ad1-b2f8-f1bbd9d242cc",
                                    "author": "Eve",
                                    "body": "idiot.",
                                    "ts": "1569412520",
                                    "type": "comment",
                                    "replies": []
                                }
                            ]
                        },
                        {
                            "id": "d98046b7-e42b-4ad1-ac11-7dd56095b026",
                            "author": "Eve",
                            "body": "no what are you blind moron it is aquamarine",
                            "ts": "1569412576",
                            "type": "comment",
                            "replies": []
                        }
                    ]
                },
            ]}/>
        </div>
    );
}



import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { discuss as discussActions, artefacts as artActions } from '../../redux/actions';

import Overview from '../Shared/Overview.js';
import ArtefactPreview from './ArtefactPreview.js';
import CentreLoading from 'components/Shared/CentreLoading';
import '../User/UserProfile.css';
import './ArtefactPage.css';

import Discussion from '../Discussion/Discussion.js';

const DISCUSSION = [
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
    {
        "id": "aca634e4-04ea-465a-a228-48e25829f85d",
        "author": "Alice",
        "body": "how many does it?",
        "ts": "1571365238",
        "type": "question",
        "replies": [
            {
                "id": "91303b03-c116-4e3d-8bc5-490a330011bb",
                "author": "xX_ItsBampleBitches_Xx",
                "body": "93",
                "ts": "1571365290",
                "type": "comment",
                "isAnswer": true,
                "replies": [
                    {
                        "id": "051f5075-d0a0-4a4b-b509-b81b27c2a9fe",
                        "author": "Alice",
                        "body": "Thank you!",
                        "type": "comment",
                        "replies": [
                            {
                                "id": "e0071ec2-9022-44ca-a7a6-4529a052a3dc",
                                "author": "xX_ItsBampleBitches_Xx",
                                "body": "You are most welcome my good friend and fellow artefact connoiseur.",
                                "type": "comment",
                                "replies": []
                            }
                        ]
                    }
                ]
            },
            {
                "id": "e027cdd3-4710-45a0-a70a-cc883c86e144",
                "author": "bobiger",
                "body": "maybe 8?",
                "type": "comment",
                "replies": [
                    {
                        "id": "12d1a243-562c-4f59-bd17-c28567fc3a05",
                        "author": "Alice",
                        "body": "Sorry but xX_ItsBampleBitches_Xx already gave the correct answer.",
                        "type": "comment",
                        "replies": [],
                    }
                ]
            }
        ]
    },
    {
        "id": "1a1c1dda-24a9-409d-b9c0-f337f4fe37ba",
        "author": "bobiger",
        "body": "Wow, this is really beautiful. It reminds me of the waning shrub.",
        "type": "comment",
        "replies": [
            {
                "id": "e4601b16-e7d7-4afa-80ea-e95609de0566",
                "author": "maddi492",
                "body": "Uh what does that mean, exactly?",
                "type": "comment",
                "replies": [
                    {
                        "id": "d1946280-eaf6-4129-8e29-2716240dc455",
                        "author": "bobiger",
                        "body": "s\u0305\u0363\u0317\u031ce\u0343\u0343\u0306\u035a\u0335e\u0363\u034c\u0305\u0344\u0343\u030b\u0351\u035a\u031d\u0355\u0339\u0362e\u0368\u0313\u0346\u0357\u036d\u031c\u032a\u0322a\u0302\u033e\u036b\u034b\u0312\u030b\u0367\u0353\u0318\u033a\u0326\u0339\u032ba\u0313\u0316\u0339\u0315a\u0367\u0310\u0348\u0325\u0330\u0331\u0358a\u030d\u0369\u0313\u032d\u0340a\u030b\u0300\u034b\u0365\u030c\u0312\u0354\u0329\u034dr\u033f\u0314\u0363\u0353\u0333\u032a\u032a\u032c\u033ar\u033f\u0300\u0305\u0364\u0369\u0300\u0330\u033b\u0320\u0362r\u034b\u0367\u030f\u030f\u0316\u0353\u0332\u0329\u032f\u0336\u030d\u030b\u0354\u0359\u0319\u0331\u0332\u035a\u0354\u0340",
                        "type": "comment",
                        "replies": []
                    }
                ]
            }
        ]
    },
    {
        "id": "ef41835e-761b-443f-924b-40a769f9d33e",
        "author": "vaseLyfe",
        "body": "Notice the crenellated smitchle on the reverse hybrid lay-wall. This suggests the item was created around the 5th century CE, probably somewhere in Europe.",
        "type": "comment",
        "replies": [
            {
                "id": "675ed8b3-cde4-4e2d-a2fb-39fc3a81518f",
                "author": "xX_ItsBampleBitches_Xx",
                "body": "You know I've been seeing your comments around this site and I'm beginning to suspect you don't actually know anything about pottery...",
                "type": "comment",
                "replies": [
                    {
                        "id": "4fe1ddf6-806b-49e8-b469-b48cdbe77b02",
                        "author": "vaseLyfe",
                        "body": "fascist",
                        "type": "comment",
                        "replies": []
                    }
                ]
            }
        ]
    }
];

function getArtefactIdFromRoute(route) {
    const matches = route.match(`/artefact/([^/]+)`);

    if (matches !== null)
        return matches[1];
    console.warn("Failed to get artefact ID from route.");
    return null;
}


class ArtefactPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
        };
    }

    componentDidMount() {
        this.props.getArtefact(this.props.artefactId);
        this.props.getDiscussion(this.props.artefactId);
    }

    render() {
        if (this.props.loading)
            return <CentreLoading/>;
        return (
            <Overview sizeStatic='50%' sizeScroll='46%'>
                <ArtefactPreview artefact={this.props.artefact}/>
                {
                    this.props.discussion.loading ? (
                        <CentreLoading/>
                    ) : (
                        <Discussion items={this.props.discussion.tree}/>
                    )
                }
            </Overview>
        );
    }

}

function mapStateToProps(state) {
    const artefactId = getArtefactIdFromRoute(state.router.location.pathname);
    return {
        artefactId,
        artefact: state.art.artIdCache[artefactId],
        loading: state.art.artIdCache[artefactId] === undefined,
        discussion: {
            tree: state.discuss[artefactId],
            loading: !state.discuss[artefactId],
        },
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getArtefact: artActions.getArtefact,
        getDiscussion: discussActions.getDiscussion,
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ArtefactPage);


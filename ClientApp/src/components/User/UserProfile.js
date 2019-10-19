import React from 'react';
import FloatingWindow from '../Shared/FloatingWindow.js';
import CreateArtefacts from '../Artefact/CreateMyArtefact.js';

import ArtefactScroller from '../Artefact/ArtefactScroller.js';
import { editableTextArea } from 'components/Shared/editableTextArea';
import ProfilePicture from './ProfilePicture';

import NavMenu from '../Nav/NavMenu.js';

import './UserProfile.css';
import './UserProfileEditing.css';
import '../Nav/NavMenu.css';

import Overview from '../Shared/Overview.js';

const FILL = `
Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium
doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore
veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam
voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia
consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque
porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci
velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore
magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum
exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi
consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit
esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo
voluptas nulla pariatur?
At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis
praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias
excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui
officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem
rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis
est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere
possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus
autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet
ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum
rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores
alias consequatur aut perferendis doloribus asperiores repellat.
THE END
`;

export default class UserProfile extends React.Component {

    changeBio = (newBio) => {
        this.props.updateUserDetails({
            bio: newBio
        });
    }

    render() {

        const BioText = (props) => {
            const bioPlaceholderStr =
                `Oh no! ${this.props.user.username} is yet to provide a bio.`;
            return <div className='text-muted'>
                    {
                        props.value != null && props.value.length
                        ? props.value
                        : bioPlaceholderStr
                    }
                </div>;
        }

        let EditableBio;
        if (this.props.editable) {
            EditableBio = editableTextArea(BioText);
        }

        return (
            <Overview>
                <div className='af-profile-card-inner'>
                    <ProfilePicture
                        imageUrl={this.props.user.imageUrl}
                        updateProfilePic={this.props.
                            updateUserProfilePic
                        }
                        editable={this.props.editable}
                    />
                    <div className='af-profile-info'>
                        <h2 className='af-profile-name'>{this.props.user.username}</h2>
                        <div className='af-profile-badges'>
                            <span className="badge badge-decal-text mx-1 af-profile-art-badge">
                                {(this.props.numArtefactsReg
                                    ? this.props.numArtefactsReg
                                    : 0) + ' Artefacts'}
                            </span>
                        </div>
                        <hr/>
                        {
                            this.props.editable
                            ?
                            <EditableBio
                                value={this.props.user.bio}
                                onValueSubmit={this.changeBio}
                            />
                            :
                            <BioText />
                        }
                    </div>
                </div>
                <div>{FILL}</div>
            </Overview>
        );
    }
}


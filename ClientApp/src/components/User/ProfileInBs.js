import React from 'react'
import Divider from '@material-ui/core/Divider'
import ChatIcon from '@material-ui/icons/Chat'
import ArtTrackIcon from '@material-ui/icons/ArtTrack'
import DeviceHubIcon from '@material-ui/icons/DeviceHub'

// Presuming that bootstrap css and js have been imported from the parent page

/* This page is intended to display user's profile.
*/

// Function that renders the copyright section of the footer.
function Copyright() {
    return (
        <h6 align="center">
            Artefactor. Copyright © {new Date().getFullYear()}
        </h6>
    );
}

// The styles attributes are grouped into this variable.
const style ={
    // style for the side section of the page
    paper:{padding:20, marginTop:10, marginBottom:10, marginLeft:10, 
        marginRight:10},
    
    gridBelowDivider: {marginBottom:30, marginTop:20},
    familyTreeButton: {margin:10},
    familyTreeButtonIcon: {marginLeft:10},

    // style for the number of artefacts and comment icons
    icon:{marginRight:10},
    
    bio:{marginTop:20},

    // The styles for the avatar (profile picture)
    profilePicture: {
        margin: 10,
        width: 300,
        height: 300,
    },

    // Style for the footer
    footer: {
        'background-color': '#bbb',
    },
}

// The main section of the Edit Profile page
export default Profile =>
    <React.Fragment>
        <div class="container">
            <div class="row">
            <div class="col-sm"> 
                {/* left section of the page */}
                <div class="card" style={style.paper}>
                    <div align="center">
                        <div>
                            <img src="https://source.unsplash.com/random" 
                                class="rounded-circle" 
                                style={style.profilePicture} />
                        </div>
                    </div>
                    <div class="row">
                        <div class="col">
                            <h3 class="text-center">Profile Name</h3>
                        </div>
                    </div>
                    
                    <Divider variant="middle" />

                    <div class="row" align="center" justify="center" 
                        style={style.gridBelowDivider}>
                        <div class="col-sm">
                            {/* displays the number of artefacts */}
                            <ArtTrackIcon style={style.icon} />
                            <span>0 artefacts</span>
                        </div>
                        <div class="col-sm">
                            {/* displays the number of comments */}
                            <ChatIcon style={style.icon} />
                            <span>0 comments</span>
                        </div>
                    </div>
                    {/* button that pops out the family tree image related to 
                        the user */}
                    <div class="row" align="center">
                        <div class="col" style={style.familyTreeButton} >
                            <button type="button" class="btn btn-secondary" 
                                data-toggle="modal" data-target="#viewFamily">
                                View family tree
                                <DeviceHubIcon 
                                    style={style.familyTreeButtonIcon}/>
                            </button>
                        </div>
                    </div>
                    {/* modal for family tree */}
                    <div class="modal fade " tabindex="-1" role="dialog" 
                        aria-labelledby="myLargeModalLabel" aria-hidden="true" 
                        id="viewFamily">
                        <div class="modal-dialog modal-lg">
                        <div class="modal-content">
                            <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLongTitle">
                                Family Tree</h5>
                            <button type="button" class="close" 
                                data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                            </div>
                            <div class="modal-body">
<img src="https://images.all-free-download.com/images/graphiclarge/family_tree_infographic_illustration_face_icons_6825019.jpg" 
                            id="imagepreview" style={style.imageViewer} />
                            </div>
                        </div>
                        </div>
                    </div>
                    
                    <Divider variant="middle" />

                    {/* biography of the user */}
                    <div class="row" style={style.bio}>
                        <div class="col">
                            <p>Description of profile</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-sm">
                {/* right section of the page */}
                <div class="card" style={style.paper} >
                    <h5>Profile name's Artefact</h5>
                    Search, Artefact scroller
                </div>
            </div>
            </div>
        </div>

        {/* Footer */}
        <footer className="py-3" style={style.footer}>
            <Copyright />
        </footer>
        {/* End footer */}
    </React.Fragment>

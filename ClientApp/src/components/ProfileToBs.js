import React from 'react'
import Typography from '@material-ui/core/Typography';

import Divider from '@material-ui/core/Divider'

import ChatIcon from '@material-ui/icons/Chat'
import ArtTrackIcon from '@material-ui/icons/ArtTrack'
import DeviceHubIcon from '@material-ui/icons/DeviceHub'

// Presuming that bootstrap css and js have been imported from the parent page

/* This page is intended to display user's profile.
*/

// The styles attributes are grouped into this variable.
const style ={
    Paper:{padding:20,marginTop:10,marginBottom:10,marginLeft:10,marginRight:10},
    
    Card:{width:'500px',marginTop:30,marginBottom:30},
    AppBar: {background:'blue'},
    gridBelowDivider: {marginBottom:30,marginTop:20},
    familyTreeButton: {margin:10},
    familyTreeButtonIcon: {marginLeft:10},
    icon:{marginRight:10},
    bio:{marginTop:20},
    editImage: {
        position: 'absolute',
        transform:'translate(100%,-800%)',
        display: 'block',
    },
    editName:{marginBottom:'30px'},
    
}
// The styles for the avatar (profile picture)
const style2 = {
    bigAvatar: {
        margin: 10,
        width: 300,
        height: 300,
    },
}


// The main section of the Profile page
export default Profile =>
    <React.Fragment>
        {/* <Header /> */}
        <div class="container">
            <div class="row">
            <div class="col-sm">
                {/* left section of the page */}
                <div class="card" style={style.Paper}>
                    <div align="center">
                        <div>
                            <img src="https://source.unsplash.com/random" class="rounded-circle" style={style2.bigAvatar} />
                        </div>
                    </div>
                    <div class="row">
                        <div class="col"><h3 class="text-center">Profile Name</h3></div>
                    </div>
                    
                    <Divider variant="middle" />

                    <div class="row" align="center" justify="center" style={style.gridBelowDivider}>
                        <div class="col-sm">
                            {/* displays the number of artefacts */}
                            <ArtTrackIcon style={style.icon} />
                            <Typography variant="p" color="inherit">
                                ... Artefacts
                            </Typography>
                        </div>
                        <div class="col-sm">
                            {/* displays the number of comments */}
                            <ChatIcon style={style.icon} />
                            <Typography variant="p" color="inherit">
                                ... Comments
                            </Typography>
                        </div>
                    </div>
                    {/* button that pops out the family tree image related to the user */}
                    <div class="row" align="center">
                        <div class="col" style={style.familyTreeButton} >
                            <button type="button" class="btn btn-secondary" data-toggle="modal" data-target="#viewFamily">
                                View family tree
                                <DeviceHubIcon style={style.familyTreeButtonIcon}/>
                            </button>
                        </div>
                    </div>
                    {/* modal to view family tree */}
                    <div class="modal fade " tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true" id="viewFamily"
                    >
                        <div class="modal-dialog modal-lg"
                        >
                        <div class="modal-content">
                            <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLongTitle">Family Tree</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                            </div>
                            <div class="modal-body">
                            <img src="https://images.all-free-download.com/images/graphiclarge/family_tree_infographic_illustration_face_icons_6825019.jpg" id="imagepreview" style={style.imageViewer} />
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
                <div class="card" style={style.Paper} >
                    <Typography variant="h5" color="inherit">
                        Profile name's Artefact
                    </Typography>
                    Search, Artefact scroller
                </div>
            </div>
            </div>
        </div>
    </React.Fragment>
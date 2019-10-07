import React from 'react'
import { Grid,Paper,Button } from '@material-ui/core'
import Typography from '@material-ui/core/Typography';

import Divider from '@material-ui/core/Divider'

import ChatIcon from '@material-ui/icons/Chat'
import ArtTrackIcon from '@material-ui/icons/ArtTrack'
import DeviceHubIcon from '@material-ui/icons/DeviceHub'

import './ProfileToBs-Edit.css'

//Presuming that Bootstrap css and js have been imported from the parent page

/* This page is intended to display user's profile.
*/

// The styles attributes are grouped into this variable.
const style ={
    Paper:{padding:20,marginTop:10,marginBottom:10,marginLeft:10,marginRight:10},
    CardMedia:{paddingTop:'56.25%',height:0,width:'inherit',margin:10}, //
    Card:{width:'500px',marginTop:30,marginBottom:30},
    AppBar: {background:'blue'},
    gridBelowDivider: {margin:50},
    familyTreeButton: {margin:10},
    familyTreeButtonIcon: {marginLeft:10},
    editImage: {
        position: 'absolute',
        width:'100%',
        height:'100%',
        transform:'translate(-8%,-21%)',
        display: 'block',
    },
}
// The styles for the avatar (profile picture)
const style2 = {
    avatar:{
        margin: 10,
    },
    bigAvatar: {
        margin: 10,
        width: 300,
        height: 300,
    },
}


// The main section of the Profile page
export default Profile =>
    <React.Fragment>
        <div class="container">
            <div class="row">
            <div class="col-sm"> 
                <Paper style={style.Paper}>
                    <div align="center" >
                        <div class="profile-pic">
                            <img src="https://source.unsplash.com/random" class="rounded-circle" style={style2.bigAvatar} />
                            <div><a href='#'><ArtTrackIcon /><div class="edit-image"><span>Change Profile Picture</span></div></a></div>
                        </div>
                    </div>
                    <div align="center">
                        <input class="form-control" type="text" placeholder="Name" />
                    </div>
                    <br />
                    <Divider variant="middle" />

                    <div alignItems="center" justify="center" style={style.gridBelowDivider}>
                        <div>
                            {/* <Avatar alt='profile name' src="https://source.unsplash.com/random" style={style2.avatar} /> */}
                            {/* displays the number of artefacts */}
                            <ArtTrackIcon />
                            <Typography variant="p" color="inherit">
                                ... Artefacts
                            </Typography>
                        </div>
                        <div>
                            {/* <Avatar alt='profile name' src="https://source.unsplash.com/random" style={style2.avatar} /> */}
                            {/* displays the number of comments */}
                            <ChatIcon />
                            <Typography variant="p" color="inherit">
                                ... Comments
                            </Typography>
                        </div>
                    </div>
                    {/* button that pops out the family tree image related to the user */}
                    <div align="center">
                        <Grid item xs>
                            <Button variant="contained" color="default" style={style.familyTreeButton}>
                                Change family tree
                                <DeviceHubIcon style={style.familyTreeButtonIcon}/>
                            </Button>
                        </Grid>
                    </div>
                    <br /><br />
                    {/* biography of the user */}
                    <textarea class="form-control" rows="3" placeholder="Bio"></textarea>
                </Paper>
            </div>
            <div class="col-sm">
                <Paper style={style.Paper}>
                    <Typography variant="h5" color="inherit">
                        Profile name's Artefact
                    </Typography>
                    Search, Artefact scroller
                </Paper>
            </div>
            </div>
        </div>
    </React.Fragment>
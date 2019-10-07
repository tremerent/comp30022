import React from 'react'
import { Grid,Paper,Button } from '@material-ui/core'
import Typography from '@material-ui/core/Typography';

import Divider from '@material-ui/core/Divider'


import ChatIcon from '@material-ui/icons/Chat'
import ArtTrackIcon from '@material-ui/icons/ArtTrack'
import DeviceHubIcon from '@material-ui/icons/DeviceHub'

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
                    <div align="center"> 
                        <div> 
                            <img src="https://source.unsplash.com/random" class="rounded-circle" style={style2.bigAvatar} />
                        </div>
                    </div>
                    <Typography variant="h3" color="inherit" align='center'> {/* gutterBottom */}
                        Profile details
                    </Typography>
                    
                    <Divider variant="middle" />

                    <div alignItems="center" justify="center" style={style.gridBelowDivider}>
                        <div>
                            
                            {/* displays the number of artefacts */}
                            <ArtTrackIcon />
                            <Typography variant="p" color="inherit">
                                ... Artefacts
                            </Typography>
                        </div>
                        <div>
                            
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
                                See in Family Tree
                                <DeviceHubIcon style={style.familyTreeButtonIcon}/>
                            </Button>
                        </Grid>
                    </div>
                    <br /><br />
                    {/* biography of the user */}
                    <Typography variant="p" color="inherit">
                        Description of profile
                    </Typography>
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
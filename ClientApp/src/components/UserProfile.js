import React from 'react'
import { Grid,Paper,Button } from '@material-ui/core'
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import Avatar from '@material-ui/core/Avatar'
import Divider from '@material-ui/core/Divider'

import FolderIcon from '@material-ui/icons/Folder'
import ChatIcon from '@material-ui/icons/Chat'
import ArtTrackIcon from '@material-ui/icons/ArtTrack'
import DeviceHubIcon from '@material-ui/icons/DeviceHub'

import Header from './Header'

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
        <Header />
        <Grid container>
            <Grid item sm>
                <Paper style={style.Paper} >
                    <Grid container alignItems="center" justify="center">
                        <Grid item xs>
                            <Avatar alt='profile name' src="https://source.unsplash.com/random" style={style2.bigAvatar} />
                        </Grid>
                    </Grid>
                    {/* <Grid item> */}
                        <Typography variant="h3" color="inherit">
                            Profile details
                        </Typography>
                    {/* </Grid> */}

                    <Divider variant="middle" />

                    <Grid container alignItems="center" justify="center" style={style.gridBelowDivider}>
                        <Grid item xs>
                            {/* <Avatar alt='profile name' src="https://source.unsplash.com/random" style={style2.avatar} /> */}
                            <ArtTrackIcon />
                            <Typography variant="p" color="inherit">
                                ... Artefacts
                            </Typography>
                        </Grid>
                        <Grid item xs>
                            {/* <Avatar alt='profile name' src="https://source.unsplash.com/random" style={style2.avatar} /> */}
                            <ChatIcon />
                            <Typography variant="p" color="inherit">
                                ... Comments
                            </Typography>
                        </Grid>
                    </Grid>
                    <Button variant="contained" color="default" style={style.familyTreeButton}>
                        See in Family Tree
                        <DeviceHubIcon style={style.familyTreeButtonIcon}/>
                    </Button>
                    <br /><br />
                    <Typography variant="p" color="inherit">
                        Description of profile
                    </Typography>
                </Paper>
            </Grid>
            <Grid item sm>
                <Paper style={style.Paper}>
                    <Typography variant="h5" color="inherit">
                        Profile name's Artefact
                    </Typography>
                    Search, Artefact scroller
                </Paper>
            </Grid>
        </Grid>
    </React.Fragment>
import React from 'react'
import { Grid,Paper } from '@material-ui/core'
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import Header from './Header'

// The styles attributes are grouped into this variable.
const style ={
    Paper:{padding:20,marginTop:10,marginBottom:10,marginLeft:10,marginRight:10},
    CardMedia:{paddingTop:'56.25%',height:0,width:'inherit',margin:10}, //
    Card:{width:'500px',marginTop:30,marginBottom:30},
    AppBar: {background:'blue'},

}
// The main section of the Profile page
export default Profile =>
    <React.Fragment>
        <Header />
        <Grid container>
            <Grid item sm>
                <Paper style={style.Paper} >
                    <Typography variant="h6" color="inherit">
                        Profile information
                    </Typography>
                    <Card style={style.Card}>
                        <CardMedia
                            // className={classes.cardMedia}
                            style={style.CardMedia}
                            image={require("../images/1.jpg")}
                            title="Image title"
                        />
                    </Card>
                    <Typography variant="p" color="inherit">
                        Profile details
                    </Typography>
                </Paper>
            </Grid>
            <Grid item sm>
                <Paper style={style.Paper}>
                    Artefact scroller
                </Paper>
            </Grid>
        </Grid>
    </React.Fragment>
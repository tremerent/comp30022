import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';

import './Artefact.css'

// Presuming that bootstrap css and js have been imported from the parent page

/* This page is intended to display user's artefacts that are fetched 
   from the server.
*/

// Function that renders the copyright section of the footer.
function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://artefactor-it.website">
        Artefactor IT Project
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

// Styles for various objects in this page.
const useStyles = makeStyles(theme => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  card: {
    marginBottom: '30px',
  },
  cardMedia: {
    cursor: 'pointer',
  },
  cardContent: {
    padding: '20px',
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
}));
// Style for the modal
const style={
  imageViewer:{
    width: '100%',
  },
  cardMedia:{
    cursor:'pointer',
  },
  card:{
    marginBottom: '20px',
  }
}


/* variable that determines the number of cards that are 
   displayed. Expected to be changed based on the backend.
*/
 const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];


const { Component } = React

const src = 'https://source.unsplash.com/random'

class ImgBox extends Component {
  
  state = {
    backgroundImage: `url(${src})`,
    backgroundPosition: '0% 0%'
  }

  // allows the image to be enlarged while hovering the mouse cursor over the image
  handleMouseMove = e => {
    const { left, top, width, height } = e.target.getBoundingClientRect()
    const x = (e.pageX - left) / width * 100
    const y = (e.pageY - top) / height * 100
    this.setState({ backgroundPosition: `${x}% ${y}%` })
  }

  render = () =>
    <figure id="imgBoxFigure" onMouseMove={this.handleMouseMove} style={this.state}>
      <img id="imgBoxImg" src={src} />
    </figure>
}


export default function BrowseArtefact() {
  const classes = useStyles();

  //render the page
  return (
    <React.Fragment>

      <main>
        {/* Hero unit */}
        <div className={classes.heroContent}>
          <div class="container">
            {/* Title of the page */}
            <Typography component="h3" variant="h4" align="center" color="textPrimary" gutterBottom>
              Browse Artefact
            </Typography>
          </div>
        </div>
        <div class="container">
          {/* section to show the iterated cards */}
          <div class="row" >
            {cards.map(card => (
              <div class="col-md-4">
                {/* hints the user at clicking the image to enlarge */}
                <div class="card"
                  style={style.card}
                >
                  {/* modal to display an enlarged artefact image. */}
                  <div class="modal fade " tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true" id="myModal"
                  >
                    <div class="modal-dialog modal-lg"
                    >
                      <div class="modal-content">
                        <div class="modal-header">
                          <h5 class="modal-title">Artefact Name</h5>
                          <span class="ml-4 mt-2 badge badge-dark">(Hover to zoom)</span>
                          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </div>
                        <div class="modal-body">
                          <div align="center" class="roottwo">
                            <div id="roottwo"><ImgBox /></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* modal for displaying edit artefact form with its category editing. */}
                  <div class="modal fade" id="editMyModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog" role="document">
                      <div class="modal-content">
                        <div class="modal-header">
                          <h5 class="modal-title" id="exampleModalLabel">Edit Artefact information</h5>
                          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </div>
                        <div class="modal-body">
                          <form>
                            <div class="form-group">
                              <label for="recipient-name" class="col-form-label">Title:</label>
                              <input type="text" class="form-control" id="recipient-name" />
                            </div>
                            {/* show the category selection for the artefact */}
                            <div class="form-group">
                              <label for="category" class="col-form-label">Category:</label>
                              <select class="form-control" id="category">
                                <option>Category 1</option>
                                <option>Category 2</option>
                              </select>
                            </div>
                          </form>
                        </div>
                        <div class="modal-footer">
                          <button type="button" class="btn btn-primary">Update</button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* the image of the artefact in each rectangles/boxes */}
                  <img class="card-img-top"
                    src="https://source.unsplash.com/random"
                    alt="Artefact"
                    data-toggle="modal" data-target="#myModal"
                    title="click to enlarge"
                    style={style.cardMedia}
                  />
                  {/* the description of the artefact */}
                  <div class="card-body" className={classes.cardContent}>
                    <p class="card-text">Category: ...</p>
                    <button type="button" class="btn btn-secondary" data-toggle="modal" data-target="#editMyModal" >Edit</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      {/* Footer */}
      <footer className={classes.footer}>
        <Typography variant="h6" align="center" gutterBottom>
          Footer
        </Typography>
        <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
          Footer subtitle
        </Typography>
        <Copyright />
      </footer>
      {/* End footer */}

    </React.Fragment>
  );
}


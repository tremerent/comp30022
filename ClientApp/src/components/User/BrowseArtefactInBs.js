import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import './ArtefactInBs.css'

// Presuming that bootstrap css and js have been imported from the parent page

/* This page is intended to display user's artefacts that are fetched 
   from the server.
*/

// Function that renders the copyright section of the footer.
function Copyright() {
  return (
    <h6 align="center">Artefactor. Copyright © {new Date().getFullYear()}</h6>
  );
}

// Styles for various objects in this page.
const useStyles = makeStyles(theme => ({
  icon: {
    marginRight: theme.spacing(2),
  },

  // Style for the title of this page
  title:{
    marginTop: '40px',
    marginBottom: '20px',
  },

  // Style for each object shown
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
    'background-color':'#bbb',
    padding: theme.spacing(6),
  },
}));

// Style for the modal
const modalStyle={
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


// Codes for the ImgBox component
const { Component } = React

const src = 'https://source.unsplash.com/random'

class ImgBox extends Component {
  
  state = {
    backgroundImage: `url(${src})`,
    backgroundPosition: '0% 0%'
  }

  handleMouseMove = e => {
    const { left, top, width, height } = e.target.getBoundingClientRect()
    const x = (e.pageX - left) / width * 100
    const y = (e.pageY - top) / height * 100
    this.setState({ backgroundPosition: `${x}% ${y}%` })
  }

  //render method must be defined to be able to show up in DOM.
  render = () =>
    <figure id="zoomFigure" onMouseMove={this.handleMouseMove} 
      style={this.state}>
      <img id="zoomImg" src={src} />
    </figure>
}

export default function BrowseArtefact() {
  const classes = useStyles();

  //render the page
  return (
    <React.Fragment>

      <main>
        <div>
          <div class="container">
            {/* Title of the page */}
            <h3 className={classes.title}>Browse Artefact</h3>
          </div>
        </div>
        <div class="container">
          {/* section to show the iterated cards */}
          <div class="row" >
            {cards.map(card => (
              <div class="col-md-4">
                {/* hints the user at clicking the image to enlarge */}
                <div class="card" style={modalStyle.card} >
                  {/* modal to display an enlarged artefact image. */}
                  <div class="modal fade " tabindex="-1" role="dialog" 
                    aria-labelledby="myLargeModalLabel" aria-hidden="true" 
                    id="myModal">
                    <div class="modal-dialog modal-lg">
                      <div class="modal-content">
                        <div class="modal-header">
                          <h5 class="modal-title">Artefact Name</h5>
                          <span class="ml-4 mt-2 badge badge-dark">
                            (Hover to zoom)</span>
                          <button type="button" class="close" 
                            data-dismiss="modal" aria-label="Close">
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

                  {/* modal for displaying edit artefact form with its 
                      category editing. */}
                  <div class="modal fade" id="editMyModal" tabindex="-1" 
                    role="dialog" aria-labelledby="exampleModalLabel" 
                    aria-hidden="true">
                    <div class="modal-dialog" role="document">
                      <div class="modal-content">
                        <div class="modal-header">
                          <h5 class="modal-title" id="exampleModalLabel">
                            Edit Artefact information</h5>
                          <button type="button" class="close" 
                            data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </div>
                        <div class="modal-body">
                          <form>
                            <div class="form-group">
                              <label for="recipient-name" 
                                class="col-form-label">Title:</label>
                              <input type="text" class="form-control" 
                                id="recipient-name" />
                            </div>
                            {/* show the category selection for the artefact */}
                            <div class="form-group">
                              <label for="category" class="col-form-label">
                                Category:</label>
                              <select class="form-control" id="category">
                                <option>Category 1</option>
                                <option>Category 2</option>
                              </select>
                            </div>
                          </form>
                        </div>
                        <div class="modal-footer">
                          <button type="button" class="btn btn-primary">
                            Update</button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* the image of the artefact in each rectangles/boxes */}
                  <img class="card-img-top"
                    src="https://source.unsplash.com/random"
                    alt="Artefact"
                    data-toggle="modal" data-target="#myModal"
                    title="click to enlarge" //tooltip
                    style={modalStyle.cardMedia}
                  />
                  
                  {/* the description of the artefact */}
                  <div class="card-body" className={classes.cardContent}>
                    <p class="card-text">Category: 
                      <span class="m-1 badge badge-info">Vintage</span></p>
                    <button type="button" class="btn btn-secondary" 
                      data-toggle="modal" data-target="#editMyModal" >
                        Edit
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className={classes.footer}>
        <Copyright />
      </footer>
      {/* End footer */}

    </React.Fragment>
  );
}


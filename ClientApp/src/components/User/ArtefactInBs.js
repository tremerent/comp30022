import React from 'react'
import Divider from '@material-ui/core/Divider'
import './ArtefactInBs.css'

// Presuming that bootstrap css and js have been imported from the parent page

/* This page is intended to display details, comments and questions related 
    to a particular artefact.
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
    paper: {padding:20, marginTop:10, marginBottom:10, marginLeft:10, 
        marginRight:10},

    // style for divider
    gridBelowDivider: {marginBottom: 30, marginTop: 20},

    // style for family tree related contents
    familyTreeButton: {margin: 10},
    familyTreeButtonIcon: {marginLeft: 10},

    // style for the number of artefacts and comment icons
    icon: {marginRight: 10},
    
    // style for artefact description
    desc: {marginTop: 20},

    // style for the artefact frame
    artefactFrame: {margin: 10, width: '80%', height: '80%', cursor:'pointer'},

    // Style for the footer
    footer: {
        'background-color': '#bbb',
    },
}

// Codes related to ImgBox component
const { Component } = React

const src = 'https://source.unsplash.com/random'

class ImgBox extends Component {
  
  state = {
    backgroundImage: `url(${src})`,
    backgroundPosition: '0% 0%'
  }
  /* allows the image to be enlarged while hovering the mouse cursor over 
    the image */
  handleMouseMove = e => {
    const { left, top, width, height } = e.target.getBoundingClientRect()
    const x = (e.pageX - left) / width * 100
    const y = (e.pageY - top) / height * 100
    this.setState({ backgroundPosition: `${x}% ${y}%` })
  }

  // render method must be defined to be able to show up in DOM.
  render = () =>
    <figure id="zoomFigure" onMouseMove={this.handleMouseMove} 
        style={this.state}>
      <img id="zoomImg" src={src} />
    </figure>
}

// The main section of the Artefact page
export default Artefact =>
    <React.Fragment>

        <div class="container">
            <div class="row">
            <div class="col col-lg-8">
                {/* left section of the page */}
                <div class="card" style={style.paper}>
                    {/* image preview of the artefact */}
                    <div class="row">
                        <div align="center">
                            <img src="https://source.unsplash.com/random" 
                                class="img-thumbnail" 
                                style={style.artefactFrame} 
                                alt="Artefact"
                                data-toggle="modal" data-target="#myModal"
                                title="click to enlarge" //tooltip
                                />
                        </div>
                    </div>

                    {/* header for artefact name */}
                    <div class="row">
                        <div class="col"><h3 class="text-left">
                            Artefact Name
                            </h3></div>
                    </div>
                    
                    <Divider variant="middle" />
                    
                    {/* modal to display an enlarged artefact image. */}
                    <div class="modal fade " tabindex="-1" role="dialog" 
                        aria-labelledby="myLargeModalLabel" aria-hidden="true" 
                        id="myModal" >
                        <div class="modal-dialog modal-lg">
                        <div class="modal-content">
                            <div class="modal-header">
                            <h5 class="modal-title">Artefact Name</h5>
                            {/* a badge to indicate that there is an image 
                                zoom functionality */}
                            <span class="ml-4 mt-2 badge badge-dark">
                                (Hover to zoom)</span>
                            <button type="button" class="close" 
                                data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                            </div>
                            <div class="modal-body">
                            <div align="center" class="roottwo">
                                <ImgBox />
                            </div>
                            </div>
                        </div>
                        </div>
                    </div>
                    
                    {/* description of artefact which includes categories 
                        in badges */}
                    <div class="row" style={style.desc}>
                        <div class="col">
                            <p>Description of artefact. Category: 
                                <span class="m-1 badge badge-info">
                                    Vintage
                                </span>
                                <span class="m-1 badge badge-success">
                                    Retro
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col">
                <div class="row">
                    {/* right section of the page */}
                    <div class="card" style={style.paper} >
                        <div class="titleBox">
                            <label>Questions</label>
                        </div>
                        {/* The part that displays the questions and answers */}
                        <div class="detailBox" id="accordion">
                            <div class="card">
                                <div class="card-header" id="headingOne">
                                <h5 class="mb-0">
                                    <button class="btn btn-link" 
                                        data-toggle="collapse" 
                                        data-target="#collapseOne" 
                                        aria-expanded="true" 
                                        aria-controls="collapseOne">
                                        Question 1
                                    </button>
                                </h5>
                                </div>

                                <div id="collapseOne" class="collapse show" 
                                    aria-labelledby="headingOne" 
                                    data-parent="#accordion">
                                    <div class="card-body">
                                        Answer
                                    </div>
                                </div>
                            </div>
                            <div class="card">
                                <div class="card-header" id="headingTwo">
                                <h5 class="mb-0">
                                    <button class="btn btn-link collapsed" 
                                        data-toggle="collapse" 
                                        data-target="#collapseTwo" 
                                        aria-expanded="false" 
                                        aria-controls="collapseTwo">
                                    Question 2
                                    </button>
                                </h5>
                                </div>
                                <div id="collapseTwo" class="collapse" 
                                    aria-labelledby="headingTwo" 
                                    data-parent="#accordion">
                                    <div class="card-body">
                                        Answer 2
                                    </div>
                                </div>
                            </div>
                            <div class="card">
                                <div class="card-header" id="headingThree">
                                <h5 class="mb-0">
                                    <button class="btn btn-link collapsed" 
                                        data-toggle="collapse" 
                                        data-target="#collapseThree" 
                                        aria-expanded="false" 
                                        aria-controls="collapseThree">
                                        Question 3
                                    </button>
                                </h5>
                                </div>
                                <div id="collapseThree" class="collapse" 
                                    aria-labelledby="headingThree" 
                                    data-parent="#accordion">
                                    <div class="card-body">
                                        Answer 3
                                    </div>
                                </div>
                            </div>
                            </div>
                            
                            <button class="btn btn-primary" 
                                style={{'margin-top': '30px'}} 
                                data-toggle="modal" 
                                data-target="#postQuestionModal">
                                    Ask your question
                            </button>
                    </div>
                    {/* MODAL for EDIT IMAGE */}
                    <div class="modal fade" id="postQuestionModal" 
                        tabindex="-1" role="dialog" 
                        aria-labelledby="exampleModalLabel" 
                        aria-hidden="true">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">
                                Ask Question
                            </h5>
                            <button type="button" class="close" 
                                data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                            </div>
                            <div class="modal-body">
                                <form>
                                    {/* show text field for question */}
                                    <div class="form-group">
                                    <label for="recipient-name" 
                                        class="col-form-label">Question:</label>
                                    <input type="text" class="form-control" 
                                        id="recipient-name" />
                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer">
                            <button type="button" class="btn btn-primary">
                                Send</button>
                            </div>
                        </div>
                    </div>
                    </div>
                </div>
                <div class="row">
                    {/* right section of the page */}
                    <div class="card" style={style.paper} >
                        {/* Comment section */}
                        <div class="detailBox">
                            <div class="titleBox">
                                <label>Comments</label>
                            </div>
                            {/* List of comments */}
                            <div class="actionBox">
                                <ul class="commentList">
                                    <li>
                                        {/* profile image of the commenter */}
                                        <div class="commenterImage">
                                        <img 
                                            src="http://placekitten.com/50/50" 
                                            />
                                        </div>
                                        {/* Text of comment including the 
                                            time and date. */}
                                        <div class="commentText">
                                            <p class="">Comment 1.</p> <span 
                                            class="date sub-text">
                                                on December 5th, 2014 at 3:00 PM
                                            </span>
                                        </div>
                                    </li>
                                    <li>
                                        <div class="commenterImage">
                                        <img 
                                            src="http://placekitten.com/45/45" 
                                            />
                                        </div>
                                        <div class="commentText">
                                            <p class="">Very very very very \
                                                very very very very long \
                                                comment.
                                                </p><span class="date sub-text">
                                                    on December 5th, 2014</span>
                                        </div>
                                    </li>
                                    <li>
                                        <div class="commenterImage">
                                        <img 
                                            src="http://placekitten.com/40/40" 
                                            />
                                        </div>
                                        <div class="commentText">
                                            <p class="">Quick comment.</p>
                                            <span class="date sub-text">
                                                on December 5th, 2014</span>
                                        </div>
                                    </li>
                                </ul>
                                {/* form to post comments */}
                                <form class="form-inline" role="form">
                                    <div class="form-group">
                                        <input class="form-control" type="text" 
                                            placeholder="Your comments" />
                                    </div>
                                    <div class="form-group">
                                        <button class="btn btn-primary">
                                            Add</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
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
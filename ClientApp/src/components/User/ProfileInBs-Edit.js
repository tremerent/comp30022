import React from 'react'
import ChatIcon from '@material-ui/icons/Chat'
import ArtTrackIcon from '@material-ui/icons/ArtTrack'
import DeviceHubIcon from '@material-ui/icons/DeviceHub';

import $ from 'jquery/dist/jquery.js'
import './ProfileInBs-Edit.css'

// Presuming that bootstrap css and js have been imported from the parent page

/* This page is intended to display user's profile in edit mode.
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
    
    // The style for the name edit text field.
    editName:{marginBottom:'30px'},

    // The styles for the avatar (profile picture).    
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


// profile image edit. this function shows image preview of the uploaded image.
function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
            $('#imagePreview').css('background-image', 
                'url('+e.target.result +')');
            $('#imagePreview').hide();
            $('#imagePreview').fadeIn(650);
        }
        reader.readAsDataURL(input.files[0]);
    }
}
$("#imageUpload").change(function() {
    readURL(this);
});


// The main section of the Profile page
export default Profile =>
    <React.Fragment>
        <div class="container">
            <div class="row">
            <div class="col-sm">
                <div class="card" style={style.paper} >
                    <div align="center" >
                        <div class="profile-pic">
                            {/* profile image with edit button on hover */}
                            <img src="https://source.unsplash.com/random" 
                                class="rounded-circle" 
                                style={style.profilePicture} />
                            <div class="edit-image"><a href='#' 
                                data-toggle="modal" 
                                data-target="#editImageModal">
                                <ArtTrackIcon />
                                <span>Change Profile Picture</span></a>
                            </div>
                        </div>
                    </div>
                    {/* MODAL for EDIT IMAGE */}
                    <div class="modal fade" id="editImageModal" tabindex="-1" 
                        role="dialog" aria-labelledby="exampleModalLabel" 
                        aria-hidden="true">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">
                                Edit Profile Image</h5>
                            <button type="button" class="close" 
                                data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                            </div>
                            <div class="modal-body">
                            <form>
                                <div class="avatar-upload">
                                    <div class="avatar-edit">
                                        <input type='file' id="imageUpload" 
                                            accept=".png, .jpg, .jpeg" />
                                        <label for="imageUpload"></label>
                                    </div>
                                    <div class="avatar-preview">
                                        <div id="imagePreview" 
                                            style={{'background-image': 
                                            'url(https://cdn3.iconfinder.com/'+
                                            'data/icons/vector-icons-6/96/'+
                                            '256-512.png)'}}>
                                        </div>
                                    </div>
                                    {/* label that indicates the upload 
                                        requirements */}
                                    <div align="center">
                                        <small>Maximum file size: ... kb</small>
                                    </div>
                                </div>
                            </form>
                            </div>
                            <div class="modal-footer">

                            {/* update button to apply changes made */}
                            <button type="button" class="btn btn-primary">
                                Update</button>
                            </div>
                        </div>
                    </div>
                    </div>
                    
                    {/* Profile name text field for editing */}
                    <div align="center" style={style.editName} >
                        <input class="form-control" type="text" 
                            placeholder="Name" />
                    </div>
                    
                    {/* row which displays the number of artefacts and 
                        comments */}
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
                                data-toggle="modal" 
                                data-target="#editFamilyModal">
                                Change family tree
                                <DeviceHubIcon 
                                    style={style.familyTreeButtonIcon}/>
                            </button>
                        </div>
                    </div>

                    {/* MODAL for EDIT FAMILY TREE */}
                    <div class="modal fade" id="editFamilyModal" tabindex="-1" 
                        role="dialog" aria-labelledby="exampleModalLabel" 
                        aria-hidden="true">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">
                                Edit Family Tree</h5>
                            <button type="button" class="close" 
                                data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                            </div>
                            <div class="modal-body">
                            {/* image preview for upload and file selector 
                                button */}
                            <form>
                                <div class="avatar-upload">
                                    <div class="avatar-edit">
                                        <input type='file' id="imageUpload" 
                                            accept=".png, .jpg, .jpeg" />
                                        <label for="imageUpload"></label>
                                    </div>
                                    <div class="avatar-preview">
                                        <div id="imagePreview" 
                                            style={{'background-image': 
                                            'url(https://images.all-free-'+
                                            'download.com/images/graphiclarge/'+
                                            'family_tree_infographic_'+
                                            'illustration_face_icons_6825019'+
                                            '.jpg)'}}>
                                        </div>
                                    </div>
                                </div>
                            </form>
                            </div>
                            <div class="modal-footer">

                            {/* update button to apply changes made */}
                            <button type="button" class="btn btn-primary">
                                Update</button>
                            </div>
                        </div>
                    </div>
                    </div>

                    {/* biography of the user */}
                    <textarea class="form-control" rows="3" placeholder="Bio">
                    </textarea>

                    {/* save button */}
                    <div class="row" align="right">
                        <div class="col" style={style.familyTreeButton}>
                            <button type="button" class="btn btn-primary">
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* right section of the page to include the artefact scroller */}
            <div class="col-sm">
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

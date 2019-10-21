import React from 'react';
import { connect } from 'react-redux';

import { 
    addArtefactImage, 
    removeArtefactImage 
} from '../../../scripts/requests';

import '../../Artefact/ArtefactPreview.css';

class ArtefactImageUploadTest extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            selectedFile: null,
        }
    }

    render() {
        let artefactStuff;
        if (this.props.artefact) {
            artefactStuff = 
            <>
                <h4> title: {this.props.artefact.title} </h4>
                <div>
                    {
                        this.props.artefact.images.length
                            ? this.props.artefact.images.map(img => {
                                    return (
                                        <>
                                            <img src={img} className="d-block af-artcard-image"/>
                                            <button onClick={(e) => {
                                                e.preventDefault();
                                                this.deleteImg(img.url);
                                            }}> </button>    
                                            <hr />
                                        </>
                                    );
                                })
                            : <h5> No images ! </h5>
                    }
                </div>
                <form onSubmit={this.handleSubmit} method="post" enctype="multipart/form-data">
                    <h5> Upload artefact image </h5>

                    <input type="text" name="userId" />

                    <hr class="my-2" />
                    <label for="file" class="mr-2"> <strong> Upload image: </strong> </label>

                    <label class="btn mt-2 btn-outline-info">
                        Browse
                        <input type="file" name="file" style={{ display: "none" }} onChange={this.onChangeHandler}/>

                    </label>

                    <button type="submit" class="btn btn-primary"> Submit </button>
                </form>
            </>
        }
        else {
            artefactStuff = <h4> No artefact </h4>;
        }
        
        return (
            <div>
                <h3> ARTEFACT IMAGES </h3>
                {artefactStuff}
            </div>
        );
    }

    onChangeHandler = event => {
        this.setState({
            ...this.state,
            selectedFile: event.target.files[0],
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();

        addArtefactImage(this.props.artefact.id, this.state.selectedFile);
    }

    deleteImg = (imgUrl) => {
        removeArtefactImage(imgUrl);
    }
}

function mapStateToProps(state) {
    const idOfInterestingArt = "9db8fe7b-4954-49a5-b7f9-400d5fdd7156";
    const interestingArt =
        state.art.myArts.myArtefacts.find(a => a.id == idOfInterestingArt);

    
    return {
        artefact: interestingArt,
    };
}

export default connect(mapStateToProps, null) (ArtefactImageUploadTest);

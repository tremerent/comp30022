
import React from 'react';
import {
    Collapse,
    Container,
    Navbar,
    NavbarBrand,
    NavbarToggler,
} from 'reactstrap';
import { Link,  } from 'react-router-dom';
import { connect } from 'react-redux';

import StyledNavLink from './StyledNavLink.js';
import UserNavMenu from './UserNavMenu.js';

import './NavMenu.css';
import ARTEFACTOR_BRAND from 'images/artefactor-brand.png';
import ARTEFACT_ICON from 'images/amphora.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy } from '@fortawesome/free-solid-svg-icons';


// WIP
// function iconsInheritParentColor() {

//     var icons = document.getElementsByClassName("af-icon");

//     var vsgs = document.getElementsByName("svg");
//     console.log(vsgs);

// //     var url="https://openclipart.org/people/StudioFibonacci/kitchen-blender.svg";
// // fetch('https://cors-anywhere.herokuapp.com/'+url)
// // 	.then(r=>r.blob())
// //   .then(b=>{
// // 	  svg_image_id.addEventListener('load', e => URL.revokeObjectURL(svg_image_id.data));
// //   	svg_image_id.data = URL.createObjectURL(b);
// //   });

// // svg_image_id.onload = e =>{
// // 	svg_image_id.contentDocument.getElementById("path241").style.fill="red"
// // }

//     console.log(icons);

//     // icon should be of form <div class='af-custom-icon'> <object/> </div>
//     for (const icon of icons) {
//         const objectEle = icon.children[0];


//         if (objectEle && objectEle.nodeName === "OBJECT") {
            
//             // style="fill:#AB7C94;"
//             console.log(objectEle);
            
//             const svgDoc = objectEle.contentDocument;
//             console.log(svgDoc);
//             console.log(objectEle.contentWindow);

//             objectEle.addEventListener("load", () => {
//                 console.log('loaded!');
//                 console.log(svgDoc);
//             });

//             // const styleElement = svgDoc.createElementNS("http://www.w3.org/2000/svg", "style");
//             // styleElement.textDocument = ".st0 { fill:#AB7C94; }"

//             // console.log('applying style');
//             // svgDoc.documentElement.appendChild(styleElement);
//         }
//         else {
//             console.error(`'.af-icon' must have inner node '<object />'`);
//         }


//     }

//     // foreach (const iconDoc in iconDocs) {
//     //     var svgDoc = a.contentDocument;

//     //     var styleElement = svgDoc.createElementNS("http://www.w3.org/2000/svg", "style");
//     //     styleElement.textContent = ".st0 { fill: #000 }";
//     //     svgDoc.getElementById("object").appendChild(styleElement);

//     //     appendColorToSvg(svgDoc);
//     // }

//     // function appendColorToSvg(svgDoc) {

//     // }

//     // var a = document.getElementById("object");
//     // var svgDoc = a.contentDocument;


//     // foreach (const iconSvg in iconSvgElts) {
//     //     iconSvgElts
//     // }

// }

class NavMenu extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            collapsed: true,
            authenticated: false,
        }

        this.toggleNav = this.toggleNav.bind(this);
    }

    toggleNav() {
        this.setState({ collapsed: !this.state.collapsed });
    }

    componentDidMount() {
        // iconsInheritParentColor();
    }

    componentDidRender() {
        // iconsInheritParentColor();
    }

    render() {
        const artefactIcon = 
            <div className='af-icon'>
                <object type='image/svg+xml' contenteditable="true" data={ARTEFACT_ICON}>
                </object>
            </div>;

        return (
            <header>
                <div className='af-navmenu'>
                    <Navbar light className="navbar-expand-sm ng-white box-shadow">
                        <Container>
                            <NavbarBrand tag={Link} to="/">
                                <img src={ARTEFACTOR_BRAND} className='af-navmenu-brand' alt='Artefactor logo'/>
                            </NavbarBrand>
                            <NavbarToggler onClick={this.toggleNav}/>
                            <Collapse
                                className="d-sm-inline-flex flex-sm-row-reverse"
                                isOpen={!this.state.collapsed} navbar
                            >
                                <ul className="navbar-nav">
                                    <StyledNavLink
                                        to="/browse"
                                        label={
                                            <>
                                                <span> Browse </span>&nbsp;
                                                {artefactIcon}
                                                {/* <svg src={ARTEFACT_ICON} className="af-icon-custom">
                                                </svg> */}
                                                     {/* <img src={ARTEFACT_ICON} className="af-icon-custom"/> */}
                                            </>
                                        }
                                        curPath={this.props.curPath}
                                    />
                                    {
                                        !/*XXX*/this.state.authenticated ? (
                                            <>
                                            {/*<NavLink tag={Link} to="/family">My Family</NavLink>*/}
                                            {/*<NavLink tag={Link} to="/profile">Profile</NavLink>*/}
                                            {/*<NavLink tag={Link} to="/my-artefacts">My Artefacts</NavLink>*/}
                                            {/*<NavLink tag={Link} to="/logout">Log Out</NavLink>*/}
                                            </>
                                        ) : (
                                            <>
                                            {/*<NavLink tag={Link} to="/login">Log In</NavLink>*/}
                                            {/*<NavLink tag={Link} to="/signup">Sign Up</NavLink>*/}
                                            </>
                                        )
                                    }
                                    <UserNavMenu/>
                                </ul>
                            </Collapse>
                        </Container>
                    </Navbar>
                </div>
                <div className='af-navmenu-placeholder'></div>
            </header>
        );
    }
}

function mapStateToProps(state) {
    return {
        curPath: state.router.location.pathname,
    }
}

export default connect(mapStateToProps)(NavMenu);


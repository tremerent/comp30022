import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';

//Presuming that Bootstrap css and js have been imported from the parent page

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
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(4, 0, 3),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    cursor: 'pointer',
    marginBottom: '30px',
  },
  cardMedia: {
    tooltip: "click to enlarge",
    cursor: 'pointer',
  },
  cardContent: {
    flexGrow: 1,
    paddingTop: 0,
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
}));
/* variable that determines the number of cards that are 
   displayed. Expected to be changed based on the backend.
*/
 const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];

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
        <div class="container"> {/* className={classes.cardGrid} */}
          
          {/* card section */}
          <div class="row" > {/* spacing={4} */}
            {cards.map(card => (
              <div class="col-md-4"> {/* item key={card} xs={6} */}
                {/* hints the user at clicking the image to enlarge */}
                <div class="card"  onClick={handleClickOpen} className={classes.card}
                  tooltip="Click to enlarge"
                >
                  <img class="card-img-top"
                    src="https://source.unsplash.com/random"
                    alt="Click to enlarge"
                  /> {/*  */}
                  <div class="card-body" className={classes.cardContent}> {/* */}
                    <p class="card-text">Genre: ... Category: ...</p>
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

      {/** DIALOG */}
      <div class="modal fade bd-example-modal-lg" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            ...
          </div>
        </div>
      </div>

        {/** END OF DIALOG */}
    </React.Fragment>
  );
}


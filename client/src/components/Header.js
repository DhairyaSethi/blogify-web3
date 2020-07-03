import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';

//const useStyles = makeStyles((theme) => ({
const styles = theme => ({
  toolbar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  toolbarTitle: {
    flex: 1,
  },
  toolbarSecondary: {
    justifyContent: 'space-between',
    overflowX: 'auto',
  },
  toolbarLink: {
    padding: theme.spacing(1),
    flexShrink: 0,
  },
});
//}));

class Header extends React.Component {
  // const classes = useStyles();

  constructor(props) {
    super(props);
//    this.props.testing.bind(this)
  }
//  testing() {console.log('aaa')}
//  click = () => { this.props.testing()}

  render () {
  const {classes } = this.props;
  const { sections, title, acc, testing } = this.props;
  return (
    <React.Fragment>
      <Toolbar className={classes.toolbar}>
        <Button variant="outlined" onClick={()=>this.props.testing()}>Upload New Arcticle</Button>
        <Typography
          component="h2"
          variant="h5"
          color="inherit"
          align="center"
          noWrap
          className={classes.toolbarTitle}
        >
          {title}
        </Typography>
        <Typography> Hello  </Typography>
        <Button variant="outlined" size="small" onClick={()=>window.alert('Hey!')}>Check Current Earning</Button>
        <Button variant="outlined" size="small" onClick={()=>console.log('hey')}>TRY</Button>
        <IconButton>
          <SearchIcon />
        </IconButton>
      </Toolbar>
      <Toolbar component="nav" variant="dense" className={classes.toolbarSecondary}>
        {sections.map(section => (
          <Link
            color="inherit"
            noWrap
            key={section.title}
            variant="body2"
            href={section.url}
            className={classes.toolbarLink}
          >
            {section.title} 
          </Link>
        ))
        }
      </Toolbar>
    </React.Fragment>
  );
}
}
Header.propTypes = {
  sections: PropTypes.array,
  title: PropTypes.string,
};

export default withStyles(styles)(Header);
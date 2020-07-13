import React, {Component} from 'react'
import Content from './Content'
import MainFeaturedPost from './MainFeaturedPost'
import FeaturedPost from './FeaturedPost'
import {Grid, withStyles, Toolbar, Link} from '@material-ui/core'


const styles = theme => ({
	mainGrid: {
    marginTop: theme.spacing(3),
  },
  toolbarSecondary: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    justifyContent: 'space-between',
    overflowX: 'auto',
  },
  toolbarLink: {
    padding: theme.spacing(1),
    flexShrink: 0,
  },
});

class Main extends Component {

	render() {

	const { classes} = this.props;

		return (
      <div>
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
			<main>
	          <MainFeaturedPost post={mainFeaturedPost} />
	          <Grid container spacing={4}>
	            {featuredPosts.map(post => (
	              <FeaturedPost key={post.title} post={post} />
	            ))}
	          </Grid>
	          <Grid container spacing={5} className={classes.mainGrid}>
	           	<Content />
	          </Grid>
	        </main> 
          </div>
			);
	}

}


export default withStyles(styles)(Main)


const mainFeaturedPost = {
  title: 'Title of a longer featured blog post',
  description:
    "Multiple lines of text that form the lede, informing new readers quickly and efficiently about what's most interesting in this post's contents.",
  image: 'https://source.unsplash.com/random',
  imgText: 'main image description',
  linkText: 'Continue reading…',
};

const featuredPosts = [
  {
    title: 'Featured post',
    date: 'Nov 12',
    description:
      'This is a wider card with supporting text below as a natural lead-in to additional content.',
    image: 'https://source.unsplash.com/random',
    imageText: 'Image Text',
  },
  {
    title: 'Post title',
    date: 'Nov 11',
    description:
      'This is a wider card with supporting text below as a natural lead-in to additional content.',
    image: 'https://source.unsplash.com/random',
    imageText: 'Image Text',
  },
];

const sections = [
  { title: 'Technology', url: '#' },
  { title: 'Design', url: '#' },
  { title: 'Culture', url: '#' },
  { title: 'Business', url: '#' },
  { title: 'Politics', url: '#' },
  { title: 'Opinion', url: '#' },
  { title: 'Science', url: '#' },
  { title: 'Health', url: '#' },
  { title: 'Style', url: '#' },
  { title: 'Travel', url: '#' },
];

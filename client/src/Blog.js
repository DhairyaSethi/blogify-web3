import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Header from './components/Header';
import MainFeaturedPost from './components/MainFeaturedPost';
import FeaturedPost from './components/FeaturedPost';
import Main from './components/Main';
import Footer from './components/Footer';
import post1 from './components/blog-post.1.md';
import Web3 from 'web3';

const styles = theme => ({
  mainGrid: {
    marginTop: theme.spacing(3),
  },
});

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

const posts = [post1];

class Blog extends React.Component{
  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3;
    // Load account
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });

    console.log("CURRENT ACCOUNT IS: " + this.state.account);
    this .setState({ loading : false })
/*
    const networkId = await web3.eth.net.getId();
    const networkData = Court.networks[networkId];
    if (networkData) {
      const court = new web3.eth.Contract(Court.abi, networkData.address);
      this.setState({ court });
      this.setState({ GAS: 500000, GAS_PRICE: "20000000000" });
      // const func = await court.methods.func(params).call()
      this.setState({ loading: false });
    } else {
      window.alert("Court contract not deployed to detected network.");
    }*/
  }



  constructor () {
    super();
    this.state = {
      account : "",
      loading : true
    }
  }

  render () {
    const { classes } = this.props;
  
  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="lg">
        <Header title="Blog" sections={sections} acc={this.state.account}/>
        {this.state.loading ? <div align="center"><p>Loading ... </p></div> : 
        <main>
          <MainFeaturedPost post={mainFeaturedPost} />
          <Grid container spacing={4}>
            {featuredPosts.map((post) => (
              <FeaturedPost key={post.title} post={post} />
            ))}
          </Grid>
          <Grid container spacing={5} className={classes.mainGrid}>
            <Main title="From the firehose" posts={posts} />
          </Grid>
        </main> }
      </Container>
      <Footer title="Footer" description="Something here to give the footer a purpose!" />
    </React.Fragment>
  );
}
}

export default withStyles(styles)(Blog);
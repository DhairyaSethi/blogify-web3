import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
// import Header from './components/Header';
import MainFeaturedPost from './components/MainFeaturedPost';
import FeaturedPost from './components/FeaturedPost';
//import Main from './components/Main';
import Footer from './components/Footer';
import Web3 from 'web3';
import Content from './components/Content';
import abi from './abis/abi.json';
import Link from '@material-ui/core/Link';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import Toolbar from '@material-ui/core/Toolbar';
// import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';

const styles = theme => ({
  mainGrid: {
    marginTop: theme.spacing(3),
  },
  toolbar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  toolbarTitle: {
    flex: 1,
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
    this.setState({ loading : false });
    const contract = new web3.eth.Contract(abi, '0xA78F14d313279864B6A6b66C8711272Fb4A21988');
    console.log('Connected to contract', contract);
    await contract.methods.checkSub(this.state.account)
      .call()
      .then(res => {console.log('sub status =>',res); this.setState({ isSubscribed: res })})
    this.setState({ contract });
    this.setState({ GAS: 500000, GAS_PRICE: "20000000000" });
    this.setState({ loading: false });
    contract.methods.checkWriter(this.state.account)
      .call()
      .then(res => {console.log('WRiter', res); this.setState({writer: res})})
    contract.methods.writerCount()
      .call()
      .then(res => {console.log(res, 'no of writers'); this.setState({writerCount: res})})
    let dai = web3.utils.toHex(1e18); console.log('DAI Amount', dai)
    this.setState({DAIAmount: dai});

  }

  async subscribe() {
    const {contract, GAS, GAS_PRICE, account} = this.state;
    await contract.methods.subscribe(account)
      .send({from: account, gas: GAS, gasPrice: GAS_PRICE})
      .on('transactionHash', res => {console.log('SUBBEEEDD', res)})
      .then(res => {console.log('SUBBEEEDD', res); this.setState({isSubscribed: true})})
      
    contract.methods.supplyDaiToCompound()
      .send({from: account, gas: 800000, gasPrice: GAS_PRICE})
      .on('transactionHash', res => {console.log('Supplied dai ', res)})
      .then(res => {console.log('minted ', res);this.setState({minted:true})})
      .error(err => console.log('TRANSACTION ERROR________',err))
  }

  async supportWriter(add) {
    const {account, GAS, GAS_PRICE, contract } = this.state;
    await contract.methods.makeWriter(add)
      .send({from: account, gas: GAS, gasPrice: GAS_PRICE})
      .then(res => {console.log('added writer ', res); this.setState({writerCount: this.state.writerCount + 1})})
      .catch(err => console.log('couldnt support writer', err))
  }

  async withdraw() {
    const {account, GAS, GAS_PRICE, contract, DAIAmount} = this.state;
    await contract.methods.withdrawDaiFromCompound(account, DAIAmount)
      .send({from: account, gas: GAS, gasPrice: GAS_PRICE})
      .then(res => {console.log('withdrawn ==>', res); })
      .catch(err => console.log('couldnt withdraw', err))
  }

  testing() {
    const {account} = this.state;
    window.alert('TRYYRYRY', account);
  }

  async newArticle(title, content) {
    const res = await axios.post(
        'http://localhost:5000/posts',
        {
          title: title,
          by: this.state.account,
          content: content
        },
        {
          headers: {'Content-Type': 'application/json'}
        }
      )
    console.log('new article POST response ==> ', res)
  }

  constructor () {
    super();
    this.state = {
      account : "",
      loading : true,
      GAS: "",
      GAS_PRICE: "",
      contract: "",
      isSubscribed: false,
      writer: false,
      minted: false,
      writerCount: 0,
      DAIAmount: 0
    }
  }

  render () {
    const { classes } = this.props;
  
  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="lg">
        {/*<Header title="Blog" sections={sections} acc={this.state.account} testing={this.testing} />*/}
{/*  START HEADER*/}        
      <Toolbar className={classes.toolbar}>
        <Button variant="outlined" onClick={() => {
          let t = window.prompt('Enter the title.');
          let c = window.prompt('Enter the content.');
          this.newArticle(t,c);
        }}>Upload New Arcticle</Button>
        <Typography
          component="h2"
          variant="h5"
          color="inherit"
          align="center"
          noWrap
          className={classes.toolbarTitle}
        >
          Blog
        </Typography>
        <Button variant="outlined" size="small" onClick={()=>{
            let add = window.prompt('What is the address of the user?');
            console.log('USER ADDED ==> ', add);
            (add)?this.supportWriter(add):console.log('didn\'t show the love ', add)
          }}>
          Support Writer
        </Button>
        <Button variant="outlined" size="small" onClick={() => {
          this.state.writer?this.withdraw():window.alert('you are not a writer yet')}
        }>Withdraw Earning</Button>
        <IconButton>
          <SearchIcon />
        </IconButton>
      </Toolbar>
      <Toolbar component="nav" variant="dense" className={classes.toolbarSecondary}>
          <Link color="inherit" noWrap key='account' href={'#'} variant="body2"  className={classes.toolbarLink}>
            Account : {this.state.account.slice(0,7)}.... 
          </Link>
          <Link color="inherit" noWrap key='mint_status' href={'#'} variant="body2"  className={classes.toolbarLink}>
            {this.state.minted?'Minted':'Minting....'}
          </Link>
          <Link color="inherit" noWrap key='creater_status' href={'#'} variant="body2"  className={classes.toolbarLink}>
            {this.state.writer? 'Content Creater': 'Not a Writer Yet'}
          </Link>
          <Link color="inherit" noWrap key='writer_count' href={'#'} variant="body2"  className={classes.toolbarLink}>
             Be among {this.state.writerCount} writers today!
          </Link>
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
{/* END HEADER */}        
        {this.state.loading ? <div align="center"><p>Loading ... </p></div> : 
          !this.state.isSubscribed ? 
          <div align="center">Please <Button variant='outlined' onClick={()=> this.subscribe()}>Subscribe</Button> :(</div> :
        <main>
          <MainFeaturedPost post={mainFeaturedPost} />
          <Grid container spacing={4}>
            {featuredPosts.map((post) => (
              <FeaturedPost key={post.title} post={post} />
            ))}
          </Grid>
          <Grid container spacing={5} className={classes.mainGrid}>
            {/*<Main title="From the firehose" posts={posts} />*/}
          <Content />
          </Grid>
        </main> }
      </Container>
      <Footer title="Footer" description="Something here to give the footer a purpose!" />
    </React.Fragment>
  );
}
}

export default withStyles(styles)(Blog);

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


import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
  CssBaseline,
  Grid,
  Button,
  Container,
  Link,
  IconButton,
  Toolbar,
  Typography,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@material-ui/core/';
import SearchIcon from '@material-ui/icons/Search';
import MainFeaturedPost from './components/MainFeaturedPost';
import FeaturedPost from './components/FeaturedPost';
import Footer from './components/Footer';
import Web3 from 'web3';
import Content from './components/Content';
import abi from './abis/abi.json';
import DAI_abi from './abis/erc20abi.json';
import axios from 'axios';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

const styles = theme => ({
  mainGrid: {
    marginTop: theme.spacing(3),
  },
  toolbar: {
    borderBottom: `3px solid ${theme.palette.divider}`,
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
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });

    console.log("CURRENT ACCOUNT IS: " + this.state.account);
    this.setState({ loading : false });
    const contract = new web3.eth.Contract(abi, '0xA78F14d313279864B6A6b66C8711272Fb4A21988');
    console.log('Connected to contract', contract);
    await contract.methods.checkSub(this.state.account)
      .call()
      .then(res => {
        console.log('sub status =>',res); 
        this.setState({ isSubscribed: res })
        this.state.isSubscribed?this.setState({minted: res}):console.log('.')
      })
    this.setState({ contract });
    this.setState({ GAS: 500000, GAS_PRICE: "20000000000" });
    contract.methods.checkWriter(this.state.account)
      .call()
      .then(res => {console.log('WRiter', res); this.setState({writer: res})})
    await contract.methods.writerCount()
      .call()
      .then(res => {console.log(res, 'no of writers'); this.setState({writerCount: res})})
      .catch(err => console.log('error is getting writerCount ', err ))

//    let c = Math.floor((1/this.state.writerCount) * 100); 
//    console.log('CCC', web3.utils.fromWei((c * 10 ** 16).toString(), 'ether'))
    let d = ((Math.floor((1/this.state.writerCount) * 100)) * 10 ** 16).toString()
    let dai = web3.utils.toHex(d); console.log('DAI Amount', dai, 'which is ', d)
    this.setState({DAIAmount: dai});

    const daicontract = new web3.eth.Contract(DAI_abi, '0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa')
    await daicontract.methods.balanceOf(this.state.account)
      .call()
      .then(res => {
        console.log('Dai balance ',web3.utils.fromWei(res, 'ether'))
        if(web3.utils.fromWei(res, 'ether') < 1) {
          window.alert('Insufficient Dai balance! Swap 0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa (DAI) token at uniswap.\n(Min 1)')
          this.setState({daiBal: false})
        }
        else this.setState({daiBal: true})
      })
    this.setState({ loading: false });


  }

  async subscribe() {
    if(!this.state.daiBal) {
      window.alert('Insufficient Dai balance! Swap 0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa (DAI) at uniswap.\n You need atleast 1 DAI to subscribe.')
      return;
    }
    const {contract, GAS, GAS_PRICE, account} = this.state;
    await contract.methods.subscribe(account)
      .send({from: account, gas: GAS, gasPrice: GAS_PRICE})
      .then(res => {console.log('SUBBEEEDD', res); this.setState({isSubscribed: true})})
      
    contract.methods.supplyDaiToCompound()
      .send({from: account, gas: 800000, gasPrice: GAS_PRICE})
      .on('transactionHash', res => {console.log('Supplied dai ', res)})
      .then(res => {console.log('minted ', res);this.setState({minted:true})})
      .catch(err => console.log('TRANSACTION ERROR________',err))
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

  async newArticle(title, content) {
    if(!title || !content) return;
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
  handleOpen() {
    this.setState({ show: true })
  }
  handleClose() {
    this.setState({ show: false })
  }

  handleOpen1() {
    this.setState({ show1: true })
  }
  handleClose1() {
    this.setState({ show1: false })
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
      DAIAmount: 0,
      daiBal: false,
      show: false,
      show1: false,
      content: "",
      title: ""
    }
  }

  render () {
    const { classes } = this.props;
  
  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="lg">       
      <Toolbar className={classes.toolbar}>
      <IconButton onClick={() => this.handleOpen1()}>
          <InfoOutlinedIcon />
      </IconButton>
        <Button variant="outlined" onClick={() => {
//          let t = window.prompt('Enter the title.');
//          let c = window.prompt('Enter the content.');
//          this.newArticle(t,c);
            this.handleOpen();
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
        {this.state.loading ? !this.state.daiBal ? 
          <div align="center"><p>Insufficient Dai balance! Swap 0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa (DAI) at uniswap.</p></div> :
          <div align="center"><p>Loading ... </p></div> : 
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
           <Content />
          </Grid>
        </main> }
      </Container>
      <Footer title="Footer" description="Something here to give the footer a purpose!" />
      <div id='form'>  
        <Dialog open={this.state.show} onClose={this.handleClose} maxWidth='md' fullWidth aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Submit Article</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin="dense" id="name" label="Title" fullWidth 
          onChange={(e) => {e.preventDefault(); this.setState({title: e.target.value})}}
          />
          <TextField autoFocus margin="dense" id="name" label="Content" multiline rows={8} fullWidth
          onChange={(e) => {e.preventDefault(); this.setState({content: e.target.value})}}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => this.handleClose()} color="primary">
            Cancel
          </Button>
          <Button onClick={() => {this.handleClose(); this.newArticle(this.state.title, this.state.content);}} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      </div>
      <div id='info'>  
        <Dialog open={this.state.show1} onClose={this.handleClose1} maxWidth='sm' fullWidth aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Information</DialogTitle>
        <DialogContent>
          <Typography>- Deployed at Rinkeby Testnet.</Typography>
          <Typography>- Users are expected to deposite 1 DAI when they subscribe to the blog.</Typography>
          <Typography>- If you don't have the time, just send some ETH to <strong>dai.inotime.eth</strong> and instantly recieve back some DAI! (0.01 ETH ~ 1 DAI)</Typography>
          <Typography>- It uses UNISWAP V2 for the exachange.</Typography>
          <Typography>- This is deposited at Compound to gain further interest.</Typography>
          <Typography>- Anyone can post articles, and readers can support writers through the platform. After a user gets a certain number of likes (currently 1), they advance to the position of content creater.</Typography>
          <Typography>- Profits each month are distributed proportionally among all Content Creaters.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => this.handleClose1()} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      </div>
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


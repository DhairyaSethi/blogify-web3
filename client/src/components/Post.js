import React, { Component } from 'react'
import { Grid, withStyles, Container, Typography } from '@material-ui/core'
import axios from 'axios'
import { dbURL } from '../Config'
import Loader from 'react-loader-spinner';
import {Link} from 'react-router-dom';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';

const styles = theme => ({
	mainGrid: {
    marginTop: theme.spacing(3),
  },
});



class Post extends Component {

	async componentWillMount() {
		let res = await axios.get(dbURL + '/' + this.props.match.params.id);
		console.log('post fetched! ')
		this.setState({loading: false, by: res.data.by, title: res.data.title, content: res.data.content})
		console.log('PROPSSS ', this.props)

	}

	constructor(props) {
		super(props)
		this.state = {
			loading: true,
			by: '',
			content: '',
			title: ''
		}
	}


	render () {
		const {classes} = this.props;
		const {by, title, content} = this.state;
		return (
			<Grid container spacing={5} className={classes.mainGrid}>
				<Container variant="h6">
					<Link to='/' ><KeyboardBackspaceIcon /></Link> <br />
					{
						this.state.loading ? 
						<div align='center'>
							<Loader type="MutatingDots" color="#00BFFF" height={180} width={180} />
						</div> :
						<div> 
				            <Typography variant='h3' align='center'> {title} </Typography>
				            <Typography align='center'> By - {by} </Typography> <br />
					        <Typography paragraph={true}> {content} </Typography>
			        	</div>
		    		}
	        	</Container>
	        </Grid>
		)
	}
}

export default withStyles(styles)(Post)
import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
//import Button from '@material-ui/core/Button';


const posts = [{
  'title' : 'Global Warming',
  'by' : '0xA070f47A6B6F2b19E334d5659A608d5d8e7f8f8c',
  'content' : "his blog post shows a few different types of content that are supported and styled with Material styles. Basic typography, images, and code are all supported.You can extend these by modifying `Markdown.js`."  
},
{
  'title' : 'PenTesting Tutorial',
  'by' : '0x119Ca1626c5610d9547811B017Ce9e5FA0C5fC53',
  'content' : "his blog post shows a few different types of content that are supported and styled with Material styles. Basic typography, images, and code are all supported.You can extend these by modifying `Markdown.js`."  
}]

export default class Content extends Component {


	render() {
		return (
			<Container>
			{posts.map(postie => {
			return (<div>
				<div align = 'center'>
		            <Typography align='center' variant='h3'> {postie.title} </Typography>
		            <Typography> By - {postie.by} </Typography>
		        </div>
		            <Typography paragraph='true'> {postie.content} </Typography>
	        </div>);
	    	})}
	        </Container>

			);
	}

}

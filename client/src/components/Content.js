import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import axios from 'axios';
// import Grid from '@material-ui/core/Grid';

//import Button from '@material-ui/core/Button';


// const posts = [{
//   'title' : 'Global Warming',
//   'by' : '0xA070f47A6B6F2b19E334d5659A608d5d8e7f8f8c',
//   'content' : "his blog post shows a few different types of content that are supported and styled with Material styles. Basic typography, images, and code are all supported.You can extend these by modifying `Markdown.js`."  
// },
// {
//   'title' : 'PenTesting Tutorial',
//   'by' : '0x119Ca1626c5610d9547811B017Ce9e5FA0C5fC53',
//   'content' : "his blog post shows a few different types of content that are supported and styled with Material styles. Basic typography, images, and code are all supported.You can extend these by modifying `Markdown.js`."  
// }]
let posts = []

export default class Content extends Component {


	componentDidMount() {
		this.getData()
	}

	async getData() {
		/*
		let xhr = new XMLHttpRequest()
		xhr.addEventListener('load', () => {
			console.log(xhr.responseText)
		})
		xhr.open('GET', 'http://127.0.0.1:5000/posts')
		xhr.send()
		*/
		// const res = await axios.post(
		//   'http://localhost:5000/posts',
		//   { 
		//   	title: 'PenTesting',
		//   	by: '0x119Ca1626c5610d9547811B017Ce9e5FA0C5fC53',
		//   	content: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.'
		//    },
		//   { headers: { 'Content-Type': 'application/json' } }
		// )
		// console.log('POST DATA RESPONSE ==>', res)

		const response = await axios.get('http://localhost:5000/posts')
		console.log(response.data)
		posts = response.data;
		console.log('POSTS VAR ==>', posts)
	}


	render() {
		return (
			<Container variant="h6" gutterBottom>
			<Typography>More from the FireHouse</Typography>
			{posts.map(postie => {
			return (
				<div>
					<div align = 'center'>
			            <Typography align='center' variant='h3'> {postie.title} </Typography>
			            <Typography> By - {postie.by} </Typography>
			        </div>
			        <Typography paragraph='true'> {postie.content} </Typography>
	        	</div>
	        );
	    	})}
	        </Container>

		);
	}

}

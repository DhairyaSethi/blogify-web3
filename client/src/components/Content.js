import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import axios from 'axios';
import { dbURL } from '../Config';
import Loader from 'react-loader-spinner';

let posts = []

export default class Content extends Component {

	constructor() {
		super()
		this.state = {
			loading: true
		}
	}

	async componentDidMount() {
		await this.getData()
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

		const response = await axios.get(dbURL)
		posts = response.data;
		console.log('posts fetched ', posts)
		this.setState({loading: false })
	}


	render() {
		return (
			<Container variant="h6" gutterBottom>
			<Typography>More from the FireHouse</Typography> <br />
			{this.state.loading ? <div align='center'><Loader type="ThreeDots" color="#00BFFF" height={150} width={150} /></div>:
			posts.map(post => {
				return (
					<div>
			            <Typography variant='h3' align='center'> {post.title} </Typography>
			            <Typography align='center'> By - {post.by} </Typography> <br />
				        <Typography paragraph='true'> {post.content} </Typography>
		        	</div>
	        );
	    	})}
	        </Container>

		);
	}

}

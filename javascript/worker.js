const axios = require('axios');

const apiMaxId = 150;
const baseUrl = "https://pokeapi.co/api/v2/pokemon"

onmessage = (e) => {
	if(e.data == 'fetch') {
	    let id = (Math.floor(Math.random() * Math.floor(apiMaxId))) + 1
	    axios.get(baseUrl + '/' + id)
	         .then(response => (postMessage(
	         	{
	         		todo: 'fetch',
	         		data: response.data 
	         	})))
	} else if(e.data == 'init') {
		axios.get(baseUrl + '?limit=150')
			 .then(response => (postMessage( 
			 	{
			 		todo: 'init',
			 		data: response.data
				})))
	}
}
const axios = require('axios');

const apiMaxId = 150;
const baseUrl = "https://pokeapi.co/api/v2/pokemon/"

onmessage = (e) => {
    let id = (Math.floor(Math.random() * Math.floor(apiMaxId))) + 1
    axios.get(baseUrl + id)
         .then(response => (postMessage(response.data)))
}
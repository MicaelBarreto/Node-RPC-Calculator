const express = require("express");
const app = express();
var http = require('http').Server(app);
require('dotenv/config');

const PORT = process.env.PORT || 80;

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.use('/scripts', express.static(__dirname + '/scripts'));

http.listen(PORT, () => {
    console.log('Client up and running');
});
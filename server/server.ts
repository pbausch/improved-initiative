/// <reference path="../typings/node/node.d.ts" />
/// <reference path="../typings/express/express.d.ts" />

import express = require('express');
var bodyParser = require('body-parser');

var port = process.env.PORT || 80;
var app = express();
var encounters = [];

var newEncounterId = (): number => {
	var newId = encounters.length;
	encounters[newId] = {};
	return newId;
}

app.use(express.static(__dirname + '/', {index: false}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
	var encounterId = newEncounterId();
    res.redirect('/e/' + encounterId);
});

app.get('/e/:id', (req, res) => {
	res.sendFile('index.html', {
		root: __dirname		
	});
})

app.route('/encounters/:id')
.get((req, res) => {
	res.json(encounters[req.params.id])
})
.post((req, res) => {
	encounters[req.params.id] = req.body;
	res.status(200).end();
})

var server = app.listen(port, () => {
	var host = server.address().address;
  	var port = server.address().port;

	console.log('Improved Initiative snarfing at http://%s:%s', host, port);
})
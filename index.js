var express = require('express');
var path = require('path');
var mongo = require('mongodb');
var routes = require('./app/routes/index.js');
var api = require('./app/api/url-shortener.js');
require('dotenv').config({
	silent : true
});

var app = express();
mongo.MongoClient.connect(process.env.MONGOLAB_URI || 'mongodb://localhost:27017/url-shortener', function(err, db){
	if(err){
		throw new Erro('Failed to connect');
	} else {
		console.log('Successfully connected');
	}


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

db.createCollection('sites', {
	capped : true,
	size : 5242880,
	max : 5000
});

routes(app, db);
api(app, db);

var port = process.env.PORT || 3000;
app.listen(port, function(){
	console.log('Server listening on port : '+port);
})


});








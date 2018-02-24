// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();
var url = require('url');

var mongodb = require('mongodb');
var mongodburl = 'mongodb://localhost:27017/imagesearch';
//Note: when using localhost, just comment out the line below and use the line above...
//var mongodburl = process.env.SECRET;


var giphy = require('giphy-api')();

app.use(express.static('public'));

app.use(function(req, res){
  
  var pathname = url.parse(req.url).pathname;
  pathname = pathname.toLowerCase();
   
  var output = {};

  if (pathname.substring(0, 16) == "/api/imagesearch") {

  	//we need to find the search query and the offset
  	var searchQuery = pathname.substring(17, pathname.length);
  	var offset = req.query.offset;
    var timestamp = new Date();
 
    mongodb.MongoClient.connect(mongodburl, function (err, db) {
    	if (err) {
      		console.log('Unable to connect to the mongoDB server. Error:', err);
      		output = {'error': "couldn't connect to MongoDB"};
    	} 
    	else {
      		//Successfully connected to MongoDB
      		console.log('Connected to MongoDB');
      		//console.log(db);

      		var collection = db.db('imagesearch');
      		
    	
    		collection.collection('searches').insert(
            	{ 'term' : searchQuery, 'when': timestamp}, 
            	function(err, documents) {
            	console.log(err);
            	if (err) throw err;
            	//Close connection
            	db.close();  
         	});
		}
    });  

    giphy.search({
      q: searchQuery,
      limit: offset,
      rating: 'g'
      }, function (err, results) {
      	// results contains gif data! 

     	if (err) {
     		output = {'there was an error' : err};
     	}
     	else{

      		for (var i=0; i<results.data.length; i++) {
				//We need to ouput: url, snippet, thumbnail (which is another url) and context 
        	 	var newtitle = results.data[i].title;
        		var newurl = results.data[i].url;
        		var newsource = results.data[i].source;
        		output[i] = {'url':newurl, 'title' : newtitle, 'source' : newsource};
      		}
      	}  
    	res.send(output);
    });
 }

 else if (pathname.substring(0, 23) == "/api/latest/imagesearch"){

	 mongodb.MongoClient.connect(mongodburl, function (err, db) {
    	if (err) {
      		console.log('Unable to connect to the mongoDB server. Error:', err);
      		output = {'error': "couldn't connect to MongoDB"};
    	} 
    	else {
      		//Successfully connected to MongoDB
      		console.log('Connected to MongoDB');

      		var collection = db.db('imagesearch');
    		
    		var results = collection.collection('searches').find().sort({when:-1}).limit(10).toArray(function(err, docs){
    			if (err) throw err;

    			//Note: this is working!!
    			//Go through the array (docs) and do output, then res.send(output)!
    			for (var j=0; j < docs.length; j++){
    				//Note: not sure if this below works; need to test!
    				output[j] = {'term':docs[j]['term'], 'when' : docs[j]['when']};
    			}
    			res.send(output);
    			db.close;
    		});
      	}
 	});  
 }    

 else {

   output = {
     "error" : "Please make sure your pathname follows the https://image-search-e.glitch.me/api/imagesearch/lolcats%20funny?offset=10 or https://image-search-e.glitch.me/api/latest/imagesearch/ format"
   }
   res.send(output);
 }  

  
});


// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

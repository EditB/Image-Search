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


//var googleImgSearch = require('free-google-image-search');
//var imageSearch = require('node-google-image-search');
//var search = require('image-search'); 
//var gifSearch = require('gif-search');
var giphy = require('giphy-api')();

app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
/*
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});
*/

app.use(function(req, res){
  
  var pathname = url.parse(req.url).pathname;
  pathname = pathname.toLowerCase();
  //console.log('pathname: ' + pathname);
  //console.log('pathname beginning: ' + pathname.substring(0, 16));
  //console.log("pathname end: " + pathname.substring(17, pathname.length));

  
  //console.log(req.url);
  // console.log('query is below');
  // console.log(req.query);
  
  var output = {};

  if (pathname.substring(0, 16) == "/api/imagesearch") {

console.log('in if 1');
  	//we need to find the search query and the offset
  	var searchQuery = pathname.substring(17, pathname.length);
  	//Note: might need to turn this into an int as it is probably a string from the url...
  	var offset = req.query.offset;
   // var timestamp = new Date().toDateString();
    var timestamp = new Date();
    console.log('timestamp: ' + timestamp);
    //console.log('new date: ' + timestamp.getTime());




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

    
    //console.log(req);
 /*
    var output = {
      "1":{ "test": "this is test",
            "testNext" : "this is the second item"},
      "2":{"test2" : "this is the second test"}
    };
  */
  //var output = {};
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
        //var tempoutput = {[i]: {'url':newurl, 'title' : newtitle}};
        output[i] = {'url':newurl, 'title' : newtitle, 'source' : newsource};
        
      }

      //Here we need to save the term we searched for (i.e. searchQuery and the timestamp)

    }  
      //console.log('output: '+JSON.stringify(output));
      //console.log('output: '+output);
      res.send(output);

  	
      
    });
 }

 else if (pathname.substring(0, 23) == "/api/latest/imagesearch"){
 	console.log('in else if 2');

 	//Find and display the 10 latest records
//db.searches.find().sort({when:-1}).limit(10);

 mongodb.MongoClient.connect(mongodburl, function (err, db) {
    	if (err) {
      		console.log('Unable to connect to the mongoDB server. Error:', err);
      		output = {'error': "couldn't connect to MongoDB"};
    	} 
    	else {
      		//Successfully connected to MongoDB
      		console.log('Connected to MongoDB');
      		//output={'note' : 'Latest Imagesearch'};
      		//console.log(db);

      		var collection = db.db('imagesearch');
      		
    		//var results = collection.collection('searches').find().sort({when:-1}).limit(10).toArray();
    		//console.log('results' + JSON.stringify(results));
    		//console.log('results: ' + results);
    		
    		var results = collection.collection('searches').find().sort({when:-1}).limit(10).toArray(function(err, docs){
    			if (err) throw err;
    			console.log(docs);

    			//Note: this is working!!
    			//Go through the array (docs) and do output, then res.send(output)!
    			for (var j=0; j < docs.length; j++){
    				//Note: not sure if this below works; need to test!
    				output[j] = {'term':docs[j]['term'], 'when' : docs[j]['when']};
    				console.log(output[j]);
    			}
    			res.send(output);
    			db.close;
    		});


    		
    		//console.log(results.length);
    		//console.log(results);
    		//Note: results.length is undefined!
			//console.log(results.length);
    		//var counter = 0;
    		//var results = collection.collection('searches').find().sort({when:-1}).limit(10);
    		//console.log('created results');
    		
    		
    		//console.log(results.count());
/*    		
results.count()
    .then(function(numItems) {
      console.log(numItems); // Use this to debug
      callback(numItems){

      	    results.forEach(function(err, result) {

    			if (err) throw err;

				var term = result.term;
				var when = result.when;
    			output[counter] = {'term':term, 'when' : when};
    			console.log(output);
    			//console.log(result);
            	//console.log(result.term);
            	//console.log(result.when);
            	counter++;

            	if (counter == numItems){
            		console.log('finished loop');
            		console.log(output);
            	}
        	});


      };
    })

    		results.forEach(function(err, result) {

    			if (err) throw err;

				var term = result.term;
				var when = result.when;
    			output[counter] = {'term':term, 'when' : when};
    			console.log(output);
    			//console.log(result);
            	//console.log(result.term);
            	//console.log(result.when);
            	counter++;


        	});
			*/
    		//console.log('after forEach');

			/*
			for (var i=0; i < results.length; i++){
				console.log('i:' + i);
				output[i] = {'term':results[i].term, 'when' : results[i].when};
        
			}
			*/
			//console.log(output);
			

			//res.send(output);
    		//Close connection
            //db.close(); 

    		/*
    		collection.collection('searches').insert(
            	{ 'term' : searchQuery, 'when': timestamp}, 
            	function(err, documents) {
            	console.log(err);
            	if (err) throw err;
            	//Close connection
            	db.close();  
         	});
         	*/
		}
    });  

 	
 	
 }      
 else {

 	console.log('in else 3');
   output = {
     "error" : "Please make sure your pathname follows the https://image-search-e.glitch.me/api/imagesearch/lolcats%20funny?offset=10 or https://image-search-e.glitch.me/api/latest/imagesearch/ format"
   }
   res.send(output);
 }  

 //console.log('output2: ' + output);

  //res.send(output);
  //res.json(output);

  
});


// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

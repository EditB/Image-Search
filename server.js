// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();
var url = require('url');

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
     
      //if (err) throw err;

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

 	output={
 		'note' : 'Latest Imagesearch' 
 	};
 	res.send(output);
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

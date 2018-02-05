// server.js

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
  console.log('pathname: ' + pathname);
  //console.log(req.url);
  console.log(req.query);
  
  //if (pathname.substring(0, 16) == "/api/imagesearch") {
    
    
    //console.log(req);
  /*
    var output = {
      "1":{ "test": "this is test",
            "testNext" : "this is the second item"},
      "2":{"test2" : "this is the second test"}
    };
  */
  var output = {};
    giphy.search({
      q: 'horse',
      limit: 2,
      rating: 'g'
    }, function (err, results) {
      // Res contains gif data! 
      if (err) throw err;
      for (var i=0; i<results.data.length; i++) {
        console.log("in for loop");
        console.log(results.data[i].url);
        console.log('i: ' + i);
        
        
        var newurl = results.data[i].url;
        var tempoutput = {[i]: {'url':newurl}};
      //output[tempoutput] = {}; 
        
        //output[i] = tempoutput;
        output[i] = newurl;
        //output[i]['url'] = results.data[i].url;
        //output[i]["new_key"] = "new_value";
        
      }
      
      //console.log(JSON.stringify(output));
      console.log(output);
      //res.send(JSON.stringify(output));
      res.json(output);
      
    });
  
/* 

 }
 else if (pathname.substring(0, 23) == "/api/latest/imagesearch"){


 }      
 else {
   output = {
     "error" : "Please make sure your pathname follows the https://image-search-e.glitch.me/api/imagesearch/lolcats%20funny?offset=10 or https://image-search-e.glitch.me/api/latest/imagesearch/ format"
   }
 }  
  */
  //res.send(output);
  
});


// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

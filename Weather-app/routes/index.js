/**
 * @author Heni Ghodbane
 */
var express = require('express');
var http = require('http');
var https = require('https');
var router = express.Router();
var Handlebars= require('handlebars');

var img = {};
    img["Breezy"] = "images/icons/icon-1.svg";
    img["Hot"] = "images/icons/icon-2.svg";
    img["Sunny"] = "images/icons/icon-3.svg";
    img["Showers"] = "images/icons/icon-4.svg";
    img["Partly Cloudy"] = "images/icons/icon-5.svg";
    img["Mostly Cloudy"] = "images/icons/icon-6.svg";
    img["Foggy"] = "images/icons/icon-7.svg";
    img["Tornado"] = "images/icons/icon-8.svg";
    img["Scattered Showers"] = "images/icons/icon-9.svg";
    img["Rain And Snow"] = "images/icons/icon-10.svg";
    img["Rain"] = "images/icons/icon-11.svg";
    img["Hail"] = "images/icons/icon-12.svg";
    img["Showers"] = "images/icons/icon-13.svg";
    img["Heavy Snow"] = "images/icons/icon-14.svg";

// GET home page.
router.get('/', function(req, res, next) {
    
  var forecast = [];
  var city = '';
  var country = '';
  var direction = '';
  var speed = '';
  var humidity = '';
  var temp = '';
  var url = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22nome%2C%20ak%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys';
  
  //get the JSON data with http get methode
  https.get(url, function(restRes){
    var body = '';

    restRes.on('data', function(chunk){
        body += chunk;
    });

    restRes.on('end', function(){
        var JSONResponse = JSON.parse(body);

        city = JSONResponse.query.results.channel.location.city;
        country = JSONResponse.query.results.channel.location.country;
        temp = JSONResponse.query.results.channel.item.condition.temp;        
        direction = JSONResponse.query.results.channel.wind.direction;        
        speed = JSONResponse.query.results.channel.wind.speed;        
        humidity = JSONResponse.query.results.channel.atmosphere.humidity;        
        //forecast for the next 10 days
        forecast = JSONResponse.query.results.channel.item.forecast;        
        
        //return data to the index page
        res.render('weather/index', {
          direction: direction,
          speed: speed,
          humidity:humidity,
          temp:temp,
          city: city,
          country: country,
          //get only 3 next days    
          forecast: forecast.slice(0,3),
          img: img
        });


    });
}).on('error', function(e){
      console.log("Got an error: ", e);
});
 
});

//Handlebars for the formating date
Handlebars.registerHelper('dateFormate', function(title) {
  var t = title.split(" ");
  return t[0] +" "+ t[1];
});

//Handlebars to get the imageUrl by key (weather name) 
Handlebars.registerHelper('imgUrl', function(state) {
  return img[state];
});


module.exports = router;

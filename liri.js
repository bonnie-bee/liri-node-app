//.env file
require('dotenv').config();

//the twitter and spotify keys
const keys = require('./keys.js');

//the various packages I'm using
const Twitter = require('twitter');
const Spotify = require('node-spotify-api');
const request = require('request');
const moment = require('moment');
const fs = require("fs");

//setting the keys for twiiter and spotify
const spotify = new Spotify(keys.spotify);
const client = new Twitter(keys.twitter);

//function to call my tweets and display them
function myTweets(){
  let params = {count: 10}
  client.get('statuses/user_timeline', params, function(error, tweets, response) {
    if(error) throw error;
    for (let i=0; i<10; i++){
      let time = tweets[i].created_at;
    console.log(`On ${moment(time).format("MMMM Do YYYY, h:mm")} Pendragon tweeted: "${tweets[i].text}"` );  
    }
  });
};

//function to grab movies and display their info
function movieThis(){
  let movieTitle="";
  if (process.argv[3] != null){
    for (var i = 3; i < process.argv.length; i++) {
      if (i > 3 && i < process.argv.length) {
        movieTitle = movieTitle + "+" + process.argv[i];
      } else {
        movieTitle += process.argv[i];
      }
    }
  } else {
    movieTitle = 'Mr.Nobody'
  }
  const omdbApi = `http://www.omdbapi.com/?apikey=trilogy&t=${movieTitle}`
  request(omdbApi, function (error, response, body) {
    if(error){console.log('error:', error);}
    let info= JSON.parse(body)
    console.log(
    `    Title: ${info.Title}
    Year: ${info.Year}
    Imdb Rating: ${info.Ratings[0].Value}
    Rotten Tomatoes Rating: ${info.Ratings[1].Value}
    Country of Origin: ${info.Country}
    Language: ${info.Language}
    Plot: ${info.Title}
    Actors: ${info.Actors}`)
  });
}

//set the songTitle variable so it can use user input and random.txt
let songTitle = "";
  if (process.argv[3] != null){
    for (var i = 3; i < process.argv.length; i++) {
      if (i > 3 && i < process.argv.length) {
        songTitle = songTitle + "+" + process.argv[i];
      } else {
        songTitle += process.argv[i];
      }
    }
  } else {
    songTitle = 'The Sign'
  }

//Search for songs on spotify and display its info
function spotifyThis(songTitle){
  spotify.search({ type: 'track', query: songTitle, limit: 1 }, function(err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }
   let trackInfo=data.tracks.items[0].album
   
  console.log(
    `     Artist: ${trackInfo.artists[0].name}
     Song Name: ${songTitle}
     Spotify Link: ${trackInfo.external_urls.spotify}
     Album Name: ${trackInfo.name}`
  );
});
}


function doThis(){
fs.readFile("random.txt", "utf8", function(error, data) {
  if (error) {
    return console.log(error);
  }
  var dataArr = data.split(",");
  console.log(dataArr);
  spotifyThis(dataArr[1])

});

}




//setting the node validation
if(process.argv[2] === 'my-tweets'){
myTweets();
} else if(process.argv[2] === 'movie-this'){
movieThis();
} else if(process.argv[2] === 'spotify-this-song'){
  spotifyThis(songTitle);
} else if(process.argv[2] === 'do-what-this-says'){
  doThis();
}
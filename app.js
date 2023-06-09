require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const spotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new spotifyWebApi ({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: process.env.REDIRECT_URI,
});
spotifyApi
            .clientCredentialsGrant()
            .then(data => {
                spotifyApi
                .setAccessToken(data.body['access_token'])
                })
            .catch(error => console.log('something went wrong when retrieving an access token', error))

// Our routes go here:
app.get('/', (req, res) => {
    res.render('HomePage');
})
app.get('/artist-search', (req, res) => {
    const { artist } = req.query; // Get the search term from the query string
    spotifyApi
        .searchArtists(artist) // Pass the search term to the searchArtists() method
        .then(data => {
        const artists = data.body.artists; // Get the artists from the response
        res.render('artist-search-results', { artists }); // Render the artist-search-results.hbs template
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
    });

app.get('/albums/:artistId', (req, res, next) => {
    const {artistId} = req.params;
    spotifyApi
                .getArtistAlbums(artistId)
                .then (data => {
                    const albumsData = data.body.items;
                    res.render('albums', {albumsData});
                })
                .catch(err => console.log('The error while searching artists occurred: ', err));
});


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));

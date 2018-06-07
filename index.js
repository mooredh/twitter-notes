const url = require('url');
const express = require('express');
const authenticator = require('./authenticator');
const config = require('./config.json')
let app = express();
const PORT = process.env.PORT || config.port;

// Add cookie parsing functionality to our express app
app.use(require('cookie-parser'));

// Take user to Twitter's login page
app.get('/auth/twitter', authenticator.redirectToTwitterLoginPage);

// This is the callback url that the user is redirected to after signing in
app.get(url.parse(config.oauth_callback).path, (req, res) => {
    authenticator.authenticate(req, res, (err) => {
        if (err) {
            console.log(err);
            res.sendStatus(401);
        } else {
            res.send("Authentication successful");
        }
    });
});

// Start listening for requests 
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
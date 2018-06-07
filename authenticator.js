const OAuth = require('oauth').OAuth;
const config = require('./config.json');

// Create the oauth object for accessing twitter 
let oauth = new OAuth(
    config.request_token_url,
    config.access_token_url,
    config.consumer_key,
    config.consumer_secret,
    config.oauth_version,
    config.oauth_callback,
    config.oauth_signature
);

module.exports = {
    redirectToTwitterLoginPage: (req, res) => {
        // Ask Twitter for request token
        oauth.getOAuthAccessToken((error, oauth_token, oath_token_secret, results) => {
            if (error) {
                console.log(error);
                res.send("Authentication failed");
            } else {
                // Use the request token to take client to twitter login page
                res.cookie('oauth_token', oauth_token, { httpOnly: true });
                res.cookie('oauth_token_secret', oauth_token_secret, { httpOnly: true });
                res.redirect(config.authorize_url + '?oauth+token=' + oauth_token);
            }
        });
    },

    authenticate: (req, res, cb) => {
        // Check if the request token and temporary credential are there
        if (!(req.cookies.oauth_token && req.cookies.oauth_token_secret && req.query.oauth_verifier)) {
            return cb("Request does not have all required keys");
        }

        // Clear  the request token cookies
        res.clearCookie('oauth_token');;
        res.clearCookie('oauth_token_secret');

        // Tell the router that authentication was successful
        cb();
    }
}
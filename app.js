var express = require('express')
  , OAuth2  = require('oauth').OAuth2
  , app     = express()
  , client  = {}
  , oauth;


/**
 * Client Details
 */

client.id           = 'CLIENT_ID';
client.secret       = 'CLIENT_SECRET';
client.redirectUri  = 'CLIENT_CALLBACK_URL';


/**
 * OAuth2 Setup
 */

oauth2 = new OAuth2(
  client.id,
  client.secret,
  'https://cr-api-staging.herokuapp.com'
);


// ---------------------------------------------------------------------------


/**
 *
 */

app.get('/', function (req, res) {
  res.send('<a href="/auth">Auth</a>');
});


/**
 *
 */

app.get('/auth', function (req, res) {
  res.redirect(oauth2.getAuthorizeUrl({
    response_type:  'code',
    scope:          ['write'],
    redirect_uri:   client.redirectUri
  }));
});


/**
 *
 */

app.all('/callback', function (req, res) {
  oauth2.getOAuthAccessToken(req.query.code, {
    grant_type:   'authorization_code',
    redirect_uri: client.redirectUri
  }, function (err, accessToken, refreshToken, results) {
    if (err) return res.json(err);
    res.redirect('/made_it?access_token=' + accessToken);
  });
});


/**
 *
 */

app.get('/made_it', function (req, res) {
  res.send('you made it, access token: ' + req.query.access_token);
});



/**
 *
 */

console.log('oauth2-example-app listening at http://localhost:3001/ ...');
app.listen(3001);

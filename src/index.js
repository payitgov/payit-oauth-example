const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const app = express();
const { v4: uuidv4 } = require('uuid');
const { PayitOauthServer } = require('payit-oauth-sdk');
require('dotenv').config();
console.log('process.env.PAYIT_CLIENT_ID', process.env.PAYIT_CLIENT_ID);

// Set EJS as view engine
app.set('view engine', 'ejs');

console.log('__dirname', __dirname);
// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, '..', 'public')));

// Use cookie-parser middleware
app.use(cookieParser());

// In-memore storage for sessions and PayitOauth Tokens
const tokenStore = {};

app.get('/', (req, res) => {
    res.render('index', { clientId: process.env.PAYIT_CLIENT_ID });
});

app.get('/callback', async (req, res) => {
    const { code, state, } = req.query;
    if (!code) {
        res.status(400).send('Invalid code');
        return;
    }
    let callbackUri = req.protocol + '://' + req.get('host') + req.originalUrl;
    callbackUri = callbackUri.split('?')[0]; // drop query params

    const payItToken = await PayitOauthServer.getToken(process.env.PAYIT_CLIENT_ID, process.env.PAYIT_CLIENT_SECRET, code, callbackUri, 'development');

    // Generate a clientside token
    const serverToken = uuidv4();

    // Set the token as a cookie
    res.cookie('auth_token', serverToken, { httpOnly: true });

    // Associate the client-side token with the PayIT Oauth token
    tokenStore[serverToken] = payItToken;

    res.redirect(`/loggedIn?state=${state}`);
});

app.get('/loggedIn', isAuthenticated, (req, res) => {
    res.render('loggedIn', { clientId: process.env.PAYIT_CLIENT_ID });
});

app.post('/logout', (req, res) => {
    const token = req.cookies['auth_token'];
    delete tokenStore[token];
    res.clearCookie('auth_token');
    res.json({ success: true });
});

app.listen(8080, () => {
    console.log('Server is running on port 8080');
});

// Middleware to check if user is authenticated
function isAuthenticated(req, res, next) {
    const token = req.cookies['auth_token'];
    if (tokenStore && tokenStore[token]) {
        return next();
    }
    res.status(401).send('Unauthorized');
}
// Get dependencies
const express = require('express');
const path = require('path');
const mongoose = require("mongoose");
//const http = require('http');
const bodyParser = require('body-parser');

// Get our API routes
const api = require('./routes/routes/api');
const auth = require('./routes/routes/auth');
const authg = require('./routes/routes/authg');
const user = require('./routes/routes/user');
const app = express();
const refreshRoutes = express.Router();

//==================CONNECT TO DB==========================
const testConfig = require('config'); //we load the db location from the JSON files
const options = {
  server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
  replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } }
};

mongoose.connect(testConfig.DBHost, options); //connect to database
//mongoose.connect("mongodb://heroku_w6qmkrvx:incbup7qafnnktd5fnvqvl43dq@ds161304.mlab.com:61304/heroku_w6qmkrvx", options);


const db = mongoose.connection;
db.on("error", (err) => {
  console.error("connection error:", err);
});
db.once("open", () => {
  console.log("db connection successful");
});

//===================CONFIGURE===========================
// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Add headers
app.use((req, response, next) => { 
    // Website you wish to allow to connect
  // var allowedOrigins = ['http://localhost:4200', 'https://angular2recipebox.herokuapp.com/'];
  // var origin = req.headers.origin;
  // if(allowedOrigins.indexOf(origin) > -1){
  //   console.log("yay");
  //   res.setHeader('Access-Control-Allow-Origin', origin);
  // }
  // else {
  //   console.log("oops");
  // }
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Credentials", "true");
  response.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  response.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
  next();
});

const forceSSL = function() {
  return function (req, res, next) {
    if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect(['https://', req.get('Host'), req.url].join(''));
    }
    next();
  }
}

//app.use(forceSSL());


// ==================STATIC REQUESTS====================
// Run the app by serving the static files
// in the dist directory
refreshRoutes.use(express.static(__dirname + '/dist'));

// For all GET requests, send back index.html
// so that PathLocationStrategy can be used
refreshRoutes.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname + '/dist/index.html'));
});

// ===================SET UP ROUTES==========================
app.use('/api', api);
app.use('/auth', auth);
app.use('/authg', authg);
app.use('/user', user);
app.use(refreshRoutes);

//===========================================================
//==========================================================
//catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

//Error Handler
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message
    }
  });
});

//====================START SERVER============================
const port = process.env.PORT || 8080;

//const server = http.createServer(app); //CHANGE BACK LISTEN WHEN NOT TESTING
app.listen(port, () => console.log(`API running on localhost:${port}`));

module.exports = app;

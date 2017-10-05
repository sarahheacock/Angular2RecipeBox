// Get dependencies
const express = require('express');
const path = require('path');
const mongoose = require("mongoose");
const http = require('http');
const bodyParser = require('body-parser');

// Get our API routes
const api = require('./server/routes/api');
const app = express();
const refreshRoutes = express.Router();

//==================CONNECT TO DB==========================
const testConfig = require('config'); //we load the db location from the JSON files
const options = {
  server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
  replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } }
};

mongoose.connect(testConfig.DBHost, options); //connect to database
// app.set('superSecret', config.secret); //set secret variable


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
app.use((req, res, next) => { 
    // Website you wish to allow to connect
  var allowedOrigins = ['http://localhost:4200', 'https://angular2recipebox.herokuapp.com/'];
  var origin = req.headers.origin;
  if(allowedOrigins.indexOf(origin) > -1){
       res.setHeader('Access-Control-Allow-Origin', origin);
  }
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

// app.use(forceSSL());

// ==================STATIC REQUESTS====================
refreshRoutes.use(express.static(path.resolve(__dirname, 'dist')));

refreshRoutes.get('*', function(request, response) {
  response.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});

// ===================SET UP ROUTES==========================
app.use('/api', api);
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
const port = process.env.PORT || '3000';
app.set('port', port);

const server = http.createServer(app); //CHANGE BACK LISTEN WHEN NOT TESTING
app.listen(port, () => console.log(`API running on localhost:${port}`));

module.exports = app;

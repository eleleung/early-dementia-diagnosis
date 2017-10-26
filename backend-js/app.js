/**
 * Created by EleanorLeung on 6/04/2017.
 */
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');
const ffmpeg = require('fluent-ffmpeg');

'use strict';

mongoose.connect(config.database);

// Check connection
mongoose.connection.on('connected', function(){
    console.log('Connected to db ' + config.database);
});

mongoose.connection.on('error', function(err){
    console.log('Database error ' + err);
});

const app = express();

const users = require('./routes/users');
const patients = require('./routes/patients');
const doctors = require('./routes/doctors');
const audio = require('./routes/transcriber');
const pictures = require('./routes/pictures');
const tests = require('./routes/tests');
const test_results = require('./routes/test_results');

// Port number
const port = 3000;

// CORS Middleware
app.use(cors());

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

// Set Static Folder (frontend)
app.use(express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use('/users', bodyParser.json());
app.use('/patients', bodyParser.json());
app.use('/doctors', bodyParser.json());
app.use('/test', bodyParser.json());

// Available routes
app.use('/users', users);
app.use('/patients', patients);
app.use('/doctors', doctors);
app.use('/transcriber', audio);
app.use('/pictures', pictures);
app.use('/tests', tests);
app.use('/test-results', test_results);

// Index Route
app.get('/', function(req, res){
   res.send('Invalid Endpoint');
});

app.get('*', function(req, res){
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Start Server
app.listen(port, function(){
    console.log('Server started on port ' + port);
});

module.exports = app;
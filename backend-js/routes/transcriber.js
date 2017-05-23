const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const passport = require('passport');
const ffmpeg = require('fluent-ffmpeg');
const multer  = require('multer');

// Multer options
var storage =   multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './uploads');
    },
    filename: function (req, file, callback) {
        callback(null,Date.now()+file.originalname);
    }
});

var upload = multer({ storage : storage}).single('upload_file');

router.post('/SendAudio', passport.authenticate('jwt', {session:false}), function(req, res) {
    console.log('audiopath: ', req.body._path);

    // TODO: implement sending of audio
    var fileName = './backend.flac';
    fs.createWriteStream(fileName);

    var proc = new ffmpeg({ source: req.body._path})
        .toFormat('flac')
        .saveToFile(fileName, function(stdout, stderr){
            console.log("file been converted");
        });

    proc.on('end', function () {
        var transcription = recognize(fileName);
        res.json({success: true, msg: transcription });
    });
});

router.post('/SendAudioFile', function(req, res){
    // Only use one method
    fs.writeFile('sample.m4a', function(err) {
        res.sendStatus(err ? 500 : 200);
    });

    request.pipe(fs.createWriteStream("out_file.m4a", { flags: 'w', encoding: null, fd: null, mode: 0666 }));
});

module.exports = router;

var SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1');
var fs = require('fs');

var speech_to_text = new SpeechToTextV1({
    username: 'e50a070e-bfa5-42e5-a89c-23de30b76671',
    password: 'K0Swn0d2rLkD'
});

recognize = function(path) {

    var params = {
        audio: fs.createReadStream(path),
        transfer_encoding: 'chunked',
        content_type: 'audio/flac',
    };

    speech_to_text.recognize(params, function (err, res) {
        if (err)
            console.log(err);
        else
            console.log(JSON.stringify(res, null, 2));
            return JSON.stringify(res, null, 2);
    });
};

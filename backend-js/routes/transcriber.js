
//const converter = require("../recogniser/transcriber");
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const passport = require('passport');


router.post('/SendAudio', passport.authenticate('jwt', {session:false}), function(req, res) {
    console.log('rec');
    console.log('audiopath: ', req.body);
    var transcription = recognize(req.body._path)
    console.log(transcription);
    res.json({success: true, msg: transcription });
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
        content_type: 'audio/mulaw;rate=16000',
    };

    speech_to_text.recognize(params, function (err, res) {
        if (err)
            console.log(err);
        else
            console.log(JSON.stringify(res, null, 2));
            return JSON.stringify(res, null, 2);
    });
}

/**
 * Created by EleanorLeung on 25/10/17.
 */
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const passport = require('passport');
const bodyParser = require('body-parser');
const ms = require('mediaserver');
const ffmpeg = require('fluent-ffmpeg');

const TestResult = require('../models/test_result');

router.post('/getCompletedPatientTests',[passport.authenticate('jwt', {session: false}), bodyParser.json()], function(req, res) {

    TestResult.getTestResultByPatientId(req.body.patientId, function(err, testResults){
        if (err || !testResults) {
            res.status(400);
            res.json({success: false, msg: "Could not find test result for patient"});
        }

        if (testResults) {
            res.json({success: true, testResults: testResults})
        }
    });
});

//BAD - should stream converted audio directly or check that the audio file has not already been converted
router.post('/audio', [passport.authenticate('jwt', {session:false}), bodyParser.json()], function(req, res) {

    const patientId = req.body.patientId;
    const filename = req.body.filename;
    const fullpath = `./data/${patientId}/${filename}`;

    const convertedFilename = fullpath.replace('.aac', '.wav');

    //Saves file as a WAV file
    const proc = new ffmpeg({ source: fullpath })
        .toFormat('wav')
        .saveToFile(convertedFilename, function(stdout, stderr) {
        });

    proc.on('end', function () {
        ms.pipe(req, res, convertedFilename);
    });
});

router.post('/image', [passport.authenticate('jwt', {session:false}), bodyParser.json()], function(req, res) {
    const patientId = req.body.patientId;
    const filename = req.body.filename;
    const fullpath = `./data/${patientId}/${filename}`;

    ms.pipe(req, res, fullpath);
});


module.exports = router;
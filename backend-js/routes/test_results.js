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

//BAD but may have to do for the purposes of demo
router.get('/audio', [passport.authenticate('jwt', {session:false}), bodyParser.json()], function(req, res) {
    const filename = req.body.filename;

    const convertedFilename = filename.replace('.flac', '.wav');

    const proc = new ffmpeg({ source: filename })
        .toFormat('wav')
        .saveToFile(convertedFilename, function(stdout, stderr) {
        });

    proc.on('end', function () {
        ms.pipe(req, res, convertedFilename);
    });
});


module.exports = router;
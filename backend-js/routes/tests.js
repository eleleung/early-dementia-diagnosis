/**
 * Created by EleanorLeung on 25/05/2017.
 */
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const passport = require('passport');
const multer = require('multer');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const mkdirp = require('mkdirp');
const bodyParser = require('body-parser');
const Test = require('../models/test');
const TestResult = require('../models/test_result');
const Patient = require('../models/patient');
const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        const json = JSON.parse(req.body.json);
        const patientId = json.patientId;
        const dir = `./data/${patientId}`;
        mkdirp(dir, function(err) {
            if (err) {
                console.log('Error creating directory');
            }
            callback(null, dir);
        });
    },
    filename: function (req, file, callback) {
        callback(null, Date.now()+file.originalname);
    }
});
const upload = multer({ storage: storage});
var SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1');
var speech_to_text = new SpeechToTextV1({
    username: 'e1ef4ae6-62c3-44db-9f8a-67536ed7590b',
    password: 'zwcQvPsycwie'
});

router.post('/getPatientTests', [passport.authenticate('jwt', {session:false}), bodyParser.json()], function(req, res) {
    Patient.getPatientById(req.body.patientId, function(err, patient) {
        if (err || patient === null) {
            res.status(400);
            res.json({success: false, msgs: 'Failed to find patient with id: ' + req.body.patientId});
        } else {
            //If the patient exists, retrieve tests for this patient
            Test.getAllTestsWithIds(patient.tests, function (err, tests) {
                if (err) {
                    res.status(400);
                    res.json({success: false, msgs: 'Failed to fetch tests'});
                }
                else {
                    res.json({success: true, msg: 'Success', tests: tests});
                }
            });
        }
    });
});

router.get('/getUserTests', [passport.authenticate('jwt', {session:false})], function(req, res) {
    Test.getAllTestsWithIds(req.user.tests, function(err, tests){
        if (err) {
            res.status(400);
            res.json({success: false, msg: 'Failed to fetch test'});
        }
        else {
            res.json({success: true, msg: 'Success', tests: tests});
        }
    });
});

router.post('/saveTest', [passport.authenticate('jwt', {session: false}), bodyParser.json()], function(req, res) {
    const test = req.body;

    if (test.userId !== req.user.id) {
        res.status(401);
        res.json({success: false, msg: 'Not authorised to save a test for this user'});
    } else {

        const newTest = new Test({
            name: test.testName,
            description: test.description,
            components: test.components,
            dateCreated: new Date(),
            creator: test.userId
        });

        Test.addTest(newTest, function (err, test) {
            if (err) {
                res.status(400);
                res.json({success: false, msg: 'Failed to save test'});
            }
            else {
                res.json({success: true, msg: 'Created test'});
            }
        });
    }
});

/*
*   This method receives multipart form data and saves the files to upload directory.
*   It then converts any audio files to flac format and re-saves them in a new directory.
*   It should then delete the original file.
* */
router.post('/submit_test', [passport.authenticate('jwt', {session:false}), upload.array('file')], function(req, res) {
    const json = JSON.parse(req.body.json);
    const testId = json.testId;
    const patientId = json.patientId;
    let results = json.results;

    const dir = getFilePathFromRequest(req);

    let promises = [];

    for (let index = 0; index < results.length; index++)
    {
        let result = results[index];

        if (result.type === 'audio') {
            promises.push(handleAudioSection(result, index, dir, req.files));
        }
        else if (result.type === 'image') {
            for (const file of req.files) {
                if (file.originalname === result.originalname) {
                    result.filename = file.filename;
                    break;
                }
            }

            //TODO: link result to new filename
        }
        else if (result.type === 'question') {
            //TODO: Implement QA Module
        }
    }

    Promise.all(promises).then( (trans) => {
        for (const tran of trans) {
            results[tran.index].transcribedString = tran.transcribedString;
            results[tran.index].filename = tran.filename;
        }

        let testResult = new TestResult({
            test : testId,
            componentResults: results,
            creator: req.user,
            patient: patientId,
            date: new Date()
        });


        TestResult.addTestResult(testResult, function(err, test){
            if (err) {
                throw err;
            }
            else {
                console.log('successful add');
            }
        });

    });

    res.json({success: true });
});

function getFilePathFromRequest(req, callback) {
    const json = JSON.parse(req.body.json);
    const patientId = json.patientId;
    return `./data/${patientId}`;
}

function handleAudioSection(result, index, dir, files) {
    return new Promise( function(resolve, reject) {

        //get file from files list
        let file = null;
        for (const tempFile of files) {
            if (tempFile.originalname === result.originalname) {
                file = tempFile;
                break;
            }
        }

        if (file && file.filename.indexOf('.aac') >= 0) { //valid audio file
            const fileName = `${dir}/${file.filename.replace('.aac', '.flac')}`;

            fs.createWriteStream(fileName);

            const proc = new ffmpeg({ source: `${dir}/${file.filename}` })
                .toFormat('flac')
                .saveToFile(fileName, function(stdout, stderr) {
                });

            proc.on('end', function () {
                const params = {
                    audio: fs.createReadStream(fileName),
                    transfer_encoding: 'chunked',
                    content_type: 'audio/flac',
                };

                speech_to_text.recognize(params, function (err, res) {
                    if (err) {
                        console.log(err);
                        return reject(err);
                    }
                    else {
                        const transcribedString = res.results[0].alternatives[0].transcript;
                        return resolve({
                            index,
                            filename: file.filename,
                            transcribedString
                        });
                    }
                });
            });
        }
        else {
            reject("Error");
        }
    });
}

module.exports = router;
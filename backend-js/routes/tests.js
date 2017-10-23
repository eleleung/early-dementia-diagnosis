/**
 * Created by EleanorLeung on 25/05/2017.
 */
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const passport = require('passport');

const Test = require('../models/test');

router.post('/getPatientTests', passport.authenticate('jwt', {session:false}), function(req, res){

    Test.getTestByCreatorAndPatient(req.user.id, req.body._id, function(err, tests){
        if (err) {
            res.status(400);
            res.json({success: false, msgs: 'Failed to fetch test'});
        }
        else {
            res.json({success: true, msg: 'Success', tests: tests});
        }
    });
});

router.post('/saveTest', passport.authenticate('jwt', {session: false}), function(req, res){
    console.log(req.body);

    const test = req.body;
    console.log(test.userId);
    console.log(test.testName);
    console.log(test.components);

    const newTest = new Test({
        name: test.testName,
        testComponents: test.components,
        dateCreated: new Date(),
        creator: test.userId
    });

    Test.addTest(newTest, function(err, test){
        if (err) {
            res.status(400);
            res.json({success: false, msg: 'Failed to save test'});
        }
        else {
            res.json({success: true, msg: 'Created test'});
        }
    });
});

module.exports = router;
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
            res.json({success: false, msgs: 'Failed to fetch tests'});
        }
        else {
            res.json({success: true, msg: 'Success', tests: tests});
        }
    });
});

module.exports = router;
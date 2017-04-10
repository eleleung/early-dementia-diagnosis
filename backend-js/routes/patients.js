/**
 * Created by EleanorLeung on 7/04/2017.
 */
const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

const User = require('../models/user');
const Patient = require('../models/patient');

router.post('/register', passport.authenticate('jwt', {session:false}), function(req, res, next){
    var newPatient = new Patient({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        gender: req.body.gender,
        dateOfBirth: req.body.dateOfBirth
    });



    Patient.addPatient(newPatient, function(err, patient){
        if (err) {
            res.json({success: false, msg: 'Failed to register patient'});
        }
        else {
            res.json({success: true, msg: 'Patient registered'});
        }
    });
});

// Profile
router.get('/profile', passport.authenticate('jwt', {session:false}), function(req, res, next){
    res.json({user: req.user});
});

module.exports = router;
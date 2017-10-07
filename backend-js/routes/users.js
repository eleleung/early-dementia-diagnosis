/**
 * Created by EleanorLeung on 6/04/2017.
 */
const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

const User = require('../models/user');
const Patient = require('../models/patient');

router.post('/register', function(req, res, next){
    var newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        dateOfBirth: req.body.dateOfBirth
    });

    User.addUser(newUser, function(err, user){
        if (err) {
            res.status(400);
            res.json({success: false, msg: 'Failed to register user'});
        }
        else {
            res.json({success: true, msg: 'User registered'});
        }
    })
});

// Login
router.post('/authenticate', function(req, res, next){
    const email = req.body.email;
    const password = req.body.password;

    User.getUserByEmail(email, function(err, user){
        if (err) {
            throw err;
        }

        if (!user) {
            return res.status(400).json({success: false, msg: 'User not found or password is incorrect'});
        }

        User.comparePassword(password, user.password, function(err, isMatch){
            if (err) {
                throw err;
            }

            if (isMatch) {
                const token = jwt.sign(user, config.secret, {
                    expiresIn: 604800   // 1 week
                });

                res.json({
                    success: true,
                    token: 'JWT ' + token,
                    user: {
                        id: user._id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email
                    }
                })
            }
            else {
                return res.status(400).json({success: false, msg: 'Wrong password'});
            }
        });
    });
});

router.get('/getPatients', passport.authenticate('jwt', {session:false}), function(req, res, next) {
    Patient.getPatientsByCarer(req.user.id, function(err, patients){
        if (err) {
            res.status(400);
            res.json({success: false, msgs: 'Failed to fetch patients associated with this carer'});
        }
        else {
            res.json({success: true, msg: 'Success', carerPatients: patients});
        }
    });
});

router.get('/profile', passport.authenticate('jwt', {session:false}), function(req, res, next){
    res.json({user: req.user});
});

router.get('/validate',passport.authenticate('jwt', {session:false}), function(req, res, next){
    res.json({user: req.user});
});

module.exports = router;
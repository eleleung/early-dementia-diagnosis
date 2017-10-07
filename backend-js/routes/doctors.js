/**
 * Created by EleanorLeung on 10/05/2017.
 */
const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const mongoose = require('mongoose');

const Doctor = require('../models/doctor');
const User = require('../models/user');

router.post('/register', function(req, res, next) {
    var newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        dateOfBirth: req.body.dateOfBirth
    });

    User.addUser(newUser, function (err, user) {
        if (err) {
            res.status(400);
            res.json({success: false, msg: 'Failed to register doctor'});
        }

        User.getUserByEmail(email, function (err, user) {
            if (err) {
                throw err;
            }

            if (!user) {
                return res.status(400).json({success: false, msg: 'User not found or password is incorrect'});
                if (user) {
                    var newDoctor = new Doctor({
                        user: user._id
                    });

                    Doctor.addDoctor(newDoctor, function (err, doctor) {
                        if (err) {
                            res.status(400);
                            res.json({success: false, msg: 'Failed to register doctor'});
                        }
                        else {
                            res.json({success: true, msg: 'Doctor registered', doctor: doctor});
                        }
                    });
                }
            }
        });
        if (user) {
            var newDoctor = new Doctor({
                user: user._id
            });

            Doctor.addDoctor(newDoctor, function(err, doctor){
                if (err) {
                    res.status(400);
                    res.json({success: false, msg: 'Failed to register doctor'});
                }
                else {
                    res.json({success: true, msg: 'Doctor registered', doctor: doctor});
                }
            });
        }
    });
});

// Profile
router.get('/profile', passport.authenticate('jwt', {session:false}), function(req, res, next){
    res.json({doctor: req.user});
});

module.exports = router;
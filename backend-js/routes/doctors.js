/**
 * Created by EleanorLeung on 10/05/2017.
 */
const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

const Doctor = require('../models/doctor');
const User = require('../models/user');

router.post('/register', function(req, res, next){
    var newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        dateOfBirth: req.body.dateOfBirth
    });

    var newDoctor = new Doctor({
        user: newUser
    });

    User.addUser(newUser, function(err, user){
        if (err) {
            res.status(400);
        }
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
});

// Authenticate
router.post('/authenticate', function(req, res, next){
    console.log(req.body);
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

                Doctor.getDoctorByEmail(email, function(err, doctor){
                    if (err) {
                        throw err;
                    }
                    if (!doctor) {
                        return res.status(400).json({success: false, msg: 'Doctor not found'});
                    }

                    res.json({
                        success: true,
                        token: 'JWT ' + token,
                        doctor: {
                            id: doctor._id,
                            user: {
                                id: user._id,
                                firstName: user.firstName,
                                lastName: user.lastName,
                                email: user.email
                            }
                        }
                    })
                });
            }
            else {
                return res.status(400).json({success: false, msg: 'Wrong password'});
            }
        });
    });
});

// Profile
router.get('/profile', passport.authenticate('jwt', {session:false}), function(req, res, next){

    res.json({doctor: req.user});
});


module.exports = router;
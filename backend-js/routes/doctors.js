/**
 * Created by EleanorLeung on 10/05/2017.
 */
const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const mongoose = require('mongoose');
const shortId = require('shortid');

const Doctor = require('../models/doctor');
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
        if (err || !user) {
            res.status(400);
            res.json({success: false, msg: 'Failed to register doctor'});
        }

        if (user) {
            var newDoctor = new Doctor({
                user: user._id,
                referenceCode: shortId.generate()
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

router.post('/assign-doctor', passport.authenticate('jwt', {session:false}), function(req, res, next){
    Patient.getPatientById(req.body.patientId, function(err, patient){
        if (err || !patient) {
            res.status(400);
            res.json({success: false, msg: 'Failed to link patient to doctor'});
        }

        if (patient) {
            Doctor.assignPatientToDoctor(req.body.referenceCode, patient, function(err, doctor) {
                if (err || !doctor) {
                    res.status(400);
                    res.json({success: false, msg: 'Failed to link patient to doctor'});
                }

                if (doctor && doctor.user) {
                    patient.carers.push(doctor.user);

                    Patient.updatePatient(patient, function(err, patient){
                        if (err) {
                            res.status(400);
                            res.json({success: false, msg: 'Failed to link patient to doctor'});
                        }
                        else {
                            res.json({success: true, msg: 'Successfully linked patient to doctor'});
                        }
                    });
                }
            })
        }
    });
});

router.post('/get-all-doctor-patients', passport.authenticate('jwt', {session:false}), function(req, res, next){
    Doctor.getAllPatients(req.body.userId, function(err, patients){
        if (err) {
            res.status(400);
            res.json({success: false, msg: 'Could not retrieve patients'});
        }

        if (patients) {
            res.json({success: true, patients: patients})
        }
    });
});

// Profile
router.get('/profile', passport.authenticate('jwt', {session:false}), function(req, res, next){
    res.json({doctor: req.user});
});

module.exports = router;
/**
 * Created by EleanorLeung on 7/04/2017.
 */
const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const mongoose = require('mongoose');

const User = require('../models/user');
const Patient = require('../models/patient');
const Test = require('../models/test');
const TestResult = require('../models/test_result');

router.post('/register', passport.authenticate('jwt', {session:false}), function(req, res){
    const newPatient = new Patient({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        gender: req.body.gender,
        dateOfBirth: req.body.dateOfBirth,
        carers: [req.user]
    });

    Patient.addPatient(newPatient, function(err, patient){
        if (err) {
            res.status(400);
            res.json({success: false, msg: 'Failed to register patient'});
        }
        else {
            res.json({success: true, msg: 'Patient registered', patient: patient});
        }
    });
});

router.post('/add_patient_test', passport.authenticate('jwt', {session:false}), function(req, res) {
    const patientId = req.body.patientId;

    Patient.getPatientById(patientId, function(err, patient) {
        if (err) {
            res.status(400);
            res.json({success: false, msg: 'Failed to load patient'});
        }

        // TODO: check the user has access to change the patient
        const testId = mongoose.Types.ObjectId(req.body.testId);

        if (!patient.tests) {
            patient.tests = []
        }
        patient.tests.push(testId);

        let uniqueTests = new Set();
        for (const testId of patient.tests) {
            uniqueTests.add(testId);
        }

        patient.tests = Array.from(uniqueTests);

        Patient.updatePatient(patient, function(err) {
            if (err) {
                res.status(400);
                res.json({success: false, msg: 'Failed to update patient'});
            }
            else {
                res.json({success: true, msg: 'Patient updated', patient: patient});
            }
        })

    });
});

// No currently in use
router.post('/update', passport.authenticate('jwt', {session:false}), function(req, res) {
    const patient = req.body.patient;

    const updatedPatient = new Patient({
        _id: patient._id,
        firstName: patient.firstName,
        lastName: patient.lastName,
        gender: patient.gender,
        dateOfBirth: patient.dateOfBirth,
        carers: patient.carers,
        tests: patient.tests,
    });

    Patient.updatePatient(updatedPatient, function(err) {
        if (err) {
            res.status(400);
            res.json({success: false, msg: 'Failed to update patient'});
        }
        else {
            res.json({success: true, msg: 'Patient updated'});
        }
    });
});

router.get('/profile', passport.authenticate('jwt', {session:false}), function(req, res, next){
    res.json({user: req.user});
});

router.post('/getPatientById', passport.authenticate('jwt', {session:false}), function(req, res, next){
    Patient.getPatientById(req.body._id, function(err, patient) {
        if (err) {
            res.status(400);
            res.json({success: false, msg: 'Failed to find patient'});
        }
        else {
            res.json({success: true, patient: patient, msg: 'Patient Found'});
        }
    })
});

router.post('/getCompletedPatientTests', passport.authenticate('jwt', {session:false}), function(req, res) {
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

module.exports = router;
/**
 * Created by EleanorLeung on 24/05/2017.
 */
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const config = require('../config/database');

const User = require('../models/user');
const Test = require('../models/test');
const Patient = require('../models/patient');


const TestResultSchema = mongoose.Schema({
    test: {
        type: mongoose.Schema.ObjectId,
        ref : 'Test',
        required: true
    },
    componentResults: {
        type: [],
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    creator: {
        type: mongoose.Schema.ObjectId,
        ref : 'User',
        required: true
    },
    patient: {
        type: mongoose.Schema.ObjectId,
        ref: 'Patient', childPath: 'tests',
    }
});
const TestResult = module.exports = mongoose.model('TestResult', TestResultSchema);

module.exports.getTestResultById = function(id, callback){
    const query = {_id: id};
    TestResult.findOne(query, callback);
};

module.exports.getTestResultByCreatorAndPatient = function(creatorId, patientId, callback){
    const query = {
        creator: creatorId,
        patient: patientId
    };
    TestResult.find(query, callback);
};

module.exports.getTestResultByPatientId = function(patientId, callback){
    const query = {
        patient: patientId
    };
    TestResult
        .find(query)
        .populate({
            path: 'test',
            populate: {path: 'creator'}
        })
        .exec(callback);
};

module.exports.getAllTestResults = function() {
    TestResult.find();
};

module.exports.addTestResult = function(newTestResult, callback){
    newTestResult.save(callback);
};
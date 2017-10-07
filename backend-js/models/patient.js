/**
 * Created by EleanorLeung on 7/04/2017.
 */
const mongoose = require('mongoose');
const relationship = require('../node_modules/mongoose-relationship');
const config = require('../config/database');

const User = require('./user');
const Doctor = require('./doctor');

const PatientSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    gender: {
        type: String
    },
    dateOfBirth: {
        type: Date
    },
    carers: [{
        type: mongoose.Schema.ObjectId, ref : 'User', childPath : 'patients'
    }],
    tests: [{
        type: mongoose.Schema.ObjectId, ref: 'Test', childPath: 'patient'
    }]
});
PatientSchema.plugin(relationship, {relationshipPathName: ['carers', 'tests']});
const Patient = module.exports = mongoose.model('Patient', PatientSchema);

module.exports.getPatientById = function(id, callback){
    const query = {_id: id};
    Patient.findOne(query, callback);
};

module.exports.getPatientsByCarer = function(id, callback){
    const query = {carers: id};
    Patient.find(query, 'firstName lastName gender dateOfBirth',  callback);
};

module.exports.getAllPatients = function(callback){
    Patient.find(callback);
};

module.exports.addPatient = function(newPatient, callback){
    // need to save patient
    newPatient.save(callback);
};

//functions made for testing purposes
module.exports.removePatients = function(callback) {
    Patient.remove({}, callback);
};
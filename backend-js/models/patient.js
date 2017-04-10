/**
 * Created by EleanorLeung on 7/04/2017.
 */
const mongoose = require('mongoose');
const config = require('../config/database');

const User = require('./user');

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
        type: mongoose.Schema.ObjectId, ref : 'User'
    }]
});

const Patient = module.exports = mongoose.model('Patient', PatientSchema);

module.exports.getPatientById = function(id, callback){
    Patient.findById(id, callback);
}

module.exports.addPatient = function(newPatient, callback){
    // need to save patient
    newPatient.save(callback);
}

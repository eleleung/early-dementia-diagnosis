/**
 * Created by EleanorLeung on 7/04/2017.
 */
const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    relationship = require("mongoose-relationship");
const config = require('../config/database');

const User = require('./user');
const Doctor = require('./doctor');

const PatientSchema = Schema({
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
        type: Schema.ObjectId, ref : "User", childPath : "patients"
    }],
    doctors: [{
        type: Schema.ObjectId, ref: "Doctor", childPath: "patients"
    }]
});
PatientSchema.plugin(relationship, {relationshipPathName: ["carers", "doctors"]});
const Patient = module.exports = mongoose.model('Patient', PatientSchema);

module.exports.getPatientById = function(id, callback){
    Patient.findById(id, callback);
}

module.exports.getPatientsByCarer = function(id, callback){
    const query = {carers: id};
    Patient.find(query, 'firstName lastName gender dateOfBirth -_id',  callback);
}

module.exports.getAllPatients = function(callback){
    Patient.find(callback);
}

module.exports.addPatient = function(newPatient, callback){
    // need to save patient
    newPatient.save(callback);
}
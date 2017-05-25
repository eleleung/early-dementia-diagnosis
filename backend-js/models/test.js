/**
 * Created by EleanorLeung on 24/05/2017.
 */
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const config = require('../config/database');
const relationship = require('../node_modules/mongoose-relationship');

const User = require('../models/user');
const Patient = require('../models/patient');

const TestSchema = mongoose.Schema({
    fileName: {
        type: String,
        required: true
    },
    transcribedText: {
        type: String,
        required: true
    },
    creator: [{
        type: mongoose.Schema.ObjectId, ref : 'User', childPath : "tests"
    }],
    patient: [{
        type: mongoose.Schema.ObjectId, ref: 'Patient', childPath: 'tests'
    }]
});
TestSchema.plugin(relationship, {relationshipPathName: ["creator", "patient"]});
const Test = module.exports = mongoose.model('Test', TestSchema);

module.exports.getTestById = function(id, callback){
    const query = {_id: id};
    Test.findOne(query, callback);
};

module.exports.getTestByCreatorAndPatient = function(creatorId, patientId, callback){
    const query = {
        creator: creatorId,
        patient: patientId
    };
    User.find(query, callback);
};

module.exports.getAllTests = function(callback){
    Test.find();
};

module.exports.addTest = function(newTest, callback){
    newTest.save(callback);
};
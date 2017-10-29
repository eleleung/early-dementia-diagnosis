/**
 * Created by EleanorLeung on 10/05/2017.
 */
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const config = require('../config/database');
const relationship = require('../node_modules/mongoose-relationship');
const Schema = mongoose.Schema;

const DoctorSchema = Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    referenceCode: {
        type: String,
        required: true
    }
});

const Doctor = module.exports = mongoose.model('Doctor', DoctorSchema);

module.exports.getDoctorById = function(id, callback){
    const query = {_id: id};
    Doctor.findOne(query, callback);
};

module.exports.getAllDoctors = function(callback){
    Doctor.find(callback);
};

module.exports.getDoctorFromLogin = function(userId, callback){
    const query = {user: userId};
    Doctor
        .findOne(query)
        .populate('user')
        .exec(callback);
};

module.exports.getDoctorByUserId = function(userId, callback){
    const query = {user: userId};
    Doctor.findOne(query, callback);
};

module.exports.assignPatientToDoctor = function(referenceCode, patient, callback){
    const query = {referenceCode: referenceCode};
    Doctor
        .findOne(query)
        .populate({
            path: 'user',
            populate: {path: 'patients'}
        })
        .exec(callback);
};

module.exports.getAllPatients = function(userId, callback){
    const query = {user: userId};
    Doctor
        .findOne(query)
        .populate({
            path: 'user',
            populate: {path: 'patients'}
        })
        .exec(callback);
};

module.exports.addDoctor = function(newDoctor, callback){
    newDoctor.save(callback);
};

//functions made for testing purposes
module.exports.removeDoctors = function(callback) {
    Doctor.remove({}, callback);
};

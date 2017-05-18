/**
 * Created by EleanorLeung on 10/05/2017.
 */
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const config = require('../config/database');
const relationship = require('../node_modules/mongoose-relationship');

const Patient = require('../models/patient');

const DoctorSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    patients: [{
        type: mongoose.Schema.ObjectId, ref : 'Patient'
    }]
});

DoctorSchema.pre('save', true, function(next, done){
    var self = this;

    Doctor.findOne({email: this.email}, 'email', function(err, results){
        if (err) {
            done(err);
        }
        else if (results) {
            self.invalidate("email", "Email must be unique");
            done(new Error("Email must be unique!"));
        }
        else {
            done();
        }
    });
    next();
});

const Doctor = module.exports = mongoose.model('Doctor', DoctorSchema);

module.exports.getDoctorById = function(id, callback){
    const query = {_id: id};
    User.findOne(query, callback);
};

module.exports.getAllDoctors = function(callback){
    Doctor.find();
};

module.exports.getDoctorByEmail = function(email, callback){
    const query = {email: email};
    Doctor.findOne(query, callback);
};

module.exports.addDoctor = function(newDoctor, callback){
    bcrypt.genSalt(10, function(err, salt){
        bcrypt.hash(newDoctor.password, salt, function(err, hash){
            if (err) {
                throw err;
            }

            newDoctor.password = hash;
            newDoctor.save(callback);
        });
    });
};

module.exports.comparePassword = function(candidatePassword, hash, callback){
    bcrypt.compare(candidatePassword, hash, function(err, isMatch){
        if (err) {
            throw err;
        }
        callback(null, isMatch);
    });
};

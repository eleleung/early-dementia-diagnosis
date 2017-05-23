/**
 * Created by EleanorLeung on 10/05/2017.
 */
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const config = require('../config/database');
const relationship = require('../node_modules/mongoose-relationship');

const UserSchema = require('../models/user');

// schema not in use atm, combining with user
const DoctorSchema = mongoose.Schema({
    user: [UserSchema]
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
    Doctor.findOne(query, callback);
};

module.exports.getAllDoctors = function(callback){
    Doctor.find();
};

module.exports.getDoctorByEmail = function(email, callback){
    const query = {'user.email': email};
    Doctor.findOne(query, callback);
};

module.exports.addDoctor = function(newDoctor, callback){
    newDoctor.save(callback);

};


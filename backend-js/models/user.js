/**
 * Created by EleanorLeung on 6/04/2017.
 */
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const config = require('../config/database');

const Patient = require('../models/patient');

const UserSchema = mongoose.Schema({
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
        required: true
    },
    password: {
        type: String,
        required: true
    },
    dateOfBirth: {
        type: Date,
    },
    carers: [{
        type: mongoose.Schema.ObjectId, ref : 'Patient'
    }]
});

const User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserById = function(id, callback){
    User.findById(id, callback);
}

module.exports.getUserByUsername = function(username, callback){
    const query = {username: username}
    User.findOne(query, callback);
}

module.exports.addUser = function(newUser, callback){
    // generate salt i.e. random key to hash password
    bcrypt.genSalt(10, function(err, salt){
       bcrypt.hash(newUser.password, salt, function(err, hash){
           if (err) {
               throw err;
           }

           newUser.password = hash;
           newUser.save(callback);
       });
    });
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
    bcrypt.compare(candidatePassword, hash, function(err, isMatch){
        if (err) {
            throw err;
        }
        callback(null, isMatch);
    });
}
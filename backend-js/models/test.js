/**
 * Created by EleanorLeung on 24/05/2017.
 */
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const config = require('../config/database');
const relationship = require('../node_modules/mongoose-relationship');

const UserSchema = require('../models/user');

const TestSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    creator: {
        user: [UserSchema]
    }
});

const Test = module.exports = mongoose.model('Test', TestSchema);

module.exports.getTestById = function(id, callback){
    const query = {_id: id};
    Test.findOne(query, callback);
};

module.exports.getTestByCreatorId = function(creatorId, callback){

};

module.exports.getAllTests = function(callback){
    Test.find();
};

module.exports.addTest = function(newTest, callback){
    newTest.save();
};
/**
 * Created by EleanorLeung on 24/05/2017.
 */
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const config = require('../config/database');
const relationship = require('../node_modules/mongoose-relationship');

const User = require('../models/user');

const TestSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    components: {
        type: Array,
        required: true
    },
    dateCreated: {
        type: Date,
        required: true
    },
    creator: [{
        type: mongoose.Schema.ObjectId, ref : 'User', childPath : "tests"
    }]
});
TestSchema.plugin(relationship, {relationshipPathName: ["creator"]});
const Test = module.exports = mongoose.model('Test', TestSchema);

module.exports.getTestById = function(id, callback){
    const query = {_id: id};
    Test.findOne(query, callback);
};

module.exports.getTestByCreator = function(creatorId, callback) {
    const query = {
        creator: creatorId,
    };
    Test.find(query, callback);
};

module.exports.getAllTests = function(callback) {
    Test.find(callback);
};

module.exports.getAllTestsWithIds = function(ids, callback) {
    Test
        .find({
            '_id': { $in : ids}
        })
        .populate('creator')
        .exec(callback)
};

module.exports.addTest = function(newTest, callback){
    newTest.save(callback);
};

module.exports.removeTests = function(callback) {
    Test.remove({}, callback);
};
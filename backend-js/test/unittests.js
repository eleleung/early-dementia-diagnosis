/**
 * Created by caitlinwoods on 3/10/17.
 */

var should = require('should');
var assert = require('assert');
var request = require('supertest');
var winston = require('winston');
var mongoose = require('mongoose');
var config = require('debug');
var express = require('express');
var server = require('../app');
const User = require('../models/user');
const Patient = require('../models/patient');
const Doctor = require('../models/doctor');
jwt = require('jsonwebtoken');
var MongoMock = require('mongodb-test-mock');
const bcrypt = require('bcrypt');

describe('User', function() {

    describe("FRC01 Compare password", function () {

        it("FRC01 should be a successful comparison", function (done) {
            this.timeout(20000);

            var password = "password";

            bcrypt.genSalt(10, function(err, salt){
                bcrypt.hash(password, salt, function(err, hash){
                    if (err) {
                        throw err;
                    } else {
                        var hashedPassword = hash;

                        User.comparePassword("password", hashedPassword, function (err, isMatch) {
                            if (err) {
                                throw err;
                                done();
                            } else {
                                assert.equal(isMatch, true);
                                done();
                            }
                        });
                    }
                });
            });
        });

        it("FRC01 should not be a successful comparison", function (done) {
            this.timeout(20000);

            var password = "password";

            bcrypt.genSalt(10, function(err, salt){
                bcrypt.hash(password, salt, function(err, hash){
                    if (err) {
                        throw err;
                    } else {
                        var hashedPassword = hash;

                        User.comparePassword("wrongpassword", hashedPassword, function (err, isMatch) {
                            if (err) {
                                throw err;
                                done();
                            } else {
                                assert.equal(isMatch, false);
                                done();
                            }
                        });
                    }
                });
            });
        });

        it("FRC01 empty password should not be a successful comparison", function (done) {
            this.timeout(20000);

            var password = "password";

            bcrypt.genSalt(10, function(err, salt){
                bcrypt.hash(password, salt, function(err, hash){
                    if (err) {
                        throw err;
                    } else {
                        var hashedPassword = hash;

                        User.comparePassword("", hashedPassword, function (err, isMatch) {
                            if (err) {
                                throw err;
                                done();
                            } else {
                                assert.equal(isMatch, false);
                                done();
                            }
                        });
                    }
                });
            });
        });

        it("FRC01 empty hash should throw an error", function (done) {

            var password = "password";

            bcrypt.genSalt(10, function(err, salt){
                bcrypt.hash(password, salt, function(err, hash){
                    if (err) {
                        throw err;
                    } else {
                        var hashedPassword = hash;

                        User.comparePassword("password", "", function (err, isMatch) {
                            if (err) {
                                //should be successful
                                assert.equal(true, true);
                                done();
                            } else {
                                assert.equal(true, false);
                                done();
                            }
                        });
                    }
                });
            });
        });

        it("FRC01 empty password and hash should throw an error", function (done) {

            var password = "password";

            bcrypt.genSalt(10, function(err, salt){
                bcrypt.hash(password, salt, function(err, hash){
                    if (err) {
                        throw err;
                    } else {
                        var hashedPassword = hash;

                        User.comparePassword("", "", function (err, isMatch) {
                            if (err) {
                                //should be successful
                                assert.equal(true, true);
                                done();
                            } else {
                                assert.equal(true, false);
                                done();
                            }
                        });
                    }
                });
            });
        });
    });
});

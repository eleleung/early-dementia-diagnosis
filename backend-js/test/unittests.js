/**
 * Created by caitlinwoods on 6/5/17.
 */

//NOTE: BE CAREFUL RUNNING THESE WITHOUT SWITCHING THE DATABASE FIRST

var should = require('should');
var assert = require('assert');
var request = require('supertest');
var mongoose = require('mongoose');
var winston = require('winston');
var config = require('debug');
var express = require('express');
app = express();
var server = require('../app');
const User = require('../models/user');



describe('Users', function() {

    // within before() you can run all the operations that are needed to setup your test
    beforeEach(function (done) {
        //clear the test db
        User.removeUsers(function (err) {
            if (err) {
                throw err;
            }
        });
        done();
    });

    describe("Register", function () {

        describe("valid request", function () {

            it("should add new user and give a 200 Status Code", function (done) {
                this.timeout(10000);
                var newUser = {
                    firstName: "firstName",
                    lastName: "lastName",
                    email: "email@email.com",
                    password: "password",
                    confirm_password: "password"
                };

                request(server)
                    .post('/users/register/')
                    .send(newUser)
                    // end handles the response
                    .end(function (err, res) {
                        if (err) {
                            throw err;
                        }
                        // should error because of the incorrect status code
                        assert.equal(res.text, '{"success":true,"msg":"User registered"}');
                        assert.equal(res.statusCode, 200);

                        // see if the new user exists
                        //var addedUser = User.getUserByEmail("email");
                        //assert.equal(addedUser.firstName = "firstName");
                        done();
                    });
            });
        });

        describe("additional valid request with same email", function () {

            it("should only add first user", function (done) {
                this.timeout(10000);

                var newUser = {
                    firstName: "firstName",
                    lastName: "lastName",
                    email: "user1@email.com",
                    password: "password",
                    confirm_password: "password"
                };

                request(server)
                    .post('/users/register/')
                    .send(newUser)
                    // end handles the response
                    .end(function (err, res) {
                        if (err) {
                            throw err;
                        }
                        assert.equal(res.statusCode, 200);
                    });

                var newUser2 = {
                    firstName: "firstName",
                    lastName: "lastName",
                    email: "user1@email.com",
                    password: "password",
                    confirm_password: "password"
                };

                request(server)
                    .post('/users/register/')
                    .send(newUser2)
                    // end handles the response
                    .end(function (err, res) {
                        if (err) {
                            throw err;
                        }
                        assert.equal(res.statusCode, 400);

                        done();
                    });
            });
        });

        describe("additional valid request with different email", function() {

            it("should add both users", function (done) {

                    this.timeout(10000);
                    var newUser = {
                        firstName: "firstName",
                        lastName: "lastName",
                        email: "user1@email.com",
                        password: "password",
                        confirm_password: "password"
                    };

                    request(server)
                        .post('/users/register/')
                        .send(newUser)
                        // end handles the response
                        .end(function (err, res) {
                            if (err) {
                                throw err;
                            }
                            assert.equal(res.statusCode, 200);
                        });

                    var newUser2 = {
                        firstName: "firstName",
                        lastName: "lastName",
                        email: "user2@email.com",
                        password: "password",
                        confirm_password: "password"
                    };

                    request(server)
                        .post('/users/register/')
                        .send(newUser2)
                        // end handles the response
                        .end(function (err, res) {
                            if (err) {
                                throw err;
                            }
                            assert.equal(res.statusCode, 200);

                            done();
                        });
            });
        });

        //TEST FAILS: Invalid confirmed password is not checked
        describe("Invalid request with incorrect confirmed password", function()
        {
            it("should not add a user and return invalid status code", function(done)
            {
                this.timeout(10000);
                var newUser = {
                    firstName: "firstName",
                    lastName: "lastName",
                    email: "email@email.com",
                    password: "password",
                    confirm_password: "p"
                };

                request(server)
                    .post('/users/register/')
                    .send(newUser)
                    // end handles the response
                    .end(function (err, res) {
                        if (err) {
                            throw err;
                        }
                        // should error because of the incorrect confirmed password
                        assert.equal(res.statusCode, 400);

                        done();
                    });

            });
        });
    });

});

/**
 * Created by caitlinwoods on 6/5/17.
 */

var should = require('should');
var assert = require('assert');
var request = require('supertest');
var mongoose = require('mongoose');
var winston = require('winston');
var config = require('debug');
var express = require('express');
app = express();
var server = require('../app');

describe('Routing', function() {
    // within before() you can run all the operations that are needed to setup your tests. In this case
    // I want to create a connection with the database, and when I'm done, I call done().
    before(function (done) {
        // In our tests we use the test db
        mongoose.connection.on('connected', function () {
            console.log('Connected to db ' + config.database);
        });
        done();
    });


        describe("routes", function () {
            describe("POST register with invalid confirmed password", function () {

                it("should give a 400 Status Code", function (done) {
                    this.timeout(10000)
                    var newUser = {
                        firstName: "firstName",
                        lastName: "lastName",
                        email: "email",
                        password: "password",
                        confirm_password: "passrd"
                    }

                    request(server)
                        .post('/users/register/')
                        .send(newUser)
                        // end handles the response
                        .end(function (err, res) {
                            if (err) {
                                throw err;
                            }
                            // should error because of the incorrect email
                            assert.equal(400, res.statusCode)
                            done();
                        });
                });
            });
        });
    });


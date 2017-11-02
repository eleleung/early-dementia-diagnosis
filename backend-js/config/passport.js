/**
 * Created by EleanorLeung on 7/04/2017.
 */
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user');
const config = require('./database');

//Handles JWT authenticaiton
module.exports = function(passport){
    var opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
    opts.secretOrKey = config.secret;
    passport.use(new JwtStrategy(opts, function(jwt_payload, done){
        User.getUserById({_id: jwt_payload._doc._id}, function(err, user){
            if (err) {
                return done(err, false);
            }

            if (user) {
                return done(null, user);
            }
            else {
                return done(null, false);
            }
        });
    }));
};
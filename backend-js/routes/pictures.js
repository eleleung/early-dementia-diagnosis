/**
 * Created by caitlinwoods on 18/5/17.
 */

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const passport = require('passport');

router.post('/SendPicture', passport.authenticate('jwt', {session:false}), function(req, res) {
    res.json({success: true, msg: "picture was sent successfully"});
});

module.exports = router;

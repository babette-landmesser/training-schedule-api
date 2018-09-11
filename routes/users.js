var express = require('express');
var router = express.Router();
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var crypto = require('crypto');
require('../config/config');

var passportJWT = require("passport-jwt");

var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;

const jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
jwtOptions.secretOrKey = CONFIG.jwt_encryption;

router.post('/update-password', function (req, res) {
   if (req.body.id && req.body.password && req.body.passwordConfirm && req.body.oldPassword) {
      const id = req.body.id;
      const oldPassword = req.body.oldPassword;
      const password = req.body.password;
      const passwordConfirm = req.body.passwordConfirm;
      const hashOld = crypto.createHmac('sha512', CONFIG.hash);
      const hashNew = crypto.createHmac('sha512', CONFIG.hash);

      if (passwordConfirm !== password || password === oldPassword) {
         res.status(500).json({message: 'password confirmation failed' });
         return;
      }

      connection.query('SELECT * FROM users WHERE id="' + id + '"', function(error, results, fields) {
         if (results && results.length === 1) {
            hashOld.update(oldPassword);
            if (hashOld.digest('hex') === results[0].password) {
               hashNew.update(password);

               connection.query('UPDATE users SET password="'+ hashNew.digest('hex') +'" WHERE id="' + id + '"', function (error, results, fields) {
                  if(error || results.length === 0){
                     res.send({"status": 500, "error": error, "response": null});
                  } else {
                     res.send({"status": 200, "error": null, "response": results});
                  }
               });
            }
         }
      });
   } else {
      res.status(500).json({message: 'incorrect request'});
   }
});

module.exports = router;
var express = require('express');
var router = express.Router();
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var crypto = require('crypto-js');
require('../config/config');

var passportJWT = require("passport-jwt");

var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;

const jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
jwtOptions.secretOrKey = CONFIG.jwt_encryption;

router.post('/', function (req, res) {
  if (req.body.name && req.body.password) {
    const name = req.body.name;
    const password = req.body.password;

    connection.query('SELECT * from users WHERE username="' + name + '"', function (error, results, fields) {

      if (error || results.length === 0) {
        console.log(error);
        res.send({"status": 500, "error": error, "response": "no such user found"});
      } else {
        if (results.length === 1) {
          const formPw = crypto.HmacSHA512(password, CONFIG.hash);
          if (formPw.toString() === results[0].password) {
            const user = results[0];
            const payload = {id: user.id};
            const token = jwt.sign(payload, jwtOptions.secretOrKey);
            res.json({"status": 200, message: "ok", token: token});
          } else {
            res.send({"status": 400, "response": 'Password'});
          }
        } else {
          res.send({"status": 400, "response": 'Something went wrong'});
        }
      }
    });
  } else {
    res.send({"status": 401, "error": null, "response": "enter data to login"});
  }
});
/*
router.post('/new', function (req, res) {
  if (req.body.name && req.body.password) {
    const name = req.body.name;
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const email = req.body.email;
    const password = crypto.HmacSHA512(req.body.password, CONFIG.hash);

    connection.query('INSERT INTO users SET username="' + name + '", password="' + password + '", '
                     + 'firstname="'+firstname+'", lastname="'+lastname+'", email="'+email+'"', function (error, results, fields) {
      if (error || results.length === 0) {
        console.log(error);
        res.send({"status": 500, "error": error, "response": "no such user found"});
      } else {
        res.json({"status": 200, message: "ok", result: results});
      }
    });
  } else {
    res.send({"status": 401, "error": null, "response": "enter data to login"});
  }
});
*/
module.exports = router;
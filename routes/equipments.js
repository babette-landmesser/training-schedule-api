var express = require('express');
var router = express.Router();
var passport = require('passport');
var passportJWT = require('passport-jwt');
var fs = require('fs');
require('../config/config');

var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;
const jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
jwtOptions.secretOrKey = CONFIG.jwt_encryption;

var strategy = new JwtStrategy(jwtOptions, function (jwt_payload, next) {
  // console.log('payload received', jwt_payload);

  connection.query('SELECT * from users WHERE id="' + jwt_payload.id + '"', function (error, user, fields) {
    if (error || user.length === 0) {
      next(null, false);
    } else {
      if (user.length === 1) {
        next(null, user[0]);
      }

    }
  });
});

passport.use(strategy);

/**
 * Get equipment for current user
 */
router.get('/', passport.authenticate('jwt', {session: false}), function (req, res, next) {
  const user_id = req.user.id;

  connection.query('SELECT * from equipments WHERE user_id="' + user_id +'"', function (error, results, fields) {
    if (error) {
      res.send({"status": 500, "error": error, "response": null});
      //If there is error, we send the error in the error section with 500 status
    } else {
      res.send({"status": 200, "error": null, "response": results});
      //If there is no error, all is good and response is 200OK.
    }

  });
});

/**
 * POST equipment to create a new equipment for current user
 */
router.post('/', passport.authenticate('jwt', {session: false}), function (req, res, next) {
  let requestHasErrors = false,
    requestErrorResponse = 'Required fields are incomplete';


  const name = req.body.name,
    type = req.body.type,
    stress_type = req.body.stress_type,
    recommended_sets = req.body.recommended_sets,
    info = req.body.info || null,
    user_id = req.user.id;

  if (!name || !type || !stress_type || !recommended_sets) {
    requestHasErrors = true;
  }

  let recommended_duration,
    recommended_repetition,
    recommended_weight;

  if (stress_type === 'REPETITION') {
    recommended_duration = 0;
    recommended_repetition = req.body.recommended_repetition;
    recommended_weight = req.body.recommended_weight;

    if (!recommended_repetition || !recommended_weight) {
      requestHasErrors = true;
    }

  } else if (stress_type === 'DURATION') {
    recommended_duration = req.body.recommended_duration;
    recommended_repetition = 0;
    recommended_weight = 0;

    if (!recommended_duration) {
      requestHasErrors = true;
    }
  }

  if (requestHasErrors) {
    res.send(JSON.stringify({"status": 400, "error": null, "response": {message: requestErrorResponse}}));
    return;
  }

  const sql = "INSERT INTO `equipments`(`name`,`type`,`stress_type`, `recommended_sets`, `info`, `recommended_duration`,"
              + "`recommended_repetition`, `recommended_weight`, `user_id`)"
              + "VALUES ('" + name + "','"
              + type + "','" + stress_type + "','" + recommended_sets + "','" + info + "','" + recommended_duration + "','"
              + recommended_repetition + "','" + recommended_weight + "', '"+ user_id +"')";

  connection.query(sql, function (err, result) {
    if (err) {
      res.send({"status": 500, "error": err, "response": null});
    } else {
      res.send({"status": 200, "error": null, "response": result});
    }
  });
});

module.exports = router;

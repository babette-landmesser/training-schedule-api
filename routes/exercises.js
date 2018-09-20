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

  connection.query('SELECT * from exercises WHERE user_id="' + user_id +'"', function (error, results, fields) {
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


  const equipment_id = req.body.equipment_id,
    sets_id = req.body.sets_id,
    user_id = req.user.id;

  if (!name || !equipment_id || !sets_id) {
    requestHasErrors = true;
  }

  if (requestHasErrors) {
    res.send(JSON.stringify({"status": 400, "error": null, "response": {message: requestErrorResponse}}));
    return;
  }

  const sql = "INSERT INTO `exercises`(`equipment_id`,`sets_id`, `user_id`)"
              + "VALUES ('" + equipment_id + "','" + sets_id + "', '"+ user_id +"')";

  connection.query(sql, function (err, result) {
    if (err) {
      res.send({"status": 500, "error": err, "response": null});
    } else {
      res.send({"status": 200, "error": null, "response": result});
    }
  });
});

module.exports = router;

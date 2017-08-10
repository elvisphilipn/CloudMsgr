'use strict';

const buffer = require('buffer');
const DB_HELPER = require('../helpers/db');

const EMAIL_REGEX = new RegExp('^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$');
const PASSWORD_SALT = 'C10udM$9r';
const PARAM_EMAIL = 'email';
const PARAM_PWD = 'password';
const PARAM_FNAME = 'first_name';
const PARAM_LNAME = 'last_name';

/**
 * REST handler for PUT /CloudMsgr/user. it will validate the query inputs
 * and produce a user tuple in the DB, otherwise the respective error codes.
 *
 * @param {object} req - the request object
 * @param {object} res - the responce object
 */
function createUser(req, res) {
  // res.status(404).send(`<h1>404: Invalid name: ${name}</h1>`);
  let user = {};

  let email = req.queryEmail(PARAM_EMAIL);
  if(email) {
    user[PARAM_EMAIL] = email;
  } else {
    res.status(400);
    res.json('Bad Request - invalid or empty email address');
    return;
  }

  let password = req.queryString(PARAM_PWD);
  if(password) {
    // salt and base64 the password
    let value = new Buffer(password + PASSWORD_SALT).toString('base64');
    user[PARAM_PWD] = value;
  } else {
    res.status(400);
    res.json('Bad Request - invalid or empty password');
    return;
  }

  let firstName = req.queryString(PARAM_FNAME);
  if(firstName) {
    user[PARAM_FNAME] = firstName;
  } else {
    res.status(400);
    res.json('Bad Request  - invalid or empty first name');
    return;
  }

  let lastName = req.queryString(PARAM_LNAME);
  if(lastName){
    user[PARAM_LNAME] = lastName;
  }

  DB_HELPER.createUser(user, function(error) {
    if(error) {
      res.status(500);
      res.json('Internal Server Error');
    } else {
      res.status(201);
      res.json('Created');
    }
  });
}

/**
 * REST handler for GET /cloudmsgr/user. It will return a user profile.
 *
 * @param {object} req - the request object
 * @param {object} res - the response object
 */
function getUserInfo(req, res) {
  let email = req.queryEmail(PARAM_EMAIL);
  if(email) {
    DB_HELPER.getUser(email, function(err, result) {
      if(err) {
        res.status(500);
        res.json('Internal Server Error');
      } else if (result) {
        // whether anything was found
        // mask the password
        result.password = '*******';
        res.status(200);
        res.json(result);
      } else {
        res.status(404);
        res.json('Not Found');
      }
    });
  } else {
    res.status(400);
    res.json('Bad Request - invalid or empty email address');
  }
}

/**
 * Handler for GET /cloudmsgr/participants. Returns a list of
 * all users on CloudMsgr.
 *
 * @param {object} req - the request object
 * @param {object} res - the response object
 */
function getParticipants(req, res) {
  DB_HELPER.getAllUsers(function(err, results) {
    if(err) {
      res.status(500);
      res.json('Internal Server Error');
    } else {
      res.status(200);
      res.json(results);
    }
  });
}

module.exports = {
  createUser, createUser,
  getUserInfo: getUserInfo,
  getParticipants: getParticipants
};

'use strict';

const DB_HELPER = require('../helpers/db');

const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const PARAM_ID = 'id';
const PARAM_PARTICIPANTS = 'participants';
const PARAM_TITLE = 'title';

const UNTITLED_CONV = 'untitled converstaion'

/**
 * Handler for PUT /cloudmsgr/conversation. Cretes new converstaions in the DB.
 *
 * @param {object} req - the request object
 * @param {object} res - the response object
 */
function createConversation(req, res){
  let participants = req.queryString(PARAM_PARTICIPANTS).split(',');
  if(participants.length < 2) {
    // must have two users at least
    res.status('400');
    res.json('Bad REquest - Insufficent number of participants');
    return;
  }
  // validate all participants are well formed email address
  for(let i in participants) {
    let valid = EMAIL_REGEX.test(participants[i]);
    if(!valid) {
      res.status('400');
      res.json('Bad REquest - Invalid list of participants');
      return;
    }
  }
  let title = req.queryString(PARAM_TITLE) || UNTITLED_CONV;
  let now  = new Date().toJSON();
  let convo = {
    'participants': participants,
    'title': title,
    'last_chanege': now
  };
  DB_HELPER.createConverstaion(convo, function(err) {
    if(err) {
      res.status(500);
      res.json('Internal Server Error');
    } else {
      res.status(201);
      res.json('Created');
    }
  });
}

/**
 * Handler for GET /cloudmsgr/conversation{id}. Returns a JOSN object
 * of converstaion info for the given ID.
 *
 * @param {object} req - the request object
 * @param {object} res - the response object
 */
function getConverstaion(req, res) {
  let id =  req.queryString(PARAM_ID);
}

/**
 * Handler for GET /cloudmsgr/user/{id}/conversions. Returns a list of
 * converstaions for a given user.
 *
 * @param {object} req - the request object
 * @param {object} res - the response object
 */
function getUserConversations(req, res) {
  // fetcj the path parameter and sanitise validte it's safe
  let id = req.swagger.params.id.value;
  if(!id || !EMAIL_REGEX.test(id)) {
    res.status('400');
    res.json('Bad REquest - Invalid or missing user id');
    return;
  }
  DB_HELPER.getConversiontrionsFor(id, function(err, results) {
    if(err) {
      res.status(500);
      res.json('Internal Server Error');
    } else {
      res.status(200);
      res.json(results);
    }
  });
}

/**
 * Handler for POST /cloudmsgr/conversation/{id}/last_message.
 * Adds a new message to a given converstaion.
 *
 * @param {object} req - the request object
 * @param {object} res - the response object
 */
function createMessage(req, res){}

/**
 * Handler for POST /cloudmsgr/message/{id}.
 * Deletes a message from given converstaion, only if the deleter is the author.
 *
 * @param {object} req - the request object
 * @param {object} res - the response object
 */
function deleteMessage(req, res){}

/**
 * Handler for GET /cloudmsgr/conversation/{id}/messages.
 * Returns the last x messages in a given converstaion.
 *
 * @param {object} req - the request object
 * @param {object} res - the response object
 */
function getMessages(req, res){}

/**converstaion
 * Handler for GET /cloudmsgr/conversation/{id}/last_message.
 * Returns the last message in a given converstaion.
 *
 * @param {object} req - the request object
 * @param {object} res - the response object
 */
function getLastMessage(req, res){
}

module.exports = {
  createConversation: createConversation,
  getConverstaion: getConverstaion,
  getUserConversations: getUserConversations,
  createMessage: createMessage,
  deleteMessage: deleteMessage,
  getMessages: getMessages,
  getLastMessage: getLastMessage
};

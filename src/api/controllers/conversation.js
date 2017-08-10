'use strict';

const DB_HELPER = require('../helpers/db');

const PARAM_ID = 'id';
const PARAM_PARTICIPANTS = 'participants';
const PARAM_TITLE = 'title';

/**
 * Handler for PUT /cloudmsgr/conversation. Cretes new converstaions in the DB.
 *
 * @param {object} req - the request object
 * @param {object} res - the response object
 */
function createConversation(req, res){
  let participants = req.queryEmail(PARAM_PARTICIPANTS);
  console.log(participants);
  let title = req.queryString(PARAM_TITLE);
  res.status(201);
  res.json('Created');
}

/**
 * Handler for GET /cloudmsgr/conversation{id}. Returns a JOSN object
 * of converstaion info for the given ID.
 *
 * @param {object} req - the request object
 * @param {object} res - the response object
 */
function getConverstaion(req, res) {
}

/**
 * Handler for GET /cloudmsgr/user/{id}/conversions. Returns a list of
 * converstaions for a given user.
 *
 * @param {object} req - the request object
 * @param {object} res - the response object
 */
function getUserConverstaions(req, res) {
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

/**
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
  createMessage: createMessage,
  deleteMessage: deleteMessage,
  getMessages: getMessages,
  getLastMessage: getLastMessage
};

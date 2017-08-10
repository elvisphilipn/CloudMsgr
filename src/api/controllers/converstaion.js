'use strict';

/**
 * Handler for PUT /cloudmsgr/conversation. Cretes new converstaions in the DB.
 *
 * @param {object} req - the request object
 * @param {object} res - the response object
 */
function createConversation(req, res){
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
 * Handler for POST /cloudmsgr/conversation/{id}/mesages.
 * Adds a new message to a  given converstaion.
 *
 * @param {object} req - the request object
 * @param {object} res - the response object
 */
function createMessage(req, res){}

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
  getMessages: getMessages,
  getLastMessage: getLastMessage
};

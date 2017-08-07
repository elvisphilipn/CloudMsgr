'use-strct'

let r = require('rethinkdb');

const DB_NAME = 'cloudmsgr';
const TABLE_NAME_USR = 'users';
const TABLE_NAME_MSG = 'messages';
const TABLE_NAME_CONV = 'conversations';
const COLUMN_NAME_PARTICIPANTS = 'participants';

/**
 * Connects to RethinkDB and creates the needed
 * database for CloudMsgr.
 *
 * @param {function} callback - the callback function
 */
function initSchema(callback) {
  r.connect('localhost', function(error, conn){
    if(error) {
      console.error('CloudMsgr - init schema - Failed to connect to RethinkDB: '
      + error);
      callback(error);
    } else {
      // check whether rthe database already exist
      // otherwise create it
      r.dbList().contains(DB_NAME).do(function(doesExist){
        return r.branch(doesExist, '', r.dbCreate(DB_NAME));
      }).run(conn, function(err){
        if(err) {
          console.error('CloudMsgr - init schema - Failed to create DB: '
          + err);
        }
        // close the connection
        conn.close(callback(err));
      });
    }
  });
}

/**
 * Connects to RethinkDB and validates that the needed
 * tables are indeed in the database; otherwise create them.
 *
 * @param {function} callback - the callback function
 */
function initTables(callback) {
  r.connect({'host': 'localhost', 'db': DB_NAME}, function(error, conn){
    if(error) {
      console.error('CloudMsgr - init tables - Failed to connect to DB'
      + error);
      callback(error);
    } else {
      // create the tables as needed
      r.tableList().contains(TABLE_NAME_USR)
      .do(r.branch(r.row, r.tableList(), r.do(function() {
        return r.tableCreate(TABLE_NAME_USR, {'primaryKey': 'emial'})
        .do(r.tableList());
      }))).contains(TABLE_NAME_MSG)
      .do(r.branch(r.row, r.tableList(), r.do(function() {
        return r.tableCreate(TABLE_NAME_MSG, {'primaryKey': 'emial'})
        .do(r.tableList());
      }))).contains(TABLE_NAME_CONV)
      .do(r.branch(r.row, r.tableList(), r.do(function() {
        return r.tableCreate(TABLE_NAME_CONV).do(r.tableList());
      }))).run(conn, function(err){
        if(err) {
          console.error('CloudMsgr - init tables - Unexpected error has occured: '
          + err);
          callbacl();
        } else {
          callback();
        }
        conn.close(function(error){
          if (error) {
            console.error('CloudMsgr - init tables - An error occured while '
            + 'closing connection');
          }
        });
      });
    }
  });
}

/**
 * Add a user to to the database.
 *
 * @param {object} user - the user object with email, password and name
 * @param {function} callback - a callbackfucntion
 */
function createUser(user, callback){
  r.connect({'host': 'localhost', 'db': DB_NAME}, function(error, conn) {
    if(error) {
      console.error('CloudMsgr - create user - Failed to connect to RethinkDB: '
      + error);
      callback(error);
    } else {
      r.table(TABLE_NAME_USR).insert(user).run(conn, function(results){
        if(results.errors > 0) {
          Console.error('CloudMsgr - create user - Failed to store user in DB: '
          + user.email);
          callback(results);
        } else {
          callback();
        }
        conn.close(function(error){
          if (error) {
            console.error('CloudMsgr - create user - An error occured while '
            + 'closing connection');
          }
        });
      });
    }
  });
}

/**
 * Adds a new conversation to the DB for given participants.
 *
 * @param {array} participants - an aary of email address of people
 * @param {function} callback - the callback function
 */
function createConverstaion(participants, callback) {
  r.connect({'host': 'localhost', 'db': DB_NAME}, function(error, conn) {
    if(error) {
      console.error('CloudMsgr - create createConverstaion - Failed to '
        + 'connect to RethinkDB: ' + error);
      callback(error);
    } else {
      r.table(TABLE_NAME_CONV).insert({COLUMN_NAME_PARTICIPANTS: participants})
      .run(conn, function(results){
        if(results.errors > 0) {
          Console.error('CloudMsgr - create user - Failed to store user in DB: '
          + user.email);
          callback(results);
        } else {
          callback();
        }
        conn.close(function(error) {
          if (error) {
            console.error('CloudMsgr - create user - An error occured while '
            + 'closing connection');
          }
        });
      });
    }
  });
}

/**
 * Reterns all the converstaios for a given participant.
 *
 * @param {string} userID - the user unique id (emial)
 * @param {function} callback - the callback functon
 */
function getConversiontrionsFor(userID, callback) {
  r.connect({'host': 'localhost', 'db': DB_NAME}, function(error, conn) {
    if(error) {
      console.error('CloudMsgr - create createConverstaion - Failed to '
        + 'connect to RethinkDB: ' + error);
      callback(error);
    } else {
      r.table(TABLE_NAME_CONV).filter(r.row(COLUMN_NAME_PARTICIPANTS)
      .contains(userID)).run(conn, function(results){
        callback(results);
        conn.close(function(error) {
          if (error) {
            console.error('CloudMsgr - conversations - An error occured while '
            + 'closing connection');
          }
        });
      });
    }
  });
}

function getMessagesIn(convoId, callback) {
  r.connect({'host': 'localhost', 'db': DB_NAME}, function(error, conn) {

  });
}

module.exports = {
  initSchema: initSchema,
  initTables: initTables,
  createUser, createUser
};

'use-strct'

let r = require('rethinkdb');

const DB_NAME = 'cloudmsgr';
const TABLE_NAME_USR = 'users';
const TABLE_PRIM_KEY_USR  = 'email';
const TABLE_NAME_MSG = 'messages';
const TABLE_NAME_CONV = 'conversations';
const COLUMN_NAME_PARTICIPANTS = 'participants';
const COLUMN_NAME_MESSAGES = "messages"

/**
 * Connects to RethinkDB and creates the needed
 * database for CloudMsgr.
 *
 * @param {function} callback - the callback function
 */
function initSchema(callback) {
  r.connect('localhost', function(error, conn){
    if(error) {
      console.error('DB Helper - init schema - Failed to connect to RethinkDB: '
      + error);
      callback(error);
    } else {
      // check whether rthe database already exist
      // otherwise create it
      r.dbList().contains(DB_NAME).do(function(doesExist){
        return r.branch(doesExist, '', r.dbCreate(DB_NAME));
      }).run(conn, function(err){
        if(err) {
          console.error('DB Helper - init schema - Failed to create DB: '
          + err);
        }
        // close the connection
        conn.close(callback(err));
      });
    }
  });
}

/**
 * Utility function for establishing DB connections
 *
 * @param {function} callback - the callback function
 */
function dbConnect(callback) {
  r.connect({'host': 'localhost', 'db': DB_NAME}, callback);
}

/**
 * Connects to RethinkDB and validates that the needed
 * tables are indeed in the database; otherwise create them.
 *
 * @param {function} callback - the callback function
 */
function initTables(callback) {
  dbConnect(function(error, conn){
    if(error) {
      console.error('DB Helper - init tables - Failed to connect to DB'
      + error);
      callback(error);
    } else {
      // create the tables as needed
      r.tableList().contains(TABLE_NAME_USR)
      .do(r.branch(r.row, r.tableList(), r.do(function() {
        return r.tableCreate(TABLE_NAME_USR, {'primaryKey': TABLE_PRIM_KEY_USR })
        .do(r.tableList());
      }))).contains(TABLE_NAME_MSG)
      .do(r.branch(r.row, r.tableList(), r.do(function() {
        return r.tableCreate(TABLE_NAME_MSG)
        .do(r.tableList());
      }))).contains(TABLE_NAME_CONV)
      .do(r.branch(r.row, r.tableList(), r.do(function() {
        return r.tableCreate(TABLE_NAME_CONV).do(r.tableList());
      }))).run(conn, function(err){
        if(err) {
          console.error('DB Helper - init tables - Unexpected error has occured: '
          + err);
          callbacl();
        } else {
          callback();
        }
        conn.close(function(error){
          if (error) {
            console.error('DB Helper - init tables - An error occured while '
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
 * @param {function} callback - a callback fucntion
 */
function createUser(user, callback){
  dbConnect(function(error, conn) {
    if(error) {
      console.error('DB Helper - create user - Failed to connect to RethinkDB: '
      + error);
      callback(error);
    } else {
      r.table(TABLE_NAME_USR).insert(user).run(conn, function(err){
        if(err) {
          Console.error('DB Helper - create user - Failed to store user in DB: '
          + user.email);
          callback(null, results);
        } else {
          callback();
        }
        conn.close(function(error){
          if (error) {
            console.error('DB Helper - create user - An error occured while '
            + 'closing connection');
          }
        });
      });
    }
  });
}

/**
 * Fetches a user from DB ny his/her userID
 *
 * @param {string} userID - the unique user indentifier (email)
 * @param {functon} callback - the callback function
 */
function getUser(userID, callback) {
  dbConnect(function(error, conn) {
    if(error) {
      console.error('DB Helper - get user - Failed to connect to RethinkDB: '
        + error);
      callback(error);
    } else {
      r.table(TABLE_NAME_USR).get(userID).run(conn, function(err, cursor) {
        if(err) {
          console.error('DB Helper - get user - An error occured while fetching'
          + ' user {' + userID + '} from DB');
        }
        callback(err, cursor);
        conn.close(function(error){
          if (error) {
            console.error('DB Helper - get user - An error occured while'
            + ' closing connection');
          }
        });
      });
    }
  });
}

/**
 * Helper for getting all the user in CloudMsgr.
 *
 * @param {function} callback - the callback function
 */
function getAllUsers(callback) {
  dbConnect(function(error, conn) {
    if(error) {
      console.error('DB Helper - get all users - Failed to connect to'
        +' RethinkDB: '+ error);
      callback(error);
    } else {
      r.table(TABLE_NAME_USR).withFields('email', 'first_name', 'last_name')
      .run(conn, function(err, cursor) {
        if(err) {
          console.error('DB Helper - get all users - An error occured while'
          + ' queryinh the DB');
          callback(err)
        } else {
          cursor.toArray(function(err, results) {
            if (err) {
              console.error('DB Helper - get all users - An error occured while'
              + ' fetching the uses from DB');
              callback(error)
            } else {
              callback(null, results);
            }
          });
        }
        conn.close(function(error){
          if (error) {
            console.error('DB Helper - get all users - An error occured while '
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
 * @param {object} conv - the conversta oject
 * @param {function} callback - the callback function
 */
function createConverstaion(conv, callback) {
  dbConnect(function(error, conn) {
    if(error) {
      console.error('DB Helper - create converstaion - Failed to '
        + 'connect to RethinkDB: ' + error);
      callback(error);
    } else {
      r.table(TABLE_NAME_CONV).insert(conv).run(conn, function(err){
        if(err) {
          Console.error('DB Helper - create converstaion - Failed to '
           + 'store conversation in DB: '+ conv.id);
          callback(null, results);
        } else {
          callback(err);
        }
        conn.close(function(error) {
          if (error) {
            console.error('DB Helper - create converstaion - An error '
            + 'occured while closing connection');
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
  dbConnect(function(error, conn) {
    if(error) {
      console.error('DB Helper - get converstaion for user - Failed to '
        + 'connect to RethinkDB: ' + error);
      callback(error);
    } else {
      r.table(TABLE_NAME_CONV).filter(r.row(COLUMN_NAME_PARTICIPANTS)
      .contains(userID)).run(conn, function(err, cursor){
        if(err) {
          console.error('DB Helper - get all users - An error occured while'
          + ' queryinh the DB');
          callback(err)
        } else {
          cursor.toArray(function(err, results) {
            if (err) {
              console.error('DB Helper -get converstaion for user - An error'
                + ' occured while fetching the uses from DB');
              callback(error)
            } else {
              callback(null, results);
            }
          });
        }
        conn.close(function(error) {
          if (error) {
            console.error('DB Helper - get conversations for use - An error '
              + 'occured while closing connection');
          }
        });
      });
    }
  });
}

/**
 * Adds a user message to a converstation.
 *
 * @param {string} convoId - the converation unique identifier
 * @param {object} message - the message object
 * @param {function} callback - the callback function
 */
function addMessageto(convoId, message, callback) {
  dbConnect(function(error, conn) {
    if(error) {
      console.error('DB Helper - add messages to conversation - Failed to '
        + 'connect to RethinkDB: ' + error);
      callback(error);
    } else {}
  });
}

/**
 * Helper that produces a list of messages in a given conversation.
 *
 * @param {string} convoId - the conversation unique identifier
 * @param {number} resultSize - the numberr of results to return
 * @param {number} page - the page number
 * @param {function} callback - the callback function
 */
function getMessagesIn(convoId, resultSize, page, callback) {
  dbConnect(function(error, conn) {
    if(error) {
      console.error('DB Helper - get messages In conversation - Failed to '
        + 'connect to RethinkDB: ' + error);
      callback(error);
    } else {}
  });
}

module.exports = {
  initSchema: initSchema,
  initTables: initTables,
  createUser, createUser,
  getUser: getUser,
  getAllUsers: getAllUsers,
  createConverstaion: createConverstaion,
  getConversiontrionsFor: getConversiontrionsFor,
  getMessagesIn: getMessagesIn
};

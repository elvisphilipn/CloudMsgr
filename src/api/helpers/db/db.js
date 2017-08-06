'use-strct'

let r = require('rethinkdb');

const DB_NAME = 'cloudmsgr';
const TABLE_NAME_USR = 'users';
const TABLE_NAME_MSG = 'messages';

/**
 * Connects toRethinkDB and creates the needed
 * database for CloudMsgr.
 *
 * @param {function} callback - the callback function
 */
function initSchema(callback) {
  r.connect('localhost', function( error, conn){
    if(error) {
      console.error('CloudMsgr - Filed to connect to DB: ' + error);
      callback(error);
    } else {
      // check whether rthe database already exist
      // otherwise create it
      r.dbList().contains(DB_NAME).do(function(doesExist){
        return r.branch(doesExist, '', r.dbCreate(DB_NAME));
      }).run(conn, function(err){
        if(err) {
          console.error('CloudMsgr - File to create DB: ' + err);
        }
        // close the connection
        conn.close(callback(err));
      });
    }
  });
}

module.exports = {
  initSchema: initSchema
};

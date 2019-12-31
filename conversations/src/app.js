'use strict';

const SWAGGER_EXPRESS = require('swagger-express-mw');
const EXPRESS = require('express');
const APP = EXPRESS();
const SWAGGER_UI = require('swagger-tools/middleware/swagger-ui');
const DB_HELPER = require('./api/helpers/db');
const SANITIZE = require('sanitize')
module.exports = APP; // for testing

var config = {
  appRoot: __dirname // required config
};

// Init rethinkdb
DB_HELPER.initSchema(function(error) {
  if(error) {
    // TO-DO
  } else {
    // all is good
    DB_HELPER.initTables(function() {
      if(error) {
        // TO-DO
      }
    });
  }
});

// Start Swagger-Express
SWAGGER_EXPRESS.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  // add swagger-ui
  APP.use(SWAGGER_UI(swaggerExpress.runner.swagger));

  // add sanitize
  APP.use(SANITIZE.middleware);

  // add bootstrap
  APP.use('/', EXPRESS.static(__dirname + '/ui')); // redirect root
  APP.use('/js', EXPRESS.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
  APP.use('/js', EXPRESS.static(__dirname + '/node_modules/jquery/dist')); // redirect JS jQuery
  APP.use('/css', EXPRESS.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap

  // install middleware
  swaggerExpress.register(APP);

  var port = process.env.PORT || 8080;
  APP.listen(port);

  if (swaggerExpress.runner.swagger.paths['/hello']) {
    console.log('try this:\ncurl http://127.0.0.1:' + port + '/hello?name=Scott' +
      '\ncurl http://127.0.0.1:' + port + '/docs');
  }
});

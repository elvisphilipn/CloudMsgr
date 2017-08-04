'use strict';

const SWAGGER_EXPRESS = require('swagger-express-mw');
const APP = require('express')();
const SWAGGER_UI = require('swagger-tools/middleware/swagger-ui');
module.exports = APP; // for testing

var config = {
  appRoot: __dirname // required config
};

SWAGGER_EXPRESS.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  // add swagger-ui
  APP.use(SWAGGER_UI(swaggerExpress.runner.swagger));

  // install middleware
  swaggerExpress.register(APP);

  var port = process.env.PORT || 10010;
  APP.listen(port);

  if (swaggerExpress.runner.swagger.paths['/hello']) {
    console.log('try this:\ncurl http://127.0.0.1:' + port + '/hello?name=Scott' +
      '\ncurl http://127.0.0.1:' + port + '/docs');
  }
});

'use strict';

const {spawn}  = require('child_process');

// Start Rethink DB
const RETHNKDB = spawn('rethinkdb', [
  '-d', '/opt/db_files',
  '--bind', 'all',
  '--http-port', '8081']);

RETHNKDB.stdout.on('data', (data) => {
  console.log(`RETHNKDB - stdout: ${data}`);
});

RETHNKDB.stderr.on('data', (data) => {
  console.log(`RETHNKDB - stderr: ${data}`);
});

RETHNKDB.on('close', (code) => {
  console.log(`RETHNKDB child process exited with code ${code}`);
});

// Stary Swagger (REST Service)
let options = {
  env: {
    'PORT': '8080'
  }
};
const SWAGGER = spawn('node', ['app.js'], options);

SWAGGER.stdout.on('data', (data) => {
  console.log(`SWAGGER - stdout: ${data}`);
});

SWAGGER.stderr.on('data', (data) => {
  console.log(`SWAGGER - stderr: ${data}`);
});

SWAGGER.on('close', (code) => {
  console.log(`SWAGGER child process exited with code ${code}`);
});

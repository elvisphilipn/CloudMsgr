const {spawn}  = require('child_process');

// Start Rethink DB
// TO-DO

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

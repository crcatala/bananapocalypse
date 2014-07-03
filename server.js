var express       = require('express');
var app           = express();
var server        = require('http').createServer(app);
var path          = require('path');
var arduinoSocket = require('./js/arduino-socket.js').startArduino(server);

server.listen(8000);
console.log("Listening for new clients on port 8000");

app.use(express.static(path.join(__dirname, '/')));
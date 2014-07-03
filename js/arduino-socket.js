var startArduino = function (server) {
  var serialport   = require("serialport");
  var SerialPort   = serialport.SerialPort
  var portName     = '/dev/ttyACM0';
  var myPort = new SerialPort(portName, {
    baudrate: 38400,
    parser: serialport.parsers.readline("\r\n")
  }, false);

  myPort.open(function (error) {
    if(error) {
      console.log(error);
    } else {
      establishSocketConnection();
    }
  });

  function establishSocketConnection() {
    console.log("inside establishSocketConnection");
    var io = require('socket.io').listen(server, {log: false});

    // ===========
    // Socket Code
    // ===========
    var connected = false;

    // var counter = 1;
    var INTERVAL = 10;
    var RESET_VAL = Math.floor(INTERVAL/7);
    var mockData = false;

    io.sockets.on('connection', function (socket) {

      // socket.emit('intervalData', {interval: INTERVAL});

      if (!connected) {
        console.log('user connected');
        connected = true;
      }

      socket.on('disconnect', function () {
        console.log('user disconnected');
        connected = false;
      });

      socket.on('record', function () {
        if (mockData) {
          timerID = setInterval(emitData, INTERVAL);
        } else {
          myPort.write('c');
          console.log("started listening on serial port...");
        }
        console.log('record event was received');
      });

      socket.on('stop', function () {
        if (mockData) {
          clearInterval(timerID);
        } else {
          myPort.write('x');
          console.log("stopped listening on serial port...");
        }
        console.log('stop event was received');
      });

      myPort.on('data', function (data) {
        // console.log("data recieved...", data, "| counter: ", counter);
        // console.log(data);
        var dataArray = data.split(",");
        // var x    = parseFloat(dataArray[0]);
        var y    = parseFloat(dataArray[1]);
        var z    = parseFloat(dataArray[2]);

        // steady state:
        // x: 0.10 y:  2.40 z: -10.50

        // Left
        // x: 0.05 y:  -4.10 z:  -9.90

        // Right
        // x: 0.20 y: 7.50 z: -7.50

        if (y<-2.50) { // Left
          // console.log("left");
          serialData = { 
            left  : true,
            right : false,
            up    : false,
            down  : false
          };
        } else if (y> 8.50) { // Right
          // console.log("right");
          serialData = {
            left  : false,
            right : true,
            up    : false,
            down  : false
          };
        } else if (z>-3.50) { // Up
          // console.log("up");
          serialData = {
            left  : false,
            right : false,
            up    : true,
            down  : false
          };
        } else if (z<-22.50) {  // Down
          // console.log("------------------------down");
          serialData = {
            left  : false,
            right : false,
            up    : false,
            down  : true
          };
        } else {
          // console.log("---");
          serialData = {
            left  : false,
            right : false,
            up    : false,
            down  : false
          };
        }

        socket.emit('serialEvent', serialData);
      });

      // =========
      // Mock data
      // =========
      var timerID = 0;
      var emitData = function () {
        var x = Math.floor(Math.random()*160)
        var y = Math.floor(Math.random()*160)
        var z = Math.floor(Math.random()*160)
        var fsr1 = Math.floor(Math.random()*160)
        var data = {"x": x, "y": y, "z": z, "fsr1": fsr1};
        socket.emit('mockData', data);
      };

    });
  }
}
exports.startArduino = startArduino;
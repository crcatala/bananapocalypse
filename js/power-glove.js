window.PowerGlove = window.PowerGlove || {};

(function () {

  window.PowerGlove.controls = { 
    left  : false,
    right : false,
    up    : false,
    down  : false
  };

  var socket = io.connect();
  console.log("socket-client...");

  socket.on('connect', function () {
    console.log("connected to server...");
  });

  var recording = false;

  socket.on('disconnect', function () {
    if (recording) { 
      recording = false; 
    }
    console.log("disconnected from server...");
  });

  $('#start-button').on('click', function (){
    if (!recording) {
      recording = true;
      console.log("emitting record");
      socket.emit('record');
    }
  });

  $('#stop-button').on('click', function (){
    console.log("clicked on stop");
    if (recording) {
      recording = false;
      socket.emit('stop');
    }
  });

  socket.on('serialEvent', function (data) {
    window.PowerGlove.controls = data;
    // console.log(this.controls);
  });
})();
window.PowerGlove = window.PowerGlove || {};
PowerGlove.left  = false;
PowerGlove.right = false;
PowerGlove.up    = false;

var socket = io.connect();
console.log("socket-client...");
socket.on('connect', function () {
  console.log("connected to server...");
});

var recording = false;

socket.on('disconnect', function () {
  // if (recording) { 
  //   recording = false; 
  //   outputData();
  // }
  console.log("disconnected from server...");
});

$('#start-button').on('click', function (){
  console.log("clicked on start");
  if (!recording) {
    recording = true;
    socket.emit('record');
  }

});

$('#stop-button').on('click', function (){
  console.log("clicked on stop");
  if (recording) {
    socket.emit('stop');
  }
});

socket.on('serialEvent', function (data) {
  PowerGlove.left  = data.left;
  PowerGlove.right = data.right;
  PowerGlove.up    = data.up;
});

socket.on('mockData', function (data) {
  // console.log("mock data: ", data);
  elX.html(data.x);
  elY.html(data.y);
  elZ.html(data.z);
  elFSR1.html(data.fsr1);
});

// socket.on('intervalData', function (data){
//   console.log("interval is: ", data.interval);
//   interval = data.interval;
// });
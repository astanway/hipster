var express = require('express')
var app = express.createServer()
var static = require('node-static');
var jquery = require('jquery');
var io = require('socket.io').listen(app);

app.listen(8080);

app.use(express.static(__dirname + "/js"));

var root = ''

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/phone.html');
});

app.get('/browser', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

io.sockets.on('connection', function (socket) {
  socket.on('velocity', function(data){
    if(data.b > 0 && Math.abs(data.g) < 70){
      angle = data.b
      console.log("upward strike " + angle)
    }
    
    if(data.b > 0 && Math.abs(data.g) >= 70){
      angle = 180 - data.b
      console.log("downward strike " + angle)
    }
    
    if(data.b < 0){
      angle = 180 - data.b
      console.log("underhand strike " + angle);
    }
  })
  
  
  
  setInterval(function(){
    socket.emit('getVelocity')
  }, 2000)
});

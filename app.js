  var express = require('express')
var app = express.createServer()
var static = require('node-static');
var jquery = require('jquery');
var io = require('socket.io').listen(app);

app.listen(8080);

app.use(express.static(__dirname + "/js"));

var root = ''

app.get('/stageleft', function (req, res) {
  res.sendfile(__dirname + '/phone.html');
});

app.get('/stageright', function (req, res) {
  res.sendfile(__dirname + '/phone.html');
});

app.get('/browser', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

io.sockets.on('connection', function (socket) {
  socket.on('clientVelocity', function(data){
    if(data.b > 0 && Math.abs(data.g) < 70){
      angle = data.b
      data['angle'] = angle
      console.log("upward strike " + angle)
      socket.broadcast.emit('fuckingVelocity', data)
    }
    
    if(data.b > 0 && Math.abs(data.g) >= 70){
      angle = 180 - data.b
      data['angle'] = angle
      console.log("downward strike " + angle)
      socket.broadcast.emit('fuckingVelocity', data)
    }
    
    if(data.b < 0){
      angle = Math.abs(data.b)
      data['angle'] = angle
      socket.broadcast.emit('fuckingVelocity', data)
    }
  })

  socket.on('wantVelocity', function(data){
    console.log("want");
    if(data == 1){
      socket.broadcast.emit('getstagerightVelocity')
    } else {
      socket.broadcast.emit('getstageleftVelocity') 
    }
  })
});

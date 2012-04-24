var express = require('express')
var app = express.createServer()
var static = require('node-static');
var jquery = require('jquery');
var io = require('socket.io').listen(app);

//this was only here so we could say that we were webscale
//var mongoose = require('mongoose');
//var Schema = mongoose.Schema;
//var db = mongoose.connect("mogodb://localhost/hipster");
//var Winners = mongoose.model('Winners', new Schema({"i" : String}));
//var win = new Winners({"i" : "win"});
//win.save();

app.listen(8080);

app.use(express.static(__dirname + "/public"));

var root = ''

app.get('/stageleft', function (req, res) {
  res.sendfile(__dirname + '/phone.html');
});

app.get('/stageright', function (req, res) {
  res.sendfile(__dirname + '/phone.html');
});

app.get('/browser', function (req, res) {
  res.sendfile(__dirname + '/public/index.html');
});

io.sockets.on('connection', function (socket) {
  socket.on('clientVelocity', function(data){
    if(data.b > 0 && Math.abs(data.g) < 70){
      angle = data.b
      data['angle'] = angle
      socket.broadcast.emit('fuckingVelocity', data)
    }
    
    if(data.b > 0 && Math.abs(data.g) >= 70){
      angle = 180 - data.b
      data['angle'] = angle
      socket.broadcast.emit('fuckingVelocity', data)
    }
    
    if(data.b < 0){
      angle = Math.abs(data.b)
      data['angle'] = angle
      socket.broadcast.emit('fuckingVelocity', data)
    }
  })

  socket.on('wantVelocity', function(data){
    if(data == 1){
      socket.broadcast.emit('getstagerightVelocity')
    } else {
      socket.broadcast.emit('getstageleftVelocity') 
    }
  })
  
  socket.on('hit', function(data){
    socket.broadcast.emit('browserHit', data)
  })
});

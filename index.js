var express = require('express');
var socket =  require('socket.io');
var app = express();
app.use(express.static('public'));
app.get('/', function(req,res) {
    res.render("index.html");
});

var server = app.listen(process.env.PORT || 5000,process.env.IP,function() {
    console.log("server listening");
});

var io = socket(server);

io.on('connection',function(socket) {
    console.log("user connected");

    socket.on('message', function(data) {
        io.sockets.emit('message',data);
    });

    socket.on('typing', function(data) {
        socket.broadcast.emit('typing',data);
    })
});
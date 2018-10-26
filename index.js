var express = require('express');
var socket =  require('socket.io');
var app = express();
app.use(express.static('public'));

app.get('/', function(req,res) {
    res.render("index.ejs");
});
app.get('/about',function(req,res) {
    res.render("about.ejs");
})
var server = app.listen(process.env.PORT || 5000,process.env.IP,function() {
    console.log("server listening");
});

var io = socket(server);
var pplonline = 0;
io.on('connection',function(socket) {
    console.log("user connected");
    pplonline++;
    socket.on('message', function(data) {
        console.log("in server");
        io.sockets.emit('message',data);
    });

    socket.on('typing', function(data) {
        socket.broadcast.emit('typing',data);
    });
    
    socket.on('nottyping', function() {
        socket.broadcast.emit('nottyping');
    });
});
io.on('disconnection',function() {
    pplonline--;
});
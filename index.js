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
var nameList = [];

io.on('connection',function(socket) {
    console.log("user connected");
    socket.on('name', function(data) {
        nameList[pplonline] = data.name;
        pplonline ++;
    });

    socket.on('message', function(data) {
        io.sockets.emit('message',data);
    });

    socket.on('typing', function(data) {
        socket.broadcast.emit('typing',data);
    });
    
    socket.on('nottyping', function() {
        socket.broadcast.emit('nottyping');
    });
    
    socket.on('getUsers', function() {
        socket.emit('getUsers', {
            users:  nameList,
            noOfUsers:  pplonline
        });
    });
    socket.on('disconnect', function(data) {
        console.log("disconnected");
        nameList.forEach(function (ele,i) {
            if(ele === data.name) {
                nameList.splice(i,1);
            }
        });
        pplonline--;
    });
    socket.on('userDelete',function(data) {
        console.log("user");
        
    });
});
 
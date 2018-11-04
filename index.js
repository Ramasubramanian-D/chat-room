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
        nameList.push({
            name: data.name,
            id: data.id
        });
        pplonline ++;
        console.log(nameList);
    });

    socket.on('newUser',function(data) {
        socket.broadcast.emit('newUser',data);
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
    socket.on('deleteUser', function(data) {
        for(var i = 0;i<pplonline;i++) {
            if(data.id == nameList[i].id) {
                nameList.splice(i,1);
                break;
            }
        }
        console.log(nameList);
    });
});


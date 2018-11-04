// Initializing the libraries.

var express = require('express');
var socket =  require('socket.io');
var app = express();
app.use(express.static('public'));

// Setting up the routes

app.get('/', function(req,res) {
    res.render("index.ejs");
});
app.get('/about',function(req,res) {
    res.render("about.ejs");
});

var server = app.listen(process.env.PORT || 5000,process.env.IP,function() {
    console.log("server listening");
});

// setting up the web socket in the server side
var io = socket(server);
var pplonline = 0; // indicates people online
var nameList = []; // has the names of people whoare currently online along with their socket ID's

io.on('connection',function(socket) {
    
    // new user has logged in
    socket.on('name', function(data) {
        // adding the user to the list
        nameList.push({
            name: data.name,
            id: data.id
        });
        pplonline ++;
    });

    // indicating other users that a new user has joined.
    socket.on('newUser',function(data) {
        socket.broadcast.emit('newUser',data);
    });

    // a message is sent.
    socket.on('message', function(data) {
        io.sockets.emit('message',data);
    });

    // the user is typing.
    socket.on('typing', function(data) {
        socket.broadcast.emit('typing',data);
    });
    socket.on('nottyping', function() {
        socket.broadcast.emit('nottyping');
    });
    
    // fetching the users currently online.
    socket.on('getUsers', function() {
        socket.emit('getUsers', {
            users:  nameList,
            noOfUsers:  pplonline
        });
    });

    // a user has left the chat.
    socket.on('deleteUser', function(data) {
        var temp;
        for(var i = 0;i<pplonline;i++) {
            if(data.id == nameList[i].id) {
                // to indicate that the use has left the chat
                socket.broadcast.emit('deleteUser',{name: nameList[i].name});
                nameList.splice(i,1); // removing the user
                pplonline--; 
                break;
            }
        }
    });
});


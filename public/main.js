// making socket connection in the client side
var socket = io.connect('/');

// getting the variables

var output = document.getElementById('out');

var nameVal = document.getElementById('name'),
    message = document.getElementById('message'),
    send = document.getElementById('send'),
    userlist = document.getElementById('userList'),
    getNewUser = document.getElementById('gn'),
    online = document.getElementById('online'),
    noUser =document.getElementById('no'),
    type = document.getElementById('typing');

// adding DOM events

//Adding name to the user list
getNewUser.addEventListener('click',function() {
    if(nameVal.value !== '') {
        socket.emit('name', {
            name: nameVal.value,
            id: socket.id
        });
        $('#getName').modal('close');
        socket.emit('newUser',{
            name: nameVal.value
        });
    } else {
        alert('Enter a valid name');
    }
});

// client sending a message
send.addEventListener('click',function() {
    send.style.border = "1px solid cadetblue";
    if(message.value !== '') {
        // sending the message to the server.
        socket.emit('message', {
            id: socket.id,
            name: nameVal.value,
            message: message.value
        });
        message.value = "";
    } else {
        alert("You cannot send an empty message");
    }
});

// to check if client is typing
message.addEventListener('keypress',function() {
    socket.emit('typing',{name: nameVal.value});
});
message.addEventListener('keyup',function() {
    socket.emit('nottyping');
});

// getting the list of online users.
userlist.addEventListener('click',function() {
    socket.emit('getUsers');
});

// a user is disconnecting
$(document).ready(function()
{
    $(window).bind("beforeunload", function() { 
        socket.emit('deleteUser', {
            id: socket.id,
            name: nameVal.value
        });
    });
});

// adding socket events 

// a message is recieved.
socket.on('message',function(data) {
    if(data.id == socket.id) 
        output.innerHTML += '<div class="card user lighten-4"><div class="card-content"><b style="font-size:16px;color:#3e508a;"> You: </b><br/> &emsp;' + data.message + '</div></div>';
    else 
        output.innerHTML += '<div class="card othuser "><div class="card-content"><b style="font-size:16px;color:#521616;">' + data.name + ': </b><br/> &emsp;' + data.message + '</div></div>';
    output.scrollTop = output.scrollHeight;
});

// another user is typing.
socket.on('typing',function(data) {
    type.innerHTML = '<p style="font-size: 16px;padding-left: 1%;"><em>' + data.name + ' is typing.</em></p>';
});
socket.on('nottyping',function() {
    setTimeout(function() {
        type.innerHTML = '';
        var usersAreHere ;
        
    },600);
});

// getting the users online.
socket.on('getUsers',function(data) {
    online.innerHTML = '';
    data.users.forEach(element => {
    online.innerHTML += '<li class="collection-item contentTheme" style="border:none;border-bottom:1px solid black;font-size: 18px;"> <i class="material-icons" style="color:#b2ff59;font-size: 16px;"> fiber_manual_record</i> &emsp;'+ element.name + '</li>';
    });
    noUser.textContent = data.noOfUsers;
    usersAreHere = data;
});

//Indicating that a new user has joined
socket.on('newUser',function(data) {
    output.innerHTML += '<p style="color:white;font-size:14px;font-weight:300;text-align:center;"><em>'+ data.name +' joined the chat. Say hi ! </em></p>'
});

//Indicating that a user has left.
socket.on('deleteUser', function(data) {
    output.innerHTML += '<p style="color:white;font-size:14px;font-weight:300;text-align:center;"><em>'+ data.name +' left the chat. </em></p>'
});
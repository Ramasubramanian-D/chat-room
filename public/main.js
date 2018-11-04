// making socket connection

var socket = io.connect('/');

// getting the variables

var output = document.getElementById('out');
var s = document.getElementById('name'),
    message = document.getElementById('message'),
    send = document.getElementById('send'),
    userlist = document.getElementById('userList'),
    gn = document.getElementById('gn'),
    online = document.getElementById('online'),
    no =document.getElementById('no'),
    type = document.getElementById('typing');

// adding DOM events

gn.addEventListener('click',function() {
    if(s.value !== '') {
        socket.emit('name', {
            name: s.value,
            id: socket.id
        });
        $('#getName').modal('close');
        socket.emit('newUser',{
            name: s.value
        });
    } else {
        alert('Enter a valid name');
    }
});

send.addEventListener('click',function() {
    send.style.border = "1px solid cadetblue";
    if(message.value !== '') {
        socket.emit('message', {
            id: socket.id,
            name: s.value,
            message: message.value
        });
        message.value = "";
    } else {
        alert("You cannot send an empty message");
    }
});

message.addEventListener('keypress',function() {
    socket.emit('typing',{name: s.value});
});

message.addEventListener('keyup',function() {
    socket.emit('nottyping');
});

userlist.addEventListener('click',function() {
    socket.emit('getUsers');
});

$(document).ready(function()
{
    $(window).bind("beforeunload", function() { 
        socket.emit('deleteUser', {
            id: socket.id
        });
        return confirm("Do you really want to close?"); 
    });
});

// adding socket events 

socket.on('message',function(data) {
    if(data.id == socket.id) 
        output.innerHTML += '<div class="card user lighten-4"><div class="card-content"><b style="font-size:16px;color:#3e508a;"> You: </b><br/> &emsp;' + data.message + '</div></div>';
    else 
        output.innerHTML += '<div class="card othuser "><div class="card-content"><b style="font-size:16px;color:#521616;">' + data.name + ': </b><br/> &emsp;' + data.message + '</div></div>';
    output.scrollTop = output.scrollHeight;
});

socket.on('typing',function(data) {
    type.innerHTML = '<p style="font-size: 16px;padding-left: 1%;"><em>' + data.name + ' is typing.</em></p>';
});

socket.on('nottyping',function() {
    setTimeout(function() {
        type.innerHTML = '';
    },600);
});
var usersAreHere ;

socket.on('getUsers',function(data) {
    online.innerHTML = '';
    data.users.forEach(element => {
    online.innerHTML += '<li class="collection-item contentTheme" style="border:none;border-bottom:1px solid black;font-size: 18px;"> <i class="material-icons" style="color:#b2ff59;font-size: 16px;"> fiber_manual_record</i> &emsp;'+ element.name + '</li>';
    });
    no.textContent = data.noOfUsers;
    usersAreHere = data;
});

socket.on('newUser',function(data) {
    output.innerHTML += '<p style="color:white;font-size:14px;font-weight:300;text-align:center;"><em>'+ data.name +' joined the chat. Say hi ! </em></p>'
});




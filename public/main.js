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
            name: s.value
        });
        $('#getName').modal('close');
    } else {
        alert('Enter a valid name');
    }
});

send.addEventListener('click',function() {
    send.style.border = "1px solid cadetblue";
    socket.emit('message', {
        id: socket.id,
        name: s.value,
        message: message.value
    });
    message.value = "";
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
// adding socket events 

socket.on('message',function(data) {
    if(data.id == socket.id) 
        output.innerHTML += '<div class="card user lighten-4"><div class="card-content"><b style="font-size:16px;color:#3e508a;"> You: </b><br/> &emsp;' + data.message + '</div></div>';
    else 
        output.innerHTML += '<div class="card othuser "><div class="card-content"><b style="font-size:16px;color:#521616;">' + data.name + ': </b><br/> &emsp;' + data.message + '</div></div>';
    output.scrollTop = output.scrollHeight;
});

socket.on('typing',function(data) {
    type.innerHTML = '<p style="font-size: 14px;padding-left: 1%;"><em>' + data.name + ' is typing.</em></p>';
});

socket.on('nottyping',function() {
    setTimeout(function() {
        type.innerHTML = '';
    },600);
});

socket.on('getUsers',function(data) {
    data.users.forEach(element => {
    online.innerHTML += '<li class="collection-item contentTheme" style="border:none;border-bottom:1px solid black;font-size: 18px;"> <i class="material-icons" style="color:#b2ff59;font-size: 16px;"> fiber_manual_record</i> &emsp;'+ element + '</li>';
    });
    no.textContent = data.noOfUsers;
});


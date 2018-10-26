// making socket connection

var socket = io.connect('/');

// getting the variables

var output = document.getElementById('out');
var s = document.getElementById('name'),
    message = document.getElementById('message'),
    send = document.getElementById('send'),
    type = document.getElementById('typing');

// adding DOM events

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

// adding socket events 

socket.on('message',function(data) {
    if(data.id == socket.id) 
        output.innerHTML += '<div class="card user light-green lighten-4"><div class="card-content"><b> You: </b><br/> ' + data.message + '</div></div>';
    else 
        output.innerHTML += '<div class="card othuser"><div class="card-content"><b>' + data.name + ': </b><br/>  ' + data.message + '</div></div>';
});

socket.on('typing',function(data) {
    type.innerHTML = '<p style="font-size: 14px;padding-left: 1%;"><em>' + data.name + ' is typing.</em></p>';
});

socket.on('nottyping',function() {
    setTimeout(function() {
        type.innerHTML = '';
    },300);
});


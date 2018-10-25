var socket = io.connect('/');

// getting the variables

var output = document.getElementById('out');
var s = document.getElementById('name'),
    message = document.getElementById('message'),
    send = document.getElementById('send'),
    typing = document.getElementsByClassName('typing');

send.addEventListener('click',function() {
    send.style.border = "1px solid cadetblue";
    console.log(s.value);
    socket.emit('message', {
        id: socket.id,
        name: s.value,
        message: message.value
    });
    message.value = "";
});

message.addEventListener('change',function() {
    socket.emit('typing',{name: name.value});
});

socket.on('message',function(data) {
    output.innerHTML += '<p><strong>' + data.name + ': </strong> ' + data.message + '</p>';
    typing.innerHTML = '';
});

socket.on('typing',function(data) {
    typing.innerHTML = '<p>' + data.name + ' is typing.</p>';
})
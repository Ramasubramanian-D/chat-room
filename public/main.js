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

message.addEventListener('keypress',function() {
    socket.emit('typing',{name: name.value});
});

socket.on('message',function(data) {
    if(data.id == socket.id) 
        output.innerHTML += '<div class="card user light-green lighten-4"><div class="card-content"><b> You: </b><br/> ' + data.message + '</div></div>';
    else 
        output.innerHTML += '<div class="card othuser"><div class="card-content"><b>' + data.name + ': </b><br/>  ' + data.message + '</div></div>';
    typing.innerHTML = '';
});

socket.on('typing',function(data) {
    typing.innerHTML = '<p>' + data.name + ' is typing.</p>';
})
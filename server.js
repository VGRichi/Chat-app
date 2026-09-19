const express = require('express');
const path = require('path');

const app = express();
const server = require('http').createServer(app);

const io = require('socket.io')(server);

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', function (socket){
    socket.on("new-user", function (username){
        socket.broadcast.emit("update", username + " has joined the conversation");
    });
     socket.on("exit-chat", function (username){
        socket.broadcast.emit("update", username + " has left the conversation");
    });
    socket.on("chat", function (message){
        socket.broadcast.emit("chat", message);
    });
});

server.listen(5000) ;
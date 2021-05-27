const express = require('express');
var PORT = process.env.PORT || 5000;
const app = require('express')();
const server = require('http').createServer(app);
var bodyParser = require('body-parser');
app.use(bodyParser.json());
const io = require("socket.io")(server, {
    handlePreflightRequest: (req, res) => {
        const headers = {
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
            "Access-Control-Allow-Origin": "https://letswatchtogether-74191.web.app/", //or the specific origin you want to give access to,
            "Access-Control-Allow-Credentials": true
        };
        res.writeHead(200, headers);
        res.end();
    }
});
// Start backend

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/lobby.html');
});

app.use(express.static(__dirname));

io.on('connection', function (socket) {
    socket.on('playerEvent', function (msg) {
        console.log(msg);
        io.to(msg.roomID).emit('event', msg);
    });
    socket.on('newVideo', function (msg) {
        console.log(msg);
        io.to(msg.roomID).emit('newVideo', msg);
    });
    socket.on('joinRoom', function (msg) {
        console.log(msg);
        socket.join(msg);
    })
    socket.on('disconnect', () => {
        console.log('user left');
    });
    socket.on('new message', (data) => {
        console.log(data);
        let message = data.username + ": " + data.message;
        io.to(data.roomID).emit('message', (message));
    });
});


server.listen(PORT, () => {
    console.log(`listening on localhost:${PORT}`);
});


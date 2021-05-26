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
    res.sendFile(__dirname + '/index.html');
  });

app.use(express.static(__dirname));

io.on('connection', function (socket) {
    console.log('a user connected');
    socket.on('playerEvent', function (msg) {
        console.log(msg);
        io.sockets.emit('event', msg);
    });
    socket.on('newVideo', function(msg) {
        console.log(msg);
        io.sockets.emit('newVideo', msg);
    });
});

server.listen(PORT, () => {
    console.log(`listening on localhost:${PORT}`);
});


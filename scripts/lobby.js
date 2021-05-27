const socket = io();
let roomid;

function createRoom() {
    roomid = Math.floor(Math.random() * 90000) + 10000;;
    localStorage.setItem('id', roomid);
    socket.emit('joinRoom', roomid);
    window.location.replace("/index.html");
}
function joinRoom() {
    roomid = document.getElementById('roomidinput').value;
    if (roomid == null || roomid == '') {
        //do nothing
    } else {
        localStorage.setItem('id', roomid);
        socket.emit('joinRoom', roomid);
        window.location.replace("/index.html");
    }
}
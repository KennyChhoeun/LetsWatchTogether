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

// Allowing 'enter' on keyboard to trigger button click
var input = document.getElementById("roomidinput");

// Execute a function when the user releases a key on the keyboard
input.addEventListener("keyup", function(event) {
  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13) {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    document.getElementById("button-addon1").click();
  }
});
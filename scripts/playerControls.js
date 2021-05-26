var duration = document.getElementById('duration');
var playButton = $('.play');
var pauseButton = $('.pause');
playButton.click(function () {
    var mydata = { state: 'play', time: player.getCurrentTime() };
    socket.emit('playerEvent', mydata);
    console.log("SUP");
});

pauseButton.click(function () {
    var mydata = { state: 'pause', time: player.getCurrentTime() };
    socket.emit('playerEvent', mydata);
    console.log("SUP");
});
const socket = io();

var roomid = localStorage.getItem('id');
socket.emit('joinRoom', roomid);
document.getElementById("room display").innerHTML = "Room ID: " + roomid;

// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');
var searchurl = document.getElementById('search');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '480',
        width: '720',
        videoId: 'u6lihZAcy4s',
        playerVars: {
            'autoplay': 1,
            'controls': 1,
            'disablekb': 1,
            'modestbranding': 0,
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange,
        }
    });
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
    event.target.playVideo();
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),

function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING) {
        var mydata = { roomID: roomid, state: 'play', time: player.getCurrentTime() };
        socket.emit('playerEvent', mydata);
    }
    if (event.data == YT.PlayerState.PAUSED) {
        var mydata = { roomID: roomid, state: 'pause' }
        socket.emit('playerEvent', mydata);
    }
}

function stopVideo() {
    player.stopVideo();
}

function search() {
    console.log(searchurl.value);
}

function playVideo() {
    player.playVideo();
}

function pauseVideo() {
    player.pauseVideo();
}

// Socket listener
socket.on('event', function (msg) {
    if (msg.state == 'play') {
        if (Math.abs(msg.time - player.getCurrentTime()) > 1) {
            seekTo(msg.time);
        }
        playVideo();
    } else if (msg.state == 'pause') {
        pauseVideo();
    }
});

socket.on('newVideo', function (msg) {
    player.loadVideoById({
        videoId: msg.videoID,
    });
    var mydata = { roomID: roomid, state: 'play', time: player.getCurrentTime() };
    socket.emit('playerEvent', mydata);
});

function nextVid() {
    let videoID = searchurl.value.substr(32);
    if(videoID == '') {

    } else {
        let vidData = { roomID: roomid, videoID: videoID };
        socket.emit('newVideo', vidData);
    }
};

function setRoom() {
    roomid = document.getElementById('roomid').value;
    socket.emit('joinRoom', roomid);
}

function lowerVolume() {
    player.setVolume(player.getVolume() - 20);
}

function increaseVolume() {
    player.setVolume(player.getVolume() + 20);
}

function seekTo(seconds) {
    player.seekTo(seconds);
}

// chat
socket.on("connect", () => {
});
function sendChat() {
    let message = document.getElementById('inputchat').value;
    if (message == '') {
        //do nothing 
    } else {
        let id = socket.id
        id = id.substring(0, id.length - 12);
        let data = { username: "user_" +id, roomID: roomid, message: message }
        socket.emit('new message', data);
        // clear text field after sent message
        document.getElementById("inputchat").value = "";
    }
}
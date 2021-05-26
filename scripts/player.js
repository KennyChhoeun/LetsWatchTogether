const socket = io();

var promptAlert = prompt("Please enter Room ID to join", "123");
var roomid;
if (promptAlert == null || promptAlert == "") {
    alert("no room id try again");
} else {
    roomid = promptAlert;
    alert(roomid);
    socket.emit('joinRoom', roomid);
}
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
        videoId: 'gSc0o6xVnmY',
        playerVars: {
            'autoplay': 1,
            'controls': 1,
            'disablekb': 1,
            'modestbranding': 1,
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange,
        }
    });
}

function progressBarLoop() {
    var progressBar = $('.progressBar');
    var progressSquare = $('#square');
    progressBar.click(function (event) {
        var divOffset = $(this).offset()
        var seekTo = (event.pageX - divOffset.left) / 720 * player.getDuration();
        console.log(seekTo);
        var mydata = { roomID: roomid, state: 'play', time: seekTo };
        socket.emit('playerEvent', mydata);
        console.log(divOffset);
    });
    setInterval(function () {
        if (player == null || progressBar == null) {
            return;
        }
        var fraction = player.getCurrentTime() / player.getDuration() * 100;
        progressSquare.css("left", fraction.toFixed(0).toString() + "%");
    }, 200);
}
// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
    progressBarLoop();
    event.target.playVideo();
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
var done = false;
function onPlayerStateChange(event) {
    //console.log(event.data);
    if (event.data == YT.PlayerState.PLAYING && !done) {
        setTimeout(stopVideo, 6000);
        done = true;
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

socket.on('newVideo', function(msg) {
    player.loadVideoById({
        videoId: msg.videoID,
    });
    var mydata = { state: 'play', time: player.getCurrentTime() };
    socket.emit('playerEvent', mydata);
})

function nextVid() {
    let videoID = searchurl.value.substr(32);
    let vidData = { videoID: videoID };
    socket.emit('newVideo', vidData);
};

function setRoom() {
    let room_id= document.getElementById('roomid').value;
    socket.emit('joinRoom', room_id);
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
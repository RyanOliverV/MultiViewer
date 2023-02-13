$(document).ready(async function() {
  let displayInput = document.getElementById("video-url");
  let displayButton = document.getElementById("display-video");
  let containerDiv = document.getElementById("video-container");
  let syncInput = document.getElementById("sync-time");
  let player;
  let players = [];

  // Load the YT library
  var tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  displayButton.addEventListener("click", function() {
    addVideo();
  });
  
  function addVideo() {
    let videoID = displayInput.value.split("watch?v=")[1];
    let videoURL = displayInput.value;
    let innerDiv = document.createElement("div");
    innerDiv.className = "inner";
    innerDiv.id = "video-" + players.length;
    let outerDiv = document.createElement("div");
    outerDiv.id = "videoStyle";
    outerDiv.className = "draggable resizable";
    outerDiv.style.transform = "translate3d(100px, 100px, 0)";
    outerDiv.appendChild(innerDiv);
    containerDiv.appendChild(outerDiv);
  
    player = new YT.Player("video-" + players.length, {
      height: "100%",
      width: "100%",
      videoId: videoID,
    });
    
    player.addEventListener("onReady", onPlayerReady);
    players.push(player);
  
    init();
  
    // Add the Ajax call here
    $.ajax({
      type: "POST",
      dataType: 'json',
      contentType: 'application/x-www-form-urlencoded',
      url: `/video-board/${user_id}`,
      data: {video:JSON.stringify({
        video_id: videoID,
        video_url:videoURL,
        position: outerDiv.style.transform,
        width: outerDiv.offsetWidth,
        height: outerDiv.offsetHeight
      })},
      success: function(response) {
        console.log("Video URL added to the database successfully");
      },
      error: function(error) {
        console.error("Error adding the video URL to the database:", error);
      }
  });
  }

function onPlayerReady(event) {

  let playPauseButton = document.getElementById("play-pause-button");
  playPauseButton.addEventListener("click", function() {
    let allPaused = true;
    for (let player of players) {
      if (player.getPlayerState() === YT.PlayerState.PLAYING) {
        allPaused = false;
        break;
      }
    }
    for (let player of players) {
      if (allPaused) {
        playPauseButton.innerHTML = "<i class='fa fa-pause'></i>";
        player.playVideo();
      } else {
        playPauseButton.innerHTML = "<i class='fa fa-play'></i>";
        player.pauseVideo();
      }
    }
  });

      event.target.unMute();
      let soundButton = document.getElementById("sound-button");
      let isMuted = false;
      soundButton.addEventListener("click", function() {
        for (let player of players) {
          if (isMuted) {
            player.unMute();
          } else {
            player.mute();
          }
        }
      
        if (isMuted) {
          soundButton.innerHTML = "<i class='fa-solid fa-volume-xmark'></i>";
          isMuted = false;
        } else {
          soundButton.innerHTML = "<i class='fa-solid fa-volume-high'></i>";
          isMuted = true;
        }
      });      

  let syncButton = document.getElementById("sync-button");
  syncButton.addEventListener("click", function() {
    let time = parseYouTubeTime(syncInput.value);
    for (let player of players) {
      player.seekTo(time, true);
    }
  });

}

function parseYouTubeTime(time) {
  let parts = time.split(":").reverse();
  let seconds = 0;
  for (let i = 0; i < parts.length; i++) {
    seconds += parseInt(parts[i]) * Math.pow(60, i);
  }
  return seconds;
}

  function init() {
    // the ui-resizable-handles are added here
    $('.resizable').resizable();
    // makes GSAP Draggable avoid clicks on the resize handles
    $('.ui-resizable-handle').attr('data-clickable', true);

    $( '.resizable' ).resizable({
      stop: function( event, ui ) {
        let videoURL = displayInput.value;
        let getVideo = document.getElementById("videoStyle");
        let videoPosition = getVideo.style.transform;
        let videoWidth = getVideo.offsetWidth;
        let videoHeight = getVideo.offsetHeight
        $.ajax({
          type: "PUT",
          url: `/video-board/${user_id}`,
          data:{videoBoard:JSON.stringify({
              video_url: videoURL,
              user_id,
              position: videoPosition,
              width: videoWidth,
              height: videoHeight
          })},
          success: function(data) {
              console.log("Size sent to the server!");
          },
          error: function(error) {
            console.error("Error adding the position to the database:", error);
          }
      });
      }
  });
    // make the element draggable
    Draggable.create('.draggable', {
      onPress: function () {
        $(this.target).addClass('ui-resizable-resizing');
      },
      onRelease: function() {
        $(this.target).removeClass('ui-resizable-resizing');
      },
      onDragEnd: function() {
        let videoURL = displayInput.value;
        let x = this.x, y = this.y;
        let getVideo = document.getElementById("videoStyle");
        let videoPosition = getVideo.style.transform;
        let videoWidth = getVideo.offsetWidth;
        let videoHeight = getVideo.offsetHeight
        // send x, y position to the server
        $.ajax({
            type: "PUT",
            url: `/video-board/${user_id}`,
            data:{videoBoard:JSON.stringify({
                video_url: videoURL,
                user_id,
                position: videoPosition,
                width: videoWidth,
                height: videoHeight
            })},
            success: function(data) {
                console.log("Position sent to the server!");
            },
            error: function(error) {
              console.error("Error adding the position to the database:", error);
            }
        });
    }
    });
  }

  async function preLoad() {
    return new Promise((resolve, reject) => {
      $.ajax({
        type: "get",
        url: `/video-board/?=${user_id}`,
        // data: {
        //     video_url: videoID,
        //     user_id,
        //     position: { x: x, y: y },
        // },
        success: function(data) {
            console.log("Position sent to the server!");
            // Create more videos, with the videos we get back.
            // const videos = data.videos
            // console.log(videos)
            resolve(data)
        },
        error: function(error) {
          console.error("Error adding the position to the database:", error);
          reject(error)
        }
    });
    })
  }

  const videos = await preLoad();
});
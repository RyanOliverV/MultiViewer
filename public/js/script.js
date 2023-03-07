$(document).ready(async function () {
  let displayInput = document.getElementById("video-url");
  let displayButton = document.getElementById("display-video");
  let containerDiv = document.getElementById("video-container");
  let syncInput = document.getElementById("sync-time");
  let player;
  let players = [];

  // Load the YT library
  // var tag = document.createElement('script');
  // tag.src = 'https://www.youtube.com/iframe_api';

  // var firstScriptTag = document.getElementsByTagName('script')[0];
  // firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  displayButton.addEventListener("click", function () {
    addVideo();
  });

  async function addVideo() {
    let videoID = displayInput.value.split("watch?v=")[1];
    let videoURL = displayInput.value;
    let innerDiv = document.createElement("div");
    let deleteButton = document.createElement("button");
    let buttonId = "";

    innerDiv.className = "inner";
    innerDiv.id = "video-" + players.length;
    let outerDiv = document.createElement("div");
    outerDiv.className = "draggable resizable";
    outerDiv.setAttribute("url", videoURL);
    outerDiv.style.transform = "translate3d(100px, 100px, 0)";

    await $.ajax({
      type: "POST",
      dataType: "json",
      contentType: "application/x-www-form-urlencoded",
      url: `/video-board/${video_board_id}`,
      data: {
        video: JSON.stringify({
          video_url: videoURL,
          position: "translate3d(100px, 100px, 0)",
          width: outerDiv.offsetWidth,
          height: outerDiv.offsetHeight,
        }),
      },
      success: function (response) {
        outerDiv.id = response.video.id;
        deleteButton.innerHTML = "<i class='fa-solid fa-xmark'></i>";
        deleteButton.style.cursor = "pointer";
        deleteButton.id = response.video.id;
        buttonId = response.video.id;
        deleteButton.addEventListener("click", function () {
          deleteVideo(buttonId);
        });

        console.log("Video URL added to the database successfully");

        outerDiv.appendChild(deleteButton);
        outerDiv.appendChild(innerDiv);
        containerDiv.appendChild(outerDiv);
      },
      error: function (error) {
        console.error("Error adding the video URL to the database:", error);
      },
    });

    player = new YT.Player("video-" + players.length, {
      height: "100%",
      width: "100%",
      videoId: videoID,
    });

    player.addEventListener("onReady", onPlayerReady);
    players.push(player);

    init();

    let videoWidth = outerDiv.offsetWidth;
    let videoHeight = outerDiv.offsetHeight;
    let videoId = outerDiv.id;
    $.ajax({
      type: "PUT",
      url: `/video-board/${video_board_id}`,
      data: {
        videoBoard: JSON.stringify({
          id: videoId,
          video_url: videoURL,
          video_board_id,
          position: "translate3d(100px, 100px, 0)",
          width: videoWidth,
          height: videoHeight,
        }),
      },
      success: function (data) {
        console.log("Size sent to the server!");
      },
      error: function (error) {
        console.error("Error adding the position to the database:", error);
      },
    });
  }

  function onPlayerReady(event) {
    let playPauseButton = document.getElementById("play-pause-button");
    playPauseButton.addEventListener("click", function () {
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
    soundButton.addEventListener("click", function () {
      for (let player of players) {
        if (isMuted) {
          player.unMute();
        } else {
          player.mute();
        }
      }

      if (isMuted) {
        soundButton.innerHTML = "<i class='fa-solid fa-volume-high'></i>";
        isMuted = false;
      } else {
        soundButton.innerHTML = "<i class='fa-solid fa-volume-xmark'></i>";
        isMuted = true;
      }
    });

    let syncButton = document.getElementById("sync-button");
    syncButton.addEventListener("click", function () {
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
    $(".resizable").resizable();
    // makes GSAP Draggable avoid clicks on the resize handles
    $(".ui-resizable-handle").attr("data-clickable", true);

    $(".resizable").resizable({
      stop: function (event, ui) {
        let videoURL = event.target.getAttribute("url");
        let videoPosition = event.target.style.transform;
        let videoWidth = event.target.offsetWidth;
        let videoHeight = event.target.offsetHeight;
        let videoId = event.target.id;
        $.ajax({
          type: "PUT",
          url: `/video-board/${video_board_id}`,
          data: {
            videoBoard: JSON.stringify({
              id: videoId,
              video_url: videoURL,
              video_board_id,
              position: videoPosition,
              width: videoWidth,
              height: videoHeight,
            }),
          },
          success: function (data) {
            console.log("Size sent to the server!");
          },
          error: function (error) {
            console.error("Error adding the position to the database:", error);
          },
        });
      },
    });

    // make the element draggable
    Draggable.create(".draggable", {
      onPress: function () {
        $(this.target).addClass("ui-resizable-resizing");
      },
      onRelease: function () {
        $(this.target).removeClass("ui-resizable-resizing");
      },
      onDragEnd: function (event) {
        let x = this.x,
          y = this.y;

        let videoURL = event.target.getAttribute("url");
        let videoPosition = event.target.style.transform;
        let videoWidth = event.target.offsetWidth;
        let videoHeight = event.target.offsetHeight;
        let videoId = event.target.id;

        // send video position to the server
        $.ajax({
          type: "PUT",
          url: `/video-board/${video_board_id}`,
          data: {
            videoBoard: JSON.stringify({
              video_url: videoURL,
              id: videoId,
              video_board_id,
              position: videoPosition,
              width: videoWidth,
              height: videoHeight,
            }),
          },
          success: function (data) {
            console.log("Position sent to the server!");
          },
          error: function (error) {
            console.error("Error adding the position to the database:", error);
          },
        });
      },
    });
  }

  async function preLoad() {
    return new Promise((resolve, reject) => {
      $.ajax({
        type: "GET",
        url: `/video-board/videos/${video_board_id}`,

        success: function (data) {
          console.log(data);
          const videos = data.findVideos;
          videos.map((v) => renderVideo(v));

          resolve(data);
        },
        error: function (error) {
          console.error("Error adding the position to the database:", error);
          reject(error);
        },
      });
    });
  }

  window.YT.ready(function () {
    preLoad();
  });

  function renderVideo(video) {
    let videoID = video.videoURL[0].split("watch?v=")[1];
    let innerDiv = document.createElement("div");
    innerDiv.className = "inner";
    innerDiv.id = "video-" + players.length;

    let outerDiv = document.createElement("div");
    outerDiv.id = video.id;
    outerDiv.setAttribute("url", video.videoURL[0]);
    outerDiv.className = "draggable resizable";
    outerDiv.style.height = video.height + "px";
    outerDiv.style.width = video.width + "px";

    //Create Button
    let deleteButton = document.createElement("button");
    deleteButton.innerHTML = "<i class='fa-solid fa-xmark'></i>";
    deleteButton.style.cursor = "pointer";
    deleteButton.id = video.id;
    buttonId = video.id;

    deleteButton.addEventListener("click", function () {
      deleteVideo(buttonId);
    });

    outerDiv.appendChild(deleteButton);
    outerDiv.appendChild(innerDiv);
    containerDiv.appendChild(outerDiv);

    outerDiv.style.transform = video.position;

    player = new YT.Player("video-" + players.length, {
      height: "100%",
      width: "100%",
      videoId: videoID,
    });

    player.addEventListener("onReady", onPlayerReady);
    players.push(player);

    init();

    document.getElementById(video.id).addEventListener("click", function () {
      deleteVideo(video.id);
    });
  }

  function deleteVideo(id) {
    $.ajax({
      type: "DELETE",
      url: `/video-board/videos/${id}`,

      success: function () {
        const video = document.getElementById(id);
        console.log("Before ", video);
        video.parentNode.removeChild(video);
        console.log("After ", video.parentNode.removeChild(video));
        alert("Video deleted succesfully");
      },
      error: function (error) {
        console.error("Error deleting the video", error);
        reject(error);
      },
    });
  }
});

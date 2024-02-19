$(document).ready(async function () {
    let containerDiv = document.getElementById("container");
    let containerRect = containerDiv.getBoundingClientRect();   
      

    let displayInput = document.getElementById("video-url");
    let displayButton = document.getElementById("display-video");
    let syncInput = document.getElementById("sync-time");
    let player;
    let players = [];

    displayButton.addEventListener("click", function () {
        addVideo();
    });

    async function addVideo() {
        let videoID = displayInput.value.split("watch?v=")[1];
        let videoURL = displayInput.value;
        let videoDiv = document.createElement("div");
        let iframeDiv = document.createElement("div");
        let deleteButton = document.createElement("button");
        let buttonId = "";

        videoDiv.className = "video";
        iframeDiv.id = "video-" + players.length;
        let outerDiv = document.createElement("div");
        outerDiv.className = "drag-handle";
        outerDiv.setAttribute("url", videoURL);

        let videoContainer = document.createElement("div");
        videoContainer.className = "video-container";
        videoContainer.style.top = "100px";
        videoContainer.style.left = "100px";
        videoContainer.setAttribute("url", videoURL);

        await $.ajax({
            type: "POST",
            dataType: "json",
            contentType: "application/x-www-form-urlencoded",
            url: `/video-board/${video_board_id}`,
            data: {
                video: JSON.stringify({
                    video_url: videoURL,
                    position: "translate3d(100px, 100px, 0)",
                    top: "100px",
                    left: "100px",
                    width: videoContainer.offsetWidth,
                    height: videoContainer.offsetHeight,
                }),
            },
            success: function (response) {
                videoContainer.id = response.video.id;
                deleteButton.innerHTML = "<i class='fa-solid fa-xmark'></i>";
                deleteButton.style.cursor = "pointer";
                deleteButton.id = response.video.id;
                buttonId = response.video.id;

                deleteButton.addEventListener("click", function () {
                    deleteVideo(buttonId);
                });

                containerDiv.appendChild(videoContainer);
                videoContainer.appendChild(outerDiv);
                outerDiv.appendChild(deleteButton);
                videoContainer.appendChild(videoDiv);
                videoDiv.appendChild(iframeDiv);

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

        let videoWidth = videoContainer.offsetWidth;
        let videoHeight = videoContainer.offsetHeight;
        let videoTop = videoContainer.style.top;
        let videoLeft = videoContainer.style.left;
        let videoId = videoContainer.id;
        $.ajax({
            type: "PUT",
            url: `/video-board/${video_board_id}`,
            data: {
                videoBoard: JSON.stringify({
                    id: videoId,
                    video_url: videoURL,
                    video_board_id,
                    position: "translate3d(100px, 100px, 0)",
                    top: videoTop,
                    left: videoLeft,
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

    function dragElement(elmnt) {
  var container = document.getElementById("container");
  var containerRect = container.getBoundingClientRect();

  var pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;

  var dragHandles = elmnt.getElementsByClassName("drag-handle");

  for (var i = 0; i < dragHandles.length; i++) {
    dragHandles[i].addEventListener("mousedown", function (e) {
      dragMouseDown(e, elmnt);
    });
  }

  function dragMouseDown(e, elmnt) {
    e = e || window.event;
    e.preventDefault();
    elmnt.classList.add("dragging");

    pos3 = e.clientX;
    pos4 = e.clientY;

    document.onmouseup = closeDragElement;
    
    document.onmousemove = function (e) {
      elementDrag(e, elmnt);
    };
  }

  function elementDrag(e, elmnt) {
    e.preventDefault();
    // Calculate the new position of the dragged element
    let newX = elmnt.offsetLeft - (pos3 - e.clientX);
    let newY = elmnt.offsetTop - (pos4 - e.clientY);

    // Limiting the draggable element to stay within the container bounds
    newX = Math.max(0, Math.min(containerRect.width - elmnt.offsetWidth, newX));
    newY = Math.max(0, Math.min(containerRect.height - elmnt.offsetHeight, newY));

    elmnt.style.left = newX + "px";
    elmnt.style.top = newY + "px";

    pos3 = e.clientX;
    pos4 = e.clientY;
}

function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
    elmnt.classList.remove('dragging'); /* remove class again when done dragging */

    
    let x = parseInt(elmnt.style.left);
    let y = parseInt(elmnt.style.top);


    let videoURL = elmnt.getAttribute("url");
    console.log("videoURL:", videoURL);
    let videoPosition = `translate3d(${x}px, ${y}px, 0)`;
    let top = elmnt.style.top;
    let left = elmnt.style.left;
    console.log("top:", top);
    console.log("left:", left);
    console.log("videoPosition:", videoPosition);
    let videoWidth = elmnt.offsetWidth;
    let videoHeight = elmnt.offsetHeight;
    let videoId = elmnt.id;

    // Send video position to the server
    // Assuming you have the variable video_board_id defined somewhere
    console.log("video_board_id:", video_board_id);
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
        top: top,
        left: left,
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
}
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
        // Initialize draggable functionality
        // const draggableElements = document.querySelectorAll(".draggable");
        // draggableElements.forEach(element => {
        //     dragElement(element);
        // });

        let videoContainers = document.getElementsByClassName("video-container");
        for (let i = 0; i < videoContainers.length; i++) {
            dragElement(videoContainers[i]);
        }

        // // Initialize resizable functionality
        // $(".resizable").resizable({
        //     stop: function (event, ui) {
        //         let videoURL = event.target.getAttribute("url");
        //         let top = event.style.top;
        //         let left = event.style.left;
        //         let videoWidth = event.target.offsetWidth;
        //         let videoHeight = event.target.offsetHeight;
        //         let videoId = event.target.id;
        //         $.ajax({
        //             type: "PUT",
        //             url: `/video-board/${video_board_id}`,
        //             data: {
        //                 videoBoard: JSON.stringify({
        //                     id: videoId,
        //                     video_url: videoURL,
        //                     video_board_id,
        //                     position: videoPosition,
        //                     top: top,
        //                     left: left,
        //                     width: videoWidth,
        //                     height: videoHeight,
        //                 }),
        //             },
        //             success: function (data) {
        //                 console.log("Size sent to the server!");
        //             },
        //             error: function (error) {
        //                 console.error("Error adding the position to the database:", error);
        //             },
        //         });
        //     },
        // });
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
        let videoDiv = document.createElement("div");
        let iframeDiv = document.createElement("div");
        videoDiv.className = "video";
        iframeDiv.id = "video-" + players.length;

        let outerDiv = document.createElement("div");
        outerDiv.className = "drag-handle";

        let videoContainer = document.createElement("div");
        videoContainer.className = "video-container";
        videoContainer.id = video.id;
        videoContainer.style.height = video.height + "px";
        videoContainer.style.width = video.width + "px";
        videoContainer.setAttribute("url", video.videoURL[0]);

        // Create Button
        let deleteButton = document.createElement("button");
        deleteButton.innerHTML = "<i class='fa-solid fa-xmark'></i>";
        deleteButton.style.cursor = "pointer";
        deleteButton.id = video.id;

        deleteButton.addEventListener("click", function (event) {
            // Prevent the event from bubbling up to the outerDiv
            event.stopPropagation();
            deleteVideo(video.id);
        });

        containerDiv.appendChild(videoContainer);
        videoContainer.appendChild(outerDiv);
        outerDiv.appendChild(deleteButton);
        videoContainer.appendChild(videoDiv);
        videoDiv.appendChild(iframeDiv);

        videoContainer.style.top = video.top;
        videoContainer.style.left = video.left;

        player = new YT.Player("video-" + players.length, {
            height: "100%",
            width: "100%",
            videoId: videoID,
        });

        player.addEventListener("onReady", onPlayerReady);
        players.push(player);

        init();
    }

    function deleteVideo(id) {
        $.ajax({
            type: "DELETE",
            url: `/video-board/videos/${id}`,
            success: function () {
                const video = document.getElementById(id);
                video.parentNode.removeChild(video);
                alert("Video deleted successfully");
            },
            error: function (error) {
                console.error("Error deleting the video", error);
            },
        });
    }
});

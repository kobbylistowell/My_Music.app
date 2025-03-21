const API_URL = "https://xrxnxqck-3000.uks1.devtunnels.ms"; // Adjust if backend runs on a different port


// Dark Mode Codes -----------------------------------------------------
const darkModeToggle = document.getElementById("darkModeToggle");

// Check if dark mode is enabled in localStorage on page load
document.addEventListener("DOMContentLoaded", () => {
    const currentTheme = localStorage.getItem("theme") || "dark"; // Default to dark if no theme in localStorage
    if (currentTheme === "light") {
        document.body.classList.add("light-mode");
        darkModeToggle.innerHTML = '<i class="bi bi-sun-fill"></i>';
    } else {
        document.body.classList.remove("light-mode");
        darkModeToggle.innerHTML = '<i class="bi bi-moon-stars-fill"></i>';
    }
});

// Toggle Dark/Light Mode on Button Click
darkModeToggle.addEventListener("click", () => {
    const isLightMode = document.body.classList.contains("light-mode");
    
    if (isLightMode) {
        document.body.classList.remove("light-mode");
        darkModeToggle.innerHTML = '<i class="bi bi-moon-stars-fill"></i>';
        localStorage.setItem("theme", "dark"); // Save theme to localStorage
    } else {
        document.body.classList.add("light-mode");
        darkModeToggle.innerHTML = '<i class="bi bi-sun-fill"></i>';
        localStorage.setItem("theme", "light"); // Save theme to localStorage
    }
});
// End of Dark Mode Codes -------------------------------------------------------




document.addEventListener("DOMContentLoaded", function() {
    const uploadBtn = document.getElementById("uploadBtn");
    const uploadInput = document.getElementById("uploadInput");
    const playlistContainer = document.getElementById("playlist");
    const masterPlayBtn = document.getElementById("masterPlay");
    const songList = document.querySelector(".menu_song");
    const currentStart = document.getElementById("currentStart");
    const currentEnd = document.getElementById("currentEnd");
    const seekBar = document.getElementById("seek");
    const volBar = document.getElementById("vol");
    const songImage = document.querySelector(".master_play img");
    const songTitle = document.querySelector(".master_play h5 .subtitle");
    const songPlayer = new Audio();

    let songs = []; // Store the list of songs from the backend
    let currentSongIndex = 0;
    
    // Load songs from backend
    async function loadSongs() {
        try {
            const response = await fetch(`${API_URL}/songs/search`);
            const data = await response.json();
            songs = data;
            renderPlaylist(songs);
        } catch (error) {
            console.error("Error loading songs:", error);
        }
    }

    function renderPlaylist(songs) {
        songList.innerHTML = ""; // Clear the list before re-rendering
        songs.forEach((song, index) => {
            const artist = song.artist ? song.artist : "Unknown Artist"; 
            const songItem = document.createElement("li");
            songItem.classList.add("songItem");
            songItem.setAttribute("data-index", index);
    
            songItem.innerHTML = `
                <span>${index + 1}</span> 
                <img src="img/vibes stream.png" alt="${song.title}">
                <h5>${song.title}
                    <div class="subtitle">${artist}</div>
                </h5>
                <i class="bi playListPlay bi-play-circle-fill" id="${index}" onclick="playSong(${index})"></i>
    
                <!-- Delete Button -->
                <i class="bi bi-trash-fill delete-song" id="delete-${index}" data-index="${index}"></i>
            `;
    
            songList.appendChild(songItem);
        });
    
    // Play next song when the current song ends
    songPlayer.addEventListener("ended", () => {
    playSong(currentSongIndex + 1);
    });


        // Attach event listeners to delete buttons
        document.querySelectorAll(".delete-song").forEach(button => {
            button.addEventListener("click", function() {
                const index = parseInt(this.getAttribute("data-index"));
                deleteSong(index);
            });
        });
    }
    
    async function deleteSong(index) {
        const songToDelete = songs[index]; // Get song object
        if (!songToDelete) return;
    
        try {
            // Send DELETE request to backend using song title
            const response = await fetch(`${API_URL}/songs/delete/${encodeURIComponent(songToDelete.title)}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" }
            });
    
            if (!response.ok) {
                throw new Error("Failed to delete song from backend");
            }
    
            // Remove song from the local array
            songs.splice(index, 1);
    
            // Re-render playlist
            renderPlaylist(songs);
    
            console.log(`Song deleted: ${songToDelete.title}`);
        } catch (error) {
            console.error("Error deleting song:", error);
        }
    }

    document.querySelectorAll('.delete-song').forEach(button => {
        button.addEventListener('click', function() {
            this.closest('.songItem').remove(); // Remove the song item
        });
    });
    

    const nowPlayingPlay = document.getElementById("nowPlayingPlay");
    const nowPlayingTitle = document.getElementById("nowPlayingTitle");
    const nowPlayingArtist = document.getElementById("nowPlayingArtist");
    const highlightColor = "#ffc800";
    
    function playSong(index) {
        if (index < 0) {
            index = songs.length - 1;
        } else if (index >= songs.length) {
            index = 0;
        }
    
        const song = songs[index];
    
        if (songPlayer.src !== `${API_URL}/uploads/${song.filename}`) {
            songPlayer.src = `${API_URL}/uploads/${song.filename}`;  
            songPlayer.play();
            currentSongIndex = index;
            songImage.src = "img/vibes stream.png"; 
    
            //  Update Master Play section
            const masterTitle = document.querySelector(".master_play h5");
            masterTitle.innerHTML = `
                ${song.title}
                <div class="subtitle">${song.artist ? song.artist : "Unknown Artist"}</div>
            `;
    
            masterPlayBtn.classList.replace("bi-play-fill", "bi-pause-fill");
    
            //  Update Now Playing section dynamically
            nowPlayingTitle.innerText = song.title;
            nowPlayingArtist.innerText = song.artist ? song.artist : "Unknown Artist";
            nowPlayingPlay.classList.replace("bi-play-circle-fill", "bi-pause-circle-fill");
    
            //  Remove highlight from all playlist items
            document.querySelectorAll(".songItem h5").forEach(title => {
                title.style.color = ""; // Reset color
            });
    
            //  Highlight the currently playing song title
            const currentSongTitle = document.querySelectorAll(".songItem h5")[index];
            if (currentSongTitle) {
                currentSongTitle.style.color = highlightColor;
            }
        } else {
            //  Toggle Play/Pause
            if (songPlayer.paused) {
                songPlayer.play();
                masterPlayBtn.classList.replace("bi-play-fill", "bi-pause-fill");
                nowPlayingPlay.classList.replace("bi-play-circle-fill", "bi-pause-circle-fill");
            } else {
                songPlayer.pause();
                masterPlayBtn.classList.replace("bi-pause-fill", "bi-play-fill");
                nowPlayingPlay.classList.replace("bi-pause-circle-fill", "bi-play-circle-fill");
            }
        }
    }
    
    //  Sync Now Playing Play Button with Master Play
    nowPlayingPlay.addEventListener("click", () => {
        if (songPlayer.paused) {
            songPlayer.play();
            masterPlayBtn.classList.replace("bi-play-fill", "bi-pause-fill");
            nowPlayingPlay.classList.replace("bi-play-circle-fill", "bi-pause-circle-fill");
        } else {
            songPlayer.pause();
            masterPlayBtn.classList.replace("bi-pause-fill", "bi-play-fill");
            nowPlayingPlay.classList.replace("bi-pause-circle-fill", "bi-play-circle-fill");
        }
    });

    // Event listeners for playlist song clicks
    songList.addEventListener("dblclick", (e) => {
        const songItem = e.target.closest(".songItem");
        if (songItem) {
            const songIndex = parseInt(songItem.getAttribute("data-index"));
            playSong(songIndex);
        }
    });
    

    // Previous Button Click
    prevBtn.addEventListener("click", () => {
        playSong(currentSongIndex - 1); // Play previous song
    });
    
    // Next Button Click
    nextBtn.addEventListener("click", () => {
        playSong(currentSongIndex + 1); // Play next song
    });
    

    // Update progress bar and time
    function updateProgressBar() {
        const currentTime = songPlayer.currentTime;
        const duration = songPlayer.duration;

        if (!isNaN(duration)) {
            currentStart.innerText = formatTime(currentTime);
            currentEnd.innerText = formatTime(duration);
            const progress = (currentTime / duration) * 100;
            seekBar.value = progress;
        }
    }

    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
    }

    // Update volume bar
    function updateVolume() {
        const volume = volBar.value;
        songPlayer.volume = volume / 100;
    }

    // Handle song search
    async function searchSongs(query) {
        try {
            const response = await fetch(`${API_URL}/songs/search?title=${query}`);
            const data = await response.json();
            songs = data;
            renderPlaylist(songs);
        } catch (error) {
            console.error("Error searching songs:", error);
        }
    }

    // Handle file upload
    uploadBtn.addEventListener("click", () => {
        uploadInput.click();
    });
    
    uploadInput.addEventListener("change", async (e) => {
        const files = e.target.files;
        if (files.length === 0) return;
    
        // Show progress bar
        document.getElementById("progressWrapper").style.display = "block";
    
        let uploadedCount = 0;
    
        for (const file of files) {
            const formData = new FormData();
            formData.append("file", file);
    
            const xhr = new XMLHttpRequest();
            xhr.open("POST", `${API_URL}/upload`, true);
    
            // Track Upload Progress
            xhr.upload.onprogress = function (event) {
                if (event.lengthComputable) {
                    let percentComplete = Math.round((event.loaded / event.total) * 100);
                    document.getElementById("progressBar").style.width = percentComplete + "%";
                    document.getElementById("progressText").innerText = percentComplete + "%";
                }
            };
    
            // When upload completes
            xhr.onload = function () {
                if (xhr.status === 200) {
                    uploadedCount++;
                    if (uploadedCount === files.length) {
                        document.getElementById("progressText").innerText = "Upload Complete!";
                        setTimeout(() => {
                            document.getElementById("progressWrapper").style.display = "none";
                            document.getElementById("progressBar").style.width = "0%"; // Reset
                            document.getElementById("progressText").innerText = "0%";
                        }, 2000);
                        loadSongs(); // Reload song list
                    }
                } else {
                    alert("Upload failed. Please try again.");
                    document.getElementById("progressWrapper").style.display = "none";
                }
            };
    
            xhr.send(formData);
        }
    });
    


    // Event listeners for playlist song clicks
    songList.addEventListener("click", (e) => {
        if (e.target.classList.contains("bi-play-circle-fill")) {
            const songIndex = e.target.id;
            playSong(songIndex);
        }
    });

    // Master play button click
    masterPlayBtn.addEventListener("click", () => {
        playSong(currentSongIndex);
    });

    // Update progress bar as the song plays
    songPlayer.addEventListener("timeupdate", updateProgressBar);

    // Seek bar update
    seekBar.addEventListener("input", (e) => {
        const seekTime = (e.target.value / 100) * songPlayer.duration;
        songPlayer.currentTime = seekTime;
    });

    // Volume control
    volBar.addEventListener("input", updateVolume);

    // Search input for songs
    const searchInput = document.querySelector(".search input");
    searchInput.addEventListener("input", (e) => {
        searchSongs(e.target.value);
    });

    // Initialize
    loadSongs(); // Load songs on page load
});



//slide show
const slides = document.querySelectorAll('.slide');
let currentIndex = 0;

function changeSlide() {
    slides[currentIndex].classList.remove('active');
    currentIndex = (currentIndex + 1) % slides.length;
    slides[currentIndex].classList.add('active');
}

// Change slide every 5 seconds
setInterval(changeSlide, 5000);


//Wave Animation
const svgWave = document.getElementById("svgWave");

function toggleWaveAnimation(isPlaying) {
    svgWave.style.display = isPlaying ? "block" : "none";
}

songPlayer.addEventListener("play", () => toggleWaveAnimation(true));
songPlayer.addEventListener("pause", () => toggleWaveAnimation(false));
songPlayer.addEventListener("ended", () => toggleWaveAnimation(false));



//  Music Player Variables
const music = new Audio();
let currentSongIndex = 0; 
let isPlaying = false;

//  Song list (Ensure file paths are correct)
const songs = [
    { id: 1, name: "Boyz Don't Cry", artist: "Rod Wave", src: "audio/boyz_dont_cry.mp3", poster: "img/1.jpg" },
    { id: 2, name: "Industry Baby", artist: "Lil Nas X", src: "audio/industry_baby.mp3", poster: "img/industry baby.jpg" },
    { id: 3, name: "EastSide", artist: "Halsey x Benny Blanco", src: "audio/eastside.mp3", poster: "img/eastside.jpg" },
    { id: 4, name: "Kwaku The Traveller", artist: "Black Sherif", src: "audio/kwaku_the_traveller.mp3", poster: "img/kwakuthetraveller.jpeg" },
    { id: 5, name: "One Don", artist: "Shatta Wale", src: "audio/one_don.mp3", poster: "img/onedon.jpg" },
    { id: 6, name: "Teach The World", artist: "Lucky Dube", src: "audio/teach_the_world.mp3", poster: "img/luckydube.jpg" },
    { id: 7, name: "Zombie", artist: "Kwesi Arthur", src: "audio/zombie.mp3", poster: "img/kwesi arthur.jpg" },
];

//  Master Play Button
let masterPlay = document.getElementById("masterPlay");
let wave = document.querySelector(".wave");
let songItems = document.querySelectorAll(".songItem");
let songTitle = document.querySelector(".master_play h5");
let songImage = document.querySelector(".master_play img");

// 🎚 Volume Control
const volumeControl = document.getElementById("vol");

// Load Last Played Song & Volume
if (localStorage.getItem("lastSongIndex")) {
    currentSongIndex = parseInt(localStorage.getItem("lastSongIndex"));
    music.src = songs[currentSongIndex].src;
    updateSongInfo(currentSongIndex);
}
if (localStorage.getItem("volume")) {
    music.volume = parseFloat(localStorage.getItem("volume"));
    volumeControl.value = music.volume * 100;
}

// Play/Pause Functionality
function togglePlayPause() {
    if (isPlaying) {
        music.pause();
        masterPlay.classList.replace("bi-pause-fill", "bi-play-fill");
        wave.classList.remove("active2");
    } else {
        music.play();
        masterPlay.classList.replace("bi-play-fill", "bi-pause-fill");
        wave.classList.add("active2");
    }
    isPlaying = !isPlaying;
}

// Play Song from Playlist
songItems.forEach((element, index) => {
    element.addEventListener("click", () => {
        playSong(index);
    });
});

// Function to Play a Specific Song
function playSong(index) {
    currentSongIndex = index;
    music.src = songs[index].src;
    music.play();
    isPlaying = true;

    masterPlay.classList.replace("bi-play-fill", "bi-pause-fill");
    wave.classList.add("active2");
    updateSongInfo(index);
    updatePlaylistUI(index);

    // Save last played song
    localStorage.setItem("lastSongIndex", index);
}

// Update Song Info in UI
function updateSongInfo(index) {
    songTitle.innerHTML = `${songs[index].name} <br> <div class="subtitle">${songs[index].artist}</div>`;
    songImage.src = songs[index].poster;
}

// Update Playlist UI When a Song Plays
function updatePlaylistUI(index) {
    songItems.forEach((element, i) => {
        let playButton = element.querySelector(".playListPlay");
        if (i === index) {
            playButton.classList.replace("bi-play-circle-fill", "bi-pause-circle-fill");
        } else {
            playButton.classList.replace("bi-pause-circle-fill", "bi-play-circle-fill");
        }
    });
}


// Handle Volume Control
volumeControl.addEventListener("input", () => {
    music.volume = volumeControl.value / 100;
    localStorage.setItem("volume", music.volume);
});

// Play Next Song When Current One Ends
music.addEventListener("ended", () => {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    playSong(currentSongIndex);
});

// Attach Play/Pause Function to Button
masterPlay.addEventListener("click", togglePlayPause);

// Dark Mode Toggle
const darkModeToggle = document.getElementById("darkModeToggle");

if (localStorage.getItem("theme") === "light") {
    document.body.classList.add("light-mode");
    darkModeToggle.innerHTML = '<i class="bi bi-sun-fill"></i>';
}

// Toggle Mode & Save Preference
darkModeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    if (document.body.classList.contains("light-mode")) {
        localStorage.setItem("theme", "light");
        darkModeToggle.innerHTML = '<i class="bi bi-sun-fill"></i>';
    } else {
        localStorage.setItem("theme", "dark");
        darkModeToggle.innerHTML = '<i class="bi bi-moon-stars-fill"></i>';
    }
});


document.addEventListener("DOMContentLoaded", function () {
    // Selecting elements for the songs and artists scrolling
    let songContainer = document.querySelector(".pop_song");
    let artistContainer = document.querySelector(".popular_artists .item");

    // Selecting left and right scroll buttons
    let leftBtnSong = document.querySelector(".popular_song #left_scroll");
    let rightBtnSong = document.querySelector(".popular_song #right_scroll");

    let leftBtnArtist = document.querySelector(".popular_artists #left_scroll");
    let rightBtnArtist = document.querySelector(".popular_artists #right_scroll");

    // Scroll amount (adjust as needed)
    let scrollAmount = 300; // Adjust this value for smooth scrolling

    // Event listeners for song scroll buttons
    rightBtnSong.addEventListener("click", function () {
        songContainer.scrollBy({ left: scrollAmount, behavior: "smooth" });
    });

    leftBtnSong.addEventListener("click", function () {
        songContainer.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    });

    // Event listeners for artist scroll buttons
    rightBtnArtist.addEventListener("click", function () {
        artistContainer.scrollBy({ left: scrollAmount, behavior: "smooth" });
    });

    leftBtnArtist.addEventListener("click", function () {
        artistContainer.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    });
});


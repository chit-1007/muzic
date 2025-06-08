console.log("javascript time")

let currentsong = new Audio();
function convertToMinuteSeconds(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
}



async function getSongs() {
    try {
        const response = await fetch("https://chit-1007.github.io/songs.json");
        console.log(response)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const songsData = await response.json();
        console.log(songsData)
        const songs = songsData.map(song => ({
            name: song.file.split('/').pop(),
            artist: song.artist
        }));
        console.log(songs)
        return songs

    } catch (error) {
        console.error("Error loading songs:", error);
        return [];
    }
}

function playMusic(track) {
    currentsong.src = "https://chit-1007.github.io/songs/" + track;
    currentsong.play();
    play.src = "pause.svg"
    document.querySelector(".songinfo").innerHTML = track;
}
async function main() {
    let songs = await getSongs()
    console.log(songs)
    let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0];
    for (const song of songs) {
        songul.innerHTML = songul.innerHTML +
            `<li data-file="${song.name}">
            <div class="music"><img class="invert" src="music.svg" alt=""></div>
                <div class="info">
                    <div>${song.name.replaceAll("_", " ").replace(".mp3", "")}</div>
                    <div><b>${song.artist}</b></div>
                </div>
            <div class="a2a2a2"><img class="invert" src="playbut.svg" alt="">Play now</div>
        </li>`
    }
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", () => {
            const fileName = e.getAttribute("data-file");
            playMusic(fileName);
        })
    });
    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play()
            play.src = "pause.svg"
        }
        else {
            currentsong.pause()
            play.src = "playbut.svg"
        }
    })

    next.addEventListener("click", () => {
        currentsong.pause()
        console.log("Next clicked")

        let currentFile = currentsong.src.split("/").pop();
        console.log(currentFile)
        let index = songs.findIndex(song => song.name === currentFile);
        console.log(index)
        if ((index + 1) < songs.length) {
            console.log(songs[index + 1].name)
            playMusic(songs[index + 1].name)
        }
        else {
            playMusic(songs[0].name)
        }
    })

    prev.addEventListener("click", () => {
        currentsong.pause();
        console.log("Previous clicked");

        let currentFile = currentsong.src.split("/").pop();
        console.log(currentFile);
        let index = songs.findIndex(song => song.name === currentFile);
        console.log(index);
        if (index > 0) {
            console.log(songs[index - 1].name);
            playMusic(songs[index - 1].name);
        } else {
            playMusic(songs[songs.length - 1].name);
        }
    });




    currentsong.addEventListener("timeupdate", () => {
        // console.log(currentsong.currentTime, currentsong.duration);
        document.querySelector(".songtime").innerHTML = `${convertToMinuteSeconds(currentsong.currentTime)}/${convertToMinuteSeconds(currentsong.duration)}`
        document.querySelector(".circle").style.left = (((currentsong.currentTime) / (currentsong.duration)) * 100) + "%";
    })
    document.querySelector(".seekbar").addEventListener("click", (e) => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = (percent) + "%";
        currentsong.currentTime = (currentsong.duration * percent) / 100
    });

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })

    // Add an event listener for close button
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })
}
main()

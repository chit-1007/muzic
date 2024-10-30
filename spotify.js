console.log("lets finally write some javascript")
let currentsong = new Audio();
function convertToMinuteSeconds(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const formattedMinutes = String(minutes).padStart(2,'0');
    const formattedSeconds = String(remainingSeconds).padStart(2,'0');
    return `${formattedMinutes}:${formattedSeconds}`;
}
async function getsongs(){
    let a = await fetch("http://127.0.0.1:3000/songs/index.html")
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split("/songs/")[1])
        }
    }
    return songs;
}
function playMusic(track) {
    currentsong.src = "/songs/"+track;
    currentsong.play();
    play.src = "pause.svg"
    document.querySelector(".songinfo").innerHTML = track;
}
async function main(){
    let songs = await getsongs()
    console.log(songs)
    let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0];
    for (const song of songs){ 
        songul.innerHTML = songul.innerHTML + `<li>
                        <div class="music"><img class="invert" src="music.svg" alt=""></div>
                        <div class="info">
                            <div>${song.replaceAll("%20", " ")}</div>
                            <div><b>I am the artist</b></div>
                        </div>
                        <div class="a2a2a2"><img class="invert" src="playbut.svg" alt="">Play now</div>
         </li>`
    }
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click",element=>{
            console.log(e.getElementsByTagName("div")[1].firstElementChild.innerHTML);
            playMusic(e.getElementsByTagName("div")[1].firstElementChild.innerHTML)
        })
    })
    play.addEventListener("click", ()=>{
        if(currentsong.paused){
            currentsong.play()
            play.src = "pause.svg"
        }
        else{
            currentsong.pause()
            play.src = "playbut.svg"
        }
    })
    currentsong.addEventListener("timeupdate", ()=>{
        console.log(currentsong.currentTime, currentsong.duration);
        document.querySelector(".songtime").innerHTML = `${convertToMinuteSeconds(currentsong.currentTime)}/${convertToMinuteSeconds(currentsong.duration)}`
        document.querySelector(".circle").style.left = (((currentsong.currentTime)/(currentsong.duration))*100)+"%";
    })
    document.querySelector(".seekbar").addEventListener("click",(e)=>{
        let percent = (e.offsetX/e.target.getBoundingClientRect().width)*100;
        document.querySelector(".circle").style.left = (percent)+"%";
        currentsong.currentTime = (currentsong.duration*percent)/100
    });
    document.querySelector(".hamburger").addEventListener("click",()=>{
        document.querySelector(".left").style.left = "0";
    })
    document.querySelector(".close").addEventListener("click",()=>{
        document.querySelector(".left").style.left = "-100%";
    })
    
}
main()

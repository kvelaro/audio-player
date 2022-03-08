import mp3sample from "../audios/sample.mp3"

import imgSample from "../images/aditya-saxena-_mIXHvl_wzA-unsplash.jpg"
import failsaveImage from "../images/music-icon.png"

import AudioPlayer from "./AudioPlayer";

//let audioElement = document.querySelector('audio')





//track.connect(gainNode).connect(pannerNode).connect(audioCtx.destination)



new AudioPlayer('.footer', {
    sourceUrl: mp3sample,
    imageUrl: imgSample,
    failsaveImage: failsaveImage,
    title: 'Music is my life',
    singer: 'Dr. Alban'
})



//progressBar.drawAudio('https://s3-us-west-2.amazonaws.com/s.cdpn.io/3/shoptalk-clip.mp3')

import mp3sample from "../audios/sample.mp3"
import imgSample from "../images/aditya-saxena-_mIXHvl_wzA-unsplash.jpg"

import AudioPlayer from "./AudioPlayer";

//let audioElement = document.querySelector('audio')





//track.connect(gainNode).connect(pannerNode).connect(audioCtx.destination)


// let canvas = document.querySelector('canvas')
// canvas.width = 900;
//canvas.height = 75;

new AudioPlayer('.footer', {
    sourceUrl: mp3sample,
    imageUrl: imgSample,
    failsaveImage: 'tt',
    title: 'ttt',
    singer: 'rrr'
})



//progressBar.drawAudio('https://s3-us-west-2.amazonaws.com/s.cdpn.io/3/shoptalk-clip.mp3')

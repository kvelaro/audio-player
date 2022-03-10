import mp3sample from "../audios/sample.mp3"
import imgSample from "../images/aditya-saxena-_mIXHvl_wzA-unsplash.jpg"
import failsaveImage from "../images/music-icon.png"

import AudioPlayer from "./AudioPlayer";

new AudioPlayer('.footer', {
    sourceUrl: mp3sample,
    imageUrl: imgSample,
    failsaveImage: failsaveImage,
    title: 'Music is my life',
    singer: 'Dr. Alban'
})



//https://s3-us-west-2.amazonaws.com/s.cdpn.io/3/shoptalk-clip.mp3
//https://audio-samples.github.io/samples/mp3/blizzard_unconditional/sample-0.mp3

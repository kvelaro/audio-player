import ProgressBar from "./ProgressBar";
import AudioPlayerControls from "./AudioPlayerControls";

export default class AudioFile {
    protected audioCtx: AudioContext
    protected selector: Element
    protected url: string
    protected audio: HTMLAudioElement
    protected audioControls: AudioPlayerControls
    protected progressBar: ProgressBar
    constructor(selector: Element, url: string) {

        this.selector = selector
        this.url = url

        this.audioControls = new AudioPlayerControls(this.selector, this.audioCtx)


        //document.querySelector(this.selector).append(this.audio)


        this.events()
        this.progressBar = new ProgressBar(200)
        //this.progressBar.drawAudio('http://localhost:8080/8d14102f3e5d724f1908.mp3')


    }

    protected events() {

    }

    // let track = audioCtx.createMediaElementSource(audioElement)
    //
    // let gainNode = audioCtx.createGain()
    //
    // let pannerNode = audioCtx.createStereoPanner()
}
import ProgressBar from "./ProgressBar";

export default class AudioFile {
    protected audioCtx: AudioContext
    protected selector: Element
    protected url: string
    protected audio: HTMLAudioElement
    protected progressBar: ProgressBar
    constructor(selector: Element, url: string) {

        this.selector = selector
        this.url = url

    }

    // let track = audioCtx.createMediaElementSource(audioElement)
    //
    // let gainNode = audioCtx.createGain()
    //
    // let pannerNode = audioCtx.createStereoPanner()
}
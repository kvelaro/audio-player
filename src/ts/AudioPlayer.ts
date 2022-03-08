
import {externalAudioData} from "./types/externalAudioData";

export default class AudioPlayer {
    protected selector: string
    protected audioData: externalAudioData
    protected audioElement: HTMLAudioElement
    protected duration: string
    protected audioCtx: AudioContext

    constructor(selector: string, audioData?: externalAudioData) {
        this.selector = selector
        this.audioData = audioData
        // @ts-ignore
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)()

        if(this.audioData.sourceUrl) {
            this.setAudioElement(this.audioData.sourceUrl)
        }
        this.draw()
    }

    protected async setAudioElement(audioUrl:string) {
        let self = this
        this.audioElement = new Audio(audioUrl)
        this.audioElement.addEventListener('loadedmetadata', function(e) {
            let el = <HTMLAudioElement>e.currentTarget
            let hours = Math.floor(el.duration / 3600)
            let mins = (el.duration / 60)
            let secs = (el.duration)

            let duration = ''
            if (hours > 0) {
                duration += Math.floor(hours).toFixed(0).padStart(2, '0')
            }

            if (duration.length > 0) {
                duration += ':'
            }
            duration += Math.floor(mins).toFixed(0).padStart(2, '0') + ':' + secs.toFixed(0).padStart(2, '0')
            self.duration = duration
        })
    }

    public draw() {
        let self = this

        let playerTemplate = require('../views/player.handlebars')
        document.querySelector(this.selector).insertAdjacentHTML('afterbegin', playerTemplate({
            audio: {
                element: self.audioElement,
                image: this.audioData.imageUrl,
                failsaveImage: this.audioData.failsaveImage,
                title: this.audioData.title,
                singer: this.audioData.singer,
                duration: this.duration
            }
        }))

        let canvas = document.querySelector(this.selector + ' .player__progressbar canvas')
        canvas.insertAdjacentElement('afterend', this.audioElement)

        let playPauseBtn = document.querySelector(this.selector + ' .player .btn-play-pause')
        playPauseBtn.addEventListener('click', function() {
            if(self.audioCtx.state == 'suspended') {
                self.audioCtx.resume()
            }
            // gainNode.gain.value = 5
            // pannerNode.pan.value = -1
            self.audioElement.play()
        })
    }
}
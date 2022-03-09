import {externalAudioData} from "./types/externalAudioData";
import ProgressBar from "./ProgressBar";

export default class AudioPlayer {
    protected selector: string
    protected audioData: externalAudioData
    protected audioElement: HTMLAudioElement
    protected duration: string
    protected audioCtx: AudioContext
    protected progressBar: ProgressBar
    protected playing: boolean

    constructor(selector: string, audioData?: externalAudioData) {
        this.selector = selector
        this.audioData = audioData
        // @ts-ignore
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)()

        this.playing = false
        if(this.audioData.sourceUrl) {
            this.setAudioElement(this.audioData.sourceUrl)
        }
        this.progressBar = new ProgressBar(this.selector, this.audioCtx, 300)
        this.draw()
    }

    protected timeToDisplay(seconds :number) {
        let hours = Math.floor(seconds / 3600)
        let mins = (seconds / 60)
        let secs = (seconds)

        let duration = ''
        if (hours > 0) {
            duration += Math.floor(hours).toFixed(0).padStart(2, '0')
        }

        if (duration.length > 0) {
            duration += ':'
        }
        duration += Math.floor(mins).toFixed(0).padStart(2, '0') + ':' + secs.toFixed(0).padStart(2, '0')
        return duration
    }

    protected setAudioElement(audioUrl:string) {
        let self = this
        this.audioElement = new Audio(audioUrl)
        this.audioElement.addEventListener('loadedmetadata', function(e) {
            let el = <HTMLAudioElement>e.currentTarget

            let playerDurationElement = document.querySelector(self.selector + ' .player .player__duration')

            let currentTimeElement = playerDurationElement.querySelector('.current-time')
            currentTimeElement.innerHTML = (el.duration > 3600) ? '00:00:00' : '00:00'

            let durationElement = playerDurationElement.querySelector('.duration')
            durationElement.innerHTML = self.timeToDisplay(el.duration)
        })

        this.audioElement.addEventListener('timeupdate', function() {
            let currentTimeElement = document.querySelector(self.selector + ' .player .player__duration .current-time')
            currentTimeElement.innerHTML = self.timeToDisplay(self.audioElement.currentTime)
        })

        this.audioElement.addEventListener('ended', function() {
            let playPauseBtn = document.querySelector(self.selector + ' .player .btn-play,.btn-pause')
            playPauseBtn.classList.remove('btn-pause')
            playPauseBtn.classList.add('btn-play')
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

        this.progressBar.draw(this.audioData.sourceUrl)

        let canvas = document.querySelector(this.selector + ' .player__progressbar canvas')
        canvas.insertAdjacentElement('afterend', this.audioElement)

        let track = this.audioCtx.createMediaElementSource(this.audioElement)
        track.connect(this.audioCtx.destination)

        let volumeElement = document.querySelector(this.selector + ' .btn-volume')
        volumeElement.addEventListener('click', function(e) {
            let el = <HTMLElement>e.currentTarget
            el.children[0].classList.remove('hidden')
        })

        let volumeRangeElement = document.querySelector(this.selector + ' .btn-volume .range-wrapper input')
        let defaultVolumeValue = 0.7
        volumeRangeElement.setAttribute('value', defaultVolumeValue.toString(10))
        self.audioElement.volume = defaultVolumeValue


        volumeRangeElement.addEventListener('change', function(e) {
            let el = <HTMLInputElement>e.currentTarget
            let rangeCurrentValue = parseFloat(el.value)

            self.audioElement.volume = rangeCurrentValue
        })

        let playPauseBtn = document.querySelector(this.selector + ' .player .btn-play,btn-pause')
        playPauseBtn.addEventListener('click', function(e) {
            let el = <HTMLElement>e.currentTarget
            if(self.audioCtx.state == 'suspended') {
                self.audioCtx.resume()
            }
            // gainNode.gain.value = 5
            // pannerNode.pan.value = -1
            if(self.playing) {
                el.classList.remove('btn-pause')
                el.classList.add('btn-play')
                self.audioElement.pause()
                self.playing = false
            }
            else {
                el.classList.remove('btn-play')
                el.classList.add('btn-pause')
                self.audioElement.play()
                self.playing = true
            }
        })

        document.addEventListener('click', function(e) {
            //@todo for now
            let el = <HTMLElement>e.target

            if(!el.classList.contains('btn-volume') && el.getAttribute('type') != 'range') {
                document.querySelector(self.selector + ' .range-wrapper').classList.add('hidden')
            }
        })
    }
}
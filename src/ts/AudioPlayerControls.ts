export default class AudioPlayerControls {
    protected selector: Element
    protected audioCtx: AudioContext
    constructor(selector: Element, audioCtx: AudioContext) {
        this.selector = selector
        this.audioCtx = audioCtx
    }

    public draw() {
        let controls = require('../views/controls.handlebars')
        this.selector.insertAdjacentHTML('afterbegin', controls())
        this.events()
    }

    public events() {
        let playPauseBtn = document.querySelector('.player.btn-play-pause')
        playPauseBtn.addEventListener('click', function() {console.log('111')
            if(this.audioCtx.state == 'suspended') {
                this.audioCtx.resume()
            }
            // gainNode.gain.value = 5
            // pannerNode.pan.value = -1
            //audioElement.play()
        })
    }

}
/* https://css-tricks.com/making-an-audio-waveform-visualizer-with-vanilla-javascript/ */
export default class ProgressBar {
    protected selector: string
    protected audioContext: AudioContext
    protected samples: number
    protected duration: number
    constructor(selector: string, audioContext: AudioContext, samples: number) {
        this.selector = selector
        this.audioContext = audioContext
        this.samples = samples
        this.duration = 0.0
    }

    /**
     * Retrieves audio from an external source, the initializes the drawing function
     * @param {String} url the url of the audio we'd like to fetch
     */
    public draw(url: string): void {
        let self = this

        fetch(url)
            .then(response => response.arrayBuffer())
            .then(arrayBuffer => this.audioContext.decodeAudioData(arrayBuffer))
            .then(audioBuffer => {this.drawProgressBar(this.normalizeData(this.filterData(audioBuffer)))})

        let canvasElement = document.querySelector(this.selector + ' canvas')
        canvasElement.addEventListener('click', function(e:PointerEvent) {
            let el = <HTMLCanvasElement>e.currentTarget
            let coords: Array<number> = self.getCursorPosition(el, e)
            let playedPercentage = coords[0] * 100 / el.width
            let currentTime = self.duration * playedPercentage / 100

            //@todo -> Not satisfied with this way
            let audioElement = <HTMLAudioElement>document.querySelector(self.selector + ' audio')
            audioElement.currentTime = currentTime

        })
    }

    /**
     * Filters the AudioBuffer retrieved from an external source
     * @param {AudioBuffer} audioBuffer the AudioBuffer from drawAudio()
     * @returns {Array} an array of floating point numbers
     */
    protected filterData(audioBuffer:AudioBuffer): Array<number> {
        this.duration = audioBuffer.duration
        const rawData = audioBuffer.getChannelData(0); // We only need to work with one channel of data
        const samples = this.samples; // Number of samples we want to have in our final data set
        const blockSize = Math.floor(rawData.length / samples); // the number of samples in each subdivision
        const filteredData = [];
        for (let i = 0; i < samples; i++) {
            let blockStart = blockSize * i; // the location of the first sample in the block
            let sum = 0;
            for (let j = 0; j < blockSize; j++) {
                sum = sum + Math.abs(rawData[blockStart + j]); // find the sum of all the samples in the block
            }
            filteredData.push(sum / blockSize); // divide the sum by the block size to get the average
        }
        return filteredData;
    };

    /**
     * Normalizes the audio data to make a cleaner illustration
     * @param {Array} filteredData the data from filterData()
     * @returns {Array} an normalized array of floating point numbers
     */
    protected normalizeData(filteredData: Array<number>): Array<number> {
        const multiplier = Math.pow(Math.max(...filteredData), -1);
        return filteredData.map(n => n * multiplier);
    }

    /**
     * Draws the audio file into a canvas element.
     * @param {Array} normalizedData The filtered array returned from filterData()
     * @returns {Array} a normalized array of data
     */
    protected drawProgressBar(normalizedData: Array<number>) {
        // set up the canvas
        const canvas = <HTMLCanvasElement>document.querySelector(this.selector + " canvas");
        canvas.width = 900;
        canvas.height = 75;
        const padding = 0;
        const ctx = canvas.getContext("2d");
        ctx.translate(0, canvas.offsetHeight / 2 + padding); // set Y = 0 to be in the middle of the canvas

        // draw the line segments
        const width = canvas.offsetWidth / normalizedData.length;
        for (let i = 0; i < normalizedData.length; i++) {
            const x = width * i;
            let height = normalizedData[i] * canvas.offsetHeight - padding;
            if (height < 0) {
                height = 0;
            } else if (height > canvas.offsetHeight / 2) {
                height = (height > canvas.offsetHeight / 2) ? 1: 0;
            }
            this.drawLineSegment(ctx, x, height, width, (i + 1) % 2);
        }
    }

    /**
     * A utility function for drawing our line segments
     * @param {AudioContext} ctx the audio context
     * @param {number} x  the x coordinate of the beginning of the line segment
     * @param {number} height the desired height of the line segment
     * @param {number} width the desired width of the line segment
     * @param {boolean} isEven whether or not the segmented is even-numbered
     */
    protected drawLineSegment(ctx: CanvasRenderingContext2D, x: number, height: number, width:number, isEven: number): void {
        ctx.lineWidth = 1; // how thick the line is
        ctx.strokeStyle = "#fff"; // what color our line is
        ctx.beginPath();
        height = isEven ? height : -height;
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.arc(x + width / 2, height, width / 2, Math.PI, 0, !!(isEven));
        ctx.lineTo(x + width, 0);
        ctx.stroke();
    }

    protected getCursorPosition(canvas: HTMLCanvasElement, event: MouseEvent) {
        const rect = canvas.getBoundingClientRect()
        const x = event.clientX - rect.left
        const y = event.clientY - rect.top
        return [x, y]
    }

}
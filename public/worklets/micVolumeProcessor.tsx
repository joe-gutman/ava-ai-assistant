const SMOOTHING_FACTOR = 0.8;
const MINIMUM_VALUE = 0.00001;

registerProcessor('micVolume', class extends AudioWorkletProcessor {
    constructor () {
        super();
        this._volume = 0;
        this.stopProcessing = false;
        this._updateIntervalInMS = 25;
        this._updateNextFrame = this._updateIntervalInMS;
        this.port.onmessage = event => {
            if (event.data.updateIntervalInMS) {
                this._updateIntervalInMS = event.data.updateIntervalInMS
            }
            if (event.data.stop) {
                this.stopProcessing = true;
            }
        }
    }

    get intervalInFrames () {
        return this._updateIntervalInMS / 1000 * sampleRate;
    }


    process(inputs, outputs, parameters) {
        const input = inputs[0]

        let hasAudioActivity = input.some(channel => channel.some(sample => sample !== 0));

        if (hasAudioActivity) {
            console.log('Audio activity detected');
        } else {
            console.log('No audio activity detected');
        }


        if (this.stopProcessing) {
            return false; 
        }

        if (input.length > 0) {
            const samples = input[0];
            let sum = 0;
            let rms = 0;

            for (let i = 0; i < samples.length; i++) {
                sum += samples[i] * samples[i];
            }

            rms = Math.sqrt(sum / samples.length);
            this._volume = Math.max(rms, this._volume * SMOOTHING_FACTOR);

            this._nextUpdateFrame -= samples.length;
            if (this._nextUpdateFrame < 0) {
                this._nextUpdateFrame += this.intervalInFrames;
                console.log('Volume:', this.volume);
                this.port.postMessage({volume: this._volume});
            }
        }

        return true;
    }
})
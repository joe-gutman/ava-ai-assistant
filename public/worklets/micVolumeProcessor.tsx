const SMOOTHING_FACTOR = 0.8;
const MINIMUM_VALUE = 0.00001;
let audio_activity = false;

registerProcessor('micVolume', class extends AudioWorkletProcessor {
    constructor (sampleRate) {
        super();
        this.sampleRate = sampleRate;
        this._volume = 0;
        this.stopProcessing = false;
        this._updateIntervalInMS = 25;
        this._nextUpdateFrame = this.intervalInFrames; // Initialize properly
        this.buffer = [];
        this.bufferSize = 0;
        this.maxBufferSize = sampleRate * 0.4;
        this.minBufferSize = sampleRate * .02;
        this.port.onmessage = event => {
            if (event.data.updateIntervalInMS) {
                this._updateIntervalInMS = event.data.updateIntervalInMS;
                this._nextUpdateFrame = this.intervalInFrames; // Update frames when interval changes
            }
            if (event.data.stop) {
                this.stopProcessing = true;
            }
        }
    }

    get intervalInFrames () {
        return this._updateIntervalInMS / 1000 * this.sampleRate;
    }

    process(inputs, outputs, parameters) {
        const input = inputs[0];

        let hasAudioActivity = input.some(channel => channel.some(sample => sample !== 0));

        // if (hasAudioActivity && !audio_activity) {
        //     console.log('Audio activity detected');
        //     audio_activity = true;
        // } else if (!hasAudioActivity && audio_activity) {
        //     console.log('No audio activity detected');
        //     audio_activity = false;
        // }

        if (this.stopProcessing) {
            return false; 
        }

        if (input.length > 0) {
            const samples = input[0];
            let sum = 0;

            console.log("Sample Rate:", samples.sampleRate);
            console.log("Number of Channels:", samples.numberOfChannels);
            console.log("Buffer Length (frames):", samples.length);
            console.log("Buffer Duration (seconds):", samples.duration);

            for (let i = 0; i < samples.length; i++) {
                sum += samples[i] * samples[i];
            }

            let rms = Math.sqrt(sum / samples.length);
            this._volume = Math.max(rms, this._volume * SMOOTHING_FACTOR);

            this.buffer.push(...samples);
            this.bufferSize += samples.length;

            this._nextUpdateFrame -= samples.length;
            if (this._nextUpdateFrame < 0) {
                this._nextUpdateFrame += this.intervalInFrames;
                if (this.bufferSize >= this.maxBufferSize || (!hasAudioActivity && this.bufferSize != 0)) {
                    this.postMessage({
                        volume: this._volume,
                        audioChunk: this.buffer.slice(0, this.bufferSize)
                    });
                }
    
            }
        }

        return true;
    }

    postMessage(data) {
        this.port.postMessage(data);
    }
});



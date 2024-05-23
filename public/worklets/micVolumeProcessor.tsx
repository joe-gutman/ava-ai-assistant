registerProcessor('micVolume', class extends AudioWorkletProcessor {
    constructor () {
        super();
        this._volume = 0;
        this.minVolume = 0.00001;
        this.smoothingFactor = .8;
        this.stopProcessing = false;
        this.buffer = [];
        this.bufferSize = 0;
        this.maxBufferSize = sampleRate * 1; // Represents a time interval in seconds ('sampleRate * 1' == 1 second)
        this.port.onmessage = event => {
            if (event.data.stop) {
                this.stopProcessing = true;
            }
        }
    }

    get intervalInFrames () {
        return this._updateIntervalInMS / 1000 * sampleRate;
    }

    process(inputs, outputs, parameters) {
        
        if (inputs.length > 0) {
            const sample = inputs[0][0];
            this.volume = this.calculateRMS(sample);
            
            if (sample.length > 0 && this.volume > this.minVolume) {
                this.buffer.push(...sample);
                this.bufferSize += sample.length;          
                
                if (this.bufferSize >= this.maxBufferSize) {
                    console.log('Buffer Size:', this.bufferSize, '; Max Buffer Size: ', this.maxBufferSize, '; Volume: ', this.volume);
                    
                    this.postMessage({
                        // volume: maxVolume,
                        audioChunk: this.buffer.slice(0, this.bufferSize)
                    });
                    
                    this.bufferSize = 0;
                }
                
            }
        } else if (this.bufferSize > 0) {
            this.postMessage({
                // volume: maxVolume,
                audioChunk: this.buffer.slice(0, this.bufferSize)
            });
        }


        return true;
    } 

    postMessage(data) {
        this.port.postMessage(data);
    }

    calculateRMS(samples) {
        let sum = 0;
        let rms = 0;
        let volume = 0
        
        for (let i = 0; i < samples.length; i++) {
            sum += samples[i] * samples[i];
        }

        rms = Math.sqrt(sum / samples.length);
        this._volume = Math.max(rms, this._volume * this.smoothingFactor);
        return this._volume;
    }
});



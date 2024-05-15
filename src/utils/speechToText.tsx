class SpeechToText {
	constructor() {
		this.transcribedText = "";
		this.stream = null;
		this.audioContext = null;
		this.node = null;
		this.silenceThreshold = -60;
		this.active = false;
	}

	async init() {
        try {
            // Create a new audio context
            this.audioContext = new AudioContext();

            // Create a new audio stream
            this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			
			this.active = true;
            console.log('Audio stream created successfully');
        } catch (error) {
            console.error('Error initializing audio:', error);
        }
    }

	async start() {
		if(!this.audioContext || !this.stream) {
			console.warn('Audio context or stream not initialized');
			return;
		}

		try {
			console.log('Starting Speech Recognition')

			await this.audioContext.audioWorklet.addModule('/worklets/micVolumeProcessor.tsx');

			let microphone = this.audioContext.createMediaStreamSource(this.stream);

			this.node = new AudioWorkletNode(this.audioContext, 'micVolume');

			microphone.connect(this.node);

			this.active = true;
			this.node.port.onmessage = event => {
				if (event.data.volume > this.silenceThreshold) {
					console.log('Sound detected');
				}
			}
		} catch (error) {
			console.error('Problem starting speech to text:', error);
		}
	}

	stop() {
		// stop the audio node from processing
		if (this.node) {
			this.node.port.postMessage({ stop : true});
			this.node = null;
			this.active = false;
		} else {
			console.warn('Speech to text is not running.');
		}
	}

	isActive() {
		return this.active;
	}
}

export default SpeechToText;

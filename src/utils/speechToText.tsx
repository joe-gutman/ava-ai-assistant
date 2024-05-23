import { callbackify } from "util";

require('dotenv').config();
const Deepgram = require('../utils/deepgram')

class SpeechToText {
	constructor() {
		this.transcribedText = "";
		this.stream = null;
		this.audioContext = null;
		this.node = null;
		this.silenceThreshold = .01;
		this.active = false;
		this.deepgram = null;
	}

	async init() {
        try {
            // Create a new audio context
            this.audioContext = new AudioContext();
			// this.sampleRate = this.audioContext.sampleRate;
			// console.log('Sample Rate:', this.sampleRate)


            // Create a new audio stream
            this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });

			this.active = true;
            console.log('Audio stream created successfully');

			this.deepgram = new Deepgram()
			await this.deepgram.initialize(process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY);
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

			await this.deepgram.startLiveTranscription()

			await this.audioContext.audioWorklet.addModule('/worklets/micVolumeProcessor.tsx');

			let microphone = this.audioContext.createMediaStreamSource(this.stream);

			this.node = new AudioWorkletNode(this.audioContext, 'micVolume');

			this.node.port.onmessage = event => {
				console.log(event.data)
				const audioChunk = event.data.audioChunk || null
				if (audioChunk) {
					console.log('Audio detected:', audioChunk);
					this.deepgram.sendAudio(audioChunk)
				}
			}

			microphone.connect(this.node);
			this.active = true;

		} catch (error) {
			console.error('Problem starting speech to text:', error);
		}
	}

	stop() {
        if (this.node) {
            this.node.port.postMessage({ stop: true });
            this.node.disconnect();
            this.node = null;
        }

        if (this.audioContext) {
            this.audioContext.close();
            this.audioContext = null;
        }

        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }

        this.active = false;
        console.log('Stopping Speech Recognition');
    }

	isActive() {
		return this.active;
	}
}

export default SpeechToText;

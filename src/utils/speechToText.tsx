const { createClient, LiveTranscriptionEvents } = require("@deepgram/sdk");

class SpeechToText {
	constructor(callback) {
		this.active = false;
		this.timeout = 10000; //ms
		this.socket = null;
		this.stream = null;
		this.interimTranscript = '';
		this.transcriptChunks = [];
		this.transcriptCallback = callback;
		this.elapsedSpeechGap = 0; // time in ms since last transcribed speech
		this.speechCheckInterval = 250; // interval time in ms to check speech gap
		this.maxSpeechGap = 2000; // max time in ms since last transcribed speech
		this.speechGapTimer = null;
	}

	start() {
		// Get permission from user for microphone access
		navigator.mediaDevices.getUserMedia({ audio: true })
		.then(stream => {
				this.stream = stream;
				console.log('Starting Speech Recognition')

            	this.mediaRecorder = new MediaRecorder(this.stream);

				this.deepgram = createClient(process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY);

				// Create a live transcription connection
				this.connection = this.deepgram.listen.live({
					model: "nova-2",
					language: "en-US",
					smart_format: true,
					endpointing: 500,
					interim_results: true,
				});

				// Listen for events from the live transcription connection
				this.connection.on(LiveTranscriptionEvents.Open, () => {
					this.active = true;

					//Record audio from microphone
					this.mediaRecorder.addEventListener('dataavailable', event => {
						if (event.data.size > 0) {
							this.elapsedSpeechGap = 0;
							console.log('Audio data available:', event.data);
							console.log({ dataSize: event.data.size});
							if (this.connection) {
								this.connection.send(event.data)
							}
						}
					})
					this.mediaRecorder.start(100)
					this.transcript = '';
					
					// Recieve transcribed text from deepgram
					this.connection.on(LiveTranscriptionEvents.Transcript, (data) => {
						if (this.active === true) {
							this.interimTranscript = data.channel.alternatives[0].transcript;
							console.log('Transcript: ', this.interimTranscript);
							this.saveChunk(data.is_final);
							this.returnTranscript(false);
						}
					});

					// Set up the interval to check for speech gaps
					this.speechGapTimer = setInterval(() => {
						this.elapsedSpeechGap += this.speechCheckInterval;
						if (this.elapsedSpeechGap >= this.maxSpeechGap) {
							this.returnTranscript(true);
							clearInterval(this.speechGapTimer);
							console.log('Max speech gap reached. Stopping transcription.');
						}
					}, this.speechCheckInterval);

				});

			}).catch ((error) => {
				console.error('Problem starting speech to text:', error);
			})
		}

	clearInterval() {
		clearInterval(this.speechGapTimer);
		this.speechGapTimer = null;
		console.log('Interval stopped.')
	}

	clearMediaRecorder() {
		if (this.mediaRecorder != null) {
			this.mediaRecorder.stop();
            this.mediaRecorder = null;
			console.log('Media recorder stopped.')
        }
	}

	clearConnection() {
		if (this.connection) {
			const message = JSON.stringify({ type: 'CloseStream' });
			this.connection.send(message);
			this.connection = null;
			console.log('Deepgram connection closed.')
		}
	}

	clearStream() {
		if (this.stream != null) {
			this.stream.getTracks().forEach(track => track.stop());
			this.stream = null;
			console.log('Stream closed.')
		}
	}

	clearTranscript() {
		this.interimTranscript = '';
		this.transcriptChunks = [];
	}

	// Save a complete chunk
    saveChunk(finalChunk) {
		if (finalChunk) {
			this.transcriptChunks.push(this.interimTranscript);
			this.interimTranscript = '';
		}
    }

	// speechEnd: (boolean) true of false if speech is considered completed
	returnTranscript(speechEnd) {
		if (this.transcriptChunks.join(' ').length > 0 || this.interimTranscript.length > 0) {
			if (!speechEnd) {
				const transcript = this.transcriptChunks.join(' ') + this.interimTranscript;
				this.transcriptCallback(transcript, false);
			} else if (speechEnd) {
				if (this.interimTranscript.length > 0) {
					this.saveChunk(true);
				}
				this.transcriptCallback(this.transcriptChunks.join(' '), true);
				this.reset();
				this.active = false;
			}
		}
	}

	// close connections and clear variables.
	reset() {
		this.active = false;
		this.clearInterval();
		this.clearMediaRecorder();
		this.clearConnection();
		this.clearStream();
		this.clearTranscript();
    }
	
	stop() {
		this.returnTranscript(true);
		console.log('Speech recognition stopped.');
	}
}

export default SpeechToText;

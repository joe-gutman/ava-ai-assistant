const { createClient, LiveTranscriptionEvents } = require("@deepgram/sdk");
const fetch = require("cross-fetch");
const dotenv = require("dotenv");
dotenv.config();

class SpeechToText {
	constructor() {
		this.transcribedText = '';
		this.timeout = 2500; //ms
		this.socket = null;
		this.stream = null;
		this.active = false;
	}

	async start(callback) {
		// Get permission from user for microphone access
		navigator.mediaDevices.getUserMedia({ audio: true })
			.then(stream => {
				this.stream = stream;
				this.active = true;
				console.log('Starting Speech Recognition')

            	const mediaRecorder = new MediaRecorder(this.stream);
				
				// this.socket = new WebSocket('wss://api.deepgram.com/v1/listen', [ 'token', process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY, 'endpointing', 300 ])

				this.deepgram = createClient(process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY);

				// STEP 2: Create a live transcription connection
				this.connection = this.deepgram.listen.live({
					model: "nova-2",
					language: "en-US",
					smart_format: true,
					endpointing: 500,
				});

				// STEP 3: Listen for events from the live transcription connection
				this.connection.on(LiveTranscriptionEvents.Open, () => {
					mediaRecorder.addEventListener('dataavailable', event => {
						if (event.data.size > 0) {
							console.log('Audio data available:', event.data);
							console.log({ dataSize: event.data.size});
							this.connection.send(event.data)
						}
					})
					mediaRecorder.start(100)
					
					this.connection.on(LiveTranscriptionEvents.Close, () => {
						console.log("Connection closed.");
					});

					this.connection.on(LiveTranscriptionEvents.Transcript, (data) => {
						console.log(data.channel.alternatives[0].transcript);
					});

					this.connection.on(LiveTranscriptionEvents.Metadata, (data) => {
						console.log(data);
					});

					this.connection.on(LiveTranscriptionEvents.Error, (err) => {
						console.error(err);
					});
				});


				// // Deepgram socket connection is opened
				// this.socket.onopen = (event) => {
				// 	console.log(`WebSocket connection opened. Action: ${event.type}`);
				// 	this.transcribedText = ''

				// 	// listen for audio from microphone stream
				// 	mediaRecorder.addEventListener('dataavailable', event => {
				// 		if (event.data.size > 0) {
				// 			console.log('Audio data available:', event.data);
				// 			console.log({ socketReadyState: this.socket.readyState, dataSize: event.data.size});
				// 			this.socket.send(event.data)
				// 		}
				// 	})
				// 	mediaRecorder.start(100)
				// }

				// this.socket.onmessage = (message) => {
				// 	console.log({ event: 'onmessage', message });
				// 	const received = JSON.parse(message.data);

				// 	if (received.channel) {
				// 		let fullTranscript = '';
				// 		const transcript = received.channel.alternatives[0].transcript;
				// 		console.log("Speech final: ", received.speech_final, " Is final: ", received.is_final);
				// 		if (transcript) {
				// 			console.log(transcript)
				// 			this.transcribedText += ' ' + transcript;
				// 			callback(this.transcribedText.trim(), 'prompt', false);

				// 			if (received.speech_final && received.is_final) {
				// 				callback(this.transcribedText.trim(), 'prompt', true);
				// 				this.transcribedText = '';
				// 			}
				// 		}
				// 	}
				// } 
				
				// this.socket.onclose = (event) => {
				// 	console.log(`WebSocket connection closed.`);
				// } 
				
				// this.socket.onerror = (error) => {
				// 	console.log(`ERROR: ${error}`);
				// }

				this.active = true;
			}).catch ((error) => {
				console.error('Problem starting speech to text:', error);
			})
		}

	stop() {
		this.connection.on(LiveTranscriptionEvents.Close, () => {
			console.log(`WebSocket connection closed.`);
			this.socket = null;
		});

        if (this.mediaRecorder) {
            this.mediaRecorder.stop();
            this.mediaRecorder = null;
        }

        if (this.socket) {
			const message = JSON.stringify({ type: 'CloseStream' });
			this.connection.send(message);
		}

		if (this.stream) {
			this.stream.getTracks().forEach(track => track.stop());
			this.stream = null;
		}

        this.active = false;
        console.log('Speech recognition stopped.');
    }
}

export default SpeechToText;

import { Console } from "console";

const { createClient, LiveTranscriptionEvents } = require("@deepgram/sdk");
const fetch = require("cross-fetch");
const dotenv = require("dotenv");
dotenv.config();

class SpeechToText {
	constructor() {
		this.timeout = 500; //ms
		this.socket = null;
		this.stream = null;
		this.active = false;
		this.textChunks = [];
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
					interim_results: true,
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
						console.log("Received data:", data);

						const transcript = data.channel.alternatives[0].transcript; 
						console.log("Transcript:", transcript);

						const displayText = this.textChunks.join(' ') + transcript;
						callback(displayText, 'prompt', false);

						if (data.is_final && !data.speech_final) {
							console.log(`---------- CHUNK COMPLETE ---------- \n Chunk: ${transcript}`);
							this.textChunks.push(transcript);
							console.log('Text chunks: ', this.textChunks);
						}else if (data.speech_final) {
							console.log('---------- SPEECH COMPLETE ----------');
							callback(displayText, 'prompt', true);
							this.finalText = '';
							this.textChunks = [];
							this.inProgressText = '';
						}
					});

					this.connection.on(LiveTranscriptionEvents.Metadata, (data) => {
						console.log(data);
					});

					this.connection.on(LiveTranscriptionEvents.Error, (err) => {
						console.error(err);
					});
				});

				this.active = true;
			}).catch ((error) => {
				console.error('Problem starting speech to text:', error);
			})
		}

	stop() {
		// this.connection.on(LiveTranscriptionEvents.Close, () => {
		// 	console.log(`WebSocket connection closed.`);
		// 	this.socket = null;
		// });

        // if (this.mediaRecorder) {
        //     this.mediaRecorder.stop();
        //     this.mediaRecorder = null;
        // }

        // if (this.socket) {
		// 	const message = JSON.stringify({ type: 'CloseStream' });
		// 	this.connection.send(message);
		// }

		// if (this.stream) {
		// 	this.stream.getTracks().forEach(track => track.stop());
		// 	this.stream = null;
		// }

        // this.active = false;
        // console.log('Speech recognition stopped.');
    }
}

export default SpeechToText;

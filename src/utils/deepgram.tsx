const { createClient, LiveTranscriptionEvents } = require('@deepgram/sdk');

class Deepgram {
    constructor() {
        this.client = null;
        this.connection = null;
    } 

    async initialize(apiKey) {
        // Create a Deepgram client using the API key
        this.client = createClient(apiKey);
    }

    async startLiveTranscription(language, model) {
        // Create a live transcription connection
        this.connection = this.client.listen.live({
        model: model || 'nova-2',
        language: language || 'en-US',
        smart_format: true,
        });

        // Listen for events from the live transcription connection
        this.connection.on(LiveTranscriptionEvents.Open, () => {
            this.connection.on(LiveTranscriptionEvents.Close, () => {
                console.log('Connection timed out.');
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

        return this.connection;
    }

    stopLiveTranscription() {
        if (this.connection) {
            this.connection.close();
        }
    }

    sendAudio(audioChunk) {
        if (this.connection) {
            this.connection.send(audioChunk);
        } else {
            console.warn('Live transcription connection not established.');
        }
    }
}

module.exports = Deepgram;

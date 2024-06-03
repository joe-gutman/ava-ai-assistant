import SendRequest from './sendRequest';

class TextToSpeechElevenLabs {
    constructor() {
        this.sampleRate = 44100;
        this.bitrate = 32;

        this.audioFormat = `mp3_${this.sampleRate}_${this.bitrate}`;
        this.voiceID = 'SeF28OCtyrmtk1Z29z6b';
        this.modelID = 'eleven_multilingual_v2';
        this.limit = 100; //character limits for spoken text
        this.voiceSettings = {
            stability: 50,
            similarity_boost: 50,
            style: 10
        };
        this.audioQueue = [];
        this.processingAudio = false;
    }   

    async start(text, audioPlayer) {
        const request = {
            url: `https://api.elevenlabs.io/v1/text-to-speech/${this.voiceID}/stream?output_format=${this.audioFormat}`,
            method: 'POST',
            headers: {
                'xi-api-key': process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY,
                'Content-Type': 'application/json'},
            body: {
                model_id: this.modelID,
                text: text,
                // voice_settings: this.voiceSettings
            }
        };

        try {
            const response = await SendRequest({...request, audioPlayer});            
        } catch (error) {
            console.error('Error generating audio:', error);
        }
    }
}

export default TextToSpeechElevenLabs;

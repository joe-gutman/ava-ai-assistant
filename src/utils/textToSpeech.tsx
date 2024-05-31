
const dotenv = require("dotenv");
dotenv.config();

class textToSpeech {
    constructor() {
        this.stream = null;
        this.client = new ElevenLabs({
            api_key: process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY
        this.ttsService = {
            'elevenLabs': {
                voice_id: 'EXAVITQu4vr4xnSDxMaL',
                settings: {
                    stability: 0.71,
                    similarity_boost: 0.5,
                    style: 0.0,
                    use_speaker_boost: true
                }
            }
        };


    }
}
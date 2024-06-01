import { ElevenLabsClient, play } from "elevenlabs";

const dotenv = require("dotenv");
dotenv.config();

class TextToSpeechElevenLabs {
    constructor() {
        this.stream = true;
        this.client = new ElevenLabsClient({
            api_key: process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY
        });
        this.voice = 'joanna';
        this.model_id = 'eleven_multilingual_v2';
        this.limit = 100; //character limits for spoken text
    }   

    async start(text) {
        try {
            const audioStream = await this.client.generate({
                stream: this.stream,
                voice: this.voice,
                text: text.substr(0, this.limit),
                model_id: this.model_id
            });
            play(audio);
        } catch (error) {
            console.error('Error generating audio:', error);
        }
    }
}

export default TextToSpeechElevenLabs;
import { Polly, SynthesizeSpeechCommand } from '@aws-sdk/client-polly';

export const TextToSpeech = async (text) => {
  const polly = new Polly({
    region: import.meta.env.VITE_AWS_REGION,
    credentials: {
      accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
      secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
    },
  });

  const params = {
    OutputFormat: 'mp3',
    Text: text,
    TextType: 'text',
    VoiceId: 'Salli',
  };


  try {
    const command = new SynthesizeSpeechCommand(params);
    const result = await polly.send(command);

    if (result.AudioStream instanceof ReadableStream) {
      const audioBuffer = await new Response(result.AudioStream).arrayBuffer();
      return audioBuffer;
    } else {
      console.log('Empty response from AWS Polly.');
    }
  } catch (err) {
    console.log('Error converting text to speech', err);
  }
};

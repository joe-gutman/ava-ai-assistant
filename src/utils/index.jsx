import { TextToSpeech } from './text-to-speech.jsx';
import { initializeSpeechRecognition } from './speechRecognition.js';
import { requestAI } from './openaiApi.js';
import AskAi from './ask-ai.js';

export {
  TextToSpeech,
  InitializeSpeechRecognition,
  RequestAI,
  BuildPrompt,
  ProcessCommand
};
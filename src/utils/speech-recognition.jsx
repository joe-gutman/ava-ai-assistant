export const InitializeSpeechRecognition = (onPhraseReceived) => {
  window.SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;

  if (!('SpeechRecognition' in window)) {
    console.error('speech not supported');
    return null;
  }

  const recognition = new window.SpeechRecognition();
  recognition.continuous = true;

  recognition.onresult = (event) => {
    const phrase = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
    onPhraseReceived(phrase);
  };

  recognition.onerror = (event) => {
    if (event.error) {
      recognition.stop();
      recognition.start();
    }
  };

  recognition.start();

  return recognition;
};


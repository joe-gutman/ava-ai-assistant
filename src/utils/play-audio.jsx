export const PlayAudio = (audioBuffer) => {
  const audioBlob = new Blob([audioBuffer], { type: 'audio/mpeg' });
  const audioUrl = URL.createObjectURL(audioBlob);
  const audio = new Audio();
  audio.src = audioUrl;
  audio.onerror = (error) => {
    console.error('Error playing audio:', error);
  };
  audio.play();
};
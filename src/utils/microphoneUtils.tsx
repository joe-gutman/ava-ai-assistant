// Gets and labels audio input stream. Input stream is assumed to be microphone but may not be.
// Current solution is to assume the input is a microphone, fix if and when necessary.
const startListening = async () => {
  try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
	  const audioContext = new AudioContext();
	  const source = audioContext.createMediaStreamSource(stream);
      return { stream, audioContext, source };
  } catch (error) {
      return null;
  }
};

const stopListening = async (stream) => {
	if (!stream) {
		console.warn('No microphone stream provided. Cannot stop stream');
		return false;
	}

	try {
		const audioTracks = stream.getAudioTracks();
		audioTracks.forEach((track) => {
			track.stop();
		});
		return true;
	} catch (error) {
		console.error('Error stopping stream:', error);
		return false;
	}   
};

export { startListening, stopListening };
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import { Login, Register, Header } from './components';
import { InitializeSpeechRecognition } from './utils/speech-recognition.jsx';
import AskAI from './utils/ask-ai.jsx';
import { TextToSpeech } from './utils/text-to-speech.jsx';
// import { PlayAudio } from './utils/play-audio.jsx';
import AI from './gpt-prompts/index.jsx';
import Lists from './components/lists/lists.jsx';
import Ava from './components/ava/ava.jsx';
import { saveAs } from 'file-saver'; // Import the FileSaver.js library

function App() {
  const [userID, setUserID] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [user, setUser] = useState(undefined);
  const [userInfo, setUserInfo] = useState({});
  const [lists, setLists] = useState([]);
  const [avaFace, setAvaFace] = useState('🙂');
  const [command, setCommand] = useState({});
  const [speaking, setSpeaking] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [universalHide, setUniversalHide] = useState(false);
  const [avaMini, setAvaMini] = useState(false);
  const [avaEmotion, setAvaEmotion] = useState({
    neutral: '🙂',
    happy: '😃',
    sad: '😢',
    angry: '😠',
    thinking: '🤔',
    speaking: '😮',
  });
  const [aiResponse, setAIResponse] = useState('');
  const [audioLength, setAudioLength] = useState(0);


  // -------- takes in a string and returns true if it is a command --------
  const isCommand = async(recognizedSpeech) => {
    let prompt = `Given a user's statement "${recognizedSpeech}", determine whether the statement is intended as a command for an AI assistant named Ava.

    For context, Ava responds to commands when they contain her name or a similar trigger word like 'Eva'.

    Here are some examples:

        If the user says "Hey Ava, what's the weather like today?", it's intended as a command for Ava.
        If the user says "I was talking to Ava about the weather.", it's not a command for Ava.

    Please respond with 'true' if the statement is a command for Ava, and 'false' if it is not.`

    if (recognizedSpeech.toLowerCase().includes("ava") || recognizedSpeech.toLowerCase().includes("eva")) {
      var  response = await AskAI(prompt);
      //response will show up in the form of (true: command type)
      if (response) {
        return true;
      } else {
        return false;
      }
    }
  }

  const chatGPTTransform = async (text) => {
    const response = await AskAI(text);
    if (response) {
      const audio = await TextToSpeech(response);
      setAIResponse(response);
      PlayAudio(audio);
    }
  }

  const handleSpeech = async () => {
    const prompt = AI.Identity.identity + AI.Commands.instructions + AI.Commands.commands + AI.Commands.handleLists + AI.Commands.handleConversation + AI.Commands.emoji + AI.Commands.initialize;

    if (user !== undefined) {
      const handlePhrase = async (phrase) => {
        console.log('Heard:', phrase);

        if ( await isCommand(phrase)) {
          setAvaFace(avaEmotion.thinking);
          const response = await AskAI(prompt + phrase + '.');
          if (response) {
            var gptResponse = JSON.parse(response.toLowerCase());
            setCommand(gptResponse);
            setAvaFace(gptResponse.emoji);
            const audio = await TextToSpeech(gptResponse.response);
            setAIResponse(gptResponse.response);
            PlayAudio(audio);
          }
        }
      }

      const recognition = InitializeSpeechRecognition(handlePhrase);

      return () => {
        if (recognition) recognition.stop();
      };
    }
  };

  const PlayAudio = (audioBuffer) => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    audioContext.decodeAudioData(audioBuffer).then((decodedBuffer) => {
      // setAvaFace(avaEmotion.speaking);
      setAudioLength(decodedBuffer.duration);


      setSpeaking(true);
      setTimeout(() => {
        console.log('done speaking');
        setAvaFace(avaEmotion.neutral);
        setSpeaking(false);
      }, decodedBuffer.duration * 1000);

      const source = audioContext.createBufferSource();
      source.buffer = decodedBuffer;
      source.connect(audioContext.destination);
      source.start();
    }).catch((error) => {
      console.error('Error decoding audio data:', error);
    });
  };

  useEffect(() => {
    console.log(aiResponse);
  }, [aiResponse]);

  useEffect(() => {
    const prompt = AI.Identity.identity + AI.Commands.instructions + AI.Commands.commands + AI.Commands.handleLists + " you have these lists: "+ lists.toString() + AI.Commands.handleConversation + AI.Commands.emoji + AI.Commands.initialize;
    setPrompt(prompt);
  }, [lists]);

  useEffect(() => {
    if (!user) {
      setShowLogin(true);
    } else {
      // const audio = new Audio('./assets/startup.mp3');
      // audio.play();
      // const prompt = AI.User.user + AI.Identity.identity + AI.Startup.startup + AI.Startup.greeting + AI.Startup.help + " be short and concise, don't make a long introduction, only ask one question" + AI.Commands.initialize;
      // chatGPTTransform(prompt);
      const recognition = InitializeSpeechRecognition(handleSpeech);
    }
  }, [user]);

  useEffect(() => {
    console.log(command);
  }, [command]);

  if (user === undefined) {
    return (
      <>
        {showLogin ? (
          createPortal(
            <Login setShowRegister={setShowRegister} setShowLogin={setShowLogin} setUser={setUser} user={user}
            />,
            document.body
          )
        ) : (
          <></>
        )}
        {showRegister ? (
          createPortal(
            <Register setShowRegister={setShowRegister} setShowLogin={setShowLogin} setUser={setUser} user={user} setUserInfo={setUserInfo} userInfo={user}
            />,
            document.body
          )
        ) : (
          <></>
        )}
      </>
    );
  } else {
    return (
      <>
        <Header userInfo={userInfo} setUserInfo={setUserInfo} />
        {createPortal(<Ava avaFace={avaFace} avaMini={avaMini} aiResponse={aiResponse} audioLength={audioLength} />,document.body)}
        <Lists user={user} command={command} universalHide={universalHide} lists={lists} setLists={setLists} setAvaMini={setAvaMini} />
      </>
    );
  }
}

export default App;
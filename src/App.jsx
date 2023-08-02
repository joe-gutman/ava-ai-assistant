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
  const [aiText, setAiText] = useState('');
  const [aiSpokenResponse, setAISpokenResponse] = useState('');
  const [audioLength, setAudioLength] = useState(0);

  const chatGPTTransform = async (text) => {
    const response = await AskAI(text);
    if (response) {
      const audio = await TextToSpeech(response);
      PlayAudio(audio);
    }
  }

  //speech recognition and voice response function
  const handleSpeech = () => {
    const triggers = ['hello ava', 'hi ava', 'hey ava'];

    if (user !== undefined) {
      const handlePhrase = async (phrase) => {
        console.log('Heard:', phrase);

        for (let trigger of triggers) {
          if (phrase.toLowerCase().startsWith(trigger)) {
            setAvaFace(avaEmotion.thinking);
            const command = phrase.replace(trigger, '').trim();
            const response = await AskAI(prompt + command + '.');
            if (response) {
              var aiResponse = JSON.parse(response.toLowerCase());
              setCommand(aiResponse);
              setAvaFace(aiResponse.emoji);
              const audio = await TextToSpeech(aiResponse.response);
              setAISpokenResponse(aiResponse.response);
              PlayAudio(audio);
            }
          }
        }
      };

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
        console.log('Done speaking')
        setAvaFace(avaEmotion.neutral);
        setSpeaking(false);
      }, audioLength * 1000);

      const source = audioContext.createBufferSource();
      source.buffer = decodedBuffer;
      source.connect(audioContext.destination);
      source.start();
    }).catch((error) => {
      console.error('Error decoding audio data:', error);
    });
  };

  // const avaFaceSwap = async (length, ...emoji) => {
  //   const max = 5000;
  //   const min = 1000;
  //   const totalDuration = length * 1000;
  //   let elapsed = 0;

  //   // Convert emoji parameters to an array of emojis
  //   const emojis = emoji.flat();

  //   const swapEmojis = () => {
  //     if (elapsed >= totalDuration) {
  //       return;
  //     }

  //     const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
  //     setAvaFace(randomEmoji);

  //     const nextInterval = Math.floor(Math.random() * (max - min) + min);
  //     elapsed += nextInterval;
  //     setTimeout(swapEmojis, nextInterval);
  //   };

  //   swapEmojis();
  // };

  useEffect(() => {
    console.log(aiText);
  }, [aiText]);

  useEffect(() => {
    console.log(aiSpokenResponse);
  }, [aiSpokenResponse]);

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
      const prompt = AI.User.user + AI.Identity.identity + AI.Startup.startup + AI.Startup.greeting + AI.Startup.help + "be short and concise" + AI.Commands.initialize;
      // chatGPTTransform(prompt);
      handleSpeech();

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
        {createPortal(<Ava avaFace={avaFace} avaMini={avaMini} aiText={aiText} aiSpokenResponse={aiSpokenResponse} audioLength={audioLength} />,document.body)}
        <Lists user={user} command={command} universalHide={universalHide} lists={lists} setLists={setLists} setAvaMini={setAvaMini} />
      </>
    );
  }
}

export default App;
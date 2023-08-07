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
  // var promptCommandType = `Given a user's statement "${recognizedSpeech}", classify it into one of the following command types:

  // list
  // conversation
  // other
  // none

  // Here are some examples for context:

  // If the user says "add milk to my grocery list", the command type would be "list".
  // If the user says "what is the weather like today?", the command type would be "other".
  // If the user asks "how are you?" or "what is your name?", the command type would be "conversation".

  // Return only the command type for the given user statement.`;


  // takes in a string and determines whether it is a command for Ava
  const isCommand = async(recognizedSpeech) => {
    let prompt = `Given a user's statement "${recognizedSpeech}", determine whether the statement is intended as a command for an AI assistant named Ava.

    For context, Ava responds to commands when they contain her name or a similar trigger word like 'Eva'.

    Here are some examples:

        If the user says "Hey Ava, what's the weather like today?", it's intended as a command for Ava.
        If the user says "I was talking to Ava about the weather.", it's not a command for Ava.

    Please respond with 'true' if the statement is a command for Ava, and 'false' if it is not.`

    if (recognizedSpeech.toLowerCase().includes("ava") || recognizedSpeech.toLowerCase().includes("eva")) {
      var response = await AskAI(prompt + recognizedSpeech);
      //response will show up in the form of (true: command type)
      if (response) {
        return true;
      } else {
        return false;
      }
    }
  }

  // takes in a string and parses out the command type for Ava
  const getCommand = (recognizedSpeech) => {
    var commandTypes = ["list", "conversation", "other", "none"]

    var commands = {
      "list": {
        "commands": ["create", "delete", "add item", "delete item", "mark complete", "mark incomplete", "show", "show all", "hide"],
        "response": "{ 'command': command, 'list': listName, 'item': itemName, 'completed': completed, 'reply': reply }",
      "conversation": {
        "response": "{ 'reply': reply }"
      },
      "other": {
        "response": "{ 'reply': 'I don't know how to do that yet.'}"
      },
      "none": {
        "response": "{ 'reply': 'I'm sorry, I didn't understand that.'}"
      }
    }



    var prompt = `Given a user's statement "${recognizedSpeech}", classify it into one of the following command types:

    ${commandTypes.join("\n")}

    Here are some examples for context:

      If the user says "add milk to my grocery list", the command type would be "list".
      If the user says "what is the weather like today?", the command type would be "other".
      If the user asks "how are you?" or "what is your name?", the command type would be "conversation".

    Return only the command type for the given user statement.`;

    return AskAI(prompt + recognizedSpeech);
  }



  const runCommand = (command) => {p
    var commands = {
      "conversation": avaConversation,
      "list": avaList,
      "other": avaOther
    }

    commands[command]();
  }

  const userInput = (phrase) => {
    console.log("Heard: " + phrase);

    if (user !== undefined) {
      isCommand(phrase)
        .then((isCommand) => {
          if (isCommand) {
            getCommand(phrase).then((command) => {
              runCommand(command);
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }

    const recognition = InitializeSpeechRecognition(userInput);

    return () => {
      if (recognition) recognition.stop();
    };
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
      const recognition = InitializeSpeechRecognition(userInput);
    }
  }, [user]);

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
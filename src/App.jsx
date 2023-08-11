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
  const [aiTypedResponse, setAITypedResponse] = useState('');
  const [audioLength, setAudioLength] = useState(0);
  const currentIndexRef = useRef(0);
  const delay = 60;

  function capitalizeText(text) {
    // Split into sentences based on different delimiters
    let sentences = text.replace(/([.!?])\s*(?=[A-Za-z])/g, "$1|").split("|");

    // Capitalize the first letter of each sentence and handle the word "I"
    sentences = sentences.map(sentence => {
      sentence = sentence.trim();
      sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1);
      sentence = sentence.replace(/\bi\b/g, "I"); // Capitalize "I" when it appears alone
      return sentence;
    });

    // Join the sentences back together
    return sentences.join(" ");
  }


  // -------- takes in a string and returns true if it is a command --------
  const isCommand = async(recognizedSpeech) => {
    let prompt = `Given a user's statement "${recognizedSpeech}", determine whether the statement is intended as a command for an AI assistant named Ava. Commands may not always start with her name or a similar trigger word like 'Eva'; the context and structure of the sentence must be considered. There may be sentences before the command, that is okay. Commands may be complex and include multiple sentences.

    Here are some examples to guide your analysis:

        If the user says "What's the weather Ava, today?", it's intended as a command for Ava.
        If the user says "I was talking to Ava about the weather.", it's not a command for Ava.
        If the user says "I could be like I need a new groceries list Eva, can you do that for me?", it is a command for Ava.
        If the user says "Like, oh yeah, the weather is nice. Hey Ava, can you create a new list for me?", it's a command for Ava.

     Carefully analyze the syntax, semantics, and context of the statement to understand whether it is an instruction directed at Ava, rather than merely mentioning her name or using a similar trigger word.

     If the user sounds like they are doing a presentation and they said something like "ava could" or "would" or "should" it is actually a command for Ava. Like if the user is trying to show Ava to someone else it is a command.

     Example: "create that so then now if i'm talking and i'm like showing you ava and i'm like yeah if ava should be able to now show me the groceries list" is a command for Ava.

     "ava should be able to now show me the groceries list" is a 'true' command.

     "okay so can you also then delete the adventures list ava" is a command for Ava.

     Please respond with 'true' if the statement is a command for Ava, and 'false' if it is not.`


    if (recognizedSpeech.toLowerCase().includes("ava") || recognizedSpeech.toLowerCase().includes("eva")) {
      // var  response = await AskAI(prompt);
      //response will show up in the form of (true: command type)
      // console.log("Is Command: " + response.toLowerCase(), typeof response);
      console.log(recognizedSpeech);
      return true;
      // if ( response.trim().toLowerCase() === "true") {
      // } else {
      //   return false;
      // }
    }
  }

  useEffect(() => {
    if (aiResponse.length > 0) {
      const timeout = setTimeout(updateCurrentText, delay);
      return () => clearTimeout(timeout);
    }
  }, [aiResponse]);

  const updateCurrentText = () => {
    if (currentIndexRef.current < aiResponse.length) {
      const currentChar = aiResponse.charAt(currentIndexRef.current);
      if (currentChar) {
        setAITypedResponse((prevText) => prevText + currentChar);
      }
      currentIndexRef.current++;
      setTimeout(updateCurrentText, delay);
    }
  };

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
            setAIResponse(capitalizeText(gptResponse.response));
            setAvaFace(gptResponse.emoji);
            const audio = await TextToSpeech(gptResponse.response);
            PlayAudio(audio);
          }
        }
      }

      const recognition = InitializeSpeechRecognition(handlePhrase);

      // return () => {
      //   if (recognition) {
      //     recognition.stop();
      //   }
      // };
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
        {createPortal(<Ava avaFace={avaFace} aiTypedResponse={aiTypedResponse} />,document.body)}
        <Lists user={user} command={command} universalHide={universalHide} lists={lists} setLists={setLists} setAvaMini={setAvaMini} />
      </>
    );
  }
}

export default App;
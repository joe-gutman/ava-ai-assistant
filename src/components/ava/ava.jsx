import React from 'react';
import { useEffect, useState, useRef } from 'react';
import CSS from './ava.css';

const Ava = ({ avaFace, avaMini, aiResponse, audioLength }) => {
  const [typedText, setTypedText] = useState('');
  const [formatedText, setFormatedText] = useState('');
  const [aiText, setAIText] = useState('');
  const currentIndexRef = useRef(0);
  const [delay, setDelay] = useState(60);

  function formatText(inputString) {
    const sentences = inputString.split(/(?<!\w\.\w.)(?<![A-Z][a-z]\.)(?<=\.|\?|\!)\s/g);
    const capitalizedSentences = sentences.map((sentence) => {
      if (sentence.length > 0) {
        const trimmed = sentence.trim();
        return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
      }
      return sentence;
    });
    return capitalizedSentences.join(' ');
  }

  useEffect(() => {
    currentIndexRef.current = 0;
    setFormatedText('');
    setAIText('');
    if (aiResponse.length > 0) {
      console.log('formatedText', formatText(aiResponse))
      setFormatedText(formatText(aiResponse));
    }
  }, [aiResponse]);



  const updateCurrentText = () => {
    if (currentIndexRef.current < aiResponse.length) {
      // Check if undefined and trim the character
      const currentChar = aiResponse.charAt(currentIndexRef.current);
      if (currentChar) {
        // console.log('currentChar', currentChar)
        setAIText((prevText) => prevText + currentChar);
      }
      currentIndexRef.current++;
    }
  };

  useEffect(() => {
    // Start updating the current text
    const timeout = setTimeout(updateCurrentText, delay);

    // Cleanup function to clear the timeout when the component unmounts or when the dependency values change
    return () => clearTimeout(timeout);
  }, [delay, aiText, aiResponse]);


  return (
    <div id="ava" >
      <div id="ava-face">
        <p>{avaFace}</p>
      </div>
      <div id="ava-mouth">
        <p>{aiText}</p>
      </div>
    </div>
  );
};

export default Ava;
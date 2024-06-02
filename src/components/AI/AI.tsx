'use client'

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../Button';
import SpeechBubble from './SpeechBubble/SpeechBubble';
import SendRequest from '../../utils/sendRequest';
import './AI.css';
import SpeechToText from '../../utils/speechToText';
import TextToSpeech from '../../utils/textToSpeech';

function AI() {
    const [listening, setListening] = useState(false);
    const [messages, setMessages] = useState([])  
    const [currentMessage, setCurrentMessage] = useState({})
    const textInputRef = useRef(null);
    const stt = useRef(new SpeechToText()).current;
    const tts = useRef(new TextToSpeech()).current;
    const audioQueue = useRef([]);
    const processingAudio = useRef(false);

    useEffect(() => {
        stt.current = new SpeechToText(handleSpeechInput);
    }, []);

    const handleAIResponse = async (prompt) => {
        const request = { 
            url: 'http://localhost:5000/messages/user/65c00a1fe8562908e8c51601/device/65cf20a0f6483111c312a925',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: {
                "user": {
                    "_id": "65c00a1fe8562908e8c51601",
                    "username": "joegutman",
                    "email": "joe@brownboxstudio.com",
                    "first_name": "Joe",
                    "last_name": "Gutman",
                    "role": "user",
                    "settings": {
                        "current_location": {
                        "country": "united states",
                        "city": "battle ground",
                        "state": "washington"
                        },
                        "prefered_temp_unit": "f"
                    },
                    "created_at": {
                        "$date": "2024-02-04T14:05:19.663Z"
                    },
                    "updated_at": {
                        "$date": "2024-02-04T14:05:19.663Z"
                    }
                },
                "type": "text",
                "text": prompt
            }
        }

        try {
            const response = await SendRequest(request);
            if (!response) {
                throw new Error('failed to get a valid response');
            }

            const responseMessage = response.data.text;

            handleMessage(responseMessage , 'response');
            const audioBlob = await tts.start(responseMessage, queueAudio);
            if (audioBlob) {
                    playAudio(audioBlob)
            }
        } catch (error) {
            console.error('Error fetching ai response data:', error);
            return null;
        }
    }

    const queueAudio = (audioBlob) => {
        audioQueue.current.push(audioBlob);
        if (!processingAudio.current) {
            processQueue();
        }
    }

    const processQueue = async () => {
        // Initial one-second buffer
        if (!processingAudio.current) {
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    
        processingAudio.current = true;

        while (processingAudio.current === true && audioQueue.current.length > 0) {
            // Combine all audio chunks in the queue into one
            const audioBatch = audioQueue.current
            
            const combinedBlob = new Blob(audioBatch, { type: 'audio/mpeg' });
            const combinedUrl = URL.createObjectURL(combinedBlob);
            const combinedAudio = new Audio(combinedUrl);

            // Play the combined audio
            combinedAudio.play();
            
            // Clear already processed audio chunks from queue
            audioQueue.current = audioQueue.current.slice(audioBatch.length);

            // don't play next audio batch until current audio batch finishes
            await new Promise(resolve => setTimeout(resolve, getAudioDuration(combinedBlob) * 1000));
        }
        processingAudio.current = false;
    };
    
    // Function to get the duration of an audio blob
    const getAudioDuration = (audioBlob) => {
        const audio = new Audio(URL.createObjectURL(audioBlob));
        return new Promise((resolve) => {
            audio.addEventListener('loadedmetadata', () => {
                resolve(audio.duration);
            });
        });
    };
    
    const updateMessages = (newMessage) => {
        setMessages(prevMessages => [newMessage, ...prevMessages]);
    };

    const formatMessage = (text, type) => {
        console.log(text);
        const newMessage = {
            currentTime: Date.now(),
            type,
            text
        };
        return newMessage;
    }

    const handleMessage = async (text, type) => {
        const newMessage = formatMessage(text, type)
        updateMessages(newMessage);

        if (type === 'prompt') {
            const aiResponse = await handleAIResponse(text);
        }
    };

    //acts as a callback for the speech to text utility class
    const handleSpeechInput = (transcript, speechEnd) => {
        if (transcript) {
            if (speechEnd) {
                handleMessage(transcript, 'prompt');
                setCurrentMessage({});
                setListening(false);
            } else {
                setCurrentMessage(formatMessage(transcript, 'prompt'));
            }
        } else {
            setListening(false);
        }
    }

    const handleTextInput = () => {
        const text = textInputRef.current.value;
        if (text.length > 0) {
            handleMessage(text, 'prompt');
            textInputRef.current.value = ''; // Clear the input field
        }
    };

    const handleSubmit = () => {
        handleTextInput();
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleTextInput();
        }
     }

    const toggleSpeechToText = () => {
        if (!listening) {
            setListening(true);
            stt.current.start();
        } else {
            setListening(false);
            stt.current.stop();
        }
    };

    return (
        <div className='ai-container'>
            <div className='background-blend' />
            <div className='text-box'>
                {/* current message being spoken updated in real time */}
                {currentMessage && <SpeechBubble text={currentMessage.text} type={currentMessage.type}/>}
                {/* all messages, updated when current message is completed */}
                {messages.map((message, index) => (
                    <SpeechBubble key={index} text={message.text} type={message.type}/>
                ))}
            </div>
            <div className='input-container'>
                <input 
                    className='type-prompt' 
                    ref={(input) => { textInputRef.current = input; }} // Use a callback function to set the ref
                    type='text' 
                    onKeyDown={handleKeyDown}
                />
                <Button 
                    onClick={handleSubmit}
                    backgroundColor='#64BE00'
                    textColor='white'
                    text='Submit'
                    width='15%'
                    name='submit-text'
                />
                <Button 
                    onClick={toggleSpeechToText}
                    backgroundColor={listening? '#FA4B00' : '#64BE00'}
                    textColor='white'
                    text={listening? 'Stop Listening' : 'Start Listening'}
                    width='18%'
                    name='listening'
                />
            </div>
        </div>
    );
}

export default AI;
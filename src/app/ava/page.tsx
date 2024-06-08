
'use client'

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../../components/Button';
import SpeechBubble from '../../components/SpeechBubble/SpeechBubble';
import SendRequest from '../../utils/sendRequest';
import SpeechToText from '../../utils/speechToText';
import TextToSpeech from '../../utils/textToSpeech';
import MenuButton from '../../components/Menu/Button';
import Menu from '../../components/Menu/Menu';
import OffsetColorBorder from '../../utils/offsetColorBorder';
import './page.css';

function AI() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [listening, setListening] = useState(false);
    const [messages, setMessages] = useState([])  
    const [currentMessage, setCurrentMessage] = useState({})
    const [isLoading, setIsLoading] = useState(true)
    const [showMenu, setShowMenu] = useState(false)
    const textInputRef = useRef(null);
    const stt = useRef(new SpeechToText()).current;
    const tts = useRef(new TextToSpeech()).current;
    const audioQueue = useRef([]);
    const processingAudio = useRef(false);

    useEffect(() => {
        OffsetColorBorder({'offset-color-border': -15, 'offset-color-border-speech-right' : -5, 'offset-color-border-speech-left' : -2});
        stt.current = new SpeechToText(handleSpeechInput);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        OffsetColorBorder({'offset-color-border': -15, 'offset-color-border-speech-right' : -5, 'offset-color-border-speech-left' : -2});
    }, [messages, currentMessage, showMenu]);

    useEffect(() => {
        if(!isLoading) {
            const loadingAva = document.querySelector('.loading.ava');
            if (loadingAva) {
                loadingAva.style.display = 'none';
              }
        }
    }, [isLoading])


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
        <div className='page-container'>
            <div className='loading ava'></div>
            <div className='noise-background' />
            <div className='center-container'>
                <div className='menu-bar offset-color-border'>
                    <img src='branding/logotype-ava.png' alt='Ava AI Assistant' className='ava-logotype'/>
                    <MenuButton className={'ai'} onClick={() => { setShowMenu(true) }}/>
                    { showMenu && <Menu />}
                </div>
                <div className='chat-box offset-color-border'>
                    {/* current message being spoken updated in real time */}
                    {currentMessage && <SpeechBubble text={currentMessage.text} type={currentMessage.type}/>}
                    {/* all messages, updated when current message is completed */}
                    {messages.map((message, index) => (
                        <SpeechBubble key={index} text={message.text} type={message.type}/>
                    ))}
                </div>
                <div className='input-container'>
                    <input 
                        className='prompt-input offset-color-border' 
                        ref={(input) => { textInputRef.current = input; }} // Use a callback function to set the ref
                        type='text' 
                        onKeyDown={handleKeyDown}
                    />
                    <Button 
                        onClick={handleSubmit}
                        text='Submit'
                        name='submit-text'
                        style={{
                            backgroundColor: '#64BE00',
                            border: '3px solid',
                            color: 'white',
                            width: '15%'
                        }}
                    />
                    <Button 
                        onClick={toggleSpeechToText}
                        text={listening ? 'Stop Listening' : 'Start Listening'}
                        name='listening'
                        style={{
                            backgroundColor: listening ? '#FA4B00' : '#64BE00',
                            border: '3px solid',
                            color: 'white',
                            width: '18%'
                        }}
                    />

                </div>
            </div>
        </div>
    );
}

export default AI;
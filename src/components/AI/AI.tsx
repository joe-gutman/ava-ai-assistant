'use client'

import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { Button } from '../Button';
import SpeechToText from '../../utils/speechToText';
import SpeechBubble from './SpeechBubble/SpeechBubble';
import SendRequest from '../../utils/sendRequest';
import './AI.css';
import sendRequest from '../../utils/sendRequest';

function AI() {
    const [listening, setListening] = useState(false);
    const [messages, setMessages] = useState([])  
    const [currentMessage, setCurrentMessage] = useState({})
    const textInputRef = useRef(null);
    const stt = useRef(null);

    useEffect(() => {
        stt.current = new SpeechToText(handleSpeechInput);
    }, []);

    useEffect(() => {
        console.log('Messages: ', messages);
    }, [messages]);

    const handleAIResponse = async (prompt) => {
        const url = 'http://localhost:5000/messages/user/65c00a1fe8562908e8c51601/device/65cf20a0f6483111c312a925';
        const method = 'POST';
        const data = {
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
        };

        try {
            const response = await sendRequest(url, method, data);
            if (!response) {
                throw new Error('failed to get a valid response');
            }

            console.log('Response data:', response);
            handleMessage(response.data.text, 'response');
        } catch (error) {
            console.error('Error fetching ai response data:', error);
            return null;
        }
        
    }
    
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
            if (aiResponse) {
                const responseMessage = {
                    currentTime: Date.now(),
                    type: 'response',
                    text: aiResponse.text
                };
                updateMessages(responseMessage);
            }
        }
    };

    //acts as a callback for the speech to text utility class
    const handleSpeechInput = (transcript, speechEnd) => {
        if (!transcript) {
            setListening(false);
            return;
        }

        if (transcript.length > 0) {
            if (!speechEnd) {
                setCurrentMessage(formatMessage(transcript, 'prompt'));
            } else {
                handleMessage(transcript, 'prompt');
                setCurrentMessage({});
                setListening(false);
            }
        } else {
            setListening(false);
        }
    };

    const handleTextInput = () => {
        const text = textInputRef.current.value;
        if (text.length > 0) {
            handleMessage(text, 'prompt');
            textInputRef.current.value = ''; // Clear the input field
        }
    };

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
                <input className='type-prompt' ref={textInputRef} type='text'></input>
                <Button onClick={handleTextInput}
                        backgroundColor='#64BE00'
                        textColor='white'
                        text='Submit'
                        width='15%'
                        name='submit-text'/>

                <Button onClick={toggleSpeechToText}
                        backgroundColor={listening? '#FA4B00' : '#64BE00'}
                        textColor='white'
                        text={listening? 'Stop Listening' : 'Start Listening'}
                        width='18%'
                        name='listening'/>
            </div>
        </div>
    );

}

export default AI;
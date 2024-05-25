'use client'

import React, { useState, useEffect } from 'react';
import { Button } from '../Button';
import SpeechToText from '../../utils/speechToText';
import SpeechBubble from './SpeechBubble/SpeechBubble';
import './AI.css';

function AI() {
    let [listening, setListening] = useState(false);
    let [stt, setSTT] = useState(null) // SpeechToText class instance
    let [messages, setMessages] = useState([]);
    let [currentMessage, setCurrentMessage] = useState({})


    useEffect(() => {
        const initializeSpeechToText = async () => {
            setSTT(new SpeechToText());
        };
    
        initializeSpeechToText();
    }, []);

    useEffect(() => {   
        console.log(messages)
    }, [messages]);

    // moves currentMessage into message array and clears currentMessage. 
    const saveMessage = (message, type, final) => {
        console.log('MESSAGE: ', message, 'Final:', final);
        const fullMessage = { currentTime: Date.now(), type: type, message: message };

        if (!final) {
            setCurrentMessage(fullMessage);
        } else {
            setMessages( prevMessages => {
                return [...prevMessages, fullMessage];
            });
            setCurrentMessage({});
        }
    };

    const toggleListening = async () => {
        if (!listening) {
            await stt.start(saveMessage);
            setListening(true)
        } else {
            // Stop listening
            stt.stop();
            setListening(false)
        }
    };

    return (
        <div className='ai-container'>
            <div className='text-box'>
                {/* all messages, updated when current message is completed */}
                {messages.map((message, index) => {
                    return <SpeechBubble key={index} text={message.message} type={message.type}/>
                })}
                {/* current message being spoken updated in real time */}
                {Object.keys(currentMessage).length === 0 ?  (<></>) : ( 
                    <SpeechBubble text={currentMessage.message} type={currentMessage.type}/>
                )}
            </div>
            <Button type={listening ? 'abort' : 'action'} 
                    onClick={toggleListening} 
                    text={listening? 'Stop Listening' : 'Start Listening'}
                    width={'100%'}
                    name={'listening'}/>
        </div>
    );
}

export default AI;
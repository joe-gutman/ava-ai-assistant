'use client'

import React, { useState, useEffect } from 'react';
import { Button } from '../Button';
import SpeechToText from '../../utils/speechToText';

function AI() {
    const [listening, setListening] = useState(false);
    const [stt, setSTT] = useState(null) // SpeechToText class instance

    useEffect(() => {
        const initializeSpeechToText = async () => {
            const stt = new SpeechToText();
            await stt.init();
    
            if (!stt.isActive()) {
                console.warn('Failed to initialize speech to text');
            } else {
                setSTT(stt);
            }
        };
    
        initializeSpeechToText();
    }, [])

    const toggleListening = async () => {
        if (!listening) {
            await stt.start()
            setListening(true)
        } else {
            // Stop listening
            stt.stop();
            setListening(false)
        }
    };

    useEffect(() => {
        console.log(`listening: ${listening}`);
    }, [listening]);

    return (
        <div>
            <Button variant={listening ? 'abort' : 'default'} 
                    onClick={toggleListening} 
                    text={listening? 'Stop Listening' : 'Start Listening'}
                    width={150}/>
        </div>
    );
}

export default AI;
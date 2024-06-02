'use client'

import React, { useState, useEffect } from 'react';
import { Button } from '../Button';
import { startListening, stopListening } from '../../utils/microphoneUtils';

function AI() {
    const [listening, setListening] = useState(false);
    const [audioData, setAudioData] = useState(null);

    const toggleListening = async () => {
        if (!listening) {
            const audioData = await startListening();
            setAudioData(audioData);
            if (audioData) {
                setListening(true);
            }
        } else {
            const stopped = await stopListening(audioData['stream']);
            if (stopped) {
                setListening(false);
                setAudioData(null)
            }
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
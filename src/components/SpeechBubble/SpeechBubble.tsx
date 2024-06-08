import React from 'react';
import './SpeechBubble.css';

function TextBox({ text, type }) {
    const svgTailPath = '../../../public/ui/speechbubble-tail.svg';
    


    if (type === 'prompt') {
        return (
            <div className='speech-bubble-container right'>
                <div className='speech-bubble right offset-color-border-speech-right'>
                    <p>{text}</p>
                </div>
                <div className='tail-container right'>
                    <div className='tail top right offset-color-border-speech-right'></div>
                    <div className='tail base right offset-color-border-speech-right'></div>
                </div>
            </div>
        );
    } else if (type === 'response') {
        return (
            <div className='speech-bubble-container left'>
                <div className='tail-container left'>
                    <div className='tail top left offset-color-border-speech-left'></div>
                    <div className='tail base left offset-color-border-speech-left'></div>
                </div>
                <div className='speech-bubble left offset-color-border-speech-left'>
                    <p>{text}</p>
                </div>
            </div>
        );
    } else {
        return null;
    }
}

export default TextBox;
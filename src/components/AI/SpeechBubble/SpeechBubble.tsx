import React from 'react';
import './SpeechBubble.css';

function TextBox({ text, type }) {
    if (type === 'prompt') {
        return (
            <div className='speech-bubble right'>
                <p>{text}</p>
                <div className='tail-container right'>
                    <div className='tail right' />  
                    <div className='inverse-border-radius right' />
                </div>
            </div>
        );
    } else if (type === 'response') {
        return (
            <div className='speech-bubble left'>
                <p>{text}</p>
                <div className='tail-container left'>
                    <div className='tail left' />
                    <div className='inverse-border-radius left' />
                </div>
            </div>
        );
    } else {
        return null;
    }
}

export default TextBox;
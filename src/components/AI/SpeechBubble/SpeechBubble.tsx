import React from 'react';
import './SpeechBubble.css';

function TextBox({ text, type }) {
    if (type === 'prompt') {
        return (
            <div className={`prompt`}>
                <p>{text}</p>
                <div className='tail right' />
            </div>
        );
    } else if (type === 'response') {
        return (
            <div className={`response`}>
                <p>{text}</p>
                <div className='tail left' />
            </div>
        );
    } else {
        return null;
    }
}

export default TextBox;
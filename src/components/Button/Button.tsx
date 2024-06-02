import React from 'react';
import './Button.css'

interface ButtonProps {
    onClick?: () => void;
    variant: 'default' | 'action' | 'abort' | 'quiet';
    text: string;
    width: number;
}

function Button({ onClick, variant, text, width }: ButtonProps) {
    const className = variant ? `button ${variant}` : `button default`;

    return (
        <button className={className} onClick={onClick} style={{width:`${width}px`}}> 
            {text}
        </button>
    )
}

export default Button;
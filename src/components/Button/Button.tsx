import React from 'react';
import './Button.css'

interface ButtonProps {
    onClick?: () => void;
    type?: 'default' | 'action' | 'abort' | 'quiet';
    text: string;
    width: number;
    name?: string;
}

function Button({ onClick, text = 'button', width = '50px', type = '', name = '' }: ButtonProps) {
    const className = `${type} ${name}`;

    return (
        <button className={className} onClick={onClick} style={{width:`${width}`}}> 
           <p>{text}</p>
        </button>
    )
}

export default Button;
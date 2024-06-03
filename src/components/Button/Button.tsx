import React from 'react';
import './Button.css'
import { adjustBrightness, lightenColor } from '../../utils/color';

interface ButtonProps {
    onClick?: () => void;
    type?: 'default' | 'action' | 'abort' | 'quiet';
    backgroundColor?: 'string';
    textColor?: 'string';
    text: string;
    width?: string;
    name?: string;
}

function Button({ onClick, text = 'button', backgroundColor = '', textColor = 'black', width = '50px', type = '', name = '' }: ButtonProps) {
    const className = `${type} ${name}`;
    const hoverBackgroundColor = backgroundColor ? adjustBrightness(backgroundColor, 8) : '';
    const activeBackgroundColor = backgroundColor ? adjustBrightness(backgroundColor, -8) : '';
    

    return (
        <button
            className={className}
            onClick={onClick}
            style={{
                width: width,
                backgroundColor: backgroundColor || undefined,
                color: textColor
            }}
            onMouseEnter={(e) => {
                if (hoverBackgroundColor) {
                    (e.target as HTMLButtonElement).style.backgroundColor = hoverBackgroundColor;
                }
            }}
            onMouseLeave={(e) => {
                if (backgroundColor) {
                    (e.target as HTMLButtonElement).style.backgroundColor = backgroundColor;
                } else {
                    (e.target as HTMLButtonElement).style.backgroundColor = '';
                }
            }}
            onMouseDown={(e) => {
                if (activeBackgroundColor) {
                    (e.target as HTMLButtonElement).style.backgroundColor = activeBackgroundColor;
                }
            }}
            onMouseUp={(e) => {
                if (hoverBackgroundColor) {
                    (e.target as HTMLButtonElement).style.backgroundColor = hoverBackgroundColor;
                }
            }}
        >
            {text}
        </button>
    );
}

export default Button;
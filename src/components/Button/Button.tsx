import React from 'react';
import './Button.css'
import { adjustBrightness } from '../../utils/colorUtils';

interface ButtonProps {
    onClick?: () => void;
    type?: 'default' | 'action' | 'abort' | 'quiet';
    text: string;
    name?: string;
}

function Button({ onClick, text = 'button', style, type = '', name = '' }: ButtonProps) {
    let hoverBackgroundColor;
    let activeBackgroundColor;
    let hoverBorderColor;
    let activeBorderColor;

    const className = `${type} ${name}`;
    if (style.backgroundColor) {
        hoverBackgroundColor = adjustBrightness(style.backgroundColor, 8);
        activeBackgroundColor = adjustBrightness(style.backgroundColor, -8);
        if (style.border) {
            style.borderColor = adjustBrightness(style.backgroundColor, -8)
            hoverBorderColor = adjustBrightness(style.backgroundColor, 0);
            activeBorderColor = adjustBrightness(style.backgroundColor, -16);
        }
    }


    return (
        <button
            className={className}
            onClick={onClick}
            style={style}
            onMouseEnter={(e) => {
                if (hoverBackgroundColor) {
                    (e.target as HTMLButtonElement).style.backgroundColor = hoverBackgroundColor;
                }
                if (hoverBorderColor) {
                    (e.target as HTMLButtonElement).style.border = style.border + hoverBorderColor;
                }
            }}
            onMouseLeave={(e) => {
                if (style.backgroundColor) {
                    (e.target as HTMLButtonElement).style.backgroundColor = style.backgroundColor;
                    if (style.border) {
                        (e.target as HTMLButtonElement).style.borderColor = style.borderColor;
                    }
                }
            }}
            onMouseDown={(e) => {
                if (activeBackgroundColor) {
                    (e.target as HTMLButtonElement).style.backgroundColor = activeBackgroundColor;
                    if (activeBorderColor) {
                        (e.target as HTMLButtonElement).style.borderColor = activeBorderColor;
                    }
                }
                
            }}
            onMouseUp={(e) => {
                if (hoverBackgroundColor) {
                    (e.target as HTMLButtonElement).style.backgroundColor = hoverBackgroundColor;
                    if (hoverBorderColor) {
                        (e.target as HTMLButtonElement).style.borderColor = hoverBorderColor;
                    }
                }
            }}
        >
            {text}
        </button>
    );
}

export default Button;
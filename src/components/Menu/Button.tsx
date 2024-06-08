'use client'

import './Button.css';

function MenuButton({ menu, className, onClick }) {

    const handleClick = () => {
        console.log('Menu button clicked');
    };

    return (
        <div className={`menu-button ${className}`} onClick={onClick}>
            <div className="stripe" />
            <div className="stripe" />
            <div className="stripe" />
        </div>
    );
}

export default MenuButton;

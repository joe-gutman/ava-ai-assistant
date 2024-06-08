import React from 'react';
import './Item.css';

function Item ({ icon, title, link, onClick }) {
    return (
        <div className='item' onClick={onClick ? onClick : null}>
            { icon && <img className='item-icon' src={icon.src} alt={icon.alt} />}
            { link && <a className='item-link' href={link}>{title}</a> }
            { onClick && <span className="item-title">{title}</span> }
        </div>
    )
}

export default Item;
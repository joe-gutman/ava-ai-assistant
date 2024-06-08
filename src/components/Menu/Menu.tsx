import React, { useState } from 'react';
import Item from './Item';
// import Login from '../Login/Login';
// import Register from '../Register/Register';
import './Menu.css';

function Menu() {
    const showLogin = () => {
        console.log('LOGIN');
    }

    const showRegister = () => {
        console.log('Register');
    }

    const [menuItems, setMenuItems] = useState([
        {
            icon:{
                src: '/icons/settings-128.png',
                alt: 'gear icon'
            },
            title: 'settings',
            link: '/settings'
        },
        {
            title: 'login',
            onClick: showLogin,
        },
        {
            title: 'Register',
            onClick: showRegister,
        }
    ]);

    return (
        <div className='menu offset-color-border'>
            {menuItems.map((item, index) => (
                <React.Fragment key={index}>
                    {index === menuItems.length - 2 && <hr className="menu-divider" />}
                    <Item 
                        key={index} 
                        { ...item } />
                </React.Fragment>
            ))}
        </div>
        )
    }

export default Menu;
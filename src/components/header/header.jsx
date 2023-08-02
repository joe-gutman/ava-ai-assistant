import Header from './header.css';

var AppHeader = ({setShowLogin, setShowRegister}) => {
    return (
          <div id="app-header">
            {/* <h1 id="logotype">Ava</h1> */}
            <div id="header-spacer"></div>
            <div id="app-header-buttons">
              {/* <button id="app-header-login" onClick={()=>{}}>Settings</button> */}
            </div>
          </div>
    )
}

export default AppHeader;
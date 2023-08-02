import { useState } from 'react';
import './login-register-modal.css';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import Visible from '../../assets/eye-visible-90.png';
import Invisible from '../../assets/eye-invisible-90.png';
import ErrorMessage from './error-message.jsx';
import axios from 'axios';



var Login = ({setShowLogin, setShowRegister, setUser, user}) => {
  const [passwordVisibility, setPasswordVisibility] = useState('password');
  const [openCloseEye, setOpenCloseEye] = useState(Visible);
  const [userExists, setUserExists] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  var SERVER = import.meta.env.VITE_SERVER_URL;

  const showPassword = () => {
    if (passwordVisibility === 'password') {
      setPasswordVisibility('text');
      setOpenCloseEye(Invisible);
    } else {
      setPasswordVisibility('password');
      setOpenCloseEye(Visible);
    }
  }

  var loginUser = (e) => {
    e.preventDefault();

    var email = e.target[0].value;
    var password = e.target[1].value;

    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const auth = userCredential.user;
        setUser(auth.uid)
        setShowLogin(false);

        let config = {
          method: 'get',
          maxBodyLength: Infinity,
          url: `${SERVER}/login/?uid=${encodeURIComponent(uid)}`,
          headers: {
            'Content-Type': 'application/json'
          }
        };
        setUser(uid);
        return axios.request(config)
      })
      .catch((error) => {
        if( error.code === 'auth/invalid-email' ) {
          setErrorMessage('User does not exist');
          console.log(error.code);
        } else if ( error.code === 'auth/wrong-password' ) {
          setErrorMessage('Incorrect password');
          console.log(error.code);
        } else {
          console.log(error.code);
        }
      });
  };

  var close = (e) => {
    if (user !== undefined) {
      if (e.target.className === 'mdl-background' || e.target.className.includes('mdl-cancel-btn')) {
        document.getElementById("mdl-login-form").reset();
        setShowLogin(false);
      }
    }
  }

  return (
    <div className="mdl-background" onClick={close}>
      <div id="mdl-login">
        <form id="mdl-login-form" onSubmit={loginUser}>
          <h1 id="mdl-login-title">Login</h1>
          <input className="mdl-login-inputs mdl-username-input" type="text" placeholder="Username" required />

          <div id="mdl-login-password-container">
            <input className="mdl-login-inputs mdl-password-input" type={passwordVisibility} placeholder="Password" required />
            <img id="mdl-login-show-password" src={openCloseEye} alt="Show Password" onClick={showPassword} />
          </div>
          <div id="mdl-new-user">
            <p>New user? </p><h3 onClick={() => {setShowRegister(true); setShowLogin(false);}}>Register</h3>
          </div>
          <div>
            <button className="mdl-login-buttons mdl-login-btn" type="submit" tag="login">Login</button>
            <button className="mdl-login-buttons mdl-cancel-btn" type="button" tag="cancel" onClick={close}>Cancel</button>
          </div>
          <ErrorMessage errorMessage={errorMessage}/>
        </form>
      </div>
    </div>
  )
}

export default Login;
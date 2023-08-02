import { useState, useEffect } from 'react';
import './login-register-modal.css';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import Visible from '../../assets/eye-visible-90.png';
import Invisible from '../../assets/eye-invisible-90.png';
import ErrorMessage from './error-message.jsx';
import axios from 'axios';




var Register = ({setShowRegister, setShowLogin, setUser, user, setUserInfo, userInfo}) => {
  const [passwordVisibility, setPasswordVisibility] = useState('password');
  const [openCloseEye, setOpenCloseEye] = useState(Visible);
  const [allowRegister, setAllowRegister] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  var SERVER = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    if (!allowRegister) {
      setErrorMessage('Sorry, registration is currently disabled');
    }
  }, [allowRegister])

  const showPassword = () => {
    if (passwordVisibility === 'password') {
      setPasswordVisibility('text');
      setOpenCloseEye(Invisible);
    } else {
      setPasswordVisibility('password');
      setOpenCloseEye(Visible);
    }
  }

  var registerUser = (e) => {
    e.preventDefault();

    const newUserInfo = {
      name: e.target.elements.name.value,
      username: e.target.elements.username.value,
      email: e.target.elements.email.value,
      address: e.target.elements.address.value,
      city: e.target.elements.city.value,
      state: e.target.elements.state.value,
      zipcode: e.target.elements.zipcode.value
    };

    if (allowRegister === true) {
      if (e.target.elements.password.value !== e.target.elements['confirm-password'].value) {
        setErrorMessage('Passwords do not match');
        return;
      } else {
        const auth = getAuth();
        createUserWithEmailAndPassword(auth, newUserInfo.email, e.target.elements.password.value)
          .then((userCredential) => {

            const newUserInfo = {
              user_id: userCredential.user.uid,
              name: e.target.elements.name.value,
              username: e.target.elements.username.value,
              email: e.target.elements.email.value,
              address: e.target.elements.address.value,
              city: e.target.elements.city.value,
              state: e.target.elements.state.value,
              zipcode: e.target.elements.zipcode.value
            };

            let config = {
              method: 'post',
              maxBodyLength: Infinity,
              url:'/register',
              headers: {
                'Content-Type': 'application/json'
              },
              data : newUserInfo,
            };
            setUser(newUserInfo.user_id);
            setUserInfo(newUserInfo);
            return axios.request(config);
          })
          .then((response) => {
            setShowRegister(false);
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            if(errorMessage === 'Firebase: Error (auth/email-already-in-use).') {
              setErrorMessage('Email already in use');
            } else if (errorMessage === 'Firebase: Error (auth/invalid-email).') {
              setErrorMessage('Invalid email');
            } else if (errorMessage === 'Firebase: Error (auth/weak-password).') {
              setErrorMessage('Password must be at least 6 characters');
            } else {
              setErrorMessage(errorMessage);
              console.log(error);
            }
          });
      }
    }
  }

  var close = (e) => {
    if (user !== undefined) {
      if (e.target.className === 'mdl-background' || e.target.className.includes('mdl-cancel-btn')) {
        document.getElementById("mdl-register-form").reset();
        setShowRegister(false);
      }
    }
  }

  return (
    <div className="mdl-background" onClick={close}>
      <div id="mdl-register">
        <form id="mdl-register-form" onSubmit={registerUser}>
          <h1 id="mdl-register-title">Register</h1>

          <input className="mdl-register-inputs" type="text" name="name" placeholder="Name" required />

          <input className="mdl-register-inputs mdl-username-input" name="username" type="text" placeholder="Username" required />

          <input className="mdl-register-inputs mdl-email-input" name="email" type="text" placeholder="Email" required />

          <div id="mdl-register-password-container">
            <input className="mdl-register-inputs mdl-password-input" name="password" type={passwordVisibility} placeholder="Password" required />
            <img id="mdl-login-show-password" src={openCloseEye} alt="Show Password" onClick={showPassword} />
          </div>

          <input className="mdl-register-inputs" name="confirm-password" type="text" type={passwordVisibility} placeholder="Confirm Password" required />


          <input className="mdl-register-inputs" type="text" name="address" placeholder="Address (optional)"/>

          <select className="mdl-register-inputs" name="state">
            <option value="" disabled selected>State (optional)</option>
            <option value="Alabama">Alabama</option>
            <option value="Alaska">Alaska</option>
            <option value="Arizona">Arizona</option>
            <option value="Arkansas">Arkansas</option>
            <option value="California">California</option>
            <option value="Colorado">Colorado</option>
            <option value="Connecticut">Connecticut</option>
            <option value="Delaware">Delaware</option>
            <option value="Florida">Florida</option>
            <option value="Georgia">Georgia</option>
            <option value="Hawaii">Hawaii</option>
            <option value="Idaho">Idaho</option>
            <option value="Illinois">Illinois</option>
            <option value="Indiana">Indiana</option>
            <option value="Iowa">Iowa</option>
            <option value="Kansas">Kansas</option>
            <option value="Kentucky">Kentucky</option>
            <option value="Louisiana">Louisiana</option>
            <option value="Maine">Maine</option>
            <option value="Maryland">Maryland</option>
            <option value="Massachusetts">Massachusetts</option>
            <option value="Michigan">Michigan</option>
            <option value="Minnesota">Minnesota</option>
            <option value="Mississippi">Mississippi</option>
            <option value="Missouri">Missouri</option>
            <option value="Montana">Montana</option>
            <option value="Nebraska">Nebraska</option>
            <option value="Nevada">Nevada</option>
            <option value="New Hampshire">New Hampshire</option>
            <option value="New Jersey">New Jersey</option>
            <option value="New Mexico">New Mexico</option>
            <option value="New York">New York</option>
            <option value="North Carolina">North Carolina</option>
            <option value="North Dakota">North Dakota</option>
            <option value="Ohio">Ohio</option>
            <option value="Oklahoma">Oklahoma</option>
            <option value="Oregon">Oregon</option>
            <option value="Pennsylvania">Pennsylvania</option>
            <option value="Rhode Island">Rhode Island</option>
            <option value="South Carolina">South Carolina</option>
            <option value="South Dakota">South Dakota</option>
            <option value="Tennessee">Tennessee</option>
            <option value="Texas">Texas</option>
            <option value="Utah">Utah</option>
            <option value="Vermont">Vermont</option>
            <option value="Virginia">Virginia</option>
            <option value="Washington">Washington</option>
            <option value="West Virginia">West Virginia</option>
            <option value="Wisconsin">Wisconsin</option>
            <option value="Wyoming">Wyoming</option>
          </select>

          <input className="mdl-register-inputs" type="text" name="city" placeholder="City (optional)"/>

          <input className="mdl-register-inputs" type="text" name="zipcode" placeholder="Zipcode (optional)" />

          <div id="mdl-current-user">
            <p>Already have an account? </p><h3 onClick={() => {setShowRegister(false); setShowLogin(true);}}>Login</h3>
          </div>
          <div>
            <button className="mdl-register-buttons mdl-register-btn" type="submit" tag="register">Register</button>
            <button className="mdl-register-buttons mdl-cancel-btn" type="button" tag="cancel" onClick={close}>Cancel</button>
          </div>
          {errorMessage !== '' ? <ErrorMessage errorMessage={errorMessage}/> : <></> }
        </form>
      </div>
    </div>
  )
}

export default Register;
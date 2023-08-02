import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyDmruMrquERLXOv_Us5MXVd_3vV4BKNCTQ",
  authDomain: "ava-ai-assistant-acc8a.firebaseapp.com",
  projectId: "ava-ai-assistant-acc8a",
  storageBucket: "ava-ai-assistant-acc8a.appspot.com",
  messagingSenderId: "570296393079",
  appId: "1:570296393079:web:58cb5c5d2cd566e1d9d572",
  measurementId: "G-0J64M0K9PL"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

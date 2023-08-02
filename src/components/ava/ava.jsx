import React from 'react';
import CSS from './ava.css';

const Ava = ({ avaFace, avaMini, aiText, aiSpokenResonse, audioLength }) => {
  // useEffect(() => {
  //   if (speaking) {
  //     let i = 0;
  //     const interval = setInterval(() => {
  //       if (i < aiSpokenResponse.length) {
  //         setAiText((aiText) => aiText + aiSpokenResponse[i]);
  //         i++;
  //       } else {
  //         clearInterval(interval);
  //       }
  //     }, (audioLength/aiSpokenResponse * 1000);

  //     // Clean up the interval when the component unmounts
  //     return () => {
  //       clearInterval(interval);
  //     };
  //   }
  // }, [speaking, audioLength]);


  return (
    <div id="ava" >
      <div id="ava-face">
        <p>{avaFace}</p>
      </div>
      <div id="ava-mouth">
        <p>{aiSpokenResonse}</p>
      </div>
    </div>
  );
};

export default Ava;
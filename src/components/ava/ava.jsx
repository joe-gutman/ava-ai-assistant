import React from 'react';
import CSS from './ava.css';

const Ava = ({ avaFace, aiTypedResponse }) => {
  return (
    <div id="ava" >
      <div id="ava-face">
        <p>{avaFace}</p>
      </div>
      { aiTypedResponse === '' ? <></> :
        <div id="ava-mouth">
          <p>{aiTypedResponse}</p>
        </div>
      }
    </div>
  );
};

export default Ava;
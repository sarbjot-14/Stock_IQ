import React from "react";

const HintButtons = props => {
  const clicker = () =>{
    console.log("clikcer");
  }
  return (
    <div>
      <h2>Hints</h2>
      <div>
        {props.mode.hints.map(hint => (
            <div>
                <button onClick={() => props.revealHintsHandler}>{Object.keys(hint)[0]}</button>
                <span>{hint[Object.keys(hint)[0]]}</span>
            </div>
            
        ))}
      </div>
      
    </div>
  );
};

export default HintButtons;

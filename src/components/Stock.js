import React from "react";

const Stock = props => {
  return (
    <div className="stock-box">
      <h1 className="name">{props.company.name}</h1>
      <div className="hints">
        <div>
          <h3>HINT</h3>
          <h3>VALUE</h3>
        </div>
       
          {props.mode.hints.map(hint => (
            <div className="hints">
              {Object.keys(hint).map(key=>(
                <div>
                  <h3>{key}</h3>
                  {hint[key].reveal?(<h3>{props.company[key]}</h3>):(<h3>-</h3>)}
                </div>
                
              ))}
            </div>
          ))}
     

        
      </div>
      <button>Select</button>
    </div>
  );
};

export default Stock;

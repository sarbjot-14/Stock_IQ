import React from "react";
import { Button } from 'react-bootstrap';


const Stock = props => {
  const checkAnswer = () => {
    props.handleClick(props.company);
  };
  const convertBill = money => {
    if (Number(money) > 100000000) {
      //console.log("IT IS MORE")
      return Number(money / 1000000000).toFixed(2) + "B";
    } else {
      return money;
    }
  };

  if (props.answer == null) {
    //console.log("IT IS NULLLL");
    let arr = document.getElementsByClassName("stock-box");

    Array.prototype.forEach.call(arr, aStock => {
      aStock.id = "stock-color-default";
    });
  } else if (props.company.name == props.answer) {
      document.getElementById(props.company.name).parentNode.id = "stock-color-right";
  
    }
    else if(props.answer == 'wrong'){
      document.getElementById(props.company.name).parentNode.id = "stock-color-wrong";
    }
     
  

  return (
    <div id="stock-color-default" className="stock-box">
      <h1 className="name" id={props.company.name}>{props.company.name}</h1>
  
      <div id="the_hints" className="hints">
        <div>
          <h3>HINT</h3>
          <h3>VALUE</h3>
        </div>

        {props.mode.hints.map(hint => (
          <div className="hints">
            {Object.keys(hint).map(key => (
              <div>
                <h3>{key.replace(/_/g, " ")}:</h3>
                {hint[key].reveal | props.mode.revealAll ? (
                  <h3>{convertBill(props.company[key])}</h3>
                ) : (
                  <h3>-</h3>
                )}
              </div>
            ))}
          </div>
        ))}
        <div>
          <h3>market cap</h3>
          {props.mode.revealAll ? (
            <h3>{convertBill(props.company["market_cap"])}</h3>
          ) : (
            <h3>?</h3>
          )}
        </div>
      </div>
      {props.mode.revealAll ? (
        <Button id={props.company.name}>Select</Button>
      ) : (
        <Button id={props.company.name} onClick={checkAnswer}>
          Select
        </Button>
      )}
    </div>
  );
};

export default Stock;

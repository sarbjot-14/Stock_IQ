import React from "react";


const Stock = props => {
  
  const checkAnswer = () =>{
    props.handleClick(props.company)
   
  }
  const convertBill= money =>{
    if(Number(money)>100000000){
      //console.log("IT IS MORE")
      return ((Number(money/1000000000)).toFixed(2)+"B")
    }
    else{
      return money;
    }
  }
  
  return (
    <div className="stock-box">
      <h1 className="name">{props.company.name}</h1>
      <div id="the_hints" className="hints">
        <div>
          <h3>HINT</h3>
          <h3>VALUE</h3>
        </div>
       
          {props.mode.hints.map(hint => (
            <div className="hints">
              {Object.keys(hint).map(key=>(
                <div>
                  <h3>{key}:</h3>
                  {(hint[key].reveal|props.mode.revealAll)?(<h3>{convertBill(props.company[key])}</h3>):(<h3>-</h3>)}
                </div>
                
              ))}
              
            </div>
          ))}
          <div>
          <h3>market cap</h3>
              {props.mode.revealAll?(<h3>{convertBill(props.company['market_cap'])}</h3>):(<h3>?</h3>)}
          </div>
          
      </div>
      <button onClick={checkAnswer} >Select</button>
    </div>
  );
};

export default Stock;

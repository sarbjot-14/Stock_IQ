import React from "react";


const Stock = props => {
  // if(props.mode.revealAll){
  //   props.handleClick(props.company)
  //   let header = document.createElement("h3");                 // Create a <li> node
  //   let textnode = document.createTextNode("market cap");         // Create a text node
  //   header.appendChild(textnode);                              // Append the text to <li>
  //   document.getElementById("the_hints").appendChild(header);

  //   let header2 = document.createElement("h3");                 // Create a <li> node
  //   let textnode2 = document.createTextNode(props.company['market_cap']);         // Create a text node
  //   header2.appendChild(textnode2);                              // Append the text to <li>

  //   let aDiv = document.createElement('div')
  //   aDiv.appendChild(header)
  //   aDiv.appendChild(header2)

  //   document.getElementById("the_hints").appendChild(aDiv);
  //   //document.getElementById('ok').style.backgroundColor="red";
  // }
  const checkAnswer = () =>{
    props.handleClick(props.company)
   
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
                  <h3>{key}</h3>
                  {(hint[key].reveal|props.mode.revealAll)?(<h3>{props.company[key]}</h3>):(<h3>-</h3>)}
                </div>
                
              ))}
              
            </div>
          ))}
          <div>
          <h3>market cap</h3>
              {props.mode.revealAll?(<h3>{props.company['market_cap']}</h3>):(<h3>?</h3>)}
          </div>
          
      </div>
      <button onClick={checkAnswer} >Select</button>
    </div>
  );
};

export default Stock;

import React, { useState, useEffect } from "react";
import "./App.css";
import Stock from "./components/Stock.js";
import 'bootstrap/dist/css/bootstrap.min.css';

import { Button, Jumbotron } from 'react-bootstrap';
//var every_company=null;
function App() {
  //const apiKEY = "lC34BoEHVvDSS6xE8At6ofih5T6adCU";
  const apiKEY = "2lC34BoEHVvDSS6xE8At6ofih5T6adCU";
  //const questions = ['Which company has a lower PE ratio?','Which company has higher R&D?','Which company has bigger MarketCap','Which company has higher price to sales?']
  const [modes, setModes] = useState([
    {
      question: "Which one has largest Market Cap?",
      check: "market_cap",
      inequality: ">",
      revealAll: false,
      hints: [
        { revenue: { penalty: -4, reveal: false } },
        { net_income: { penalty: -4, reveal: false } },
        { debt_to_assets: { penalty: -2, reveal: false } }
      ]
    },
    {
      question: "Which company has a lower PE ratio?",
      check: "pe",
      revealAll: false,
      inequality: "<",
      hints: [
        { market_cap: -4, reveal: false },
        { RD: -2, reveal: false },
        { eps: -4, reveal: false },
        { ps: -3, reveal: false }
      ]
    }
  ]);
  const [comp_10, setComp10] = useState([]);
  const [gameData, setGameData] = useState({
    round: 0,
    score: 0,
    buttonStatus: "Start"
  });

  //const the_indicators = ["market_cap","revenue", "price", "RD", "net_income","debt_to_assets", "eps","pe","ps" ]
  //const the_indicators = [{"market_cap"},{"revenue"},{"price"}, {"RD"}, {"net_income"},{"debt_to_assets"}, {"eps"},{"pe"},{"ps"} ]

  // get all companies sp100
  const sp100 = ['AAPL','ABBV','ABT','ACN','ADBE','AGN','AIG','ALL','SCHW','AMZN','AXP','BA','BAC','BIIB','TGT','BKNG','BLK','BMY','SBUX','WYNN','CAT','CELG','CHTR','CL','CMCSA','COF','COP','COST','CSCO','CVS','CVX','MCO','DHR','DIS','DOW','DUK','EMR','LULU','F','FB','FDX','GD','GE','GILD','GM','GOOG','GOOGL','GS','HD','HON','IBM','INTC','JNJ','JPM','TWTR','KMI','KO','LLY','LMT','LOW','MA','MCD','MDLZ','MDT','MET','MMM','MO','MRK','MS','MSFT','SWKS','NFLX','NKE','NVDA','ORCL','OXY','PEP','PFE','PG','PM','PYPL','QCOM','RTN','SBUX','SLB','MU','SPG','T','TGT','TXN','UNH','UNP','UPS','USB','UTX','V','VZ','WBA','WFC','WMT','XOM']

  //var comp_10 = [];

  //add simfinid and name
  const get_simid = async tick => {
    //console.log("returning " +tick)
    let req = `https://simfin.com/api/v1/info/find-id/ticker/${tick}?api-key=${apiKEY}`;
    let response = await fetch(req);
    let comp = await response.json();

    return comp;
  };
  const flow = async () => {
    var arr = [];
    while (arr.length < 9) {
      var r = Math.floor(Math.random() * 100) + 1;
      if (arr.indexOf(r) === -1) arr.push(r);
    }
    //console.log("THE RANDOM ARRAY ISSSS..." + arr);
    let rand10 = [];
    for (let i = 0; i < 9; i++) {
      let item = sp100[arr[i]];
      let obj = { ticker: item };
      rand10.push(obj);
      ////console.log("appending " + rand10)
    }
    //console.log(rand10);
    //add SimFinId and Name

    for (let i = 0; i < 9; i++) {
      let tick = rand10[i].ticker;
      try {
        let comp = await get_simid(tick);
        rand10[i].name = comp[0].name;
        rand10[i].simId = comp[0].simId;
      } catch {
        //console.log("could not get name offfff " + tick);
      }
    }

    rand10 = await addIndicators(rand10);
    //console.log("has everything");
    //console.log(rand10);

    return rand10;
  };

  const addIndicators = async companies => {
    const get_indicators = async simId => {
      let market_cap_req = `https://simfin.com/api/v1/companies/id/${simId}/ratios?api-key=${apiKEY}`;
      let response = await fetch(market_cap_req);
      let market_cap = await response.json();

      return market_cap;
    };
    for (let i = 0; i < 9; i++) {
      let SimFinId = companies[i].simId;
      let ind = await get_indicators(SimFinId);
      try{
        companies[i].market_cap = ind[41].value;
        companies[i].revenue = ind[5].value;
        companies[i].price = ind[0].value;
        companies[i].net_income = ind[17].value;
        companies[i].debt_to_assets = ind[53].value;
        //companies[i].eps = ind[54].value;
        //companies[i].pe = ind[60].value;
        //companies[i].ps = ind[60].value;
      }
      catch(err){
        console.log(err)
        window.alert("Something went wrong. Please refresh and try again.")
      }
      

      for (var key in companies[i]) {
        if (companies[i][key] == null) {
          console.log(companies[i]);
          console.log("CLEEEEEEEEEAAAAARRRRRRRRRRRRRRRRRRRRRRRRRRRRR");
          companies[i] = {
            ticker: "WFC",
            name: "Wells Fargo & Co",
            market_cap: 214360000000,
            revenue: 83700000000,
            price: 48.65,
            net_income: 22520000000,
            debt_to_assets: 1.36,
            eps: 4.84,
            pe: 10.05,
            ps: 2.56
          };
        }
      }
      //console.log("did it work?");

      //console.log("FINISHED ADDING INDICATORS");
    }
    return companies;
  };
  const startFlow = () => {
    document.getElementById("fetch").innerText = "Fetching Data Please Wait";

    if(document.getElementById("intro") != null){document.getElementById("intro").innerText = "."};
    //console.log("starting flow");
    if (gameData.round == 0) {
      setGameData({ round: 0, score: 0, buttonStatus: "Start" });
    } else {
      setGameData({ round: 0, score: 0, buttonStatus: "Next" });
    }

    setComp10([]);
    flow().then(rand10 => {
      setComp10(rand10);
      document.getElementById("fetch").innerText = "";
    });
  };

  const revealHints = theHint => {
    ///hints:[{"revenue":{"penalty":-5,"reveal":false}},{"ne
    //console.log("triggered " + theHint);
    let newModes = modes.slice();
    modes[0].hints.map((hint, index) => {
      Object.keys(hint).map(key => {
        if (key == theHint) {
          //console.log(newModes);
          let tempHint = hint;
          if (!tempHint[key].reveal) {
            tempHint[key].reveal = true;
            let tempGameData = gameData;
            tempGameData.score = tempGameData.score + hint[key].penalty;

            setGameData(tempGameData);
          }
          newModes[0].hints[index] = tempHint;
          //console.log(newModes);
        }
        setModes(newModes);
      });
    });
  };
  const checkAnswer = selectedComp => {
    
    let newModes = modes.slice();
    newModes[0].revealAll = true;
    setModes(newModes);
    //console.log("did the select work? " + selectedComp.name);
    let otherOptions = comp_10.slice(
      gameData.round * 3,
      gameData.round * 3 + 3
    );

    for (let i = 0; i < otherOptions.length; i++) {
      if (selectedComp.name != otherOptions[i].name) {
        if (
          Number(selectedComp.market_cap) < Number(otherOptions[i].market_cap)
        ) {
          //console.log("you selected the incorrect answer!!!!");
          let temp10 = comp_10.slice()
          temp10[9] = {name:'wrong'};
          setComp10(temp10);
                //document.getElementById('theHeader').innerText = "Incorrect!!"

          let newObj = {
            round: gameData.round,
            score: gameData.score - 10,
            buttonStatus: "Next"
          };
          setGameData(newObj);
          return;
        }
      }
    }

    //tempGameData.score = tempGameData.score +10

    let newObj = {
      round: gameData.round,
      score: gameData.score + 20,
      buttonStatus: "Next"
    };
    setGameData(newObj);
    //console.log("you selected the correct answer!!!!");
    let temp10 = comp_10.slice()
    temp10[9] = selectedComp;
    setComp10(temp10);
    //document.getElementById('theHeader').innerText = "Correct!!"
    return;
  };
  const nextRound = () => {
    if(comp_10.length>=10){
      let temp10 = comp_10.slice()
      temp10.pop();
      setComp10(temp10);
    }
    
    let newModes = modes.slice();
    newModes[0].revealAll = false;
    newModes[0].hints.forEach(hint=>{
      Object.keys(hint).forEach(hintName=>{
        hint[hintName].reveal = false;
      })
    })               
    setModes(newModes);
    let newObj = {
      round: gameData.round + 1,
      score: gameData.score,
      buttonStatus: "Next"
    };
    setGameData(newObj);
    //console.log("next round obj is");
    //console.log(newObj);
  };
  //revalHints();
  //let round = 0;

  let button;

  if ((gameData.round == 0) & (gameData.buttonStatus == "Start")) {
    button = (
      <Button id="nextButton" onClick={startFlow}>
        Start
      </Button>
    );
  } else if ((gameData.round < 3) & (gameData.buttonStatus == "Next")) {
    button = (
      <Button id="nextButton" size="lg" onClick={nextRound}>
        Next
      </Button>
    );
  } else {
    button = (
      <Button id="nextButton" onClick={startFlow}>
        Restart
      </Button>
    );
  }
  //console.log("this is the array now " + comp_10.length)
 
  return (
    <div className="App">
      
      <div className="header">
        <div className="score">
          <h2>Hints</h2>
          <div>
            {modes[0].hints.map(hint => (
              <div>
                <Button variant="outline-info" onClick={() => revealHints(Object.keys(hint)[0])} block>
                  {(Object.keys(hint)[0]).replace(/_/g, " ")+": "+hint[Object.keys(hint)[0]].penalty} 
                </Button>
                
              </div>
            ))}
          </div>
        </div>

        <h1 id="theHeader">Which Company Has The Highest Market Cap</h1>
        <div className="score">
          <h2>Score: {gameData.score}</h2>
          <h2>Round: {gameData.round}</h2>
        </div>
      </div>

      {button}

      <h1 id="fetch"></h1>
     
      {gameData.round<3?(
      <div className="stock-container">
        {comp_10.slice(gameData.round * 3, gameData.round * 3 + 3).map(comp => (
          <Stock
            handleClick={checkAnswer}
            key={comp.name}
            mode={modes[0]}
            company={comp}
            answer={comp_10.length ==10?(comp_10[9].name):(null)}
            
          />
        ))}
      </div>):(<div></div>)}
      {gameData.round == 3 ? (
        <h2>Game Over, Your Score Is: {gameData.score}</h2>
      ) : (
        <h3></h3>
      )}
      {gameData.round == 0 ? (
        <Jumbotron  id="intro">
        <h2>This game was created to test one's awareness of some of the largest US publicly traded companies. Targeted for those interested in the stock market and I encourage you to google some companies you may have not heard of during gameplay.</h2>
        <h3>Help</h3>
        <ul>
          <li>
            Correct answers are 20 points and incorrect answers are -10 
          </li>
          <li>
            There are three rounds, but you can always try again!
          </li>
          <li>
            Feel free to take some hints along the way, but they will cost you.
          </li>
        </ul>
      </Jumbotron>
        
      ) : (
        <h3></h3>)}
        
    </div>
  );
}

export default App;

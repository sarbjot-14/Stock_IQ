import React, { useState, useEffect } from "react";
import "./App.css";
import Stock from "./components/Stock.js";

//var every_company=null;
function App() {
  //const apiKEY = "lC34BoEHVvDSS6xE8At6ofih5T6adCU";
  const apiKEY = "2lC34BoEHVvDSS6xE8At6ofih5T6adCU";
  //const questions = ['Which company has a lower PE ratio?','Which company has higher R&D?','Which company has bigger MarketCap','Which company has higher price to sales?']
  const [modes, setModes] = useState([
    {
      question: "Which one has largest Market Cap?",
      check: "market_cap",
      inequality:">",
      revealAll:false,
      hints: [
        { revenue: { penalty: -5, reveal: false } },
        { net_income: { penalty: -5, reveal: false } },
        { debt_to_assets: { penalty: -2, reveal: false } },
        { pe: { penalty: -2, reveal: false } }
      ]
    },
    {
      question: "Which company has a lower PE ratio?",
      check: "pe",
      revealAll:false,
      inequality:"<",
      hints: [
        { market_cap: -4, reveal: false },
        { RD: -2, reveal: false },
        { eps: -4, reveal: false },
        { ps: -3, reveal: false }
      ]
    }
  ]);
  const [comp_10, setComp10] = useState([]);
  const [gameData, setGameData] = useState({round:0, score:0});

  
  //const the_indicators = ["market_cap","revenue", "price", "RD", "net_income","debt_to_assets", "eps","pe","ps" ]
  //const the_indicators = [{"market_cap"},{"revenue"},{"price"}, {"RD"}, {"net_income"},{"debt_to_assets"}, {"eps"},{"pe"},{"ps"} ]

  // get all companies sp100
  const sp100 = ['AAPL','ABBV','ABT','ACN','ADBE','AGN','AIG','ALL','SCHW','AMZN','AXP','BA','BAC','BIIB','TGT','BKNG','BLK','BMY','SBUX','WYNN','CAT','CELG','CHTR','CL','CMCSA','COF','COP','COST','CSCO','CVS','CVX','MCO','DHR','DIS','DOW','DUK','EMR','LULU','F','FB','FDX','GD','GE','GILD','GM','GOOG','GOOGL','GS','HD','HON','IBM','INTC','JNJ','JPM','KHC','KMI','KO','LLY','LMT','LOW','MA','MCD','MDLZ','MDT','MET','MMM','MO','MRK','MS','MSFT','SWKS','NFLX','NKE','NVDA','ORCL','OXY','PEP','PFE','PG','PM','PYPL','QCOM','RTN','SBUX','SLB','MU','SPG','T','TGT','TXN','UNH','UNP','UPS','USB','UTX','V','VZ','WBA','WFC','WMT','XOM']

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
    let rand10 = [];
    for (let i = 0; i < 10; i++) {
      let item = sp100[Math.floor(Math.random() * sp100.length)];
      let obj = { ticker: item };
      rand10.push(obj);
      //console.log("appending " + rand10)
    }
    console.log(rand10);
    //add SimFinId and Name

    for (let i = 0; i < 10; i++) {
      let tick = rand10[i].ticker;
      try{
        let comp = await get_simid(tick);
        rand10[i].name = comp[0].name;
        rand10[i].simId = comp[0].simId;
      }
      catch{
        console.log("could not get name offfff " + tick)
      }
      
    }

    rand10 = await addIndicators(rand10);
    console.log("has everything");
    console.log(rand10);

    return rand10;
  };

  const addIndicators = async companies => {
    const get_indicators = async simId => {
      let market_cap_req = `https://simfin.com/api/v1/companies/id/${simId}/ratios?api-key=${apiKEY}`;
      let response = await fetch(market_cap_req);
      let market_cap = await response.json();

      return market_cap;
    };
    for (let i = 0; i < 10; i++) {
      let SimFinId = companies[i].simId;
      let ind = await get_indicators(SimFinId);

      companies[i].market_cap = ind[41].value;
      companies[i].revenue = ind[5].value;
      companies[i].price = ind[0].value;
      companies[i].net_income = ind[17].value;
      companies[i].debt_to_assets = ind[53].value;
      companies[i].eps = ind[54].value;
      companies[i].pe = ind[60].value;
      companies[i].ps = ind[60].value;

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
    console.log("starting flow");
    flow().then(rand10 => {
      setComp10(rand10);
      //comp_10 = rand10;
    });
  };

  const revealHints = theHint => {
    ///hints:[{"revenue":{"penalty":-5,"reveal":false}},{"ne
    console.log("triggered " + theHint);
    let newModes = modes.slice();
    modes[0].hints.map((hint, index) => {
      Object.keys(hint).map(key => {
        if (key == theHint) {
          console.log(newModes);
          let tempHint = hint;
          if(!tempHint[key].reveal){
            tempHint[key].reveal = true;
            let tempGameData = gameData
            tempGameData.score = tempGameData.score + hint[key].penalty
            
            setGameData(tempGameData);
          }
          newModes[0].hints[index] = tempHint;
          console.log(newModes);
        }
        setModes(newModes);
      });
    });
  };
  const checkAnswer = (selectedComp) => {
 
    let newModes = modes.slice();
    newModes[0].revealAll = true;
    setModes(newModes);
    console.log("did the select work? "+selectedComp.name);
    let otherOptions = comp_10.slice(gameData.round * 3, gameData.round * 3 + 3);
  
    for(let i =0; i<otherOptions.length; i++){
      if(selectedComp.name != otherOptions[i].name){
        
        if(Number(selectedComp.market_cap) < Number(otherOptions[i].market_cap )){
          console.log("you selected the incorrect answer!!!!")
         
          let newObj  = {round:0,score:(gameData.score-5)}
          setGameData(newObj);
          return;
        }
      }
    }
   
    //tempGameData.score = tempGameData.score +10
    
    let newObj  = {round:0,score:(gameData.score+10)}
    setGameData(newObj);
    console.log("you selected the correct answer!!!!")
    return

  }
  //revalHints();
  //let round = 0;

  let button;

  if (gameData.round==0) {
      button= (<button id="nextButton" onClick={startFlow}>Start</button>)
  } else if(gameData.round<3) {
    button = (<button id="nextButton" onClick={startFlow}>Next</button>)
  }
  else{
    button = (<button id="nextButton" onClick={startFlow}>Finish</button>)
  }

  return (
    <div className="App">
      <div className="header">
        <div>
          <h2>Hints</h2>
          <div>
            {modes[0].hints.map(hint => (
              <div>
                <button onClick={() => revealHints(Object.keys(hint)[0])}>
                  {Object.keys(hint)[0]}
                </button>
                <span>{hint[Object.keys(hint)[0]].penalty}</span>
              </div>
            ))}
          </div>
        </div>

        <h1>{modes[0].question}</h1>
        <div className="score">
          <h2>Your Score Is:{gameData.score}</h2>
          <h2>Round:{gameData.round}</h2>
        </div>
      </div>
      
      {button}
      <div className="stock-container">
        {comp_10.slice(gameData.round * 3, gameData.round * 3 + 3).map(comp => (
          <Stock handleClick= {checkAnswer} key={comp.name} mode={modes[0]} company={comp} />
        ))}
      </div>
    </div>
  );
}

export default App;

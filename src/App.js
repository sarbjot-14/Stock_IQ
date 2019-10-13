import React, { useState, useEffect } from "react";
import "./App.css";
import Stock from "./components/Stock.js";
import HintButtons from "./components/HintButtons.js";

//var every_company=null;
function App() {
  //const apiKEY = "lC34BoEHVvDSS6xE8At6ofih5T6adCU";
  const apiKEY = "2lC34BoEHVvDSS6xE8At6ofih5T6adCU";
  //const questions = ['Which company has a lower PE ratio?','Which company has higher R&D?','Which company has bigger MarketCap','Which company has higher price to sales?']
  const [modes, setModes] = useState([
    {
      question: "Which one has largest Market Cap?",
      check: "market_cap",
      hints: [
        { revenue: { penalty: -5, reveal: false } },
        { net_income: { penalty: -5, reveal: false } },
        { debt_to_assets: { penalty: -2, reveal: false } },
        { pe: { penalty: -2, reveal: false } }
      ]
    },
    {
      question: "Which company has a lower PE ratio?",
      check: "ps",
      hints: [
        { market_cap: -4, reveal: false },
        { RD: -2, reveal: false },
        { eps: -4, reveal: false },
        { ps: -3, reveal: false }
      ]
    }
  ]);

  const [comp_10, setComp10] = useState([]);
  //const the_indicators = ["market_cap","revenue", "price", "RD", "net_income","debt_to_assets", "eps","pe","ps" ]
  //const the_indicators = [{"market_cap"},{"revenue"},{"price"}, {"RD"}, {"net_income"},{"debt_to_assets"}, {"eps"},{"pe"},{"ps"} ]

  // get all companies sp100
  const all_company_req = `https://simfin.com/api/v1/info/all-entities?api-key=${apiKEY}`;
  const sp100 = ['AAPL','ABBV','ABT','ACN','ADBE','AGN','AIG','ALL','AMGN','AMZN','AXP','BA','BAC','BIIB','BK','BKNG','BLK','BMY','BRK.B','C','CAT','CELG','CHTR','CL','CMCSA','COF','COP','COST','CSCO','CVS','CVX','DD','DHR','DIS','DOW','DUK','EMR','EXC','F','FB','FDX','GD','GE','GILD','GM','GOOG','GOOGL','GS','HD','HON','IBM','INTC','JNJ','JPM','KHC','KMI','KO','LLY','LMT','LOW','MA','MCD','MDLZ','MDT','MET','MMM','MO','MRK','MS','MSFT','NEE','NFLX','NKE','NVDA','ORCL','OXY','PEP','PFE','PG','PM','PYPL','QCOM','RTN','SBUX','SLB','SO','SPG','T','TGT','TXN','UNH','UNP','UPS','USB','UTX','V','VZ','WBA','WFC','WMT','XOM']

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
      let comp = await get_simid(tick);

      rand10[i].name = comp[0].name;
      rand10[i].simId = comp[0].simId;
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
    //const [modes, setModes] = useState([{question:"Which one has largest Market Cap?",check:"market_cap", hints:[{"revenue":-5,"reveal":false}, {"net_income":-5,"reveal":false},{"debt_to_assets":-2,"reveal":false}, {"pe":-2,"reveal":false}]},{question:"Which company has a lower PE ratio?",check:"ps", hints:[{"market_cap":-4,"reveal":false}, {"RD":-2,"reveal":false}, {"eps":-4,"reveal":false},{"ps":-3,"reveal":false}]}]);
    let newModes = modes.slice();
    modes[0].hints.map((hint, index) => {
      Object.keys(hint).map(key => {
        if (key == theHint) {
          console.log(newModes);
          let tempHint = hint;
          tempHint[key].reveal = true;

          newModes[0].hints[index] = tempHint;
          console.log(newModes);
        }
        setModes(newModes);
      });
    });
  };
  const clicker = () => {
    console.log("clikcer");
  };
  //revealHints();
  let round = 0;

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
          <h2>Your Score Is:</h2>
        </div>
      </div>
      <button onClick={startFlow}>Start!</button>
      <div className="stock-container">
        {comp_10.slice(round * 3, round * 3 + 3).map(comp => (
          <Stock key={comp.name} mode={modes[0]} company={comp} />
        ))}
      </div>
    </div>
  );
}

export default App;

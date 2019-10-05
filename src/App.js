import React from "react";
import "./App.css";
import Stock from "./components/Stock.js";

//var every_company=null;
function App() {
  const apiKEY = 'lC34BoEHVvDSS6xE8At6ofih5T6adCU'
  //const apiKEY = '2lC34BoEHVvDSS6xE8At6ofih5T6adCU'

  // get all companies
  const all_company_req = `https://simfin.com/api/v1/info/all-entities?api-key=${apiKEY}`
  const get_all_companies = async () => {
  
    const response = await fetch(all_company_req);
    const all_companies = await response.json();

    return all_companies;
  }

   get_all_companies().then(companies=>{
     console.log("did it work?");
     console.log(companies);

     companies = addIndicators(companies)
     companies = filterLargeCap(companies)
     console.log("ALL COMPANIES")
     console.log(companies);

   }).catch(err=>console.log("error in get_all_companies"))
  


  //add sector to company

  //add market cap to company
   function addIndicators(companies){
    

    const get_indicators = async (simId) => {
      let market_cap_req =`https://simfin.com/api/v1/companies/id/${simId}/ratios?api-key=${apiKEY}`
      let response = await fetch(market_cap_req);
      let market_cap = await response.json();
  
      return market_cap;
    }
    for(let i=1010;i<1030;i++){
      let SimFinId = companies[i].simId
      get_indicators(SimFinId).then(ind=>{
     
      
        companies[i].market_cap = ind[41].value;
        companies[i].revenue = ind[5].value;
        companies[i].price = ind[0].value;
        companies[i].RD = ind[10].value;
        companies[i].net_income = ind[17].value;
        companies[i].debt_to_assets = ind[53].value;
        companies[i].eps = ind[54].value;
        companies[i].pe = ind[60].value;
        companies[i].ps = ind[60].value;
    
        console.log("did it work?");
        console.log(companies[i]);
        console.log("FINISHED ADDING INDICATORS")
          //rev is 5
      }).catch(err=>console.log("error in get_indicators"))
    }
     return companies;
   }

   function filterLargeCap(companies){
     //filter to only large cap stocks
    companies = companies.filter(comp =>{
      if(comp.market_cap ==null){
        return false
      }
      else if(comp.market_cap > 5000000000){
        return true;
      }
      else{
        return false;
      }
    } );
    console.log("FINISHED FILTERING")
    return companies;
   }
  
  //get simfin id from ticker

  //get simfin id from stock name


 
  return (
    <div className="App">
      <div className="header">
        <div>
          <h2>Game Settings:</h2>
          <h3>Company Size:</h3>
          <h3>Sector:</h3>
        </div>

        <h1>Which One Has A Larger Market Cap</h1>
        <div className="score">
          <h2>Your Score Is:</h2>
        </div>
      </div>
      <div className='stock-container'>
        <Stock />
        <Stock />
      </div>
      
    </div>
  );
}

export default App;

import React from "react";
import "./App.css";
import Stock from "./components/Stock.js";

function App() {
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

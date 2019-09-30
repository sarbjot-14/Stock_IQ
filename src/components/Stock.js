import React from "react";

const Stock = props => {
  return (
    <div className="stock-box">
      <h1 className="name">Name</h1>
      <div className="hints">
        <div className="hint-title">
          <h3>HINT</h3>
          <h3>PENALTY</h3>
        </div>
        <div className="hint">
          <h3>P/E RATIO</h3>
          <h3>-4</h3>
          <h3>?</h3>
        </div>
        <div className="hint">
          <h3>PEG RATIO</h3>
          <h3>-4</h3>
          <h3>?</h3>
        </div>
        <div className="hint">
          <h3>D/E RATIO</h3>
          <h3>-4</h3>
          <h3>?</h3>
        </div>
      </div>
    </div>
  );
};

export default Stock;

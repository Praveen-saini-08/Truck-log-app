import React from "react";

const RouteInstructions = ({ instructions }) => {
  if (!instructions || instructions.length === 0) return null;

  return (
    <div className="instructions-card">
      <h2>Route Instructions</h2>

      <ol>
        {instructions.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ol>
    </div>
  );
};

export default RouteInstructions;
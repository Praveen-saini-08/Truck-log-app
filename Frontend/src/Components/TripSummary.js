import React from "react";

const TripSummary = ({ summary }) => {
  if (!summary) return null;

  return (
    <div className="summary-card">
      <h2>Trip Summary</h2>

      <div className="summary-grid">
        <div>
          <strong>Total Distance:</strong> {summary.distance_miles} miles
        </div>

        <div>
          <strong>Estimated Driving:</strong> {summary.estimated_hours} hrs
        </div>

        <div>
          <strong>Fuel Stops:</strong> {summary.fuel_stops}
        </div>

        <div>
          <strong>Total Log Days:</strong> {summary.logs?.length || 0}
        </div>
      </div>
    </div>
  );
};

export default TripSummary;
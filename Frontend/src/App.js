import React, { useState } from "react";
import TripForm from "./Components/TripForm";
import RouteMap from "./Components/RouteMap";
import LogSheet from "./Components/LogSheet";
import TripSummary from "./Components/TripSummary";
import "./App.css";
import RouteInstructions from "./Components/RouteInstructions";

function App() {
  const [tripData, setTripData] = useState(null);

  return (
    <div className="app-container">
      <header className="header">
        <h1>Driver Route Planner</h1>
        <p>Trip planning with route summary and electronic log sheets</p>
      </header>

      <TripForm setTripData={setTripData} />

      {tripData && (
        <>
          <TripSummary summary={tripData.route_summary} />
          <RouteInstructions instructions={tripData?.route_summary?.instructions} />
          <RouteMap mapPoints={tripData?.map_points} />
          <LogSheet
            logs={tripData?.route_summary?.logs}
            inputs={tripData?.inputs}
            summary={tripData?.route_summary}
          />
        </>
      )}
    </div>
  );
}

export default App;
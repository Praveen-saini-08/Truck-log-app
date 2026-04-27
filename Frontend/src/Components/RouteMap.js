import React from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
});

const fuelIcon = L.divIcon({
  className: "fuel-marker",
  html: "⛽",
  iconSize: [34, 34],
  iconAnchor: [17, 17],
  popupAnchor: [0, -16]
});

const restIcon = L.divIcon({
  className: "rest-marker",
  html: "☕",
  iconSize: [34, 34],
  iconAnchor: [17, 17],
  popupAnchor: [0, -16]
});

const RouteMap = ({ mapPoints }) => {
  if (!mapPoints?.pickup || !mapPoints?.dropoff) return null;

  const routePath =
    mapPoints.route_path?.map(point => [point.lat, point.lng]) || [];

  return (
    <div style={{ marginTop: "30px" }}>
      <h2 style={{ marginBottom: "15px" }}>Route Overview</h2>

      <MapContainer
        center={[mapPoints.pickup.lat, mapPoints.pickup.lng]}
        zoom={5}
        style={{
          height: "500px",
          width: "100%",
          borderRadius: "18px"
        }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <Marker position={[mapPoints.pickup.lat, mapPoints.pickup.lng]}>
          <Popup>Pickup Location</Popup>
        </Marker>

        <Marker position={[mapPoints.dropoff.lat, mapPoints.dropoff.lng]}>
          <Popup>Dropoff Location</Popup>
        </Marker>

        {mapPoints.fuel_stops?.map((stop, index) => (
          <Marker
            key={index}
            position={[stop.lat, stop.lng]}
            icon={fuelIcon}
          >
            <Popup>{stop.label}</Popup>
          </Marker>
        ))}

        {mapPoints.rest_stops?.map((stop, index) => (
          <Marker
            key={`rest-${index}`}
            position={[stop.lat, stop.lng]}
            icon={restIcon}
          >
            <Popup>{stop.label}</Popup>
          </Marker>
        ))}

        <Polyline positions={routePath} />
      </MapContainer>
    </div>
  );
};

export default RouteMap;
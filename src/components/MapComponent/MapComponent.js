import React, { memo, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap } from "react-leaflet";
import L from "leaflet";
import "./styles.css"

// Define a smaller custom marker icon with reduced shadow
const customIcon = L.icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconSize: [20, 30],       // Smaller icon size
  iconAnchor: [10, 30],     // Anchor point of the icon
  popupAnchor: [0, -28],    // Position of popup relative to the icon
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  shadowSize: [25, 10],     // Reduced shadow size
  shadowAnchor: [10, 10],   // Anchor for the shadow
});

// Selected court icon with a red border or another distinguishing feature
const selectedIcon = L.icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
  shadowUrl:
  "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  shadowSize: [25, 10],     // Reduced shadow size
  shadowAnchor: [10, 10],
  iconSize: [30, 30],
  iconAnchor: [10, 30],
  popupAnchor: [0, -28],
});

const hoverIcon = L.icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
  iconSize: [30, 30],
  iconAnchor: [10, 30],
  popupAnchor: [0, -28],
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  shadowSize: [25, 10],
  shadowAnchor: [10, 10],
});

// Helper that flies to the selected court
function FlyToSelected({ selectedCourt }) {
  const map = useMap();
  useEffect(() => {
    if (selectedCourt) {
      map.flyTo(
        [selectedCourt.Latitude, selectedCourt.Longitude],
        12,              // zoom level
        { duration: 0.8 } // animation duration in seconds
      );
    }
  }, [selectedCourt, map]);
  return null;
}

// Main map component
const MapComponent = memo(({ 
  courts, 
  onCourtSelect, 
  selectedCourt,
  hoveredCourt
}) => { const centerUSA = [37.0902, -95.7129];

  return (
    <MapContainer
      center={centerUSA}
      zoom={4}
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FlyToSelected selectedCourt={selectedCourt} />

      {/* Show hoveredCourt marker separately, if it's not already the selected one */}
      {hoveredCourt && hoveredCourt.SN !== selectedCourt?.SN && (
        <Marker
          position={[hoveredCourt.Latitude, hoveredCourt.Longitude]}
          icon={hoverIcon}
        >
          <Tooltip direction="top" offset={[0, -20]} opacity={1} permanent={false}>
            <strong>{hoveredCourt.Name}</strong><br />
            {hoveredCourt.Location}
          </Tooltip>
        </Marker>
      )}

      {courts.map((court) => {
        const isSelected = court.SN === selectedCourt?.SN;
        return (
          <Marker
            key={court.SN}
            position={[court.Latitude, court.Longitude]}
            icon={isSelected ? selectedIcon : customIcon}
            eventHandlers={{
              click: () => onCourtSelect(court),
            }}
          >
            <Tooltip direction="top" offset={[0, -20]} opacity={1} permanent={false}>
              <strong>{court.Name}</strong><br />
              {court.Location}
            </Tooltip>
            <Popup>
              <strong>{court.Name}</strong><br />{court.Location}
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
});

export default MapComponent;
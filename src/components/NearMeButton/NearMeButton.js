import React, { memo, useState } from "react";
import "./styles.css";

const NearMeButton = memo(({ onFilterByDistance }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [userTime, setUserTime] = useState(null);
  const [selectedDistance, setSelectedDistance] = useState("");

  const handleClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Capture user location and time
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(location);
          const currentTime = new Date();
          setUserTime(currentTime);
          setShowDropdown(true);
          alert(
            `Your location: (${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}) at ${currentTime.toLocaleTimeString()}`
          );
        },
        (error) => {
          // Error occurred with geolocation; fallback to default values for testing:
          console.error("Geolocation error:", error);
          const defaultLocation = { lat: 40.77240, lng: -74.60490 };
          // Create a Date object and set the time to 10:00 AM.
          let defaultTime = new Date();
          defaultTime.setHours(10, 0, 0, 0);
          setUserLocation(defaultLocation);
          setUserTime(defaultTime);
          setShowDropdown(true);
          alert(
            `Error fetching location. Using default location: (${defaultLocation.lat.toFixed(
              4
            )}, ${defaultLocation.lng.toFixed(4)}) at 10:00 AM`
          );
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const handleDistanceChange = (e) => {
    const distance = parseInt(e.target.value, 10);
    setSelectedDistance(distance);
    // Call the parent's handler to filter courts by distance (using the Haversine formula)
    // and the lighting condition based on the extracted user time.
    if (userLocation && onFilterByDistance) {
      onFilterByDistance(userLocation, distance, userTime);
    }
  };

  return (
    <div className="near-me-container">
      <button
        className="near-me-button"
        onClick={handleClick}
        type="button"
      >
        NEAR-ME
      </button>

      {showDropdown && (
        <select
          className="near-me-select"
          value={selectedDistance}
          onChange={handleDistanceChange}
        >
          <option value="" disabled>
            Filter Courts By Distance
          </option>
          {[5,10,15,20,25,30,35,40,45,50].map(km => (
            <option key={km} value={km}>
              Within {km} km
            </option>
          ))}
        </select>
      )}
    </div>
  );
});

export default NearMeButton;
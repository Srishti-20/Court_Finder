// NearMeButton.js
import React from "react";
import "./styles.css";

const NearMeButton = ({ onNearbyFetch }) => {
  const handleClick = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        onNearbyFetch(userLocation);
      },
      (error) => {
        alert("Unable to retrieve your location.");
        console.error(error);
      }
    );
  };

  return (
    <button onClick={handleClick} className="near-me-button">
      Near Me
    </button>
  );
};

export default NearMeButton;

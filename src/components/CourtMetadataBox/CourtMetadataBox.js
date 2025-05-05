import React, { useState, useEffect } from "react";
import "./styles.css";

const CourtMetadataBox = ({ court }) => {
  const [bookingLink, setBookingLink] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Initialize booking link when court changes
    if (court) {
      setBookingLink(court["Booking Link"] || "https://example.com");
      setIsEditing(false);
    }
  }, [court]);

  const handleSave = async () => {
    // Ensure that the bookingLink is not empty before submitting
    if (!bookingLink.trim()) {
      alert("Please provide a valid booking link.");
      return;
    }
  
    try {
      const response = await fetch(`https://courtfinder-db.onrender.com/api/courts/${court._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ "Booking Link": bookingLink }), // Send the BookingLink
      });
  
      if (!response.ok) throw new Error("Failed to update");
  
      alert("Booking link updated successfully!");
      setIsEditing(false); // Assuming you want to stop editing once it's saved
    } catch (err) {
      console.error("Error updating booking link:", err);
      alert("Update failed.");
    }
  };
  

  if (!court) {
    return <div>Please select a court from the map or list.</div>;
  }

  const googleMapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    court.Name + " " + court.Location
  )}`;

  return (
    <div className="court-metadata-box">
      <h3>{court.Name}</h3>
      <p><strong>Location:</strong> {court.Location}</p>
      <p><strong>Court Type:</strong> {court["Court Type"]}</p>
      <p><strong>Access:</strong> {court.Access}</p>
      <p><strong>Lighting:</strong> {court.Lighting}</p>
      <p><strong>Court Purpose:</strong> {court["Court Purpose"]}</p>
      <p>
        <strong>Google Maps Link:</strong>{" "}
        <a href={googleMapsSearchUrl} target="_blank" rel="noopener noreferrer">
          View on Google Maps
        </a>
      </p>
      <p>
        <strong>Court Booking Link:</strong>{" "}
        {isEditing ? (
          <>
            <input
              type="text"
              value={bookingLink}
              onChange={(e) => setBookingLink(e.target.value)}
              style={{ width: "80%" }}
            />
            <br />
            <button onClick={handleSave}>Save</button>
            <button onClick={() => setIsEditing(false)}>Cancel</button>
          </>
        ) : (
          <>
            <a
              href={bookingLink || "https://example.com"}
              target="_blank"
              rel="noopener noreferrer"
            >
              Let's Play Pickleball
            </a>{" "}
            <button onClick={() => setIsEditing(true)}>Edit</button>
          </>
        )}
      </p>
    </div>
  );
};

export default CourtMetadataBox;

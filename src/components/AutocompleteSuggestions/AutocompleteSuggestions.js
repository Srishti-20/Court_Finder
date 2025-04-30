import React, { useMemo } from "react";
import Fuse from "fuse.js";
import "./styles.css"
/**
 * AutocompleteSuggestions
 * -----------------------
 * Displays a dropdown of court suggestions based on the current search query.
 * Props:
 * - courts: Array of court objects
 * - query: string being typed in the SearchBar
 * - onSelect: function(court) called when a suggestion is clicked
 */
const AutocompleteSuggestions = ({ courts, query, onSelect }) => {
  // Compute suggestions when query or courts change
  const suggestions = useMemo(() => {
    if (!query) return [];
    const fuse = new Fuse(courts, {
      keys: ["Name", "Location", "Court Type"],
      threshold: 0.4,
    });
    return fuse.search(query).map((result) => result.item);
  }, [courts, query]);

  // Don't render anything if there are no suggestions
  if (!suggestions.length) {
    return null;
  }

  return (
    <div
      style={{
        position: "absolute",
        top: "100%",
        left: 0,
        right: 0,
        maxHeight: "200px",
        overflowY: "auto",
        background: "#fff",
        border: "1px solid #ccc",
        zIndex: 1000,
      }}
    >
      {suggestions.map((court) => (
        <div
          key={court.SN}
          onClick={() => onSelect(court)}
          style={{
            padding: "8px",
            borderBottom: "1px solid #eee",
            cursor: "pointer",
          }}
        >
          <strong>{court.Name}</strong> — {court.Location}
        </div>
      ))}
    </div>
  );
};

export default AutocompleteSuggestions;

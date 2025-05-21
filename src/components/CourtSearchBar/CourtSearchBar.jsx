import React, { useState, useEffect } from 'react';
import './styles.css';

const CourtSearchBar = ({ value, onChange, courts, onSelect }) => {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (value.trim() === '') {
      setSuggestions([]);
      return;
    }

    const filtered = courts.filter((court) =>
      court?.ClubDetails?.Name?.toLowerCase().includes(value.toLowerCase())
      || court?.Address?.Location?.toLowerCase().includes(value.toLowerCase())
    );

    setSuggestions(filtered.slice(0, 10));
  }, [value, courts]);

  const handleSelect = (court) => {
    if (court.ClubDetails.Name !== value) {
      onChange(court.ClubDetails.Name);
    }
    setSuggestions([]);
    onSelect(court);
  };
  

  return (
    <div className="court-search-bar">
      <input
        type="text"
        placeholder="Search courts..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {suggestions.length > 0 && (
        <ul className="search-results">
          {suggestions.map((court, index) => (
            <li key={index} onClick={() => handleSelect(court)}>
              <strong>{court.ClubDetails?.Name || 'Unnamed Court'}</strong>
              <div className="result-location">{court.Address?.Location || 'No Address'}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );  
};

export default CourtSearchBar;

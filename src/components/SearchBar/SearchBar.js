import React, { memo, useCallback } from "react";
import "./styles.css";

const SearchBar = memo(({ searchQuery, setSearchQuery, setShowSuggestions, onFocus }) => {
  const handleChange = useCallback(
    (e) => {
      const value = e.target.value;
      setSearchQuery(value);
      setShowSuggestions(value.trim() !== "");
    },
    [setSearchQuery, setShowSuggestions]
  );

  return (
    <input
      className="search-input"
      id="courtName" 
      name="courtName"
      type="text"
      value={searchQuery}
      onFocus={onFocus}
      onChange={handleChange}
      placeholder="Search for pickleball courts..."
    />
  );
});

export default SearchBar;

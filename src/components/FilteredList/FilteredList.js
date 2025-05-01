import React, { memo } from "react";
import "./styles.css";
// FilteredList displays the list of filtered courts. 
// It expects the "courts" array (which could include near‑me filtered results)
// and a callback "onCourtSelect" to update the selected court.
const FilteredList = memo(({ courts, onCourtSelect, onCourtHover }) => {
  return (
    <div className="filtered-list">
      {courts.map((court) => (
        <div
          key={court.SN}
          className="filtered-list-item"
          onMouseEnter={() => onCourtHover(court)}
          onMouseLeave={() => onCourtHover(null)}
          onClick={() => onCourtSelect(court)}
          style={{ cursor: "pointer" }}
        >
          <strong>{court.Name}</strong>
          <p className="filtered-list-location">Location: {court.Location}</p>
        </div>
      ))}
      {courts.length === 0 && (
        <div className="filtered-list-item">
          No courts found in the selected range or filter criteria.
        </div>
      )}
    </div>
  );
});

export default FilteredList;


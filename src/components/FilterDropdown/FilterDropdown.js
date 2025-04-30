import React, { memo } from "react";
import "./styles.css";

const FilterDropdown = memo(({ filters, setFilters }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="filter-dropdown">
      <strong className="filter-title">Filter Courts</strong>

      <select
        name="courtType"
        value={filters.courtType}
        onChange={handleChange}
      >
        <option value="All">Court Type: All</option>
        <option value="Indoor">Indoor</option>
        <option value="Outdoor">Outdoor</option>
        <option value="Both">Both</option>
      </select>

      <select
        name="access"
        value={filters.access}
        onChange={handleChange}
      >
        <option value="All">Access: All</option>
        <option value="Free">Free</option>
        <option value="Membership">Membership</option>
      </select>

      <select
        name="purpose"
        value={filters.purpose}
        onChange={handleChange}
      >
        <option value="All">Court Purpose: All</option>
        <option value="Dedicated Pickleball Court">Dedicated Pickleball Court</option>
        <option value="Tennis Court">Tennis Court</option>
        <option value="Others">Others</option>
      </select>

      <select
        name="lighting"
        value={filters.lighting}
        onChange={handleChange}
      >
        <option value="All">Lighting: All</option>
        <option value="Yes">Yes</option>
        <option value="No">No</option>
      </select>
    </div>
  );
});

export default FilterDropdown;

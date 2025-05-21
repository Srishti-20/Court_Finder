// src/components/CourtFilters/CourtFilters.jsx
import React from 'react';
import './styles.css';

const alphabet = ['All', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'];

const CourtFilters = ({ filters, onFilterChange }) => {
  return (
    <div className="filter-panel">
      <label>
        Max Range:
        <select name="maxRange" onChange={onFilterChange}>
          <option value="All">All</option>
          {[5, 10, 20, 50, 100].map((mile) => (
            <option key={mile} value={mile}>{mile} miles</option>
          ))}
        </select>
      </label>

      <label>
        Court Name Initial:
        <select name="initial" onChange={onFilterChange}>
          {alphabet.map((letter) => (
            <option key={letter} value={letter}>{letter}</option>
          ))}
        </select>
      </label>

      <label>
        Access:
        <select name="access" onChange={onFilterChange}>
          <option value="All">All</option>
          <option value="Free">Free</option>
          <option value="Membership">Membership</option>
        </select>
      </label>

      <label>
        Type:
        <select name="courtType" onChange={onFilterChange}>
          <option value="All">All</option>
          <option value="Outdoor">Outdoor</option>
          <option value="Indoor">Indoor</option>
          <option value="Both">Both</option>
        </select>
      </label>

      <label>
        Purpose:
        <select name="purpose" onChange={onFilterChange}>
          <option value="All">All</option>
          <option value="Dedicated Pickleball Court">Dedicated Pickleball Court</option>
          <option value="Tennis Court">Tennis Court</option>
          <option value="Court Type Other">Court Type Other</option>
        </select>
      </label>

      <label>
        Lighting:
        <select name="lighting" onChange={onFilterChange}>
          <option value="All">All</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </label>

      <label>
        Currency Code:
        <select name="currency" onChange={onFilterChange}>
          <option value="All">All</option>
          {["AUD", "CAD", "EUR", "GBP", "TWD", "USD", "ZAR"].map(code => (
            <option key={code} value={code}>{code}</option>
          ))}
        </select>
      </label>
    </div>
  );
};

export default CourtFilters;

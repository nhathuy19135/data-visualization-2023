// src/components/YearDropdown.js
import React from 'react';

const YearDropdown = ({ years, selectedYear, handleSelect }) => {
  return (
    <div>
      <label>Select a Year:</label>
      <select value={selectedYear} onChange={handleSelect}>
        <option value="">Select a year</option>
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
};

export default YearDropdown;

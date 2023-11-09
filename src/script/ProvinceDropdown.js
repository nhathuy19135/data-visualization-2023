// src/components/ProvinceDropdown.js
import React from 'react';

const ProvinceDropdown = ({ provinces, selectedProvince, handleSelect }) => {
  return (
    <div>
      <label>Select a Province:</label>
      <select value={selectedProvince} onChange={handleSelect}>
        <option value="">Select a province</option>
        {provinces.map((province) => (
          <option key={province} value={province}>
            {province}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ProvinceDropdown;

// src/components/ParameterDropdown.js
import React from 'react';

const ParameterDropdown = ({ parameterOptions, selectedParameter, handleSelect }) => {
  return (
    <div>
      <label>Select a Parameter:</label>
      <select value={selectedParameter} onChange={handleSelect}>
        <option value="">Select a parameter</option>
        {parameterOptions.map((parameter) => (
          <option key={parameter} value={parameter}>
            {parameter}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ParameterDropdown;

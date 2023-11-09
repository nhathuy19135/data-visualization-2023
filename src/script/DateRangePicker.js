// src/components/DateRangePicker.js
import React from 'react';
import { DateRange } from 'react-date-range';

const DateRangePicker = ({ selectedRange, handleSelect }) => {
  return (
    <DateRange
      ranges={[selectedRange]}
      onChange={handleSelect}
    />
  );
};

export default DateRangePicker;

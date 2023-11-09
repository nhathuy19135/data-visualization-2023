import React, { useState, useEffect } from 'react';
import ProvinceDropdown from './script/ProvinceDropdown';
import ParameterDropdown from './script/ParameterDropdown';
import YearDropdown from './script/YearDropdown';
import { fetchWeatherData } from './script/d3test';
import LineChart from './chart/LineChart';

const App = () => {
  const [selectedProvince, setSelectedProvince] = useState('');
  const [provinces, setProvinces] = useState([]);

  const [selectedParameter, setSelectedParameter] = useState(''); // Initial selection
  const parameterOptions = ['max', 'min', 'wind', 'rain', 'humidi', 'cloud', 'pressure']; //wind_d (wind direction is not supported yet)

  const [selectedYear, setSelectedYear] = useState(''); // Initial selection
  const [years, setYears] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, provinces, years } = await fetchWeatherData();
        setProvinces(provinces);
        setYears(years);
        setData(data);
        // You can also set the default selected province here if needed.
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleProvinceSelect = (event) => {
    setSelectedProvince(event.target.value);
  };
  const handleParameterSelect = (event) => {
    setSelectedParameter(event.target.value);
  };
  const handleYearSelect = (event) => {
    // Parse the selected value as a number
    setSelectedYear(parseInt(event.target.value, 10));
  };


  return (
    <div>
      {/* Other components and dropdowns go here */}
      <ProvinceDropdown
        provinces={provinces}
        selectedProvince={selectedProvince}
        handleSelect={handleProvinceSelect}
      />
      <ParameterDropdown
        parameterOptions={parameterOptions}
        selectedParameter={selectedParameter}
        handleSelect={handleParameterSelect}
      />
      <YearDropdown
        years={years}
        selectedYear={selectedYear}
        handleSelect={handleYearSelect}
      />
      <LineChart
        data={data}
        selectedProvince={selectedProvince}
        selectedYear={selectedYear}
        selectedParameter={selectedParameter}
      />
    </div>

  );

};

export default App;

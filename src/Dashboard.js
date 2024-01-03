import React, { useState, useEffect } from 'react';
import ProvinceDropdown from './script/ProvinceDropdown';
import ParameterDropdown from './script/ParameterDropdown';
import YearDropdown from './script/YearDropdown';
import { fetchWeatherData } from './script/d3test';
import LineChart from './chart/LineChart';
import ScatterPlot from './chart/ScatterPlot';
import "./App.css"
import TimeSeriesChart from './chart/TimeSeriesChart';

const DashBoard = () => {
  const [selectedProvince, setSelectedProvince] = useState('');
  const [provinces, setProvinces] = useState([]);

  const [selectedParameter, setSelectedParameter] = useState(''); // Initial selection
  const parameterOptions = ['max temp', 'min temp', 'rain', 'humidity', 'cloud density', 'pressure']; //wind and wind_d (wind direction is not supported yet)

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
    <div className="App">
      <header className="header">
        <h1>Weather Data Visualization</h1>
        <p>Visualizing weather data by province in Vietnam</p>
      </header>
      <><div className='navbar'>
        {/* Other components and dropdowns go here */}
        <ProvinceDropdown
          provinces={provinces}
          selectedProvince={selectedProvince}
          handleSelect={handleProvinceSelect} />
        <ParameterDropdown
          parameterOptions={parameterOptions}
          selectedParameter={selectedParameter}
          handleSelect={handleParameterSelect} />
        <YearDropdown
          years={years}
          selectedYear={selectedYear}
          handleSelect={handleYearSelect} />

      </div><LineChart
          data={data}
          selectedProvince={selectedProvince}
          selectedYear={selectedYear}
          selectedParameter={selectedParameter} />
        <ScatterPlot
          data={data}
          selectedProvince={selectedProvince}
          selectedYear={selectedYear}
          selectedParameter={selectedParameter}
        />
        <TimeSeriesChart
          data={data}
          selectedProvince={selectedProvince}
          selectedParameter={selectedParameter}
        />

      </>
      <footer className="footer">
        <p>© 2023 Vietnam Weather Data</p>
        <p>
          Datasets:
          <a href="https://raw.githubusercontent.com/TungTh/tungth.github.io/master/data/vn-provinces.json" target="_blank" rel="noopener noreferrer">GeoMap</a>,
          <a href="https://raw.githubusercontent.com/vanviethieuanh/dataset/main/weather/weather.csv" target="_blank" rel="noopener noreferrer">Weather</a>
        </p>
        <p>
          <a href="https://github.com/nhathuy19135/data-visualization-2023" target="_blank" rel="noopener noreferrer">GitHub Repo</a>
        </p>
      </footer>
    </div>

  );

};

export default DashBoard;

// src/utils/data.js
import * as d3 from 'd3';

export const fetchWeatherData = () => {
  const url = 'https://raw.githubusercontent.com/vanviethieuanh/dataset/main/weather/weather.csv';

  return new Promise(async (resolve, reject) => {
    try {
      const data = await d3.csv(url, d3.autoType);

      const years = [...new Set(data.map((entry) => new Date(entry.date).getFullYear()))];


      // Extract the list of unique provinces
      const provinces = [...new Set(data.map((entry) => entry.province))];
      console.log('provinces:', provinces);
      console.log('years:', years);
      resolve({ data, provinces, years });
    } catch (error) {
      console.error('Error fetching weather data:', error);
      reject(error);
    }
  });
};

// TimeSeriesChart.js
import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import d3Tip from 'd3-tip';

const TimeSeriesChart = ({ data, selectedProvince, selectedParameter }) => {
  const chartRef = useRef();
  const [selectedMonth, setSelectedMonth] = useState(null);

  useEffect(() => {
    d3.select(chartRef.current)
      .selectAll('*')
      .transition()
      .duration(500)
      .style('opacity', 0)
      .remove();

    const margin = { top: 40, right: 30, bottom: 40, left: 50 };
    const width = 1200 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3
      .select(chartRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Filter data for the selected province and parameter
    let filteredData = data.filter((entry) => entry.province === selectedProvince);

    // Filter data based on the selected month
    if (selectedMonth !== null) {
      filteredData = filteredData.filter((entry) => new Date(entry.date).getMonth() === selectedMonth);
    }

    let parameterKey;
    let measurementUnit;
    switch (selectedParameter) {
      case 'max temp':
        parameterKey = 'max';
        measurementUnit = '°C';
        break;
      case 'min temp':
        parameterKey = 'min';
        measurementUnit = '°C';
        break;
      // case 'wind':
      //     parameterKey = 'wind';
      //     break;
      // case 'wind_d':
      //     parameterKey = 'wind_d';
      //     break;
      case 'rain':
        parameterKey = 'rain';
        measurementUnit = 'mm';
        break;
      case 'humidity':
        parameterKey = 'humidi';
        measurementUnit = '%';
        break;
      case 'cloud density':
        parameterKey = 'cloud';
        measurementUnit = '%';
        break;
      case 'pressure':
        parameterKey = 'pressure';
        measurementUnit = 'hPa';
        break;
      default:
        console.error('Unknown parameter:', selectedParameter);
        return;
    }

    // Create scales for x and y axes
    const xScale = d3
      .scaleTime()
      .domain(d3.extent(filteredData, (d) => new Date(d.date)))
      .range([0, width]);

    const yScale = d3
      .scaleLinear()
      .domain([d3.min(filteredData, (d) => d[parameterKey]) - 50, d3.max(filteredData, (d) => d[parameterKey]) + 50])
      .nice()
      .range([height, 0]);

    if (selectedMonth !== null) {
      const selectedMonthData = filteredData.filter((entry) => new Date(entry.date).getMonth() === selectedMonth);
      xScale.domain(d3.extent(selectedMonthData, (d) => new Date(d.date)));
    } else {
      xScale.domain(d3.extent(filteredData, (d) => new Date(d.date)));
    }

    // Create scatter plot for max values
    const maxPoints = svg
      .selectAll('.point-max')
      .data(filteredData)
      .enter()
      .append('circle')
      .attr('class', 'point-max')
      .attr('cx', (d) => xScale(new Date(d.date)))
      .attr('cy', (d) => yScale(d.max))
      .attr('r', 5) // Adjust the radius as needed
      .style('fill', 'steelblue');

    // Create scatter plot for min values
    const minPoints = svg
      .selectAll('.point-min')
      .data(filteredData)
      .enter()
      .append('circle')
      .attr('class', 'point-min')
      .attr('cx', (d) => xScale(new Date(d.date)))
      .attr('cy', (d) => yScale(d.min))
      .attr('r', 5) // Adjust the radius as needed
      .style('fill', 'orange');

    // Create x and y axes
    const xAxis = d3.axisBottom(xScale).tickFormat((date) => {
      const monthYearFormat = d3.timeFormat('%b %Y');
      const selectedMonthFormat = d3.timeFormat('%b %Y')(date);
      return selectedMonth !== null ? selectedMonthFormat : monthYearFormat(date);
    });


    const yAxis = d3.axisLeft(yScale);

    svg
      .append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0, ${height})`)
      .call(xAxis);

    svg.append('g').attr('class', 'y-axis').call(yAxis);

    // Initialize the tooltip
    const tip = d3Tip()
      .attr('class', 'd3-tip')
      .html((event, d) => {
        const formattedDate = d3.timeFormat('%b %Y')(new Date(d.date));
        const max = d.max.toFixed(2);
        const min = d.min.toFixed(2);
        return `<strong>Date:</strong> ${formattedDate}<br><strong>Max:</strong> ${max}${measurementUnit}<br><strong>Min:</strong> ${min}${measurementUnit}`;

      });

    // Call the tooltip on the max and min points
    maxPoints.call(tip);
    minPoints.call(tip);

    // Show tooltip on mouseover
    maxPoints.on('mouseover', tip.show).on('mouseout', tip.hide);
    minPoints.on('mouseover', tip.show).on('mouseout', tip.hide);
  }, [data, selectedParameter, selectedProvince, selectedMonth]);

  // Function to handle month selection change
  const handleMonthChange = (event) => {
    const selectedMonthValue = event.target.value;
    setSelectedMonth(selectedMonthValue !== 'all' ? parseInt(selectedMonthValue, 10) : null);
  };

  return (
    <div className="container">
      <div className="chart-title">Line Chart</div>
      <div className="select-container">
        <label htmlFor="monthSelect">Select Month:</label>
        <select id="monthSelect" onChange={handleMonthChange}>
          <option value="all">All Months</option>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i} value={i}>
              {d3.timeFormat('%B')(new Date(2000, i, 1))}
            </option>
          ))}
        </select>
      </div>
      <svg ref={chartRef}></svg>
    </div>
  );
};

export default TimeSeriesChart;

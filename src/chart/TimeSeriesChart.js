// TimeSeriesChart.js
import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const TimeSeriesChart = ({ data, selectedProvince, selectedParameter }) => {
  const chartRef = useRef();

  useEffect(() => {
    d3.select(chartRef.current)
      .selectAll('*')
      .transition()
      .duration(500)
      .style('opacity', 0)
      .remove();

    const margin = { top: 40, right: 30, bottom: 40, left: 50 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3
      .select(chartRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Filter data for the selected province and parameter
    const filteredData = data
      .filter((entry) => entry.province === selectedProvince);

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
      // Add cases for other parameters if needed
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
      .domain([0, d3.max(filteredData, (d) => d[parameterKey])])
      .nice()
      .range([height, 0]);

    filteredData.sort((a, b) => new Date(a.date) - new Date(b.date));

    // Create separate line generators for max and min values
    const lineMax = d3
      .line()
      .x((d) => xScale(new Date(d.date)))
      .y((d) => yScale(d.max));

    const lineMin = d3
      .line()
      .x((d) => xScale(new Date(d.date)))
      .y((d) => yScale(d.min));

    // Append the path for the max value line
    svg
      .append('path')
      .datum(filteredData)
      .attr('class', 'line-max')
      .style('fill', 'none')
      .style('stroke', 'steelblue')
      .style('stroke-width', 2)
      .style('opacity', 0)
      .transition()
      .duration(1000)
      .attr('d', lineMax)
      .style('opacity', 1);

    // Append the path for the min value line
    svg
      .append('path')
      .datum(filteredData)
      .attr('class', 'line-min')
      .style('fill', 'none')
      .style('stroke', 'orange')
      .style('stroke-width', 2)
      .style('opacity', 0)
      .transition()
      .duration(1000)
      .attr('d', lineMin)
      .style('opacity', 1);

    // Create x and y axes
    const xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat('%b %Y'));
    const yAxis = d3.axisLeft(yScale);

    svg
      .append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0, ${height})`)
      .call(xAxis);

    svg.append('g').attr('class', 'y-axis').call(yAxis);
  }, [data, selectedParameter, selectedProvince]);

  return <svg ref={chartRef}></svg>;
};

export default TimeSeriesChart;

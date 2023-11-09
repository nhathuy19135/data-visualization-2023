import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const LineChart = ({ data, selectedProvince, selectedYear, selectedParameter }) => {
    const chartRef = useRef();

    useEffect(() => {
        d3.select(chartRef.current).selectAll("*").remove();
        const margin = { top: 20, right: 30, bottom: 40, left: 50 };
        const width = 600 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        const svg = d3
            .select(chartRef.current)
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // Filter data for the selected province, year, and parameter
        const filteredData = data
            .filter((entry) => entry.province === selectedProvince)
            .filter((entry) => new Date(entry.date).getFullYear() === selectedYear);

        // Check the selected parameter and filter based on it
        let parameterKey;
        switch (selectedParameter) {
            case 'max':
                parameterKey = 'max';
                break;
            case 'min':
                parameterKey = 'min';
                break;
            case 'wind':
                parameterKey = 'wind';
                break;
            // case 'wind_d':
            //     parameterKey = 'wind_d';
            //     break;
            case 'rain':
                parameterKey = 'rain';
                break;
            case 'humidi':
                parameterKey = 'humidi';
                break;
            case 'cloud':
                parameterKey = 'cloud';
                break;
            case 'pressure':
                parameterKey = 'pressure';
                break;
            default:
                console.error('Unknown parameter:', selectedParameter);
                return;
        }

        // Continue filtering based on the selected parameter
        const filteredByParameter = filteredData.filter((entry) => entry[parameterKey]);

        console.log('Filtered Data:', filteredByParameter); // Log the filtered data

        // Create scales for x and y axes
        const xScale = d3
            .scaleTime()
            .domain(d3.extent(filteredByParameter, (d) => new Date(d.date)))
            .range([0, width]);

        console.log('xScale Domain:', xScale.domain()); // Log xScale domain

        const yScale = d3
            .scaleLinear()
            .domain([0, d3.max(filteredByParameter, (d) => d[parameterKey])])
            .nice()
            .range([height, 0]);

        console.log('yScale Domain:', yScale.domain()); // Log yScale domain


        // Create the line generator
        const line = d3
            .line()
            .x((d) => xScale(new Date(d.date)))
            .y((d) => yScale(d[parameterKey]));

        console.log('Line Data:', filteredByParameter); // Log the data used for the line

        // Append the path for the line chart
        svg
            .append('path')
            .datum(filteredByParameter)
            .attr('class', 'line')
            .attr('d', line)
            .style('fill', 'none')
            .style('stroke', 'steelblue')
            .style('stroke-width', 2);

        // Create x and y axes
        const xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat('%b %Y'));
        const yAxis = d3.axisLeft(yScale);

        svg
            .append('g')
            .attr('class', 'x-axis')
            .attr('transform', `translate(0, ${height})`)
            .call(xAxis);

        svg.append('g').attr('class', 'y-axis').call(yAxis);
    }, [data, selectedParameter, selectedProvince, selectedYear]);

    return <svg ref={chartRef}></svg>;
};

export default LineChart;

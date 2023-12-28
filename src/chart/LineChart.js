import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import GeoMap from './GeoMap';

const LineChart = ({ data, selectedProvince, selectedYear, selectedParameter, }) => {
    const chartRef = useRef();

    useEffect(() => {

        d3.select(chartRef.current)
            .selectAll("*")
            .transition()
            .duration(500)  // Set the duration of the fade-out transition in milliseconds
            .style("opacity", 0)
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

        // Filter data for the selected province, year, and parameter
        const filteredData = data
            .filter((entry) => entry.province === selectedProvince)
            .filter((entry) => new Date(entry.date).getFullYear() === selectedYear);

        // Check the selected parameter and filter based on it
        let parameterKey;
        let mearsurementUnit;
        switch (selectedParameter) {
            case 'max temp':
                parameterKey = 'max';
                mearsurementUnit = '°C';
                break;
            case 'min temp':
                parameterKey = 'min';
                mearsurementUnit = '°C';
                break;
            // case 'wind':
            //     parameterKey = 'wind';
            //     break;
            // case 'wind_d':
            //     parameterKey = 'wind_d';
            //     break;
            case 'rain':
                parameterKey = 'rain';
                mearsurementUnit = 'mm';
                break;
            case 'humidity':
                parameterKey = 'humidi';
                mearsurementUnit = '%';
                break;
            case 'cloud density':
                parameterKey = 'cloud';
                mearsurementUnit = '%';
                break;
            case 'pressure':
                parameterKey = 'pressure';
                mearsurementUnit = 'hPa';
                break;
            default:
                console.error('Unknown parameter:', selectedParameter);
                return;
        }
        var t = d3.transition()
            .duration(1000)
            .ease(d3.easeLinear);

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

        filteredByParameter.sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort the data by date

        // Create the line generator
        const line = d3
            .line()
            .x((d) => xScale(new Date(d.date)))
            .y((d) => yScale(d[parameterKey]))
        // .transition()
        // .duration(1000); // Set the duration of the transition in milliseconds


        console.log('Line Data:', filteredByParameter); // Log the data used for the line

        // Append the path for the line chart
        const path = svg
            .append('path')
            .datum(filteredByParameter)
            .attr('class', 'line')
            .style('fill', 'none')
            .style('stroke', 'steelblue')
            .style('stroke-width', 2)
            // .attr('d', line)
            // .transition()
            // .duration(1000)
            .style('opacity', 0);


        path.transition()
            .duration(1000) // Set the duration of the transition in milliseconds
            .attr('d', line)
            .style('opacity', 1);



        // This allows to find the closest X index of the mouse:
        var bisect = d3.bisector(function (d) { return new Date(d.date); }).left;
        // Add vertical line to the focus
        var focusVerticalLine = svg
            .append('line')
            .style("stroke", "black")
            .style("stroke-dasharray", ("3, 3"))  // Set the line style to dashed
            .style("opacity", 0);

        // Add horizontal line to the focus
        var focusHorizontalLine = svg
            .append('line')
            .style("stroke", "black")
            .style("stroke-dasharray", ("3, 3"))  // Set the line style to dashed
            .style("opacity", 0);


        // Create the circle that travels along the curve of chart
        var focus = svg
            .append('g')
            .append('circle')
            .style("fill", "none")
            .attr("stroke", "black")
            .attr('r', 8.5)
            .style("opacity", 0);

        // Create the text that travels along the curve of chart
        var focusText = svg
            .append('g')
            .append('text')
            .style("opacity", 0)
            .attr("text-anchor", "left")
            .attr("alignment-baseline", "middle");

        svg
            .append('text')
            .attr('x', width / 2)
            .attr('y', -margin.top / 2)
            .attr('text-anchor', 'middle')
            .style('font-size', '16px')
            .style('font-weight', 'bold')
            .text('Line Chart');

        // Create a rect on top of the svg area: this rectangle recovers mouse position
        svg
            .append('rect')
            .style("fill", "none")
            .style("pointer-events", "all")
            .attr('width', width)
            .attr('height', height)
            .on('mouseover', mouseover)
            .on('mousemove', mousemove)
            .on('mouseout', mouseout);

        // What happens when the mouse move -> show the annotations at the right positions.
        function mouseover() {
            focus.style("opacity", 1);
            focusText.style("opacity", 1);
            focusVerticalLine.style("opacity", 1);  // Show the vertical line
            focusHorizontalLine.style("opacity", 1);  // Show the horizontal line
        }
        let selectedData;

        function mousemove(event) {
            // recover coordinate we need
            var x0 = xScale.invert(d3.pointer(event)[0]);
            var i = bisect(filteredByParameter, x0, 1);
            selectedData = filteredByParameter[i];
            if (selectedData) { // Add this check
                focus
                    .attr("cx", xScale(new Date(selectedData.date)))
                    .attr("cy", yScale(selectedData[parameterKey]));
                focusText
                    .html(selectedData[parameterKey] + mearsurementUnit)
                    .attr("x", xScale(new Date(selectedData.date)) + 0)
                    .attr("y", yScale(selectedData[parameterKey]) - 30);

                // Update the position of the vertical line
                focusVerticalLine
                    .attr("x1", xScale(new Date(selectedData.date)))
                    .attr("y1", yScale.range()[0])  // Bottom of the chart
                    .attr("x2", xScale(new Date(selectedData.date)))
                    .attr("y2", yScale.range()[1]); // Top of the chart

                // Update the position of the horizontal line
                focusHorizontalLine
                    .attr("x1", xScale.range()[0])  // Left of the chart
                    .attr("y1", yScale(selectedData[parameterKey]))
                    .attr("x2", xScale.range()[1])  // Right of the chart
                    .attr("y2", yScale(selectedData[parameterKey]));
            }
        }

        function mouseout() {
            focus.style("opacity", 0);
            focusText.style("opacity", 0);
            focusVerticalLine.style("opacity", 0);  // Hide the vertical line
            focusHorizontalLine.style("opacity", 0);  // Hide the horizontal line
        }

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

    return (
        <div>
            <svg ref={chartRef}></svg>
            {/* <div className="geomap-container"> */}
            <GeoMap selectedProvince={selectedProvince} /> {/* Use the GeoMap component */}
            {/* </div> */}
        </div>
    );
};

export default LineChart;

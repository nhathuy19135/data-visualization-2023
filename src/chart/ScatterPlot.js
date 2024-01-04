// ScatterPlot.js
import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const ScatterPlot = ({ data, selectedYear, selectedParameter }) => {
    const chartRef = useRef();

    useEffect(() => {
        // Ensure the chart is cleared before drawing a new one
        d3.select(chartRef.current).selectAll('*').remove();

        const margin = { top: 60, right: 30, bottom: 40, left: 50 };
        const width = 650 - margin.left - margin.right;
        const height = 320 - margin.top - margin.bottom;

        const svg = d3
            .select(chartRef.current)
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // Filter data for the selected year
        const filteredData = data.filter((entry) => new Date(entry.date).getFullYear() === selectedYear);
        let parameterKey;
        switch (selectedParameter) {
            case 'max temp':
                parameterKey = 'max';
                break;
            case 'min temp':
                parameterKey = 'min';
                break;
            default:
                console.error('Unknown parameter:', selectedParameter);
                return;
        }
        // Extract the min or max temperature for each province based on the selected parameter
        const temperatureValues = d3.rollup(
            filteredData,
            (v) => {
                if (parameterKey === 'min') {
                    return d3.min(v, (d) => d.min);
                } else if (parameterKey === 'max') {
                    return d3.max(v, (d) => d.max);
                } else {
                    console.error('Unknown parameter:', parameterKey);
                    return null;
                }
            },
            (d) => d.province
        );


        svg
            .append('text')
            // .attr('x', width / 2)
            .attr('y', -margin.top / 2)
            .attr('text-anchor', 'start')
            .style('font-size', '16px')
            .style('font-weight', 'bold')
            .text('Temperature by Province');

        var tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        // Create scales for x and y axes
        const xScale = d3
            .scaleBand()
            .domain(data.map((entry) => entry.province))
            .range([0, width])
            .padding(0.1);

        const yScale = d3
            .scaleLinear()
            .domain([0, d3.max(Array.from(temperatureValues.values()))])
            .nice()
            .range([height, 0]);

        const colorScale = d3.scaleOrdinal(d3.schemeCategory10);
        // // Get unique provinces
        // const provinces = Array.from(new Set(data.map((entry) => entry.province)));

        // // Define the size and position of the legend
        // const legendSize = 10;
        // const legendSpacing = 4;
        // const legendY = -margin.top / 2;

        // // Create a group for the legend
        // const legend = svg.selectAll('.legend')
        //     .data(provinces)
        //     .enter()
        //     .append('g')
        //     .attr('class', 'legend')
        //     .attr('transform', (d, i) => `translate(0,${i * (legendSize + legendSpacing)})`);

        // // Add a rectangle for each legend item
        // legend.append('rect')
        //     .attr('width', legendSize)
        //     .attr('height', legendSize)
        //     .style('fill', colorScale)
        //     .style('stroke', colorScale);

        // // Add a label for each legend item
        // legend.append('text')
        //     .attr('x', legendSize + legendSpacing)
        //     .attr('y', legendSize - legendSpacing)
        //     .text((d) => d);

        // Create the scatter plot points
        svg.selectAll('circle')
            .data(Array.from(temperatureValues))
            .enter()
            .append('circle')
            .attr('cx', (d) => xScale(d[0]) + xScale.bandwidth() / 2)
            .attr('cy', (d) => yScale(d[1]))
            .attr('r', 5)
            .style('fill', (d) => colorScale(d[0]))
            .style('opacity', 0)
            .on("mouseover", function (event, d) {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                tooltip.html(`${d[0]}<br/>Temperature: ${d[1]}`)
                    .style("left", (event.pageX) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", function (d) {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            })
            .transition()
            .duration(1000)
            .style('opacity', 1);

        // Create x and y axes
        const xAxis = d3.axisBottom(xScale).tickFormat("");
        const yAxis = d3.axisLeft(yScale);

        svg
            .append('g')
            .attr('class', 'x-axis invisible')
            .attr('transform', `translate(0, ${height})`)
            .call(xAxis);

        svg.append('g').attr('class', 'y-axis').call(yAxis);
    }, [data, selectedYear, selectedParameter]);

    return <svg ref={chartRef}></svg>;
};

export default ScatterPlot;

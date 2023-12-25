// GeoMap.js
import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const GeoMap = () => {
    const geoMapRef = useRef();

    useEffect(() => {
        const width = 600;
        const height = 500;

        // Append an SVG element for the GeoMap
        const geoMapSvg = d3.select(geoMapRef.current)
            .attr('width', width)
            .attr('height', height);

        // Load GeoJSON data for Vietnam provinces
        const geoJSONUrl = 'https://raw.githubusercontent.com/TungTh/tungth.github.io/master/data/vn-provinces.json';
        d3.json(geoJSONUrl).then(geoJSONData => {
            // Set up projection and path generator
            const projection = d3.geoMercator().fitSize([width, height], geoJSONData);
            const pathGenerator = d3.geoPath().projection(projection);

            // Draw the map
            geoMapSvg.selectAll('path')
                .data(geoJSONData.features)
                .enter().append('path')
                .attr('d', pathGenerator)
                .attr('stroke', 'white')
                .attr('fill', 'lightgray')
                .on('mouseover', handleMouseOver)
                .on('mouseout', handleMouseOut);

            // Function to handle mouseover event on GeoMap
            function handleMouseOver(event, d) {
                const provinceName = d.properties.Name;

                // Use the projection to get SVG coordinates
                const [x, y] = projection(d3.geoCentroid(d));

                // Append a text element to display the province name
                geoMapSvg.append('text')
                    .attr('x', x)
                    .attr('y', y)
                    .text(provinceName)
                    .attr('class', 'province-label'); // You can style this class in your CSS
                console.log(" province name: ", provinceName);

                // You can also add logic to highlight the province (e.g., change fill color)
                d3.select(event.target).attr('fill', 'orange');
            }

            function handleMouseOut(event, d) {
                // Remove the text element and revert any changes made during mouseover
                geoMapSvg.selectAll('.province-label').remove();
                d3.select(event.target).attr('fill', 'lightgray');
            }
        });




    }, []);

    return <svg ref={geoMapRef}></svg>;
};

export default GeoMap;

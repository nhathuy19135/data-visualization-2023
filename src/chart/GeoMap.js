// GeoMap.js
import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const GeoMap = ({ selectedProvince }) => {
    selectedProvince = selectedProvince.replace(' City', '').trim();
    const geoMapRef = useRef();

    useEffect(() => {
        const width = 500;
        const height = 500;

        // Append an SVG element for the GeoMap
        const geoMapSvg = d3.select(geoMapRef.current)
            .attr('width', width)
            .attr('height', height);

        // Load GeoJSON data for Vietnam provinces
        const geoJSONUrl = 'https://raw.githubusercontent.com/TungTh/tungth.github.io/master/data/vn-provinces.json';
        d3.json(geoJSONUrl).then(geoJSONData => {
            // Modify GeoJSONData to trim province names
            geoJSONData.features.forEach(feature => {
                feature.properties.Name = feature.properties.Name
                    .replace(' Province', '').trim()
                    .replace(' City', '').trim();
            });

            // Set up projection and path generator
            const projection = d3.geoMercator().fitSize([width, height], geoJSONData);
            const pathGenerator = d3.geoPath().projection(projection);

            // Draw the map
            const paths = geoMapSvg.selectAll('path')
                .data(geoJSONData.features)
                .join('path')  // This will handle the enter, update, and exit scenarios
                .attr('d', pathGenerator)
                .attr('stroke', 'white')
                .on('mouseover', handleMouseOver)
                .on('mouseout', handleMouseOut);

            updateFillColor(paths);

            function updateFillColor(paths) {
                paths.each(function (d) {
                    const provinceName = d.properties.Name.trim();
                    const fillColor = provinceName === selectedProvince ? 'cyan' : 'lightgray';
                    d3.select(this).attr('fill', fillColor);
                });
            }

            // Function to handle mouseover event on GeoMap
            function handleMouseOver(event, d) {
                const provinceName = d.properties.Name.replace(' Province', ''); // Remove "Province" suffix

                // Use the projection to get SVG coordinates
                const [x, y] = projection(d3.geoCentroid(d));

                // Append a text element to display the province name
                geoMapSvg.append('text')
                    .attr('x', x)
                    .attr('y', y)
                    .text(provinceName)
                    .attr('class', 'province-label'); // You can style this class in your CSS

                // You can also add logic to highlight the province (e.g., change fill color)
                d3.select(event.target).attr('fill', 'orange');
            }

            function handleMouseOut(event, d) {
                // Remove the text elements and revert any changes made during mouseover
                geoMapSvg.selectAll('.province-label').remove();
                const provinceName = d.properties.Name.replace(' Province', ''); // Remove "Province" suffix
                d3.select(event.target).attr('fill', provinceName === selectedProvince ? 'cyan' : 'lightgray');
            }
        });
    }, [selectedProvince]);

    return <svg ref={geoMapRef}></svg>;
};

export default GeoMap;

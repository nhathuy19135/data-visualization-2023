// GeoMap.js
import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const GeoMap = ({ selectedProvince }) => {
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
            // Modify GeoJSONData to trim province names
            geoJSONData.features.forEach(feature => {
                feature.properties.Name = feature.properties.Name.replace(' Province', '').trim();
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
                    const fillColor = provinceName === selectedProvince ? 'orange' : 'lightgray';
                    d3.select(this).attr('fill', fillColor);
                });
            }

            // Function to handle mouseover event on GeoMap
            function handleMouseOver(event, d) {
                // You can add specific mouseover behavior here
            }

            function handleMouseOut(event, d) {
                // You can add specific mouseout behavior here
            }
        });
    }, [selectedProvince]);

    return <svg ref={geoMapRef}></svg>;
};

export default GeoMap;

// GeoMap.js
import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const GeoMap = ({ selectedProvince }) => {
    selectedProvince = selectedProvince.replace(' City', '').trim();
    if (selectedProvince === 'Vung Tau') {
        selectedProvince = 'Ba Ria - Vung Tau';
    }
    if (selectedProvince === 'Hanoi') {
        selectedProvince = 'Ha Noi';
    }
    if (selectedProvince === 'Hue') {
        selectedProvince = 'Thua Thien Hue';
    }
    if (selectedProvince === 'Tam Ky') {
        selectedProvince = 'Quang Nam';
    }
    if (selectedProvince === 'Tan An') {
        selectedProvince = 'Long An';
    }
    if (selectedProvince === 'Bien Hoa' ) {
        selectedProvince = 'Dong Nai';
    }
    if (selectedProvince === 'Hong Gai' || selectedProvince === 'Cam Pha' || selectedProvince === 'Uong Bi' ) {
        selectedProvince = 'Quang Ninh';
    }
    if (selectedProvince === 'Buon Me Thuot') {
        selectedProvince = 'Dak Lak';
    }
    if (selectedProvince === 'Long Xuyen') {
        selectedProvince = 'An Giang';
    }
    if (selectedProvince === 'My Tho') {
        selectedProvince = 'Tien Giang';
    }
    if (selectedProvince === 'Tuy Hoa') {
        selectedProvince = 'Phu Yen';
    }
    if (selectedProvince === 'Cam Ranh' || selectedProvince === 'Nha Trang') {
        selectedProvince = 'Khanh Hoa';
    }
    if (selectedProvince === 'Viet Tri') {
        selectedProvince = 'Phu Tho';
    }
    if (selectedProvince === 'Chau Doc') {
        selectedProvince = 'An Giang';
    }
    if (selectedProvince === 'Phan Rang') {
        selectedProvince = 'Ninh Thuan';
    }
    if (selectedProvince === 'Vinh') {
        selectedProvince = 'Nghe An';
    }
    if (selectedProvince === 'Da Lat') {
        selectedProvince = 'Lam Dong';
    }
    if (selectedProvince === 'Phan Thiet') {
        selectedProvince = 'Binh Thuan';
    }
    if (selectedProvince === 'Play Cu') {
        selectedProvince = 'Gia Lai'
    }
    if (selectedProvince === 'Qui Nhon') {
        selectedProvince = 'Binh Dinh';
    }
    if (selectedProvince === 'Rach Gia') {
        selectedProvince = 'Kien Giang';
    }

    const geoMapRef = useRef();

    useEffect(() => {
        // GeoMap.js
        const margin = { top: 10, right: 0, bottom: 30, left: 100 }; // existing margins

        // Increase the left margin
        // margin.left += 50; // adjust this value as needed
        const width = 450;
        const height = 500;

        // Append an SVG element for the GeoMap
        const geoMapSvg = d3.select(geoMapRef.current)
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)

        const colorScale = d3.scaleLinear()
            .domain([0, 1]) // input
            .range(["#ff0000", "#0000ff"]); // output

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
            const colorInterpolator = d3.interpolateRainbow;

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
                    if (provinceName === selectedProvince) {
                        // Start a transition that changes the fill color over time
                        d3.select(this)
                            .transition()
                            .duration(5000) // Duration of the transition in milliseconds
                            .ease(d3.easeLinear) // Linear easing function for a constant speed
                            .attrTween('fill', function() {
                                return function(t) {
                                    return colorInterpolator(t);
                                };
                            });
                    } else {
                        d3.select(this)
                            .interrupt() // Stop the transition
                            .attr('fill', 'lightgray'); // Reset the fill color
                    }
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
                const randomValue = Math.random();

                // Get a color from the color scale
                const color = colorScale(randomValue);
        
                // Remove the text elements and revert any changes made during mouseover
                geoMapSvg.selectAll('.province-label').remove();
                const provinceName = d.properties.Name.replace(' Province', ''); // Remove "Province" suffix
                d3.select(event.target).attr('fill', provinceName === selectedProvince ? color : 'lightgray');
            }
        });
    }, [selectedProvince]);

    return <svg ref={geoMapRef}></svg>;
};

export default GeoMap;

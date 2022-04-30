import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import React, { useRef, useEffect, useState } from 'react'; 
mapboxgl.accessToken = 'pk.eyJ1IjoibXJhbHBhY2EiLCJhIjoiY2pyYmV5dWg4MTJheDQzcGNxeGtleWx0bCJ9.SwBpLsVT9FGuA9JoEHg60w';

function Map(props) {
    const mapContainer = useRef(null);
    const map = useRef(null);
    /*
    const [lng, setLng] = useState(-70.9);
    const [lat, setLat] = useState(42.35);
    */
    const [zoom, setZoom] = useState(9);
    const [value, setValue] = useState(props.visibilityArray);
    
    useEffect(() => {
        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [-82.636, 39.052],
        zoom: zoom
        });
    });
    useEffect(() => {
        if (!map.current) return;
        map.current.on('load', () => {
            //setMap(map);
            map.current.addSource('Jackson', {type: "geojson", data: "http://127.0.0.1:5000/api/county_boundaries/Jackson"});
            // Add a new layer to visualize the polygon.
        map.current.addLayer({
            'id': 'Jackson',
            'type': 'fill',
            'source': 'Jackson', // reference the data source
            'layout': {},
            //'visibility':'none',
            'paint': {
            'fill-color': '#0080ff', // blue color fill
            'fill-opacity': 0.1
            }
            });
            // Add a black outline around the polygon.
            map.current.addLayer({
            'id': 'outline',
            'type': 'line',
            'source': 'Jackson',
            'layout': {},
            'paint': {
            'line-color': '#000',
            'line-width': 3
            }
            });
            map.current.addSource('Scioto', {type: "geojson", data: "http://127.0.0.1:5000/api/county_boundaries/Scioto"});
                // Add a new layer to visualize the polygon.
            map.current.addLayer({
                'id': 'Scioto',
                'type': 'fill',
                'source': 'Scioto', // reference the data source
                'layout': {},
                'paint': {
                'fill-color': '#e892de', // blue color fill
                'fill-opacity': 0.1
                }
                });
                // Add a black outline around the polygon.
                map.current.addLayer({
                'id': 'outline2',
                'type': 'line',
                'source': 'Scioto',
                'layout': {},
                'paint': {
                'line-color': '#000',
                'line-width': 3
                }
                });
            map.current.loadImage('https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png',
            (error, image) => {
            if (error) throw error;
            map.current.addImage('custom-marker', image);
            map.current.addSource('NPPES', {type:"geojson", data:"http://127.0.0.1:5000/api/NPPES"});
            map.current.addLayer({
            'id': 'NPPES',
            'type': 'symbol',
            'source': 'NPPES',
            'layout': {
            
                    'icon-image': 'custom-marker',
                    'icon-allow-overlap': true
            }  
            });
            map.current.addSource('Project_Down', {type:"geojson", data:"http://127.0.0.1:5000/api/Project_Down"});
            map.current.addLayer({
            'id': 'Project_Down',
            'type': 'symbol',
            'source': 'Project_Down',
            'layout': {
            
                    'icon-image': 'custom-marker',
                    'icon-allow-overlap': true
            }  
            });
            map.current.addSource('SAMASA', {type:"geojson", data:"http://127.0.0.1:5000/api/SAMASA"});
            map.current.addLayer({
            'id': 'SAMASA',
            'type': 'symbol',
            'source': 'SAMASA',
            'layout': {
            
                    'icon-image': 'custom-marker',
                    'icon-allow-overlap': true
            }  
            });
            if (props.visibilityArray) {
                const keys = Object.keys(props.visibilityArray);
                for (var i = 0; i < keys.length; i++) {
                    map.current.setLayoutProperty(keys[i], "visibility", props.visibilityArray[keys[i]]);
                    console.log(`Set property ${keys[i]} to ${props.visibilityArray[keys[i]]}`);
                }
            }
         

        });

        });
        //map.current.setLayer
        map.current.on('click', 'NPPES', (e) => {

            const coordinates = e.features[0].geometry.coordinates.slice();
            const description = e.features[0].properties.NAME1;
            //console.log(e.features)
             
            
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }
             
            new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(description)
            .addTo(map.current);
            });
            map.current.on('click', 'Project_Down', (e) => {

                const coordinates = e.features[0].geometry.coordinates.slice();
                const description = e.features[0].properties.NAME1;
                //console.log(e.features)
                 
                
                while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                }
                 
                new mapboxgl.Popup()
                .setLngLat(coordinates)
                .setHTML(description)
                .addTo(map.current);
                });
                map.current.on('click', 'SAMASA', (e) => {

                    const coordinates = e.features[0].geometry.coordinates.slice();
                    const description = e.features[0].properties.NAME1;
                    //console.log(e.features)
                     
                    
                    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                    }
                     
                    new mapboxgl.Popup()
                    .setLngLat(coordinates)
                    .setHTML(description)
                    .addTo(map.current);
                    });
                
                
    });
 

    return (
        <div ok={props.visibilityArray}>
            <div>{props.toRerender}</div>
        <div ref={mapContainer} className="map-container" />
        </div>
    );
}

export default Map;
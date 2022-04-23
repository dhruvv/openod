import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import React, { useRef, useEffect, useState } from 'react'; 
mapboxgl.accessToken = 'pk.eyJ1IjoibXJhbHBhY2EiLCJhIjoiY2pyYmV5dWg4MTJheDQzcGNxeGtleWx0bCJ9.SwBpLsVT9FGuA9JoEHg60w';

function Map() {
    const mapContainer = useRef(null);
    const map = useRef(null);
    //map = useState()
    const [lng, setLng] = useState(-70.9);
    const [lat, setLat] = useState(42.35);
    const [zoom, setZoom] = useState(9);
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
            map.current.addSource('jackson', {type: "geojson", data: "http://127.0.0.1:5000/api/county_boundaries/Jackson"});
            // Add a new layer to visualize the polygon.
        map.current.addLayer({
            'id': 'jackson',
            'type': 'fill',
            'source': 'jackson', // reference the data source
            'layout': {},
            'paint': {
            'fill-color': '#0080ff', // blue color fill
            'fill-opacity': 0.1
            }
            });
            // Add a black outline around the polygon.
            map.current.addLayer({
            'id': 'outline',
            'type': 'line',
            'source': 'jackson',
            'layout': {},
            'paint': {
            'line-color': '#000',
            'line-width': 3
            }
            });
            map.current.addSource('scioto', {type: "geojson", data: "http://127.0.0.1:5000/api/county_boundaries/Scioto"});
                // Add a new layer to visualize the polygon.
            map.current.addLayer({
                'id': 'scioto',
                'type': 'fill',
                'source': 'scioto', // reference the data source
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
                'source': 'scioto',
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
            map.current.addSource('places', {type:"geojson", data:"http://127.0.0.1:5000/api/NPPES"});
            map.current.addLayer({
            'id': 'places',
            'type': 'symbol',
            'source': 'places',
            'layout': {
            
                    'icon-image': 'custom-marker',
                    'icon-allow-overlap': true
            }  
            });
            map.current.addSource('places2', {type:"geojson", data:"http://127.0.0.1:5000/api/Project_Down"});
            map.current.addLayer({
            'id': 'places2',
            'type': 'symbol',
            'source': 'places2',
            'layout': {
            
                    'icon-image': 'custom-marker',
                    'icon-allow-overlap': true
            }  
            });
            map.current.addSource('places3', {type:"geojson", data:"http://127.0.0.1:5000/api/SAMASA"});
            map.current.addLayer({
            'id': 'places3',
            'type': 'symbol',
            'source': 'places3',
            'layout': {
            
                    'icon-image': 'custom-marker',
                    'icon-allow-overlap': true
            }  
            });
        });

        });
        map.current.on('click', 'places', (e) => {

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
            map.current.on('click', 'places2', (e) => {

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
                map.current.on('click', 'places3', (e) => {

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
        /*
    useEffect(() => {
        if (!map.current) return;
        map.current.on(''

        )
    }

    )*/
    return (
        <div>
        <div ref={mapContainer} className="map-container" />
        </div>
    );
}

export default Map;
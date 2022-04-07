import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import React, { useRef, useEffect, useState } from 'react'; 
mapboxgl.accessToken = 'pk.eyJ1IjoibXJhbHBhY2EiLCJhIjoiY2pyYmV5dWg4MTJheDQzcGNxeGtleWx0bCJ9.SwBpLsVT9FGuA9JoEHg60w';

function Map() {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(-70.9);
    const [lat, setLat] = useState(42.35);
    const [zoom, setZoom] = useState(9);
    useEffect(() => {
        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [-82.994149, 39.965160],
        zoom: zoom
        });
        });
        useEffect(() => {
        if (!map.current) return;
        map.current.on('load', () => {
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
        });

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
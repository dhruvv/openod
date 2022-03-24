import logo from './logo.svg';
import './App.css';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import React, { useRef, useEffect, useState } from 'react'; 
mapboxgl.accessToken = 'pk.eyJ1IjoibXJhbHBhY2EiLCJhIjoiY2pyYmV5dWg4MTJheDQzcGNxeGtleWx0bCJ9.SwBpLsVT9FGuA9JoEHg60w';

function App() {
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
      center: [lng, lat],
      zoom: zoom
    });
    });
  useEffect(() => {
    if (!map.current) return;
    map.current.on(''

    )
  }

  )
  return (
    <div>
      <div ref={mapContainer} className="map-container" />
    </div>
  );
}

export default App;

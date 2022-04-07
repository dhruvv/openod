import logo from './logo.svg';
import './App.css';
//import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
//import React, { useRef, useEffect, useState } from 'react'; 
//mapboxgl.accessToken = 'pk.eyJ1IjoibXJhbHBhY2EiLCJhIjoiY2pyYmV5dWg4MTJheDQzcGNxeGtleWx0bCJ9.SwBpLsVT9FGuA9JoEHg60w';
import Map from './Map';

function App() {

  return (
    <div>
      <Map />
    </div>
  );
}

export default App;

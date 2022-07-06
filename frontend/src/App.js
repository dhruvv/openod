import logo from './logo.svg';
import './App.css';
import React, { useRef, useEffect, useState } from 'react'; 
//import Map from './components/Map';
import PersistentDrawerLeft from './Sidebar';
import LoadingModal from './components/LoadingModal';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
mapboxgl.accessToken = 'pk.eyJ1IjoibXJhbHBhY2EiLCJhIjoiY2pyYmV5dWg4MTJheDQzcGNxeGtleWx0bCJ9.SwBpLsVT9FGuA9JoEHg60w';
var nibrsData, nibrsYear;
var loadedCount = 0;

function App() {

  const [modalOpen, setModalOpen] = useState(false);
  
  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

  //var nibrsData = {"Scioto":"Loading data...", "Jackson":"Loading data..."};
  // This array defines whether a layer should be shown or not
  var visibilityArray = {"NPPES":"visible", 
                        "SAMASA":"visible", 
                        "Project_Down":"visible", 
                        "Jackson":"visible", 
                        "Scioto":"visible",
                        "zipcodes":"visible",
                        "NIBRS":"visible"
  };
  const matchArrays = () => {

  }

  const isUserDefinedLayer = (e) => {
    const keys = Object.keys(visibilityArray);
    const sourceID = e["sourceId"]
    for (var i = 0; i < keys.length; i++) {
      if (sourceID == keys[i] && e["isSourceLoaded"])  {
        return true;
      }
    }
    return false;
  }
  // Called by checkbox on / off 
  const callbackFunction = (paramName) => {
    const updatedArray = {...visibilityArray};
    if (visibilityArray[paramName] == "visible"){
      visibilityArray[paramName] = "none";
    } else {
      visibilityArray[paramName] = "visible";
    }
    const keys = Object.keys(visibilityArray);
    for (var i = 0; i < keys.length; i++) {
      // If we are dealing with county boundary. update fill and outline layers since they are separate
      if (keys[i] == "Jackson" || keys[i] == "Scioto" || keys[i] == "zipcodes") {
        map.current.setLayoutProperty(keys[i], "visibility", visibilityArray[keys[i]]);
        map.current.setLayoutProperty(keys[i]+"Outline", "visibility", visibilityArray[keys[i]]);
      } else { // Otherwise, set layer to visible or not
        map.current.setLayoutProperty(keys[i], "visibility", visibilityArray[keys[i]]);
        console.log(`Set property ${keys[i]} to ${visibilityArray[keys[i]]}`);
      }
    }
  }  
  const updateNibrsCallback = (event, year, toSetModalClose) => {
    console.log(year);
    nibrsYear = year;
    if (!toSetModalClose) {
      setModalOpen(true);   
      fetch("http://127.0.0.1:5000/api/NIBRS/"+year)
              .then(response => response.json())
              .then(data => nibrsData = {...JSON.parse(data)})
              .then(() => setModalOpen(false));
    }else{
      fetch("http://127.0.0.1:5000/api/NIBRS/"+year)
      .then(response => response.json())
      .then(data => nibrsData = {...JSON.parse(data)})
    }
    
  }

  //const updateZOrderCallback = ()
  const mapContainer = useRef(null);
    const map = useRef(null);
    const [zoom, setZoom] = useState(9);
    //const [value, setValue] = useState(props.visibilityArray);
    
    useEffect(() => {
        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [-82.636, 39.052],
        zoom: zoom
        // hotel: trivago 
        });
    });
    useEffect(() => {
        if (!map.current) return;
        map.current.on('load', () => { 
            updateNibrsCallback(0, 2012);
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
            map.current.addSource('Jackson', {type: "geojson", data: "http://127.0.0.1:5000/api/county_boundaries/Jackson"});
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
                'id': 'JacksonOutline',
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
                    'id': 'SciotoOutline',
                    'type': 'line',
                    'source': 'Scioto',
                    'layout': {},
                    'paint': {
                    'line-color': '#000',
                    'line-width': 3
                    }
                  });
            map.current.addSource('zipcodes', {type: "geojson", data:"http://127.0.0.1:5000/api/zipcode_boundaries"});
            map.current.addLayer({
              'id': 'zipcodesOutline',
              'type': 'line',
              'source': 'zipcodes',
              'layout': {},
              'paint': {
              'line-color': '#808080',
              'line-width': 1
              }
            });
            //map.current.addSource('zipcodes', {type: "geojson", data:"http://127.0.0.1:5000/api/zipcode_boundaries"});
            map.current.addLayer({
              'id': 'zipcodes',
              'type': 'fill',
              'source': 'zipcodes', // reference the data source
              'layout': {},
              'paint': {
              'fill-color': '#00FF00', // blue color fill
              'fill-opacity': 0.1
              }
              });

        });

        });
      const jPopup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
      });
     
      map.current.on('mouseenter', "Jackson", (e) => {
        //const coordinates = e.features[0].geometry.coordinates.slice();
        //console.log(nibrsData);
        const description = "Jackson County\n"+nibrsData["Jackson"]+"\n"+nibrsYear;
        //console.log(e.lngLat.wrap());
        const coordinates = [e.lngLat.wrap()['lng'], e.lngLat.wrap()['lat']];
        /*
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }*/
        jPopup.setLngLat(coordinates).setHTML(description).addTo(map.current);
      });
      map.current.on('mouseleave', "Jackson", (e) => {
        jPopup.remove();
      });
      map.current.on('mouseenter', "Scioto", (e) => {
        //const coordinates = e.features[0].geometry.coordinates.slice();
        const description = "Scioto County\n"+nibrsData["Scioto"]+"\n"+nibrsYear
        //console.log(e.lngLat.wrap());
        const coordinates = [e.lngLat.wrap()['lng'], e.lngLat.wrap()['lat']];
        /*
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }*/
        jPopup.setLngLat(coordinates).setHTML(description).addTo(map.current);
      });
      map.current.on('mouseleave', "Scioto", (e) => {
        jPopup.remove();
      });

      const zPopup = new mapboxgl.Popup();
      map.current.on('click', "zipcodes", (e) => {
        //const coordinates = e.features[0].geometry.coordinates.slice();
        const description = e.features[0].properties.ZCTA5CE10; 
        //console.log(e.lngLat.wrap()); ZCTA5CE10
        const coordinates = [e.lngLat.wrap()['lng'], e.lngLat.wrap()['lat']];
        /*
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }*/
        zPopup.setLngLat(coordinates).setHTML(description).addTo(map.current);
      });

      map.current.on('click', 'NPPES', (e) => {

          const coordinates = e.features[0].gaeometry.coordinates.slice();
          const description = e.features[0].properties.NAME1 + " NPPES";
          
       
          //console.log(coordinates);
             
          new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(description)
            .addTo(map.current);
        });
            map.current.on('click', 'Project_Down', (e) => {

                const coordinates = e.features[0].geometry.coordinates.slice();
                const description = e.features[0].properties.NAME1 + " PD";
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
                    const description = e.features[0].properties.NAME1 + " SAMASA";
                    //console.log(e.features)
                     
                    
                    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                    }
                     
                    new mapboxgl.Popup()
                    .setLngLat(coordinates)
                    .setHTML(description)
                    .addTo(map.current);
                    });
    map.current.on('sourcedata', (e) => {
      var loadedArray;
      const keys = Object.keys(visibilityArray);
      //cdcsxcconsole.log("Calling loaded event");
      console.log(e);
      if (isUserDefinedLayer(e)) { 
        loadedCount++;
        loadedArray.append(e["sourceId"]);
        console.log((e["sourceId"]));
        if(loadedArray.sort().join(',')=== keys.sort().join(',')){
          setModalOpen(false);
        }
      }
    }
    
    )
                
                
    });
    const eleJSON = {};
    return (
      <div>
        <PersistentDrawerLeft callback={callbackFunction} nCallback={updateNibrsCallback} vArray={visibilityArray} eleJSON={eleJSON}/>
        <LoadingModal modalOpen={modalOpen} handleModalClose={handleModalClose} />
        <div ref={mapContainer} className="map-container" />
      </div>
    );
}
// visibilityArray={visibilityArray}
export default App;

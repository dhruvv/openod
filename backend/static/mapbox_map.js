mapboxgl.accessToken = 'pk.eyJ1IjoibXJhbHBhY2EiLCJhIjoiY2pyYmV5dWg4MTJheDQzcGNxeGtleWx0bCJ9.SwBpLsVT9FGuA9JoEHg60w';
    const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [-82.994149, 39.965160],
    zoom: 11.15
});

map.on('load', () => {
    
    map.loadImage('https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png',
    (error, image) => {
    if (error) throw error;
    map.addImage('custom-marker', image);
    map.addSource('places', {type:"geojson", data:"api/NPPES"});    
    map.addLayer({
        'id': 'places',
        'type': 'symbol',
        'source': 'places',
        'layout': {
        
                'icon-image': 'custom-marker',
                'icon-allow-overlap': true
    }  
    });}

);

});

map.on('click', 'places', (e) => {

    const coordinates = e.features[0].geometry.coordinates.slice();
    const description = e.features[0].properties.description;
     
    
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }
     
    new mapboxgl.Popup()
    .setLngLat(coordinates)
    .setHTML(description)
    .addTo(map);
    });
     
    map.on('mouseenter', 'places', () => {
    map.getCanvas().style.cursor = 'pointer';
    });
    
    map.on('mouseleave', 'places', () => {
    map.getCanvas().style.cursor = '';
});

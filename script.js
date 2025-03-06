mapboxgl.accessToken = 'pk.eyJ1Ijoia2VsbHlrZWxseTciLCJhIjoiY202aWNjdDE5MDcwbTJrcHppYWw5ZjJzcCJ9.pry2p-gu8qXteiF0TWa4dw';

const map = new mapboxgl.Map({
    container: 'toronto-shootings-map', // Specify the container ID
    style:
       'mapbox://styles/kellykelly7/cm7vfa21q006401s06g2ehayf', // Specify which map style to use
    center: [-79.41630000, 43.70011000], // Specify the starting position [lng, lat]
    zoom: 10 // Specify the starting zoom
});

map.on('load', () => {
    map.addSource('neighbourhoods', {
        'type': 'vector',
        'url': 'mapbox://kellykelly7.4yezgnse'
    });

    map.addLayer({
        'id': 'neighbourhoods_toronto',
        'type': 'fill',
        'source': 'neighbourhoods',
        'paint': {
            'fill-color': "hsl(73, 72%, 91%)",
            'fill-opacity': 1,
            'fill-outline-color': 'black'
        },
        'source-layer': 'Neighbourhoods_-_4326-dr8i76'
    },
    'shootings_firearms_toronto'
    );

    map.addSource('shootings_firearms', {
        'type': 'vector',
        'url': 'mapbox://kellykelly7.89q0vkys'
    });

    map.addLayer({
        'id': 'shootings_firearms_toronto',
        'type': 'circle',
        'source': 'shootings_firearms',
        'paint': {
            'circle-radius': 5,
            'circle-color': [
                "interpolate",
                ["linear"],
                ["get", "DEATH"],
                0,
                "hsl(266, 86%, 45%)",
                1,
                "hsl(209, 86%, 51%)",
                2,
                "hsl(92, 96%, 51%)",
                3,
                "hsl(0, 98%, 55%)"
              ]
        },
        'source-layer': 'shootings-firearm-discharges_-6s98mw'
    },
    'neighbourhoods_toronto'
    );
});
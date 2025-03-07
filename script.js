mapboxgl.accessToken = 'pk.eyJ1Ijoia2VsbHlrZWxseTciLCJhIjoiY202aWNjdDE5MDcwbTJrcHppYWw5ZjJzcCJ9.pry2p-gu8qXteiF0TWa4dw';

const map = new mapboxgl.Map({
    container: 'toronto-shootings-map', // Specify the container ID
    style:
       'mapbox://styles/kellykelly7/cm7vfa21q006401s06g2ehayf', // Specify which map style to use
    center: [-79.361348, 43.711883], // Specify the starting position [lng, lat]
    zoom: 10 // Specify the starting zoom
});

map.on('load', () => {
    // adding data source from mapbox tileset
    map.addSource('neighbourhoods', {
        'type': 'vector',
        'url': 'mapbox://kellykelly7.4yezgnse' //tileset id
    });
    // visualizing vector tileset 
    map.addLayer({
        'id': 'neighbourhoods_toronto', // layer id
        'type': 'fill', // polygon fill type
        'source': 'neighbourhoods', // data source
        'paint': {
            'fill-color': "hsl(73, 72%, 91%)", // fill colour
            'fill-opacity': 1, // opacity of the fill
            'fill-outline-color': 'black' // outline of the neighbourhoods in this data set
        },
        // tileset name (different from tileset id) from when I created a new tileset on mapbox
        'source-layer': 'Neighbourhoods_-_4326-dr8i76'
    },
    // drawing order -- places this layer below the shootings_firearms layer (point data layer)
    //in this case this data layer is like the basemap for the point data layer
    'shootings_firearms_toronto'
    );
    // adding another data source from mapbox tileset
    map.addSource('shootings_firearms', {
        'type': 'vector',
        'url': 'mapbox://kellykelly7.89q0vkys'
    });
    // visualizing 'shootings_firearms' vector tileset
    map.addLayer({
        'id': 'shootings_firearms_toronto',
        'type': 'circle', // vector point data type
        'source': 'shootings_firearms', // data source
        'paint': {
            'circle-radius': [
                'interpolate',
                ['linear'],
                ['zoom'], // zoom level
                11, 1.5, // when zoom level is 10 or less, circle radius is 2 
                13, 6 // when zoom level is 13 or more, circle radius is 6
            ],
            'circle-color': [
                // colouring the circles based on number of deaths attribute, using 'interpolate' expression to define the linear relationship
                "interpolate", // expression produces continuous results by interpolating between value pairs
                ["linear"], // linear scale expression
                ["get", "DEATH"], // data expression get attribute value
                0, // for value 0, colour is purple
                "hsl(266, 86%, 45%)",
                1, // for value 1, colour is blue
                "hsl(209, 86%, 51%)",
                2, // for value 2, colour is green
                "hsl(92, 96%, 51%)",
                3, // for value 3, colour is red
                "hsl(0, 98%, 55%)"
              ]
        },
        // tileset name (not id) from mapbox tileset
        'source-layer': 'shootings-firearm-discharges_-6s98mw'
    },
    );
});

// adding zoom buttons and rotation control for map
map.addControl(new mapboxgl.NavigationControl());

//Switch cursor to pointer when mouse is over shootings_firearms_toronto layer
map.on('mouseenter', 'shootings_firearms_toronto', () => {
    map.getCanvas().style.cursor = 'pointer'; 
});

//Switch cursor back when mouse leaves shootings_firearms_toronto layer
map.on('mouseleave', 'shootings_firearms_toronto', () => {
    map.getCanvas().style.cursor = ''; 
});

// adding popup on click event for shootings_firearms_toronto layer
map.on('click', 'shootings_firearms_toronto', (e) => {
    new mapboxgl.Popup() //Declare new popup object on each click
        .setLngLat(e.lngLat) //Use method to set coordinates of popup based on mouse click location
        .setHTML("<b>Date of Occurrence: </b> " + e.features[0].properties.OCC_DATE + "<br>" +
            "<b>Time of Occurrence (range): </b>" + e.features[0].properties.OCC_TIME_RANGE + "<br>" +
            "<b>Neighbourhood (158-model): </b>" + e.features[0].properties.NEIGHBOURHOOD_158 + "<br>" +
            "<b>Coordinates: </b>" + e.features[0].geometry.coordinates + "<br>" +
            "<b>Deaths: </b>" + e.features[0].properties.DEATH + "<br>" +
            "<b>Injuries: </b>" + e.features[0].properties.INJURIES + "<br>")//Use click event properties to write text for popup
        .addTo(map); //Show popup on map
});


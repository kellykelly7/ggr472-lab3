mapboxgl.accessToken = 'pk.eyJ1Ijoia2VsbHlrZWxseTciLCJhIjoiY202aWNjdDE5MDcwbTJrcHppYWw5ZjJzcCJ9.pry2p-gu8qXteiF0TWa4dw';

// create a new map
const map = new mapboxgl.Map({
    container: 'toronto-shootings-map', // container id from html
    style:
       'mapbox://styles/kellykelly7/cm7y9wzv600vw01saejijeyfm', // map style for basemap
    center: [-79.347212, 43.720271], // starting position [longitude, latitude]
    zoom: 10 // starting zoom extent
});

// adding new data to the newly created map
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
                "#6610d5",
                1, // for value 1, colour is blue
                "#1786ee",
                2, // for value 2, colour is green
                "#7afa0a",
                3, // for value 3, colour is red
                "#fd1c1c"
              ]
        },
        // tileset name (not id) from mapbox tileset
        'source-layer': 'shootings-firearm-discharges_-6s98mw'
    },
    );
});

// adding zoom buttons and rotation control for map
map.addControl(new mapboxgl.NavigationControl(), 'bottom-left');

// adding fullscreen option for map
map.addControl(new mapboxgl.FullscreenControl());

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
        //Use click event properties to write text for popup
        .setHTML("<b>Date of Occurrence: </b> " + e.features[0].properties.OCC_DATE + "<br>" +
            "<b>Time of Occurrence (range): </b>" + e.features[0].properties.OCC_TIME_RANGE + "<br>" +
            "<b>Neighbourhood (158-model): </b>" + e.features[0].properties.NEIGHBOURHOOD_158 + "<br>" +
            "<b>Coordinates: </b>" + e.features[0].geometry.coordinates + "<br>" +
            "<b>Deaths: </b>" + e.features[0].properties.DEATH + "<br>" +
            "<b>Injuries: </b>" + e.features[0].properties.INJURIES + "<br>")
        .addTo(map); //Show popup on map
});

//Add search control to map overlay
map.addControl(
    new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl,
        // search will only find locations in Canada
        countries: "ca" 
    // modifies position of geocoder on map
    }), "top-left"
);

// add function to the return button with flyto, bringing us back to our original zoom and center point
document.getElementById('returnbutton').addEventListener('click', () => {
    map.flyTo({
        center: [-79.347212, 43.720271],
        zoom: 10,
        essential: true
    });
});

// declare legend labels 
const legendlabels = [
    '0 deaths',
    '1 death',
    '2 deaths',
    '3 deaths',
];

// declare legend colours 
const legendcolours = [
    "#6610d5",
    "#1786ee",
    "#7afa0a",
    "#fd1c1c",
];

//Declare legend variable using legend div tag
const legend = document.getElementById('legend');

//For each layer create a block to put the colour and label in
legendlabels.forEach((label, i) => {
    const colour = legendcolours[i];

    const item = document.createElement('div'); //each layer gets a 'row'
    const key = document.createElement('span'); //add a 'key' to the row 

    key.className = 'legend-key'; //the key takes on the shape and style properties defined in css
    key.style.backgroundColor = colour; // the background color is retreived from the layers array

    const value = document.createElement('span'); //add a value variable to the 'row' in the legend
    value.innerHTML = `${label}`; //give the value variable text based on the label

    item.appendChild(key); //add the key (colour circle) to the legend row
    item.appendChild(value); //add the value to the legend row

    legend.appendChild(item); //add row to the legend
});

// adding filter for the map
let timevalue;

document.getElementById("timerangefieldset").addEventListener('change',(e) => {   
    timevalue = document.getElementById('timerange').value;
// if the dropdown value is 'All', show all points from the layer
    if (timevalue == 'All') {
        map.setFilter(
            'shootings_firearms_toronto',
            ['has', 'OCC_TIME_RANGE'] // Returns all polygons from layer that have a value in OCC_TIME_RANGE
        );
// if the dropdown value is not 'All', show points that match the dropdown selection
    } else {
        map.setFilter(
            'shootings_firearms_toronto',
            ['==', ['get', 'OCC_TIME_RANGE'], timevalue] // returns points with OCC_TIME_RANGE value that matches dropdown selection
        );
    }
});
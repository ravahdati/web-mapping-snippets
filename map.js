/**
 * Map Display Functions for Node.js
 * Supports multiple map providers: Google Maps, CedarMaps, Neshan, Map.ir, ParsiMap, Mapbox, OSM, Bing, Yandex
 */

/**
 * Show all available map providers
 * @returns {Object} Object containing supported map providers
 */
function showAvailableMaps() {
    return {
        'google': 'Google Maps',
        'cedarmaps': 'CedarMaps (Iran)',
        'neshan': 'Neshan (Iran)',
        'mapir': 'Map.ir (Iran)',
        'parsimap': 'ParsiMap (Iran)',
        'mapbox': 'Mapbox',
        'osm': 'OpenStreetMap',
        'bing': 'Bing Maps',
        'yandex': 'Yandex Maps'
    };
}

/**
 * Display Map based on provider
 * @param {number} latitude - Latitude coordinate
 * @param {number} longitude - Longitude coordinate
 * @param {string} provider - Map provider (google, cedarmaps, neshan, mapir, parsimap, mapbox, osm, bing, yandex)
 * @returns {string} HTML string to render the map
 */
function displayMapWithLocation(latitude, longitude, provider = 'google') {
    let html = `<div id='map' style='width: 100%; height: 400px;'></div>`;

    switch (provider.toLowerCase()) {
        case 'google':
            html += `
            <script>
                function initMap() {
                  var location = {lat: ${latitude}, lng: ${longitude}};
                  var map = new google.maps.Map(document.getElementById('map'), {
                    zoom: 15,
                    center: location
                  });
                  var marker = new google.maps.Marker({
                    position: location,
                    map: map
                  });
                }
            </script>
            <script src='https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_API_KEY&callback=initMap' async defer></script>
            `;
            break;

        case 'cedarmaps':
            html += `
            <link href='https://api.cedarmaps.com/cedarmaps.js/v1.8.1/cedarmaps.css' rel='stylesheet' />
            <script src='https://api.cedarmaps.com/cedarmaps.js/v1.8.1/cedarmaps.js'></script>
            <script>
                L.cedarmaps.accessToken = 'YOUR_CEDAR_ACCESS_TOKEN';
                var map = L.cedarmaps.map('map', 'https://api.cedarmaps.com/v1/tiles/cedarmaps.streets.json?access_token=YOUR_CEDAR_ACCESS_TOKEN', {
                  center: [${latitude}, ${longitude}],
                  zoom: 15
                });
                var marker = L.marker([${latitude}, ${longitude}]).addTo(map);
            </script>
            `;
            break;

        case 'neshan':
            html += `
            <link href='https://static.neshan.org/sdk/leaflet/1.4.0/leaflet.css' rel='stylesheet' type='text/css'>
            <script src='https://static.neshan.org/sdk/leaflet/1.4.0/leaflet.js' type='text/javascript'></script>
            <script>
                var map = new L.Map('map', {
                    key: 'YOUR_NESHAN_API_KEY',
                    maptype: 'dreamy',
                    poi: true,
                    traffic: false,
                    center: [${latitude}, ${longitude}],
                    zoom: 14
                });
                var marker = L.marker([${latitude}, ${longitude}]).addTo(map);
            </script>
            `;
            break;

        case 'mapir':
            html += `
            <script src='https://cdn.map.ir/web-sdk/1.4.2/mapbox-gl.js'></script>
            <link rel='stylesheet' href='https://cdn.map.ir/web-sdk/1.4.2/mapbox-gl.css' />
            <script>
                mapboxgl.accessToken = 'YOUR_MAPIR_ACCESS_TOKEN';
                var map = new mapboxgl.Map({
                  container: 'map',
                  style: 'https://map.ir/vector/styles/main/mapir-xyz-light-style.json',
                  center: [${longitude}, ${latitude}],
                  zoom: 15
                });
                new mapboxgl.Marker().setLngLat([${longitude}, ${latitude}]).addTo(map);
            </script>
            `;
            break;

        case 'parsimap':
            html += `
            <script src='https://api.parsimap.com/web/v1/js/main.js'></script>
            <script>
                var map = L.map('map').setView([${latitude}, ${longitude}], 15);
                L.tileLayer('https://api.parsimap.com/tile/parsimap-streets-v1/{z}/{x}/{y}.png?key=YOUR_PARSIMAP_KEY', {
                    maxZoom: 18,
                }).addTo(map);
                var marker = L.marker([${latitude}, ${longitude}]).addTo(map);
            </script>
            `;
            break;

        case 'mapbox':
            html += `
            <script src='https://api.mapbox.com/mapbox-gl-js/v2.5.0/mapbox-gl.js'></script>
            <link href='https://api.mapbox.com/mapbox-gl-js/v2.5.0/mapbox-gl.css' rel='stylesheet' />
            <script>
                mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN';
                var map = new mapboxgl.Map({
                  container: 'map',
                  style: 'mapbox://styles/mapbox/streets-v11',
                  center: [${longitude}, ${latitude}],
                  zoom: 15
                });
                new mapboxgl.Marker().setLngLat([${longitude}, ${latitude}]).addTo(map);
            </script>
            `;
            break;

        case 'osm':
            html += `
            <link rel='stylesheet' href='https://unpkg.com/leaflet@1.7.1/dist/leaflet.css' />
            <script src='https://unpkg.com/leaflet@1.7.1/dist/leaflet.js'></script>
            <script>
                var map = L.map('map').setView([${latitude}, ${longitude}], 15);
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                  maxZoom: 19,
                  attribution: '© OpenStreetMap contributors'
                }).addTo(map);
                var marker = L.marker([${latitude}, ${longitude}]).addTo(map);
            </script>
            `;
            break;

        case 'bing':
            html += `
            <script type='text/javascript' src='https://www.bing.com/api/maps/mapcontrol?callback=GetMap&key=YOUR_BING_MAPS_KEY' async defer></script>
            <script>
                function GetMap() {
                    var map = new Microsoft.Maps.Map('#map', {
                        center: new Microsoft.Maps.Location(${latitude}, ${longitude}),
                        zoom: 15
                    });
                    var center = map.getCenter();
                    var pin = new Microsoft.Maps.Pushpin(center, {
                        title: 'Location'
                    });
                    map.entities.push(pin);
                }
            </script>
            `;
            break;

        case 'yandex':
            html += `
            <script src='https://api-maps.yandex.ru/2.1/?apikey=YOUR_YANDEX_API_KEY&lang=en_US' type='text/javascript'></script>
            <script>
                ymaps.ready(init);
                function init(){
                    var myMap = new ymaps.Map('map', {
                        center: [${latitude}, ${longitude}],
                        zoom: 15
                    });
                    var myPlacemark = new ymaps.Placemark([${latitude}, ${longitude}], {
                        hintContent: 'Location',
                        balloonContent: 'Selected Location'
                    });
                    myMap.geoObjects.add(myPlacemark);
                }
            </script>
            `;
            break;

        default:
            html += `<p>Provider not supported.</p>`;
            break;
    }

    return html;
}

// Export for Node.js/CommonJS
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        showAvailableMaps,
        displayMapWithLocation
    };
}

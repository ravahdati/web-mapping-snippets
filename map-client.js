/**
 * Map Display Functions for Pure JavaScript (Client-side)
 * Supports multiple map providers: Google Maps, CedarMaps, Neshan, Map.ir, ParsiMap, Mapbox, OSM, Bing, Yandex
 *
 * Usage:
 * const mapRenderer = new MapRenderer('map-container-id');
 * mapRenderer.displayMap(35.6892, 51.3890, 'google');
 */

class MapRenderer {
    /**
     * Constructor
     * @param {string} containerId - ID of the container element for the map
     */
    constructor(containerId = 'map') {
        this.containerId = containerId;
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error(`Container with ID "${containerId}" not found`);
        }
    }

    /**
     * Get all available map providers
     * @returns {Object} Object containing supported map providers
     */
    static getAvailableMaps() {
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
     * Load external script dynamically
     * @param {string} src - Script source URL
     * @param {Function} callback - Callback function after script loads
     */
    loadScript(src, callback) {
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.defer = true;
        script.onload = callback;
        document.head.appendChild(script);
    }

    /**
     * Load external CSS dynamically
     * @param {string} href - CSS source URL
     */
    loadCSS(href) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        document.head.appendChild(link);
    }

    /**
     * Display map with Google Maps
     * @param {number} latitude - Latitude coordinate
     * @param {number} longitude - Longitude coordinate
     */
    displayGoogleMap(latitude, longitude) {
        this.loadScript(
            'https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_API_KEY',
            () => {
                const location = { lat: latitude, lng: longitude };
                const map = new google.maps.Map(this.container, {
                    zoom: 15,
                    center: location
                });
                new google.maps.Marker({
                    position: location,
                    map: map
                });
            }
        );
    }

    /**
     * Display map with CedarMaps
     * @param {number} latitude - Latitude coordinate
     * @param {number} longitude - Longitude coordinate
     */
    displayCedarMaps(latitude, longitude) {
        this.loadCSS('https://api.cedarmaps.com/cedarmaps.js/v1.8.1/cedarmaps.css');
        this.loadScript(
            'https://api.cedarmaps.com/cedarmaps.js/v1.8.1/cedarmaps.js',
            () => {
                L.cedarmaps.accessToken = 'YOUR_CEDAR_ACCESS_TOKEN';
                const map = L.cedarmaps.map(
                    this.containerId,
                    'https://api.cedarmaps.com/v1/tiles/cedarmaps.streets.json?access_token=YOUR_CEDAR_ACCESS_TOKEN',
                    {
                        center: [latitude, longitude],
                        zoom: 15
                    }
                );
                L.marker([latitude, longitude]).addTo(map);
            }
        );
    }

    /**
     * Display map with Neshan
     * @param {number} latitude - Latitude coordinate
     * @param {number} longitude - Longitude coordinate
     */
    displayNeshanMap(latitude, longitude) {
        this.loadCSS('https://static.neshan.org/sdk/leaflet/1.4.0/leaflet.css');
        this.loadScript(
            'https://static.neshan.org/sdk/leaflet/1.4.0/leaflet.js',
            () => {
                const map = new L.Map(this.containerId, {
                    key: 'YOUR_NESHAN_API_KEY',
                    maptype: 'dreamy',
                    poi: true,
                    traffic: false,
                    center: [latitude, longitude],
                    zoom: 14
                });
                L.marker([latitude, longitude]).addTo(map);
            }
        );
    }

    /**
     * Display map with Map.ir
     * @param {number} latitude - Latitude coordinate
     * @param {number} longitude - Longitude coordinate
     */
    displayMapir(latitude, longitude) {
        this.loadCSS('https://cdn.map.ir/web-sdk/1.4.2/mapbox-gl.css');
        this.loadScript(
            'https://cdn.map.ir/web-sdk/1.4.2/mapbox-gl.js',
            () => {
                mapboxgl.accessToken = 'YOUR_MAPIR_ACCESS_TOKEN';
                const map = new mapboxgl.Map({
                    container: this.containerId,
                    style: 'https://map.ir/vector/styles/main/mapir-xyz-light-style.json',
                    center: [longitude, latitude],
                    zoom: 15
                });
                new mapboxgl.Marker().setLngLat([longitude, latitude]).addTo(map);
            }
        );
    }

    /**
     * Display map with ParsiMap
     * @param {number} latitude - Latitude coordinate
     * @param {number} longitude - Longitude coordinate
     */
    displayParsiMap(latitude, longitude) {
        this.loadScript(
            'https://api.parsimap.com/web/v1/js/main.js',
            () => {
                const map = L.map(this.containerId).setView([latitude, longitude], 15);
                L.tileLayer(
                    'https://api.parsimap.com/tile/parsimap-streets-v1/{z}/{x}/{y}.png?key=YOUR_PARSIMAP_KEY',
                    { maxZoom: 18 }
                ).addTo(map);
                L.marker([latitude, longitude]).addTo(map);
            }
        );
    }

    /**
     * Display map with Mapbox
     * @param {number} latitude - Latitude coordinate
     * @param {number} longitude - Longitude coordinate
     */
    displayMapbox(latitude, longitude) {
        this.loadCSS('https://api.mapbox.com/mapbox-gl-js/v2.5.0/mapbox-gl.css');
        this.loadScript(
            'https://api.mapbox.com/mapbox-gl-js/v2.5.0/mapbox-gl.js',
            () => {
                mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN';
                const map = new mapboxgl.Map({
                    container: this.containerId,
                    style: 'mapbox://styles/mapbox/streets-v11',
                    center: [longitude, latitude],
                    zoom: 15
                });
                new mapboxgl.Marker().setLngLat([longitude, latitude]).addTo(map);
            }
        );
    }

    /**
     * Display map with OpenStreetMap
     * @param {number} latitude - Latitude coordinate
     * @param {number} longitude - Longitude coordinate
     */
    displayOSM(latitude, longitude) {
        this.loadCSS('https://unpkg.com/leaflet@1.7.1/dist/leaflet.css');
        this.loadScript(
            'https://unpkg.com/leaflet@1.7.1/dist/leaflet.js',
            () => {
                const map = L.map(this.containerId).setView([latitude, longitude], 15);
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    maxZoom: 19,
                    attribution: '© OpenStreetMap contributors'
                }).addTo(map);
                L.marker([latitude, longitude]).addTo(map);
            }
        );
    }

    /**
     * Display map with Bing Maps
     * @param {number} latitude - Latitude coordinate
     * @param {number} longitude - Longitude coordinate
     */
    displayBingMap(latitude, longitude) {
        window.GetMap = () => {
            const map = new Microsoft.Maps.Map(`#${this.containerId}`, {
                center: new Microsoft.Maps.Location(latitude, longitude),
                zoom: 15
            });
            const pin = new Microsoft.Maps.Pushpin(map.getCenter(), {
                title: 'Location'
            });
            map.entities.push(pin);
        };
        this.loadScript(
            'https://www.bing.com/api/maps/mapcontrol?callback=GetMap&key=YOUR_BING_MAPS_KEY'
        );
    }

    /**
     * Display map with Yandex Maps
     * @param {number} latitude - Latitude coordinate
     * @param {number} longitude - Longitude coordinate
     */
    displayYandexMap(latitude, longitude) {
        this.loadScript(
            'https://api-maps.yandex.ru/2.1/?apikey=YOUR_YANDEX_API_KEY&lang=en_US',
            () => {
                ymaps.ready(() => {
                    const myMap = new ymaps.Map(this.containerId, {
                        center: [latitude, longitude],
                        zoom: 15
                    });
                    const myPlacemark = new ymaps.Placemark([latitude, longitude], {
                        hintContent: 'Location',
                        balloonContent: 'Selected Location'
                    });
                    myMap.geoObjects.add(myPlacemark);
                });
            }
        );
    }

    /**
     * Display map based on provider
     * @param {number} latitude - Latitude coordinate
     * @param {number} longitude - Longitude coordinate
     * @param {string} provider - Map provider name
     */
    displayMap(latitude, longitude, provider = 'google') {
        if (!this.container) {
            console.error('Container element not found');
            return;
        }

        this.container.style.width = '100%';
        this.container.style.height = '400px';

        switch (provider.toLowerCase()) {
            case 'google':
                this.displayGoogleMap(latitude, longitude);
                break;
            case 'cedarmaps':
                this.displayCedarMaps(latitude, longitude);
                break;
            case 'neshan':
                this.displayNeshanMap(latitude, longitude);
                break;
            case 'mapir':
                this.displayMapir(latitude, longitude);
                break;
            case 'parsimap':
                this.displayParsiMap(latitude, longitude);
                break;
            case 'mapbox':
                this.displayMapbox(latitude, longitude);
                break;
            case 'osm':
                this.displayOSM(latitude, longitude);
                break;
            case 'bing':
                this.displayBingMap(latitude, longitude);
                break;
            case 'yandex':
                this.displayYandexMap(latitude, longitude);
                break;
            default:
                this.container.innerHTML = '<p>Provider not supported.</p>';
        }
    }
}

// Make it available globally
if (typeof window !== 'undefined') {
    window.MapRenderer = MapRenderer;
}

package com.example.mapping;

import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;

/**
 * Map Display Service for Java/Spring Boot
 * Supports multiple map providers: Google Maps, CedarMaps, Neshan, Map.ir, ParsiMap, Mapbox, OSM, Bing, Yandex
 *
 * Usage in Controller:
 * @Autowired
 * private MapService mapService;
 *
 * String mapHtml = mapService.displayMapWithLocation(35.6892, 51.3890, "google");
 */
@Service
public class MapService {

    /**
     * Show all available map providers
     *
     * @return Map of supported providers
     */
    public Map<String, String> showAvailableMaps() {
        Map<String, String> providers = new HashMap<>();
        providers.put("google", "Google Maps");
        providers.put("cedarmaps", "CedarMaps (Iran)");
        providers.put("neshan", "Neshan (Iran)");
        providers.put("mapir", "Map.ir (Iran)");
        providers.put("parsimap", "ParsiMap (Iran)");
        providers.put("mapbox", "Mapbox");
        providers.put("osm", "OpenStreetMap");
        providers.put("bing", "Bing Maps");
        providers.put("yandex", "Yandex Maps");
        return providers;
    }

    /**
     * Display Map based on provider
     *
     * @param latitude  Latitude coordinate
     * @param longitude Longitude coordinate
     * @param provider  Map provider name
     * @return HTML string to render the map
     */
    public String displayMapWithLocation(double latitude, double longitude, String provider) {
        if (provider == null || provider.isEmpty()) {
            provider = "google";
        }

        StringBuilder html = new StringBuilder();
        html.append("<div id='map' style='width: 100%; height: 400px;'></div>");

        switch (provider.toLowerCase()) {
            case "google":
                html.append(String.format(
                    "<script>\n" +
                    "    function initMap() {\n" +
                    "      var location = {lat: %f, lng: %f};\n" +
                    "      var map = new google.maps.Map(document.getElementById('map'), {\n" +
                    "        zoom: 15,\n" +
                    "        center: location\n" +
                    "      });\n" +
                    "      var marker = new google.maps.Marker({\n" +
                    "        position: location,\n" +
                    "        map: map\n" +
                    "      });\n" +
                    "    }\n" +
                    "</script>\n" +
                    "<script src='https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_API_KEY&callback=initMap' async defer></script>",
                    latitude, longitude
                ));
                break;

            case "cedarmaps":
                html.append(String.format(
                    "<link href='https://api.cedarmaps.com/cedarmaps.js/v1.8.1/cedarmaps.css' rel='stylesheet' />\n" +
                    "<script src='https://api.cedarmaps.com/cedarmaps.js/v1.8.1/cedarmaps.js'></script>\n" +
                    "<script>\n" +
                    "    L.cedarmaps.accessToken = 'YOUR_CEDAR_ACCESS_TOKEN';\n" +
                    "    var map = L.cedarmaps.map('map', 'https://api.cedarmaps.com/v1/tiles/cedarmaps.streets.json?access_token=YOUR_CEDAR_ACCESS_TOKEN', {\n" +
                    "      center: [%f, %f],\n" +
                    "      zoom: 15\n" +
                    "    });\n" +
                    "    var marker = L.marker([%f, %f]).addTo(map);\n" +
                    "</script>",
                    latitude, longitude, latitude, longitude
                ));
                break;

            case "neshan":
                html.append(String.format(
                    "<link href='https://static.neshan.org/sdk/leaflet/1.4.0/leaflet.css' rel='stylesheet' type='text/css'>\n" +
                    "<script src='https://static.neshan.org/sdk/leaflet/1.4.0/leaflet.js' type='text/javascript'></script>\n" +
                    "<script>\n" +
                    "    var map = new L.Map('map', {\n" +
                    "        key: 'YOUR_NESHAN_API_KEY',\n" +
                    "        maptype: 'dreamy',\n" +
                    "        poi: true,\n" +
                    "        traffic: false,\n" +
                    "        center: [%f, %f],\n" +
                    "        zoom: 14\n" +
                    "    });\n" +
                    "    var marker = L.marker([%f, %f]).addTo(map);\n" +
                    "</script>",
                    latitude, longitude, latitude, longitude
                ));
                break;

            case "mapir":
                html.append(String.format(
                    "<script src='https://cdn.map.ir/web-sdk/1.4.2/mapbox-gl.js'></script>\n" +
                    "<link rel='stylesheet' href='https://cdn.map.ir/web-sdk/1.4.2/mapbox-gl.css' />\n" +
                    "<script>\n" +
                    "    mapboxgl.accessToken = 'YOUR_MAPIR_ACCESS_TOKEN';\n" +
                    "    var map = new mapboxgl.Map({\n" +
                    "      container: 'map',\n" +
                    "      style: 'https://map.ir/vector/styles/main/mapir-xyz-light-style.json',\n" +
                    "      center: [%f, %f],\n" +
                    "      zoom: 15\n" +
                    "    });\n" +
                    "    new mapboxgl.Marker().setLngLat([%f, %f]).addTo(map);\n" +
                    "</script>",
                    longitude, latitude, longitude, latitude
                ));
                break;

            case "parsimap":
                html.append(String.format(
                    "<script src='https://api.parsimap.com/web/v1/js/main.js'></script>\n" +
                    "<script>\n" +
                    "    var map = L.map('map').setView([%f, %f], 15);\n" +
                    "    L.tileLayer('https://api.parsimap.com/tile/parsimap-streets-v1/{z}/{x}/{y}.png?key=YOUR_PARSIMAP_KEY', {\n" +
                    "        maxZoom: 18,\n" +
                    "    }).addTo(map);\n" +
                    "    var marker = L.marker([%f, %f]).addTo(map);\n" +
                    "</script>",
                    latitude, longitude, latitude, longitude
                ));
                break;

            case "mapbox":
                html.append(String.format(
                    "<script src='https://api.mapbox.com/mapbox-gl-js/v2.5.0/mapbox-gl.js'></script>\n" +
                    "<link href='https://api.mapbox.com/mapbox-gl-js/v2.5.0/mapbox-gl.css' rel='stylesheet' />\n" +
                    "<script>\n" +
                    "    mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN';\n" +
                    "    var map = new mapboxgl.Map({\n" +
                    "      container: 'map',\n" +
                    "      style: 'mapbox://styles/mapbox/streets-v11',\n" +
                    "      center: [%f, %f],\n" +
                    "      zoom: 15\n" +
                    "    });\n" +
                    "    new mapboxgl.Marker().setLngLat([%f, %f]).addTo(map);\n" +
                    "</script>",
                    longitude, latitude, longitude, latitude
                ));
                break;

            case "osm":
                html.append(String.format(
                    "<link rel='stylesheet' href='https://unpkg.com/leaflet@1.7.1/dist/leaflet.css' />\n" +
                    "<script src='https://unpkg.com/leaflet@1.7.1/dist/leaflet.js'></script>\n" +
                    "<script>\n" +
                    "    var map = L.map('map').setView([%f, %f], 15);\n" +
                    "    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {\n" +
                    "      maxZoom: 19,\n" +
                    "      attribution: '© OpenStreetMap contributors'\n" +
                    "    }).addTo(map);\n" +
                    "    var marker = L.marker([%f, %f]).addTo(map);\n" +
                    "</script>",
                    latitude, longitude, latitude, longitude
                ));
                break;

            case "bing":
                html.append(String.format(
                    "<script type='text/javascript' src='https://www.bing.com/api/maps/mapcontrol?callback=GetMap&key=YOUR_BING_MAPS_KEY' async defer></script>\n" +
                    "<script>\n" +
                    "    function GetMap() {\n" +
                    "        var map = new Microsoft.Maps.Map('#map', {\n" +
                    "            center: new Microsoft.Maps.Location(%f, %f),\n" +
                    "            zoom: 15\n" +
                    "        });\n" +
                    "        var center = map.getCenter();\n" +
                    "        var pin = new Microsoft.Maps.Pushpin(center, {\n" +
                    "            title: 'Location'\n" +
                    "        });\n" +
                    "        map.entities.push(pin);\n" +
                    "    }\n" +
                    "</script>",
                    latitude, longitude
                ));
                break;

            case "yandex":
                html.append(String.format(
                    "<script src='https://api-maps.yandex.ru/2.1/?apikey=YOUR_YANDEX_API_KEY&lang=en_US' type='text/javascript'></script>\n" +
                    "<script>\n" +
                    "    ymaps.ready(init);\n" +
                    "    function init(){\n" +
                    "        var myMap = new ymaps.Map('map', {\n" +
                    "            center: [%f, %f],\n" +
                    "            zoom: 15\n" +
                    "        });\n" +
                    "        var myPlacemark = new ymaps.Placemark([%f, %f], {\n" +
                    "            hintContent: 'Location',\n" +
                    "            balloonContent: 'Selected Location'\n" +
                    "        });\n" +
                    "        myMap.geoObjects.add(myPlacemark);\n" +
                    "    }\n" +
                    "</script>",
                    latitude, longitude, latitude, longitude
                ));
                break;

            default:
                html.append("<p>Provider not supported.</p>");
        }

        return html.toString();
    }
}

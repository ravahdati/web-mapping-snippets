"""
Map Display Helper for Django
Supports multiple map providers: Google Maps, CedarMaps, Neshan, Map.ir, ParsiMap, Mapbox, OSM, Bing, Yandex

Usage in Django View:
from .map_helper import MapHelper

def my_view(request):
    map_html = MapHelper.display_map_with_location(35.6892, 51.3890, 'google')
    return render(request, 'map.html', {'map_html': map_html})

Usage in Django Template:
{{ map_html|safe }}
"""

from django.utils.safestring import mark_safe
from django.conf import settings


class MapHelper:
    """
    Helper class for rendering map HTML in Django applications
    """

    @staticmethod
    def show_available_maps():
        """
        Show all available map providers

        Returns:
            dict: Dictionary of supported map providers
        """
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
        }

    @staticmethod
    def display_map_with_location(latitude, longitude, provider='google'):
        """
        Display Map based on provider

        Args:
            latitude (float): Latitude coordinate
            longitude (float): Longitude coordinate
            provider (str): Map provider - Options: 'google', 'cedarmaps', 'neshan',
                           'mapir', 'parsimap', 'mapbox', 'osm', 'bing', 'yandex'

        Returns:
            SafeString: HTML string to render the map (Django safe)
        """
        html = f"<div id='map' style='width: 100%; height: 400px;'></div>"

        google_key = getattr(settings, 'GOOGLE_MAPS_API_KEY', 'YOUR_GOOGLE_API_KEY')
        cedar_token = getattr(settings, 'CEDARMAPS_TOKEN', 'YOUR_CEDAR_ACCESS_TOKEN')
        neshan_key = getattr(settings, 'NESHAN_API_KEY', 'YOUR_NESHAN_API_KEY')
        mapir_token = getattr(settings, 'MAPIR_TOKEN', 'YOUR_MAPIR_ACCESS_TOKEN')
        parsimap_key = getattr(settings, 'PARSIMAP_KEY', 'YOUR_PARSIMAP_KEY')
        mapbox_token = getattr(settings, 'MAPBOX_TOKEN', 'YOUR_MAPBOX_ACCESS_TOKEN')
        bing_key = getattr(settings, 'BING_MAPS_KEY', 'YOUR_BING_MAPS_KEY')
        yandex_key = getattr(settings, 'YANDEX_API_KEY', 'YOUR_YANDEX_API_KEY')

        if provider.lower() == 'google':
            html += f"""
            <script>
                function initMap() {{
                  var location = {{lat: {latitude}, lng: {longitude}}};
                  var map = new google.maps.Map(document.getElementById('map'), {{
                    zoom: 15,
                    center: location
                  }});
                  var marker = new google.maps.Marker({{
                    position: location,
                    map: map
                  }});
                }}
            </script>
            <script src='https://maps.googleapis.com/maps/api/js?key={google_key}&callback=initMap' async defer></script>
            """

        elif provider.lower() == 'cedarmaps':
            html += f"""
            <link href='https://api.cedarmaps.com/cedarmaps.js/v1.8.1/cedarmaps.css' rel='stylesheet' />
            <script src='https://api.cedarmaps.com/cedarmaps.js/v1.8.1/cedarmaps.js'></script>
            <script>
                L.cedarmaps.accessToken = '{cedar_token}';
                var map = L.cedarmaps.map('map', 'https://api.cedarmaps.com/v1/tiles/cedarmaps.streets.json?access_token={cedar_token}', {{
                  center: [{latitude}, {longitude}],
                  zoom: 15
                }});
                var marker = L.marker([{latitude}, {longitude}]).addTo(map);
            </script>
            """

        elif provider.lower() == 'neshan':
            html += f"""
            <link href='https://static.neshan.org/sdk/leaflet/1.4.0/leaflet.css' rel='stylesheet' type='text/css'>
            <script src='https://static.neshan.org/sdk/leaflet/1.4.0/leaflet.js' type='text/javascript'></script>
            <script>
                var map = new L.Map('map', {{
                    key: '{neshan_key}',
                    maptype: 'dreamy',
                    poi: true,
                    traffic: false,
                    center: [{latitude}, {longitude}],
                    zoom: 14
                }});
                var marker = L.marker([{latitude}, {longitude}]).addTo(map);
            </script>
            """

        elif provider.lower() == 'mapir':
            html += f"""
            <script src='https://cdn.map.ir/web-sdk/1.4.2/mapbox-gl.js'></script>
            <link rel='stylesheet' href='https://cdn.map.ir/web-sdk/1.4.2/mapbox-gl.css' />
            <script>
                mapboxgl.accessToken = '{mapir_token}';
                var map = new mapboxgl.Map({{
                  container: 'map',
                  style: 'https://map.ir/vector/styles/main/mapir-xyz-light-style.json',
                  center: [{longitude}, {latitude}],
                  zoom: 15
                }});
                new mapboxgl.Marker().setLngLat([{longitude}, {latitude}]).addTo(map);
            </script>
            """

        elif provider.lower() == 'parsimap':
            html += f"""
            <script src='https://api.parsimap.com/web/v1/js/main.js'></script>
            <script>
                var map = L.map('map').setView([{latitude}, {longitude}], 15);
                L.tileLayer('https://api.parsimap.com/tile/parsimap-streets-v1/{{z}}/{{x}}/{{y}}.png?key={parsimap_key}', {{
                    maxZoom: 18,
                }}).addTo(map);
                var marker = L.marker([{latitude}, {longitude}]).addTo(map);
            </script>
            """

        elif provider.lower() == 'mapbox':
            html += f"""
            <script src='https://api.mapbox.com/mapbox-gl-js/v2.5.0/mapbox-gl.js'></script>
            <link href='https://api.mapbox.com/mapbox-gl-js/v2.5.0/mapbox-gl.css' rel='stylesheet' />
            <script>
                mapboxgl.accessToken = '{mapbox_token}';
                var map = new mapboxgl.Map({{
                  container: 'map',
                  style: 'mapbox://styles/mapbox/streets-v11',
                  center: [{longitude}, {latitude}],
                  zoom: 15
                }});
                new mapboxgl.Marker().setLngLat([{longitude}, {latitude}]).addTo(map);
            </script>
            """

        elif provider.lower() == 'osm':
            html += f"""
            <link rel='stylesheet' href='https://unpkg.com/leaflet@1.7.1/dist/leaflet.css' />
            <script src='https://unpkg.com/leaflet@1.7.1/dist/leaflet.js'></script>
            <script>
                var map = L.map('map').setView([{latitude}, {longitude}], 15);
                L.tileLayer('https://{{s}}.tile.openstreetmap.org/{{z}}/{{x}}/{{y}}.png', {{
                  maxZoom: 19,
                  attribution: '© OpenStreetMap contributors'
                }}).addTo(map);
                var marker = L.marker([{latitude}, {longitude}]).addTo(map);
            </script>
            """

        elif provider.lower() == 'bing':
            html += f"""
            <script type='text/javascript' src='https://www.bing.com/api/maps/mapcontrol?callback=GetMap&key={bing_key}' async defer></script>
            <script>
                function GetMap() {{
                    var map = new Microsoft.Maps.Map('#map', {{
                        center: new Microsoft.Maps.Location({latitude}, {longitude}),
                        zoom: 15
                    }});
                    var center = map.getCenter();
                    var pin = new Microsoft.Maps.Pushpin(center, {{
                        title: 'Location'
                    }});
                    map.entities.push(pin);
                }}
            </script>
            """

        elif provider.lower() == 'yandex':
            html += f"""
            <script src='https://api-maps.yandex.ru/2.1/?apikey={yandex_key}&lang=en_US' type='text/javascript'></script>
            <script>
                ymaps.ready(init);
                function init(){{
                    var myMap = new ymaps.Map('map', {{
                        center: [{latitude}, {longitude}],
                        zoom: 15
                    }});
                    var myPlacemark = new ymaps.Placemark([{latitude}, {longitude}], {{
                        hintContent: 'Location',
                        balloonContent: 'Selected Location'
                    }});
                    myMap.geoObjects.add(myPlacemark);
                }}
            </script>
            """

        else:
            html += "<p>Provider not supported.</p>"

        return mark_safe(html)

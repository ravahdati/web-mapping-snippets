package mapping

import (
	"fmt"
	"html/template"
)

// MapProvider represents a map service provider
type MapProvider struct {
	Key  string
	Name string
}

// ShowAvailableMaps returns all available map providers
func ShowAvailableMaps() map[string]string {
	return map[string]string{
		"google":    "Google Maps",
		"cedarmaps": "CedarMaps (Iran)",
		"neshan":    "Neshan (Iran)",
		"mapir":     "Map.ir (Iran)",
		"parsimap":  "ParsiMap (Iran)",
		"mapbox":    "Mapbox",
		"osm":       "OpenStreetMap",
		"bing":      "Bing Maps",
		"yandex":    "Yandex Maps",
	}
}

// DisplayMapWithLocation generates HTML for displaying a map with a marker
// provider options: google, cedarmaps, neshan, mapir, parsimap, mapbox, osm, bing, yandex
func DisplayMapWithLocation(latitude, longitude float64, provider string) template.HTML {
	if provider == "" {
		provider = "google"
	}

	html := "<div id='map' style='width: 100%; height: 400px;'></div>"

	switch provider {
	case "google":
		html += fmt.Sprintf(`
		<script>
			function initMap() {
			  var location = {lat: %f, lng: %f};
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
		`, latitude, longitude)

	case "cedarmaps":
		html += fmt.Sprintf(`
		<link href='https://api.cedarmaps.com/cedarmaps.js/v1.8.1/cedarmaps.css' rel='stylesheet' />
		<script src='https://api.cedarmaps.com/cedarmaps.js/v1.8.1/cedarmaps.js'></script>
		<script>
			L.cedarmaps.accessToken = 'YOUR_CEDAR_ACCESS_TOKEN';
			var map = L.cedarmaps.map('map', 'https://api.cedarmaps.com/v1/tiles/cedarmaps.streets.json?access_token=YOUR_CEDAR_ACCESS_TOKEN', {
			  center: [%f, %f],
			  zoom: 15
			});
			var marker = L.marker([%f, %f]).addTo(map);
		</script>
		`, latitude, longitude, latitude, longitude)

	case "neshan":
		html += fmt.Sprintf(`
		<link href='https://static.neshan.org/sdk/leaflet/1.4.0/leaflet.css' rel='stylesheet' type='text/css'>
		<script src='https://static.neshan.org/sdk/leaflet/1.4.0/leaflet.js' type='text/javascript'></script>
		<script>
			var map = new L.Map('map', {
				key: 'YOUR_NESHAN_API_KEY',
				maptype: 'dreamy',
				poi: true,
				traffic: false,
				center: [%f, %f],
				zoom: 14
			});
			var marker = L.marker([%f, %f]).addTo(map);
		</script>
		`, latitude, longitude, latitude, longitude)

	case "mapir":
		html += fmt.Sprintf(`
		<script src='https://cdn.map.ir/web-sdk/1.4.2/mapbox-gl.js'></script>
		<link rel='stylesheet' href='https://cdn.map.ir/web-sdk/1.4.2/mapbox-gl.css' />
		<script>
			mapboxgl.accessToken = 'YOUR_MAPIR_ACCESS_TOKEN';
			var map = new mapboxgl.Map({
			  container: 'map',
			  style: 'https://map.ir/vector/styles/main/mapir-xyz-light-style.json',
			  center: [%f, %f],
			  zoom: 15
			});
			new mapboxgl.Marker().setLngLat([%f, %f]).addTo(map);
		</script>
		`, longitude, latitude, longitude, latitude)

	case "parsimap":
		html += fmt.Sprintf(`
		<script src='https://api.parsimap.com/web/v1/js/main.js'></script>
		<script>
			var map = L.map('map').setView([%f, %f], 15);
			L.tileLayer('https://api.parsimap.com/tile/parsimap-streets-v1/{z}/{x}/{y}.png?key=YOUR_PARSIMAP_KEY', {
				maxZoom: 18,
			}).addTo(map);
			var marker = L.marker([%f, %f]).addTo(map);
		</script>
		`, latitude, longitude, latitude, longitude)

	case "mapbox":
		html += fmt.Sprintf(`
		<script src='https://api.mapbox.com/mapbox-gl-js/v2.5.0/mapbox-gl.js'></script>
		<link href='https://api.mapbox.com/mapbox-gl-js/v2.5.0/mapbox-gl.css' rel='stylesheet' />
		<script>
			mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN';
			var map = new mapboxgl.Map({
			  container: 'map',
			  style: 'mapbox://styles/mapbox/streets-v11',
			  center: [%f, %f],
			  zoom: 15
			});
			new mapboxgl.Marker().setLngLat([%f, %f]).addTo(map);
		</script>
		`, longitude, latitude, longitude, latitude)

	case "osm":
		html += fmt.Sprintf(`
		<link rel='stylesheet' href='https://unpkg.com/leaflet@1.7.1/dist/leaflet.css' />
		<script src='https://unpkg.com/leaflet@1.7.1/dist/leaflet.js'></script>
		<script>
			var map = L.map('map').setView([%f, %f], 15);
			L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			  maxZoom: 19,
			  attribution: '© OpenStreetMap contributors'
			}).addTo(map);
			var marker = L.marker([%f, %f]).addTo(map);
		</script>
		`, latitude, longitude, latitude, longitude)

	case "bing":
		html += fmt.Sprintf(`
		<script type='text/javascript' src='https://www.bing.com/api/maps/mapcontrol?callback=GetMap&key=YOUR_BING_MAPS_KEY' async defer></script>
		<script>
			function GetMap() {
				var map = new Microsoft.Maps.Map('#map', {
					center: new Microsoft.Maps.Location(%f, %f),
					zoom: 15
				});
				var center = map.getCenter();
				var pin = new Microsoft.Maps.Pushpin(center, {
					title: 'Location'
				});
				map.entities.push(pin);
			}
		</script>
		`, latitude, longitude)

	case "yandex":
		html += fmt.Sprintf(`
		<script src='https://api-maps.yandex.ru/2.1/?apikey=YOUR_YANDEX_API_KEY&lang=en_US' type='text/javascript'></script>
		<script>
			ymaps.ready(init);
			function init(){
				var myMap = new ymaps.Map('map', {
					center: [%f, %f],
					zoom: 15
				});
				var myPlacemark = new ymaps.Placemark([%f, %f], {
					hintContent: 'Location',
					balloonContent: 'Selected Location'
				});
				myMap.geoObjects.add(myPlacemark);
			}
		</script>
		`, latitude, longitude, latitude, longitude)

	default:
		html += "<p>Provider not supported.</p>"
	}

	return template.HTML(html)
}

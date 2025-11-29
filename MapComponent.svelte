<script>
  /**
   * Svelte Map Component
   * Supports multiple map providers: Google Maps, CedarMaps, Neshan, Map.ir, ParsiMap, Mapbox, OSM, Bing, Yandex
   *
   * Usage:
   * <MapComponent latitude={35.6892} longitude={51.3890} provider="google" />
   */

  import { onMount, onDestroy } from 'svelte';

  export let latitude;
  export let longitude;
  export let provider = 'google';
  export let containerId = 'map';
  export let width = '100%';
  export let height = '400px';

  export const MAP_PROVIDERS = {
    google: 'Google Maps',
    cedarmaps: 'CedarMaps (Iran)',
    neshan: 'Neshan (Iran)',
    mapir: 'Map.ir (Iran)',
    parsimap: 'ParsiMap (Iran)',
    mapbox: 'Mapbox',
    osm: 'OpenStreetMap',
    bing: 'Bing Maps',
    yandex: 'Yandex Maps'
  };

  let mapContainer;
  let mapInstance = null;

  const loadScript = (src) => {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
      document.head.appendChild(script);
    });
  };

  const loadCSS = (href) => {
    if (!document.querySelector(`link[href="${href}"]`)) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      document.head.appendChild(link);
    }
  };

  const initMap = async () => {
    if (!mapContainer) return;

    try {
      switch (provider.toLowerCase()) {
        case 'google':
          await loadScript('https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_API_KEY');
          const googleMap = new window.google.maps.Map(mapContainer, {
            zoom: 15,
            center: { lat: latitude, lng: longitude }
          });
          new window.google.maps.Marker({
            position: { lat: latitude, lng: longitude },
            map: googleMap
          });
          mapInstance = googleMap;
          break;

        case 'cedarmaps':
          loadCSS('https://api.cedarmaps.com/cedarmaps.js/v1.8.1/cedarmaps.css');
          await loadScript('https://api.cedarmaps.com/cedarmaps.js/v1.8.1/cedarmaps.js');
          window.L.cedarmaps.accessToken = 'YOUR_CEDAR_ACCESS_TOKEN';
          const cedarMap = window.L.cedarmaps.map(
            containerId,
            'https://api.cedarmaps.com/v1/tiles/cedarmaps.streets.json?access_token=YOUR_CEDAR_ACCESS_TOKEN',
            { center: [latitude, longitude], zoom: 15 }
          );
          window.L.marker([latitude, longitude]).addTo(cedarMap);
          mapInstance = cedarMap;
          break;

        case 'neshan':
          loadCSS('https://static.neshan.org/sdk/leaflet/1.4.0/leaflet.css');
          await loadScript('https://static.neshan.org/sdk/leaflet/1.4.0/leaflet.js');
          const neshanMap = new window.L.Map(containerId, {
            key: 'YOUR_NESHAN_API_KEY',
            maptype: 'dreamy',
            poi: true,
            traffic: false,
            center: [latitude, longitude],
            zoom: 14
          });
          window.L.marker([latitude, longitude]).addTo(neshanMap);
          mapInstance = neshanMap;
          break;

        case 'mapir':
          loadCSS('https://cdn.map.ir/web-sdk/1.4.2/mapbox-gl.css');
          await loadScript('https://cdn.map.ir/web-sdk/1.4.2/mapbox-gl.js');
          window.mapboxgl.accessToken = 'YOUR_MAPIR_ACCESS_TOKEN';
          const mapirMap = new window.mapboxgl.Map({
            container: containerId,
            style: 'https://map.ir/vector/styles/main/mapir-xyz-light-style.json',
            center: [longitude, latitude],
            zoom: 15
          });
          new window.mapboxgl.Marker().setLngLat([longitude, latitude]).addTo(mapirMap);
          mapInstance = mapirMap;
          break;

        case 'parsimap':
          await loadScript('https://api.parsimap.com/web/v1/js/main.js');
          const parsimapMap = window.L.map(containerId).setView([latitude, longitude], 15);
          window.L.tileLayer(
            'https://api.parsimap.com/tile/parsimap-streets-v1/{z}/{x}/{y}.png?key=YOUR_PARSIMAP_KEY',
            { maxZoom: 18 }
          ).addTo(parsimapMap);
          window.L.marker([latitude, longitude]).addTo(parsimapMap);
          mapInstance = parsimapMap;
          break;

        case 'mapbox':
          loadCSS('https://api.mapbox.com/mapbox-gl-js/v2.5.0/mapbox-gl.css');
          await loadScript('https://api.mapbox.com/mapbox-gl-js/v2.5.0/mapbox-gl.js');
          window.mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN';
          const mapboxMap = new window.mapboxgl.Map({
            container: containerId,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [longitude, latitude],
            zoom: 15
          });
          new window.mapboxgl.Marker().setLngLat([longitude, latitude]).addTo(mapboxMap);
          mapInstance = mapboxMap;
          break;

        case 'osm':
          loadCSS('https://unpkg.com/leaflet@1.7.1/dist/leaflet.css');
          await loadScript('https://unpkg.com/leaflet@1.7.1/dist/leaflet.js');
          const osmMap = window.L.map(containerId).setView([latitude, longitude], 15);
          window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap contributors'
          }).addTo(osmMap);
          window.L.marker([latitude, longitude]).addTo(osmMap);
          mapInstance = osmMap;
          break;

        case 'bing':
          window.GetMap = () => {
            const bingMap = new window.Microsoft.Maps.Map(`#${containerId}`, {
              center: new window.Microsoft.Maps.Location(latitude, longitude),
              zoom: 15
            });
            const pin = new window.Microsoft.Maps.Pushpin(bingMap.getCenter(), {
              title: 'Location'
            });
            bingMap.entities.push(pin);
            mapInstance = bingMap;
          };
          await loadScript('https://www.bing.com/api/maps/mapcontrol?callback=GetMap&key=YOUR_BING_MAPS_KEY');
          break;

        case 'yandex':
          await loadScript('https://api-maps.yandex.ru/2.1/?apikey=YOUR_YANDEX_API_KEY&lang=en_US');
          window.ymaps.ready(() => {
            const yandexMap = new window.ymaps.Map(containerId, {
              center: [latitude, longitude],
              zoom: 15
            });
            const placemark = new window.ymaps.Placemark([latitude, longitude], {
              hintContent: 'Location',
              balloonContent: 'Selected Location'
            });
            yandexMap.geoObjects.add(placemark);
            mapInstance = yandexMap;
          });
          break;

        default:
          console.error(`Provider "${provider}" not supported`);
      }
    } catch (error) {
      console.error('Error loading map:', error);
    }
  };

  onMount(() => {
    initMap();
  });

  onDestroy(() => {
    if (mapInstance && mapInstance.remove) {
      mapInstance.remove();
    }
  });

  $: if (mapContainer) {
    if (mapInstance && mapInstance.remove) {
      mapInstance.remove();
    }
    initMap();
  }
</script>

<div
  id={containerId}
  bind:this={mapContainer}
  style="width: {width}; height: {height};"
></div>

<style>
  /* Map container styling handled via props */
</style>

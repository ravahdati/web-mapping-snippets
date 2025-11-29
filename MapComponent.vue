<template>
  <div :id="containerId" :style="{ width, height }" ref="mapContainer"></div>
</template>

<script setup lang="ts">
/**
 * Vue 3 Map Component
 * Supports multiple map providers: Google Maps, CedarMaps, Neshan, Map.ir, ParsiMap, Mapbox, OSM, Bing, Yandex
 *
 * Usage:
 * <MapComponent :latitude="35.6892" :longitude="51.3890" provider="google" />
 */

import { ref, onMounted, onBeforeUnmount, watch } from 'vue';

interface Props {
  latitude: number;
  longitude: number;
  provider?: 'google' | 'cedarmaps' | 'neshan' | 'mapir' | 'parsimap' | 'mapbox' | 'osm' | 'bing' | 'yandex';
  containerId?: string;
  width?: string;
  height?: string;
}

const props = withDefaults(defineProps<Props>(), {
  provider: 'google',
  containerId: 'map',
  width: '100%',
  height: '400px'
});

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

const mapContainer = ref<HTMLElement | null>(null);
const mapInstance = ref<any>(null);

const loadScript = (src: string): Promise<void> => {
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

const loadCSS = (href: string): void => {
  if (!document.querySelector(`link[href="${href}"]`)) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  }
};

const initMap = async () => {
  if (!mapContainer.value) return;

  try {
    switch (props.provider.toLowerCase()) {
      case 'google':
        await loadScript('https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_API_KEY');
        const googleMap = new (window as any).google.maps.Map(mapContainer.value, {
          zoom: 15,
          center: { lat: props.latitude, lng: props.longitude }
        });
        new (window as any).google.maps.Marker({
          position: { lat: props.latitude, lng: props.longitude },
          map: googleMap
        });
        mapInstance.value = googleMap;
        break;

      case 'cedarmaps':
        loadCSS('https://api.cedarmaps.com/cedarmaps.js/v1.8.1/cedarmaps.css');
        await loadScript('https://api.cedarmaps.com/cedarmaps.js/v1.8.1/cedarmaps.js');
        (window as any).L.cedarmaps.accessToken = 'YOUR_CEDAR_ACCESS_TOKEN';
        const cedarMap = (window as any).L.cedarmaps.map(
          props.containerId,
          'https://api.cedarmaps.com/v1/tiles/cedarmaps.streets.json?access_token=YOUR_CEDAR_ACCESS_TOKEN',
          { center: [props.latitude, props.longitude], zoom: 15 }
        );
        (window as any).L.marker([props.latitude, props.longitude]).addTo(cedarMap);
        mapInstance.value = cedarMap;
        break;

      case 'neshan':
        loadCSS('https://static.neshan.org/sdk/leaflet/1.4.0/leaflet.css');
        await loadScript('https://static.neshan.org/sdk/leaflet/1.4.0/leaflet.js');
        const neshanMap = new (window as any).L.Map(props.containerId, {
          key: 'YOUR_NESHAN_API_KEY',
          maptype: 'dreamy',
          poi: true,
          traffic: false,
          center: [props.latitude, props.longitude],
          zoom: 14
        });
        (window as any).L.marker([props.latitude, props.longitude]).addTo(neshanMap);
        mapInstance.value = neshanMap;
        break;

      case 'mapir':
        loadCSS('https://cdn.map.ir/web-sdk/1.4.2/mapbox-gl.css');
        await loadScript('https://cdn.map.ir/web-sdk/1.4.2/mapbox-gl.js');
        (window as any).mapboxgl.accessToken = 'YOUR_MAPIR_ACCESS_TOKEN';
        const mapirMap = new (window as any).mapboxgl.Map({
          container: props.containerId,
          style: 'https://map.ir/vector/styles/main/mapir-xyz-light-style.json',
          center: [props.longitude, props.latitude],
          zoom: 15
        });
        new (window as any).mapboxgl.Marker().setLngLat([props.longitude, props.latitude]).addTo(mapirMap);
        mapInstance.value = mapirMap;
        break;

      case 'parsimap':
        await loadScript('https://api.parsimap.com/web/v1/js/main.js');
        const parsimapMap = (window as any).L.map(props.containerId).setView([props.latitude, props.longitude], 15);
        (window as any).L.tileLayer(
          'https://api.parsimap.com/tile/parsimap-streets-v1/{z}/{x}/{y}.png?key=YOUR_PARSIMAP_KEY',
          { maxZoom: 18 }
        ).addTo(parsimapMap);
        (window as any).L.marker([props.latitude, props.longitude]).addTo(parsimapMap);
        mapInstance.value = parsimapMap;
        break;

      case 'mapbox':
        loadCSS('https://api.mapbox.com/mapbox-gl-js/v2.5.0/mapbox-gl.css');
        await loadScript('https://api.mapbox.com/mapbox-gl-js/v2.5.0/mapbox-gl.js');
        (window as any).mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN';
        const mapboxMap = new (window as any).mapboxgl.Map({
          container: props.containerId,
          style: 'mapbox://styles/mapbox/streets-v11',
          center: [props.longitude, props.latitude],
          zoom: 15
        });
        new (window as any).mapboxgl.Marker().setLngLat([props.longitude, props.latitude]).addTo(mapboxMap);
        mapInstance.value = mapboxMap;
        break;

      case 'osm':
        loadCSS('https://unpkg.com/leaflet@1.7.1/dist/leaflet.css');
        await loadScript('https://unpkg.com/leaflet@1.7.1/dist/leaflet.js');
        const osmMap = (window as any).L.map(props.containerId).setView([props.latitude, props.longitude], 15);
        (window as any).L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '© OpenStreetMap contributors'
        }).addTo(osmMap);
        (window as any).L.marker([props.latitude, props.longitude]).addTo(osmMap);
        mapInstance.value = osmMap;
        break;

      case 'bing':
        (window as any).GetMap = () => {
          const bingMap = new (window as any).Microsoft.Maps.Map(`#${props.containerId}`, {
            center: new (window as any).Microsoft.Maps.Location(props.latitude, props.longitude),
            zoom: 15
          });
          const pin = new (window as any).Microsoft.Maps.Pushpin(bingMap.getCenter(), {
            title: 'Location'
          });
          bingMap.entities.push(pin);
          mapInstance.value = bingMap;
        };
        await loadScript('https://www.bing.com/api/maps/mapcontrol?callback=GetMap&key=YOUR_BING_MAPS_KEY');
        break;

      case 'yandex':
        await loadScript('https://api-maps.yandex.ru/2.1/?apikey=YOUR_YANDEX_API_KEY&lang=en_US');
        (window as any).ymaps.ready(() => {
          const yandexMap = new (window as any).ymaps.Map(props.containerId, {
            center: [props.latitude, props.longitude],
            zoom: 15
          });
          const placemark = new (window as any).ymaps.Placemark([props.latitude, props.longitude], {
            hintContent: 'Location',
            balloonContent: 'Selected Location'
          });
          yandexMap.geoObjects.add(placemark);
          mapInstance.value = yandexMap;
        });
        break;

      default:
        console.error(`Provider "${props.provider}" not supported`);
    }
  } catch (error) {
    console.error('Error loading map:', error);
  }
};

onMounted(() => {
  initMap();
});

onBeforeUnmount(() => {
  if (mapInstance.value && mapInstance.value.remove) {
    mapInstance.value.remove();
  }
});

watch([() => props.latitude, () => props.longitude, () => props.provider], () => {
  if (mapInstance.value && mapInstance.value.remove) {
    mapInstance.value.remove();
  }
  initMap();
});
</script>

<style scoped>
/* Map container styling handled via props */
</style>

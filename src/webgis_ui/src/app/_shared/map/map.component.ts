import { Component, OnInit, OnDestroy, Input, HostListener } from '@angular/core';
import * as maplibregl from 'maplibre-gl';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnDestroy {
  @Input() defaultCenter: [number, number] = [100.5018, 13.7563];
  @Input() defaultZoom: number = 8;
  map!: maplibregl.Map;

  ngOnInit(): void {
    console.log('in');
    
    this.initializeMap();
    this.setMapHeight(); // Set initial map height
  }

  // Listen for window resize events to adjust map height
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.setMapHeight();
  }

  initializeMap(): void {
    const savedZoom = localStorage.getItem('mapZoom');
    const savedCenter = localStorage.getItem('mapCenter');

    this.map = new maplibregl.Map({
      container: 'map',
      style: 'https://api.maptiler.com/maps/d9a4b917-d11b-4c66-8566-d42eb37737ec/style.json?key=89niYR6Aow3J66RlqxlA',
      center: savedCenter ? JSON.parse(savedCenter) : this.defaultCenter,
      zoom: savedZoom ? parseFloat(savedZoom) : this.defaultZoom,
    });

    // ratio controller 
    const scale = new maplibregl.ScaleControl({
      maxWidth: 80,
      unit: 'metric',
    });
    this.map.addControl(scale, 'bottom-right');
    
    // zoom contoller
    const nav = new maplibregl.NavigationControl();
    this.map.addControl(nav, 'bottom-right');

    // current location controller 
    const myLocationControl = new maplibregl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true // Use high accuracy if possible
      },
      trackUserLocation: true, // Automatically track the user's location
      showUserLocation: true, // Show user location on the map
    });
    this.map.addControl(myLocationControl, 'bottom-right');

    this.mapEvents();
  }

  setMapHeight(): void {
    const navbarHeight = document.querySelector('.navbar')?.clientHeight || 0; // Get navbar height
    const mapContainer = document.getElementById('map');
    if (mapContainer) {
      
      mapContainer.style.height = `${window.innerHeight - navbarHeight}px`; // Set map height
    }
  }

  mapEvents(): void {
    this.map.on('zoomend', () => {
      const zoomLevel = this.map.getZoom();
      localStorage.setItem('mapZoom', zoomLevel.toString());
    });
    this.map.on('moveend', () => {
      const center = this.map.getCenter();
      localStorage.setItem('mapCenter', JSON.stringify([center.lng, center.lat]));
    });
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }
}

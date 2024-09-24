// editor-map.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import * as maplibregl from 'maplibre-gl';

@Component({
  selector: 'app-editor-map',
  templateUrl: './editor-map.component.html',
  styleUrls: ['./editor-map.component.scss']
})
export class EditorMapComponent implements OnInit, OnDestroy {
  map!: maplibregl.Map;  // Declare map instance

  ngOnInit(): void {
    this.initializeMap();
    this.mapEvents();
  }

  initializeMap(): void {
    // Create a MapLibre map instance
    const savedZoom = localStorage.getItem('mapZoom');
    const savedCenter = localStorage.getItem('mapCenter');
    this.map = new maplibregl.Map({
      container: 'map',
      style: 'https://api.maptiler.com/maps/b9ce2a02-280d-4a34-a002-37f946992dfa/style.json?key=NRZzdXmGDnNvgNaaF4Ic',
      center: savedCenter ? JSON.parse(savedCenter) : [100.5018, 13.7563],
      zoom: savedZoom ? parseFloat(savedZoom) : 8,
    });

    this.map.addControl(new maplibregl.NavigationControl(), 'bottom-right');
  }


  mapEvents(){
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
    // Destroy the map instance to free up resources
    if (this.map) {
      this.map.remove();
    }
  }
}

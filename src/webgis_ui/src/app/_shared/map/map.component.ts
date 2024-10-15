import { Component, OnInit, OnDestroy, Input, HostListener } from '@angular/core';
import * as maplibregl from 'maplibre-gl';
import { StyleControl } from '../../../models/stylecontrol';
import { Router } from '@angular/router';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnDestroy {
  @Input() defaultCenter: [number, number] = [100.5018, 13.7563];
  @Input() defaultZoom: number = 8;

  map!: maplibregl.Map;

  constructor(private router: Router,private _sharedService:SharedService) { }

  ngOnInit(): void {
    this.initializeMap();
    this.setMapHeight();
    this.addCustomImages();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.setMapHeight();
  }

  initializeMap(): void {
    const flag = this.router.url == localStorage.getItem('page');
    const savedZoom = localStorage.getItem('mapZoom')
    const savedCenter = localStorage.getItem('mapCenter')

    this.map = new maplibregl.Map({
      container: 'map',
      style: 'https://api.maptiler.com/maps/basic-v2/style.json?key=89niYR6Aow3J66RlqxlA',
      center: flag && savedCenter ? JSON.parse(savedCenter) : this.defaultCenter,
      zoom: flag && savedZoom ? parseFloat(savedZoom) : this.defaultZoom,
    });

    this.map.on('load', () => {
      // Add your initial layers here if needed
      this.initialMapController();
      this.mapEvents()
    });
  }

  setNewMap(newMap: maplibregl.Map): void {
    this.map = newMap;
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

    localStorage.setItem('page', this.router.url)
  }


  initialMapController() {
    this.map.addControl(new maplibregl.ScaleControl({ maxWidth: 80, unit: 'metric' }), 'bottom-right');
    this.map.addControl(new maplibregl.NavigationControl(), 'bottom-right');
    this.map.addControl(new maplibregl.GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: true,
      showUserLocation: true,
    }), 'bottom-right');
    this.map.addControl(new StyleControl(this._sharedService), 'bottom-left');
  }


  addLayer(layer: maplibregl.LayerSpecification, source: maplibregl.SourceSpecification, id: string): void {
      // Add source first
      if (!this.map.getSource(id)) {
        this.map.addSource(id, source);
      } 

      // Add layer with the provided options
      if (!this.map.getLayer(layer.id)) {
        this.map.addLayer(layer);
      } 

  }

  removeLayer(layerId: string, sourceId: string): void {
    // First check if layer and source exist before removing
    if (this.map.getLayer(layerId)) {
      this.map.removeLayer(layerId);
    }
    if (this.map.getSource(sourceId)) {
      this.map.removeSource(sourceId);
    }
  }

  setMapHeight(): void {
    // Adjust the map height based on window size
  }

  addCustomImages(): void {
    // Add your custom marker image
    const imgUrl = 'assets/img/location.svg'; // Replace with your image URL
    const img = new Image(25, 25); // Adjust the size as needed
    img.onload = () => {
      if (!this.map.hasImage('custom-marker')) {
        this.map.addImage('custom-marker', img);
      }
    };
    img.src = imgUrl;
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }
}

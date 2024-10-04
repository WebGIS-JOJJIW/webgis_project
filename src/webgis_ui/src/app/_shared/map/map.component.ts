import { Component, OnInit, OnDestroy, Input, HostListener } from '@angular/core';
import * as maplibregl from 'maplibre-gl';
import { StyleControl } from '../../../models/stylecontrol';
import * as turf from '@turf/turf';
import { GeoserverDataService } from '../../../services/geoserver/geoserver-data.service';
import { environment } from '../../../environments/environment.dev';
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnDestroy {
  @Input() defaultCenter: [number, number] = [100.5018, 13.7563];
  @Input() defaultZoom: number = 8;
  map!: maplibregl.Map;

  constructor(private GeoDataService: GeoserverDataService) { }
  ngOnInit(): void {
    this.initializeMap();
    this.setMapHeight(); // Set initial map height
  }

  // Listen for window resize events to adjust map height
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.setMapHeight();
  }

  initializeMap(): void {
    // Define available styles

    const savedZoom = localStorage.getItem('mapZoom');
    const savedCenter = localStorage.getItem('mapCenter');

    this.map = new maplibregl.Map({
      container: 'map',
      // style: 'https://api.maptiler.com/maps/d9a4b917-d11b-4c66-8566-d42eb37737ec/style.json?key=89niYR6Aow3J66RlqxlA',
      style: 'https://api.maptiler.com/maps/basic-v2/style.json?key=89niYR6Aow3J66RlqxlA',
      center: savedCenter ? JSON.parse(savedCenter) : this.defaultCenter,
      zoom: savedZoom ? parseFloat(savedZoom) : this.defaultZoom,
    });

    this.loadRoadData();
    this.initialMapController();
    this.mapEvents();
  }

  initialMapController() {
    this.map.addControl(new maplibregl.ScaleControl({ maxWidth: 80, unit: 'metric' }), 'bottom-right');
    this.map.addControl(new maplibregl.NavigationControl(), 'bottom-right');
    this.map.addControl(new maplibregl.GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: true,
      showUserLocation: true,
    }), 'bottom-right');
    this.map.addControl(new StyleControl(), 'bottom-left');
  }

  loadRoadData(): void {
    this.map.on('load', () => {
      this.addRasterOnMap();
    });
  }

  addRasterOnMap(): void {
    const rasterSourceId = 'my-raster-source'; // Define a unique ID for the source
    const rasterLayerId = 'my-raster-layer'; // Define a unique ID for the layer
    const name = '02';
    const url = `http://138.197.163.159:8000/geoserver/gis/wms?service=WMS&version=1.1.0&request=GetMap&layers=gis%3A${name}&bbox={bbox-epsg-3857}&width=512&height=512&srs=EPSG%3A3857&styles=&format=image%2Fpng&TRANSPARENT=true` // Adjust the URL to use 'image/png' for raster tiles

    // Add the WMS source
    this.map.addSource(rasterSourceId, {
      type: 'raster',
      tiles: [
        url
      ],
      tileSize: 512, // Define tile size
    });

    // Add the raster layer using the source
    this.map.addLayer({
      id: rasterLayerId,
      type: 'raster',
      source: rasterSourceId,
      minzoom: 0,
      maxzoom: 22,
    });

    // Retrieve the BBOX of the added raster layer
    this.getRasterLayerBbox(rasterSourceId, name);
  }

  getRasterLayerBbox(sourceId: string, name: string): void {
    const source = this.map.getSource(sourceId);
    let bbox = ''
    if (source) {
      this.GeoDataService.GetLayerDetail(`${environment.geosever}/geoserver/rest/workspaces/gis/coveragestores/${name}/coverages/${name}.json`).subscribe(res => {
        bbox = [
          res.coverage.nativeBoundingBox.minx,  // minX
          res.coverage.nativeBoundingBox.miny, // minY
          res.coverage.nativeBoundingBox.maxx,  // maxX
          res.coverage.nativeBoundingBox.maxy   // maxY
        ].join(','); // Format as "minX,minY,maxX,maxY"
        // console.log('BBOX of the raster layer:', bbox);
        this.setRoadOnMap(bbox)
      })
      // If the source exists, calculate the BBOX based on the current map bounds
      // const bounds = this.map.getBounds();

    } else {
      console.error(`Source "${sourceId}" does not exist.`);
    }
  }

  setRoadOnMap(bbox: string) {
    const data = `http://138.197.163.159:8080/geoserver/gis/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=gis:thailand_road&BBOX=${bbox}&outputFormat=application/json`

    this.map.addSource('thailand-roads', {
      type: 'geojson',
      data: data
    });

    // Add a layer to display the railways
    this.map.addLayer({
      id: 'roads-layer',
      type: 'line',
      source: 'thailand-roads', // Ensure this source is defined
      paint: {
        'line-color': 'rgba(255, 255, 255, 0.7)', // White color with 50% opacity
        'line-width': 2
      }
    });
  }

  setMapHeight(): void {
    // const navbarHeight = document.querySelector('.navbar')?.clientHeight || 0; // Get navbar height
    // const mapContainer = document.getElementById('map');
    // if (mapContainer) {

    //   mapContainer.style.height = `${window.innerHeight - navbarHeight}px`; // Set map height
    // }
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



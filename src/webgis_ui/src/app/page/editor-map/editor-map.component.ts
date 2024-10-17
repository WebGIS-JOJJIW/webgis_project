// editor-map.component.ts
import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import * as maplibregl from 'maplibre-gl';
import { MapComponent } from '../../_shared/map/map.component';

@Component({
  selector: 'app-editor-map',
  templateUrl: './editor-map.component.html',
  styleUrls: ['./editor-map.component.scss']
})
export class EditorMapComponent implements AfterViewInit {
  @ViewChild(MapComponent) mapComponent!: MapComponent;
  constructor() { }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.add3DMap();
    }, 100)
  }

  add3DMap() {
    const newMap = new maplibregl.Map({
      container: 'map',
      style: { // Custom style for the editor map
        'version': 8,
        'sources': {
          'raster-tiles': {
            'type': 'raster',
            'tiles': ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
            'tileSize': 256,
            'minzoom': 0,
            'maxzoom': 19
          }
        },
        'layers': [
          {
            'id': 'background',
            'type': 'background',
            'paint': { 'background-color': '#e0dfdf' }
          },
          {
            'id': 'simple-tiles',
            'type': 'raster',
            'source': 'raster-tiles'
          }
        ]
      },
      center: [100.502, 13.752],
      zoom: 15.99,
      pitch: 40,
      bearing: 20,
      antialias: true
    });
    this.mapComponent.setNewMap(newMap);

    const Source: maplibregl.SourceSpecification = {
      'type': 'geojson',
      'data': 'https://maplibre.org/maplibre-gl-js/docs/assets/indoor-3d-map.geojson'
    };
    const Layer: maplibregl.LayerSpecification = {
      'id': 'room-extrusion',
      'type': 'fill-extrusion',
      'source': 'floorplan',
      'paint': {

        // Get the fill-extrusion-color from the source 'color' property.
        'fill-extrusion-color': ['get', 'color'],

        // Get fill-extrusion-height from the source 'height' property.
        'fill-extrusion-height': ['get', 'height'],

        // Get fill-extrusion-base from the source 'base_height' property.
        'fill-extrusion-base': ['get', 'base_height'],

        // Make extrusions slightly opaque for see through indoor walls.
        'fill-extrusion-opacity': 0.5
      }
    };

    const geojsonSource: maplibregl.GeoJSONSourceOptions = {
      type: 'geojson',
      data: this.exampleGeoJson
    };

    const geojsonLayer: maplibregl.LayerSpecification = {
      'id': '3d-buildings',
      'type': 'fill-extrusion',
      'source': 'buildings',  // Use the source id "buildings"
      'paint': {
        'fill-extrusion-color': ['get', 'color'],  // Use the 'color' property
        'fill-extrusion-height': ['get', 'height'],  // Use the 'height' property
        'fill-extrusion-base': ['get', 'base_height'],  // Use the 'base_height' property
        'fill-extrusion-opacity': 0.6  // Slight transparency for 3D buildings
      }
    };

    const wallSource: maplibregl.GeoJSONSourceOptions = {
      type: 'geojson',
      data: this.wallGeoJson  // Use the wall GeoJSON data
    };

    const wallLayer: maplibregl.LayerSpecification = {
      'id': '3d-wall',
      'type': 'fill-extrusion',
      'source': 'wall',  // Use the source id "wall"
      'paint': {
        'fill-extrusion-color': ['get', 'color'],  // Use the 'color' property
        'fill-extrusion-height': ['get', 'height'],  // Use the 'height' property
        'fill-extrusion-base': ['get', 'base_height'],  // Use the 'base_height' property
        'fill-extrusion-opacity': 0.8  // Higher opacity for solid wall appearance
      }
    };

    this.mapComponent.map.once('load', () => {
      this.mapComponent.addLayer(Layer, Source, 'floorplan'); // example from maplibre
      this.mapComponent.addLayer(geojsonLayer, geojsonSource, 'buildings'); // example from ai 
      this.mapComponent.addLayer(wallLayer, wallSource, 'wall'); // example from ai 
    })
  }

  exampleGeoJson: GeoJSON.FeatureCollection = {
    'type': 'FeatureCollection',
    'features': [
      {
        'type': 'Feature',
        'geometry': {
          'type': 'Polygon',
          'coordinates': [[
            [100.499, 13.752],
            [100.501, 13.752],
            [100.501, 13.754],
            [100.499, 13.754],
            [100.499, 13.752]
          ]]
        },
        'properties': {
          'height': 100,
          'base_height': 0,
          'color': '#ff0000'  // Red for demonstration
        }
      },
      {
        'type': 'Feature',
        'geometry': {
          'type': 'Polygon',
          'coordinates': [[
            [100.502, 13.752],
            [100.504, 13.752],
            [100.504, 13.754],
            [100.502, 13.754],
            [100.502, 13.752]
          ]]
        },
        'properties': {
          'height': 50,
          'base_height': 10,
          'color': '#0000ff'  // Blue for demonstration
        }
      }
    ]
  };

  wallGeoJson: GeoJSON.FeatureCollection =
    {
      "type": "FeatureCollection",
      "features": [
        {
          "type": "Feature",
          "properties": {
            "level": 1,
            "name": "Wall 1",
            "height": 30,
            "base_height": 0,
            "color": "grey"
          },
          "geometry": {
            "type": "Polygon",
            "coordinates": [
              [
                [100.5060, 13.752],  // Bottom-left corner
                [100.5060, 13.754],  // Top-left corner
                [100.5065, 13.754],  // Top-right corner
                [100.5065, 13.752],  // Bottom-right corner
                [100.5060, 13.752]   // Close the polygon
              ]
            ]
          },
          "id": "wall1"
        },
        {
          "type": "Feature",
          "properties": {
            "level": 1,
            "name": "Wall 2",
            "height": 30,
            "base_height": 0,
            "color": "grey"
          },
          "geometry": {
            "type": "Polygon",
            "coordinates": [
              [
                [100.5065, 13.752],  // Bottom-right corner
                [100.5065, 13.754],  // Top-right corner
                [100.5070, 13.754],  // Top-right diagonal
                [100.5070, 13.752],  // Bottom-right diagonal
                [100.5065, 13.752]   // Close the polygon
              ]
            ]
          },
          "id": "wall2"
        },
        {
          "type": "Feature",
          "properties": {
            "level": 1,
            "name": "Wall 3",
            "height": 30,
            "base_height": 0,
            "color": "red"
          },
          "geometry": {
            "type": "Polygon",
            "coordinates": [
              [
                [100.5070, 13.752],  // Bottom-right diagonal
                [100.5070, 13.754],  // Top-right diagonal
                [100.5075, 13.754],  // Top-right extended
                [100.5075, 13.752],  // Bottom-right extended
                [100.5070, 13.752]   // Close the polygon
              ]
            ]
          },
          "id": "wall3"
        },
        {
          "type": "Feature",
          "properties": {
            "level": 1,
            "name": "Wall 4",
            "height": 30,
            "base_height": 0,
            "color": "blue"
          },
          "geometry": {
            "type": "Polygon",
            "coordinates": [
              [
                [100.5075, 13.752],  // Bottom-right extended
                [100.5075, 13.754],  // Top-right extended
                [100.5077, 13.754],  // Top-right other corner
                [100.5077, 13.752],  // Bottom-right other corner
                [100.5075, 13.752]   // Close the polygon
              ]
            ]
          },
          "id": "wall4"
        }
      ]
    };
}

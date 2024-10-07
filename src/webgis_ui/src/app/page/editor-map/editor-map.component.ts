// editor-map.component.ts
import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import * as maplibregl from 'maplibre-gl';
import { MapComponent } from '../../_shared/map/map.component';

@Component({
  selector: 'app-editor-map',
  templateUrl: './editor-map.component.html',
  styleUrls: ['./editor-map.component.scss']
})
export class EditorMapComponent implements  AfterViewInit {
  @ViewChild(MapComponent) mapComponent!: MapComponent;
  constructor(){}
  
  ngAfterViewInit(): void {
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
      center: [-87.61694, 41.86625],
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
        // See the MapLibre Style Specification for details on data expressions.
        // https://maplibre.org/maplibre-style-spec/expressions/

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

    this.mapComponent.map.once('load',()=>{
      this.mapComponent.addLayer(Layer,Source,'floorplan');
    })
  }
}

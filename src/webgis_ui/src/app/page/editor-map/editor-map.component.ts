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
  }
}

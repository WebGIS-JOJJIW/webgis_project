import { Injectable } from '@angular/core';
import * as maplibregl from 'maplibre-gl';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private map!: maplibregl.Map;

  setMap(mapInstance: maplibregl.Map) {
    this.map = mapInstance;
  }

  getMap(): maplibregl.Map {
    return this.map;
  }

  addGeoJSONLayer(layerId: string, sourceConfig: maplibregl.SourceSpecification, layerConfig: maplibregl.LayerSpecification) {
    if (this.map && !this.map.getLayer(layerId)) {
      this.map.addSource(layerId, sourceConfig);
      this.map.addLayer(layerConfig);
    }
  }

  addRasterLayer(layerId: string, sourceConfig: maplibregl.SourceSpecification, layerConfig: maplibregl.LayerSpecification) {
    if (this.map && !this.map.getLayer(layerId)) {
      this.map.addSource(layerId, sourceConfig);
      this.map.addLayer(layerConfig);
    }
  }
  
  addLayer(layerId: string, sourceConfig: maplibregl.SourceSpecification, layerConfig: maplibregl.LayerSpecification) {
    if (this.map && !this.map.getLayer(layerId)) {
      this.map.on('load' ,() => {
        this.map.addSource(layerId, sourceConfig);
        this.map.addLayer(layerConfig);
      });
    }
  }

  removeLayer(layerId: string) {
    if (this.map && this.map.getLayer(layerId)) {
      this.map.removeLayer(layerId);
      this.map.removeSource(layerId);
    }
  }
}
